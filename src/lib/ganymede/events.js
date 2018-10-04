import {runAll} from './util'
import {getMetadata} from './metadata'


// property decorator: add method as event listener (to instance or given node or path to node)
export function on(...args) {
	var eventName = args.pop()
	// if only event was given, pass it directly to Ganymedes scheduleEvent
	/*if (args.length === 0) {
		// Only event name was given (as a single argument)
		return (ClassProto, callbackName) => {
			console.log('---', eventName, callbackName, ClassProto[callbackName])
			scheduleEvent(ClassProto.constructor, eventName, ClassProto[callbackName])
		}
	}*/
	// condition was possibly given to determine wheter to attach listener
	// to given class instance
	if (typeof eventName === 'function') {
		var condition = eventName
		eventName = args.pop()
	}
	// Two arguments were given.
	// First arg is path to element on which to listen the event
	// (for example '$.myid' matches 'this.$.myid')
	// or the element itself (not related to instace, something like window/document, etc...)
	// Second one is the eventName
	var nodeOrPath = args[0]
	if (typeof nodeOrPath === 'string') {
		var nodePath = nodeOrPath
		var globalNode
	} else {
		var nodePath
		var globalNode = nodeOrPath
	}
	var nodePath = typeof nodeOrPath === 'string' ? nodeOrPath : undefined
	return (ClassProto, callbackName) => {
		var errorMsg = `ganymede: unable to attach @on event listener for ${ClassProto.constructor.name}#${nodePath} because node path is undefined`
		// wait for creation of element, to populate shadowRoot nodes
		scheduleOnce(ClassProto.constructor, 'connected', function() {
		//scheduleEvent(ClassProto.constructor, 'created', function() {
			// node is either given (something not related to instance like window/document)
			// or path to the node is (like 'nextElementSibling')
			// or nothing is given and target is the custom element itself (at this point
			// it must be because of the condition)
			var node = globalNode || (nodePath ? traverseNodePath(this, nodePath) : this)
			if (node) {
				attachEvent(this, node, callbackName, eventName, condition)
			} else if (nodePath) {
				// something went wrong, unable to attach
				if (nodePath.includes('.')) {
					throw Error(errorMsg)
				} else {
					// path is not deep so we could try to wait for the ready event and try again
					this.once('ready', () => {
						node = traverseNodePath(this, nodePath)
						if (node)
							attachEvent(this, node, callbackName, eventName, condition)
						else
							throw Error(errorMsg)
					})
				}
			}
		})
	}
}

// property decorator: 
export function once(...args) {
	//console.warn(`ganymede: @once decorator is not yet implemented`)
	return on(...args)
}

export function promiseOnce(target, eventName, condition, rejectIfNotMet = false) {
	return new Promise((resolve, reject) => {
		target.addEventListener(eventName, () => {
			if (condition) {
				if (condition()) {
					resolve()
				} else if (rejectIfNotMet) {
					reject()
				}
			} else {
				resolve()
			}
		})
	})
}

function traverseNodePath(context, nodePath) {
	var node
	if (nodePath.includes('.')) {
		var pathSplit = nodePath.split('.') // path to element in shadowRoot like '$.myid' for 'this.$.myid'
		var pathStep
		node = context
		while (pathStep = pathSplit.shift()) {
			node = node[pathStep]
		}
	} else {
		node = context[nodePath]
	}
	return node
}

// Returns true if attaching event was successful
// Returns false if could not attach due to false condition
function attachEvent(context, node, callbackName, eventName, condition) {
	if (condition && !condition(context)) return false
	var listener = context[callbackName].bind(context)
	node.addEventListener(eventName, e => listener(e.detail, e))
	context.registerKillback(() => node.removeEventListener(eventName, listener))
	return true
}

// Decorators can't access instance but sometimes need to (hook up event listener).
// This schedules event callback in a hidden queue and those will be attached on instantiation
export function scheduleEvent(Class, eventName, callback) {
	getMetadata(Class).scheduledEvents.push([eventName, callback])
}
export function scheduleOnce(Class, eventName, callback) {
	getMetadata(Class).scheduledOnce.push([eventName, callback])
}






// General Purpose Killbacks
var GPKillbacks = Symbol('GPKillbacks')

function registerKillback(killback) {
	this[GPKillbacks].add(killback)
}

// NOTE: this is made to be extendable class as well as decorator.
// It could be exported but is not now and is instead built into every element

// EventEmitter Killbacks
var EEKillbacks = Symbol('EEKillbacks')

function DOMEventEmitter() {
	this[EEKillbacks] = new Map
}

// args: [target], eventName, listener
// by default events on 'this' are listened but sometimes the nice syntax of on()
// and killbacks is nice to use elsewhere (like on children)
DOMEventEmitter.prototype.on = function(...args) {
	var listener = args.pop()
	var eventName = args.pop()
	var target = args.length ? args.pop() : this
	// binding in advance (instead of doing #call every time event gets fired) for efficiency
	var boundListener = listener.bind(this)
	if (eventName === 'change') {
		var callback = e => {
			// preventing bubbling 'change' event from children (like checkboxes) 
			if (e.target !== this) return
			boundListener(e.detail, e)
		}
	} else {
		var callback = e => boundListener(e.detail, e)
	}
	var killback = () => {
		target.removeEventListener(eventName, callback)
		this[EEKillbacks].delete(listener)
	}
	target.addEventListener(eventName, callback)
	this[EEKillbacks].set(listener, killback)
}

DOMEventEmitter.prototype.once = function(eventName, listener) {
	var callback = e => {
		//if (e.target !== this) return
		listener.call(this, e.detail, e)
		killback()
	}
	var killback = () => {
		this.removeEventListener(eventName, callback)
		this[EEKillbacks].delete(listener)
	}
	this.addEventListener(eventName, callback)
	this[EEKillbacks].set(listener, killback)
}

DOMEventEmitter.prototype.off = function(eventName, listener) {
	var killback = this[EEKillbacks].get(listener)
	if (killback) {
		killback()
		this[EEKillbacks].delete(listener)
	}
}

// simple wrapper for dispatchEvent
export function emit(node, eventName, data) {
	if (data !== undefined)
		var event = new CustomEvent(eventName, {detail: data})
	else
		var event = new Event(eventName)
	node.dispatchEvent(event)
}



export function setupEventListeners(element, meta) {
	// add general purpose killbacks registry
	element[GPKillbacks] = new Set
	element.registerKillback = registerKillback.bind(element)
	// mixin EventEmitter prototype if allowed
	if (!meta.preventEventEmitter) {
		element.on = DOMEventEmitter.prototype.on.bind(element)
		element.once = DOMEventEmitter.prototype.once.bind(element)
		element.off = DOMEventEmitter.prototype.off.bind(element)
		element.emit = emit.bind(element, element)
		DOMEventEmitter.call(element)
		// assign waiting events requested by decorators (which are called before instatiation)
		// sidenote: these listeners might need to be bound or #called
		meta.scheduledEvents.forEach(([name, listener]) => element.on(name, listener))
		meta.scheduledOnce.forEach(([name, listener]) => element.once(name, listener))
	} else {
		// assign waiting events requested by decorators (which are called before instatiation)
		// sidenote: these listeners might need to be bound or #called
		//_.forEach(meta.scheduledEvents, ([name, listener] = data) => {
		meta.scheduledEvents.forEach(([name, listener]) => {
			element.addEventListener(name, listener)
			element.registerKillback(() => element.removeEventListener(name, listener))
		})
		// TODO once
	}
}


export function killEventListeners(element, meta) {
	// kill general purpose killbacks
	runAll(element[GPKillbacks])
	// mixin EventEmitter prototype if allowed
	if (!meta.preventEventEmitter)
		runAll(element[EEKillbacks])
}