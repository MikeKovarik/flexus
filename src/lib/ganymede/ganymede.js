'use strict'

import {camelToKebab, kebabToCamel} from './util'
import {setupReflection, setupInstanceReflection, setupDefaultValues, setupPropertyObservers} from './sync'
import {setupEventListeners, killEventListeners, emit, promiseOnce} from './events'
import {setupTemplate, createIdList, solidifyTemplate} from './template'
import {getMetadata} from './metadata'


export {$, $$} from './util'
export {reflect, defaultValue} from './sync'
export {on, once, emit, scheduleEvent} from './events'
export {template, css} from './template'
export * from './decorators'

export var constructors = {}
export var awaitPromises = []

//var documentReady = promiseOnce(document, 'readystatechange', document.readyState === 'complete')

function awaitDocumentReady() {
	if (document.readyState === 'interactive')
		return Promise.resolve()
	else
		return promiseOnce(document, 'DOMContentLoaded')
}
function awaitPromisesReady() {
	return Promise.all(awaitPromises)
}

export var ready = awaitDocumentReady().then(awaitPromisesReady)

// emit 'ganymede-ready' event to document when ganymede is ready
ready.then(() => emit(document, 'ganymede-ready'))

function registerElement(Class, options) {
	var meta = getMetadata(Class)
	meta.preventIdList = options.preventIdList
	meta.preventEventEmitter = options.preventEventEmitter
	//registerUnresolvedStyle(name)
	solidifyTemplate(meta)
	setupPropertyObservers(meta, Class)
	setupReflection(meta, Class)
	customElements.define(options.name, Class)
	constructors[Class.name] = Class
	window[Class.name] = Class
	return Class
}

export function customElement(arg) {
	if (arg.constructor === Object) {
		return Class => registerElement(Class, arg)
	} else if (arg.constructor === String) {
		return Class => registerElement(Class, {name: arg})
	} else {
		return registerElement(arg, {name: camelToKebab(arg.name)})
	}
}

/*
export function customElement(arg) {
	Promise.all(awaitPromises)
		.catch(e => {
			console.error('Loading polyfills failed, could not continue registering custom elements', e)
		})
		.then(() => {
			if (arg.constructor === Object) {
				return Class => registerElement(Class, arg)
			} else if (arg.constructor === String) {
				return Class => registerElement(Class, {name: arg})
			} else {
				return registerElement(arg, {name: camelToKebab(arg.name)})
			}
		})
		.catch(e => {
			console.error('Error registering custom element', e)
		})
}
*/

// factory for wrapping Ganymede Element and multiple mixins
export function ganymedeElement(...classes) {
	class GanymedeElement extends Element {}
	// each class has different reflected/observed attributes
	GanymedeElement.observedAttributes = []
	classes.unshift(GanymedeElement)
	return classes.reduce((curr, next) => next(curr))
}

// TODO: check this.ownerDocument.defaultView to see if we've been
//       inserted into a document with a browsing context, and avoid

var alreadyConnected = Symbol()

class Element extends HTMLElement {

	// observedAttributes must be finalized at registration time
	static observedAttributes = []

	constructor() {
		super()
		var Class = this.constructor
		var meta = getMetadata(Class)

		// create shadow DOM and inject template if is defined
		if (meta.template) {
			setupTemplate(this, meta)
			// create quick access list of all shadowroot thiss with [id]
			if (!meta.preventIdList)
				createIdList(this)
		}
		// extend this with EventEmitter API if not prevented
		setupEventListeners(this, meta)

		if (this.emit) this.emit('created')
	}

	connectedCallback() {
		// prevent setting up element after first connection
		if (this[alreadyConnected]) {
			if (this.emit) this.emit('connected')
			return
		} else {
			this[alreadyConnected] = true
			var Class = this.constructor
			var meta = getMetadata(Class)

			// setups synchronization of properties decorated with @reflect
			// between the JS object and corresponding HTML tag attributes
			// Note: Also reads descriptor.initializer and injects it into
			//       this right away so theres no delay due to babel
			//       applying the property values at the end of constructor
			setupInstanceReflection(this, meta)
			setupDefaultValues(this, meta)

			// TODO: figure out a better way to call this after users constructor
			if (this.emit) this.emit('connected')
			// DOM elements are initialized top down and children are still unavailable
			// by the time element is 'connected'. 
			setTimeout(() => {
				// TODO, investigate: meta is shared for all instances, this 'constructed' thing is wrong
				meta.constructed = true
				if (this.emit) this.emit('beforeready')
				if (this.ready) this.ready()
				if (this.emit) this.emit('ready')
				if (Class.preventReadyAnimation === undefined)
					this.setAttribute('ready', '')
			})
		}
	}

	disconnectedCallback() {
		if (this.emit) this.emit('disconnected')
		killEventListeners(this, getMetadata(this.constructor))
	}

	show() {
		this.emit('show')
	}

	hide() {
		this.emit('hide')
	}

}
