import {scheduleEvent} from 'ganymede'

/*
// create and inject multipurpose overlay
export var overlay = document.createElement('div')
overlay.id = 'fx-overlay'
document.addEventListener('DOMContentLoaded', e => {
	document.body.insertBefore(overlay, document.body.childNodes[0])
})
*/

// creates <style> for adding additional custom rules of imported elements 
var styleEl = document.createElement('style')
styleEl.id = 'fx-addon-styles'
document.head.appendChild(styleEl)
export var styleSheet = styleEl.sheet

export function addReadyAnimation(tagName) {
	styleSheet.addRule(`${tagName}:not([ready])`, 'opacity: 0 !important', 0)
	styleSheet.addRule(`${tagName}[ready]`, 'animation: 200ms fadein', 0)
}


// traverse node's parents until condition is met
export function traverse(startNode, condition) {
	var node = startNode
	while (node != null) {
		if (condition(node)) break
		node = node.parentElement
	}
	return node
}
export function traverseValue(startNode, condition) {
	var node = startNode
	var result
	while (node) {
		result = condition(node)
		if (result !== undefined && result !== null)
			return result
		node = node.parentElement
	}
}

export function runAll(array) {
	for (var i = 0; i < array.length; i++)
		array[i]()
}

export function clamp(num, min, max) {
	return num < min ? min : num > max ? max : num
}

export function mapRange(num, in_min, in_max, out_min, out_max) {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

export function isTouchEvent(e) {
	if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)
		return true
	if (e.pointerType && e.pointerType == 'touch')
		return true
	return false
}

if (!Element.prototype.matches) {
	Element.prototype.matches = 
		Element.prototype.matchesSelector || 
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector || 
		Element.prototype.oMatchesSelector || 
		Element.prototype.webkitMatchesSelector ||
		function(s) {
			var matches = (this.document || this.ownerDocument).querySelectorAll(s)
			var i = matches.length
			while (--i >= 0 && matches.item(i) !== this) {}
			return i > -1
		}
}

var debounceMap = new Map
// warning: very naive implementation for single event type.
//          add some memory to store events in (and prevent duplicates) if used broadly
export function debounceEmit(target, eventName, millis = 50) {
	var debounceTimeout = debounceMap.get(eventName)
	clearTimeout(debounceTimeout)
	debounceTimeout = setTimeout(() => {
		emit(target, eventName)
		//console.log('emit', eventName)
	}, millis)
	//console.log('debounceEmit set', eventName, debounceTimeout)
	debounceMap.set(eventName, debounceTimeout)
}


export function rafThrottle(callback) {
	var latestArg
	var running = false
	function run() {
		running = false
		callback(latestArg)
	}
	return arg => {
		if (running === true) return
		running = true
		latestArg = arg
		requestAnimationFrame(run)
	}
}

// todo: deprecate?
export function draggable(ClassOrElement, name = '', handlersSource = ClassOrElement, bindingTarget = handlersSource, orientation = 'horizontal') {
	var handlers = name instanceof Array ? name : [`on${name}DragStart`, `on${name}DragMove`, `on${name}DragEnd`]

	if (ClassOrElement instanceof Element) {
		// This means drggable used as a function (in some element created/ready callback or something)
		// and is used to handle dragging shadow dom sub element. Name as well as source was given 
		//handlersSource = ClassOrElement
		attachToInstance.call(ClassOrElement)
		// todo. make function like scheduleEvent but for non custom elements (sub elements in shadow tree) - because of killbacks
	} else {
		// This branch means draggable is used as class decorator to add general pointer handler.
		// methods come from Class prototype and will be bound and attached to element
		handlersSource = ClassOrElement.prototype
		scheduleEvent(ClassOrElement, 'created', attachToInstance)
	}


	function attachToInstance() {
		var startHandler, moveHandler, endHandler
		var bindTo = bindingTarget || this
		if (handlersSource[handlers[0]]) startHandler = handlersSource[handlers[0]].bind(bindTo)
		if (handlersSource[handlers[1]]) moveHandler  = handlersSource[handlers[1]].bind(bindTo)
		if (handlersSource[handlers[2]]) endHandler   = handlersSource[handlers[2]].bind(bindTo)

		// touch-action tells browser what direction is not handled by JS and is left to browser to handle
		if (orientation === 'vertical') {
			// browser natively scrolls X axis and JS consumes and takes care of Y axis events
			this.setAttribute('touch-action', 'pan-x')
		} else if (orientation === 'horizontal') {
			// browser natively scrolls Y axis and JS consumes and takes care of X axis events
			this.setAttribute('touch-action', 'pan-y')
		}

		this.addEventListener('pointerdown', onDragStart)
		bindTo.registerKillback(() => this.removeEventListener('pointerdown', onDragStart))

		function onDragStart(e) {
			e.stopPropagation()
			if (e.pointerType == 'mouse')
				e.preventDefault()
			document.addEventListener('pointermove', onDragMove)
			document.addEventListener('pointerup', onDragEnd)
			document.addEventListener('pointercancel', onDragEnd)
			if (startHandler) startHandler(e)
		}
		function onDragMove(e) {
			e.stopPropagation()
			e.preventDefault()
			if (moveHandler) moveHandler(e)
		}
		function onDragEnd(e) {
			e.stopPropagation()
			e.preventDefault()
			document.removeEventListener('pointermove', onDragMove)
			document.removeEventListener('pointerup', onDragEnd)
			document.removeEventListener('pointercancel', onDragEnd)
			if (endHandler) endHandler(e)
		}
	}
}