(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('ganymede', ['exports'], factory) :
	(factory((global.ganymede = global.ganymede || {})));
}(this, (function (exports) { 'use strict';

var $ = document.querySelector.bind(document);
var $$ = selector => Array.from(document.querySelectorAll(selector));

function camelToKebab(string) {
	return string.split(/(?=[A-Z])/).join('-').toLowerCase();
}

function kebabToCamel(string) {
	return string.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

function runAll(iterable) {
	iterable.forEach(fc => fc());
}

var meta = Symbol('Metadata');

function getMetadata(Class) {
	if (!Class[meta]) Class[meta] = new Metadata(Class);
	return Class[meta];
}

let Metadata = class Metadata {
	// TODO: Let the class extend Map instead of using this map
	//       when extending builtins is implemented in browsers
	constructor(Class) {
		this.properties = new Map();
		this.attributes = new Map();
		this.template = undefined;
		this.initializers = [];
		this.scheduledEvents = [];
		this.scheduledOnce = [];

		// TODO clone inherited metadata
		//var Super = Object.getPrototypeOf(Class)
		//Class[meta] = Metadata.clone(Super[meta])
		this.className = Class.name;
		this.elementName = camelToKebab(Class.name);
	}
	//reflections = []


	get(propName) {
		return this.getProp(propName);
	}

	_createPropAttr(propName, attrName) {
		var propMeta = new PropAttrMeta(propName, attrName);
		this.properties.set(propName, propMeta);
		this.attributes.set(attrName, propMeta);
		return propMeta;
	}

	getProp(propName) {
		if (!this.properties.has(propName)) return this._createPropAttr(propName, camelToKebab(propName));else return this.properties.get(propName);
	}

	getAttr(attrName) {
		if (!this.attributes.has(attrName)) return this._createPropAttr(kebabToCamel(attrName), attrName);else return this.attributes.get(attrName);
	}

	forEach(callback) {
		this.properties.forEach(callback);
	}

};
let PropAttrMeta = class PropAttrMeta {

	constructor(propName, attrName) {
		this.observers = [];
		this.type = undefined;
		this.reflect = false;
		this.reflectSkip = false;
		this.deserializeSkip = false;
		this.getsetAttached = false;
		this.getter = undefined;
		this.setter = undefined;
		this.initValue = undefined;
		this.defaultValue = undefined;

		this.propName = propName;
		this.attrName = attrName;
		this.symbol = Symbol(propName);
	}
	// original getter/setter of the property


	// comes from descriptor.initializer() to determine initial value or type

	// comes from @defaultValue descriptor and only assigns value if initial is undefined
};

// property decorator

function reflect(ClassProto, propName, descriptor) {
	//console.log('reflect', propName)
	var Class = ClassProto.constructor;
	var meta = getMetadata(Class);
	var propMeta = meta.get(propName);
	propMeta.reflect = true;
	// register attribute for observation in custom elements API
	Class.observedAttributes.push(propName);

	// type of initializer properties can be discovered before registration
	// Note: can't do the same with getters. Their value is accessible after instatiation
	if (descriptor.initializer) {
		var initValue = descriptor.initializer();
		//console.log('initValue', propName, initValue)
		descriptor.initializer = undefined;
		descriptor.writable = true;
		if (!determineType(initValue, propMeta)) initValue = undefined;
		meta.initializers.push(context => context[propMeta.symbol] = initValue);
	}
	//return setupGetSet(ClassProto, descriptor, propMeta, meta)
	//console.log('setupGetSet (reflect)', propName, propMeta.getsetAttached)
	var output = setupGetSet(ClassProto, descriptor, propMeta, meta);
	Object.defineProperty(ClassProto, propName, output);
	return output;
}

// decorator
function defaultValue(value) {
	return (ClassProto, propName, descriptor) => {
		var Class = ClassProto.constructor;
		var meta = getMetadata(Class);
		var propMeta = meta.get(propName);
		propMeta.defaultValue = value;
		if (descriptor.initializer === null) descriptor.initializer = () => value.constructor;
	};
}

function setupPropertyObservers(meta, Class) {
	var ClassProto = Class.prototype;

	// automatically turn all methods ending with 'Changed' into observer
	Object.getOwnPropertyNames(ClassProto).forEach(methodName => {
		// only focus at methods ending with 'Changed'
		if (!methodName.endsWith('Changed')) return;
		// register method as observer in metadata
		var propName = methodName.slice(0, -7);
		var propMeta = meta.get(propName);
		if (!propMeta.observers.includes(methodName)) propMeta.observers.push(methodName);
	});

	// attach the actual listeners
	meta.forEach(propMeta => {
		if (propMeta.observers.length === 0) return;
		var { propName } = propMeta;
		// extend property into get/set
		var descriptor = Object.getOwnPropertyDescriptor(ClassProto, propName);
		if (!descriptor) descriptor = getDefaultDescriptor();
		//if (descriptor.configurable === false) return
		//console.log('setupGetSet (setupPropertyObservers)', propName, propMeta.getsetAttached)
		if (!propMeta.getsetAttached) {
			descriptor = setupGetSet(ClassProto, descriptor, propMeta, meta);
			Object.defineProperty(ClassProto, propName, descriptor);
		}
	});
}

function getDefaultDescriptor() {
	return {
		value: undefined,
		enumerable: true,
		writable: true,
		configurable: true
	};
}

function setupReflection(meta, Class) {
	//var oldCallback = Class.prototype.attributeChangedCallback
	Class.prototype.attributeChangedCallback = function (attrName, oldValue, newValue) {
		deserializeAttribute(this, meta.get(attrName));
		//if (oldCallback) oldCallback.call(this, attrName, oldValue, newValue)
	};
}

function setupInstanceReflection(element, meta) {
	meta.initializers.forEach(initializer => initializer(element));

	meta.forEach(propMeta => {
		if (propMeta.reflect) {
			if (propMeta.type === Boolean) {
				// short circuit the deserialization if type is Boolean
				// and shortcut for 'false' value is present.
				// That is: attribute name with 'no' or 'not' prefix
				// therefore no-attribute-name
				// instead of the attribute-name="false"
				if (element.hasAttribute(`not-${ propMeta.attrName }`)) {
					element.removeAttribute(`not-${ propMeta.attrName }`);
					element.setAttribute(propMeta.attrName, 'false');
				}
				if (element.hasAttribute(`no-${ propMeta.attrName }`)) {
					element.removeAttribute(`no-${ propMeta.attrName }`);
					element.setAttribute(propMeta.attrName, 'false');
				}
			}
			// Deserialize is called even though there might be no attribute on element
			// and that's because of setting types and initializing everything correctly
			var initAttrValue = _deserialize(element, propMeta, true);
			// WARNING: Third parameter kicks off the deserializeSkip/reflectSkip manually
			// if element initial doesn't have the attribute to deserialize
			// It's because attributeChangedCallback() gets fired only after existing attribute has changed
			// and this throws off the deserializeSkip/reflectSkip lifecycle
			_reflect(element, propMeta, initAttrValue !== null);
		} else if (propMeta.observers.length) {
			// type of getter can only be discovered after instatiation (not during registration)
			var value = element[propMeta.propName];
			determineType(value, propMeta);
		}
	});
}

function setupDefaultValues(element, meta) {
	meta.properties.forEach(({ propName, defaultValue }) => {
		if (defaultValue === undefined) return;
		element[`_${ propName }Default`] = defaultValue;
		if (element[propName] === undefined) element[propName] = defaultValue;
	});
}

function setupGetSet(ClassProto, descriptor, propMeta, meta) {
	var { propName, reflect, observers, symbol } = propMeta;

	//if (propMeta.getsetAttached)
	//	return Object.getOwnPropertyDescriptor(ClassProto, propName) || descriptor
	//if (propMeta.getsetAttached) return descriptor

	//console.log('setupGetSet', propName, propMeta)
	if (descriptor.get && descriptor.set) {
		// decorated property is already a getter/setter
		var getter = descriptor.get;
		var setter = descriptor.set;
	} else {
		var symbol = propMeta.symbol;
		var getter = function () {
			return this[symbol];
		};
		var setter = function (newValue) {
			this[symbol] = newValue;
		};
	}

	function set(newValue) {
		//console.log('_set', propName, newValue)
		// preventing infinite loop that NaN tends to ends up in
		if (Number.isNaN(newValue) && Number.isNaN(value)) return value = NaN;
		var oldValue = getter.call(this);
		if (oldValue === newValue) return;
		setter.call(this, newValue);
		if (reflect) reflectProperty(this, propMeta);

		//console.log('SETTER', propName, newValue)

		// call observers if there are any. And do so only after element is constructed
		// (ignore all observers during bootrapping the deserialize/reflect phase)
		if (observers.length && meta.constructed) observers.forEach(observerName => this[observerName](newValue, oldValue));
	}

	propMeta.getsetAttached = true;

	return {
		configurable: true,
		get: getter,
		set
	};
}

// returns bool isPrimitive
function determineType(value, propMeta) {
	if (value !== undefined && value !== null && value.constructor !== Function) {
		propMeta.type = value.constructor;
		return true;
	} else {
		propMeta.type = value;
		return false;
	}
}

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------ ELEMENT ATTRIBUTE TO OBJECT PROPERTY DESERIALIZATION ---------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------


function deserializeAttribute(element, propMeta) {
	//console.log('deserialize', propMeta.propName, propMeta.deserializeSkip ? 'SKIP' : 'OK')
	if (propMeta.deserializeSkip) propMeta.deserializeSkip = false;else _deserialize(element, propMeta);
}

function _deserialize(element, propMeta, avoidIfHasValue = false) {
	//console.log('_deserialize', propMeta.propName)
	// prevent endless loop by preventing next reflection (which will be triggered by this deserialization)
	var { propName, type } = propMeta;
	var attrValue = element.getAttribute(propMeta.attrName);
	//console.log('attrValue', attrValue)
	//console.log('DESERIALIZE', propMeta.type, propName, attrValue)
	//var propValue = element[propName]
	//if (avoidIfHasValue && propValue !== undefined && attrValue === null) return
	if (avoidIfHasValue && attrValue === null) return attrValue;
	//console.log('reflectSkip', propMeta.propName)
	// prevent reactiong (setting value will trigget setter which will trigger reflection)
	propMeta.reflectSkip = true;
	if (type === Boolean) {
		if (attrValue !== 'false' && attrValue !== null) {
			//console.log('XXX A', propName, true)
			element[propName] = true;
		} else {
			//console.log('XXX B')
			element[propName] = false;
		}
	} else if (type === Number) {
		element[propName] = attrValue === null ? undefined : +attrValue || 0;
	} else if (type === String) {
		element[propName] = attrValue === null ? undefined : attrValue;
	} else {
		// custom type handler
		type(element, propName, attrValue);
	}
	// all synchronous reactions were prevented at this point, reset
	propMeta.reflectSkip = false;
	return attrValue;
}

// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------ PROPERTY TO ELEMENT ATTRIBUTE REFLECTION ---------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

function reflectProperty(element, propMeta) {
	//console.log('reflect', propMeta.propName, propMeta.reflectSkip ? 'SKIP' : 'OK')
	//console.log('reflectProperty', propMeta.propName, propMeta.attrName, '|', propMeta.reflectSkip ? 'SKIP' : 'PASS')
	if (propMeta.reflectSkip) propMeta.reflectSkip = false;else _reflect(element, propMeta);
}
function _reflect(element, propMeta, canSkipDeserialize = true) {
	//console.log('_reflect', propMeta.propName, '|', canSkipDeserialize)
	// prevent endless loop by preventing next deserialization (which will be triggered by this reflection)
	propMeta.deserializeSkip = canSkipDeserialize;
	var attrName = propMeta.attrName;
	var propValue = element[propMeta.propName];
	//console.log('reflect', attrName, propValue)
	if (propValue === undefined) {
		element.removeAttribute(attrName);
		return;
	}
	if (propValue === true) element.setAttribute(attrName, '');else if (propValue === false) element.removeAttribute(attrName);else element.setAttribute(attrName, propValue);
}

// property decorator: add method as event listener (to instance or given node or path to node)
function on(...args) {
	var eventName = args.pop();
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
		var condition = eventName;
		eventName = args.pop();
	}
	// Two arguments were given.
	// First arg is path to element on which to listen the event
	// (for example '$.myid' matches 'this.$.myid')
	// or the element itself (not related to instace, something like window/document, etc...)
	// Second one is the eventName
	var nodeOrPath = args[0];
	if (typeof nodeOrPath === 'string') {
		var nodePath = nodeOrPath;
		var globalNode;
	} else {
		var nodePath;
		var globalNode = nodeOrPath;
	}
	var nodePath = typeof nodeOrPath === 'string' ? nodeOrPath : undefined;
	return (ClassProto, callbackName) => {
		var errorMsg = `ganymede: unable to attach @on event listener for ${ ClassProto.constructor.name }#${ nodePath } because node path is undefined`;
		// wait for creation of element, to populate shadowRoot nodes
		scheduleOnce(ClassProto.constructor, 'connected', function () {
			//scheduleEvent(ClassProto.constructor, 'created', function() {
			// node is either given (something not related to instance like window/document)
			// or path to the node is (like 'nextElementSibling')
			// or nothing is given and target is the custom element itself (at this point
			// it must be because of the condition)
			var node = globalNode || (nodePath ? traverseNodePath(this, nodePath) : this);
			if (node) {
				attachEvent(this, node, callbackName, eventName, condition);
			} else if (nodePath) {
				// something went wrong, unable to attach
				if (nodePath.includes('.')) {
					throw Error(errorMsg);
				} else {
					// path is not deep so we could try to wait for the ready event and try again
					this.once('ready', () => {
						node = traverseNodePath(this, nodePath);
						if (node) attachEvent(this, node, callbackName, eventName, condition);else throw Error(errorMsg);
					});
				}
			}
		});
	};
}

// property decorator: 
function once(...args) {
	console.warn(`ganymede: @once decorator is not yet implemented`);
	return on(...args);
}

function promiseOnce(target, eventName, condition, rejectIfNotMet = false) {
	return new Promise((resolve, reject) => {
		target.addEventListener(eventName, () => {
			if (condition) {
				if (condition()) {
					resolve();
				} else if (rejectIfNotMet) {
					reject();
				}
			} else {
				resolve();
			}
		});
	});
}

function traverseNodePath(context, nodePath) {
	var node;
	if (nodePath.includes('.')) {
		var pathSplit = nodePath.split('.'); // path to element in shadowRoot like '$.myid' for 'this.$.myid'
		var pathStep;
		node = context;
		while (pathStep = pathSplit.shift()) {
			node = node[pathStep];
		}
	} else {
		node = context[nodePath];
	}
	return node;
}

// Returns true if attaching event was successful
// Returns false if could not attach due to false condition
function attachEvent(context, node, callbackName, eventName, condition) {
	if (condition && !condition(context)) return false;
	var listener = context[callbackName].bind(context);
	node.addEventListener(eventName, e => listener(e.detail, e));
	context.registerKillback(() => node.removeEventListener(eventName, listener));
	return true;
}

// Decorators can't access instance but sometimes need to (hook up event listener).
// This schedules event callback in a hidden queue and those will be attached on instantiation
function scheduleEvent(Class, eventName, callback) {
	getMetadata(Class).scheduledEvents.push([eventName, callback]);
}
function scheduleOnce(Class, eventName, callback) {
	getMetadata(Class).scheduledOnce.push([eventName, callback]);
}

// General Purpose Killbacks
var GPKillbacks = Symbol('GPKillbacks');

function registerKillback(killback) {
	this[GPKillbacks].add(killback);
}

// NOTE: this is made to be extendable class as well as decorator.
// It could be exported but is not now and is instead built into every element

// EventEmitter Killbacks
var EEKillbacks = Symbol('EEKillbacks');

function DOMEventEmitter() {
	this[EEKillbacks] = new Map();
}

// args: [target], eventName, listener
// by default events on 'this' are listened but sometimes the nice syntax of on()
// and killbacks is nice to use elsewhere (like on children)
DOMEventEmitter.prototype.on = function (...args) {
	var listener = args.pop();
	var eventName = args.pop();
	var target = args.length ? args.pop() : this;
	// binding in advance (instead of doing #call every time event gets fired) for efficiency
	var boundListener = listener.bind(this);
	if (eventName === 'change') {
		var callback = e => {
			// preventing bubbling 'change' event from children (like checkboxes) 
			if (e.target !== this) return;
			boundListener(e.detail, e);
		};
	} else {
		var callback = e => boundListener(e.detail, e);
	}
	var killback = () => {
		target.removeEventListener(eventName, callback);
		this[EEKillbacks].delete(listener);
	};
	target.addEventListener(eventName, callback);
	this[EEKillbacks].set(listener, killback);
};

DOMEventEmitter.prototype.once = function (eventName, listener) {
	var callback = e => {
		//if (e.target !== this) return
		listener.call(this, e.detail, e);
		killback();
	};
	var killback = () => {
		this.removeEventListener(eventName, callback);
		this[EEKillbacks].delete(listener);
	};
	this.addEventListener(eventName, callback);
	this[EEKillbacks].set(listener, killback);
};

DOMEventEmitter.prototype.off = function (eventName, listener) {
	var killback = this[EEKillbacks].get(listener);
	if (killback) {
		killback();
		this[EEKillbacks].delete(listener);
	}
};

// simple wrapper for dispatchEvent
function emit(node, eventName, data) {
	if (data !== undefined) var event = new CustomEvent(eventName, { detail: data });else var event = new Event(eventName);
	node.dispatchEvent(event);
}

function setupEventListeners(element, meta) {
	// add general purpose killbacks registry
	element[GPKillbacks] = new Set();
	element.registerKillback = registerKillback.bind(element);
	// mixin EventEmitter prototype if allowed
	if (!meta.preventEventEmitter) {
		element.on = DOMEventEmitter.prototype.on.bind(element);
		element.once = DOMEventEmitter.prototype.once.bind(element);
		element.off = DOMEventEmitter.prototype.off.bind(element);
		element.emit = emit.bind(element, element);
		DOMEventEmitter.call(element);
		// assign waiting events requested by decorators (which are called before instatiation)
		// sidenote: these listeners might need to be bound or #called
		meta.scheduledEvents.forEach(([name, listener]) => element.on(name, listener));
		meta.scheduledOnce.forEach(([name, listener]) => element.once(name, listener));
	} else {
		// assign waiting events requested by decorators (which are called before instatiation)
		// sidenote: these listeners might need to be bound or #called
		//_.forEach(meta.scheduledEvents, ([name, listener] = data) => {
		meta.scheduledEvents.forEach(([name, listener]) => {
			element.addEventListener(name, listener);
			element.registerKillback(() => element.removeEventListener(name, listener));
		});
		// TODO once
	}
}

function killEventListeners(element, meta) {
	// kill general purpose killbacks
	runAll(element[GPKillbacks]);
	// mixin EventEmitter prototype if allowed
	if (!meta.preventEventEmitter) runAll(element[EEKillbacks]);
}

//var polyfillShadowCss = window.ShadyCSS && navigator.userAgent.includes('Edge')

// creates shadow dom inside element and injects template into it
function setupTemplate(element, meta) {
	var clonedTemplate = document.importNode(meta.template.content, true);
	element.attachShadow({ mode: 'open' });
	element.shadowRoot.appendChild(clonedTemplate);
	if (window.ShadyCSS && ShadyCSS.styleElement) ShadyCSS.styleElement(element);else if (window.ShadyCSS && ShadyCSS.applyStyle) ShadyCSS.applyStyle(element);
}

// find all elements with id inside shadowRoot and assign them to element.$
function createIdList(element) {
	var $ = element.$ = {};
	if (element.shadowRoot == null) return;
	Array.from(element.shadowRoot.querySelectorAll('[id]')).forEach(element => {
		$[element.id] = element;
	});
}

// ------------------------------------- DECORATORS ------------------------------------------

// created template element out of given template string (for performance)
// and also polyfills styles for older browsers
function solidifyTemplate(meta) {
	if (!(meta.templateString || meta.styleString)) return;
	meta.template = document.createElement('template');
	meta.template.innerHTML = (meta.styleString || '') + (meta.templateString || '<slot></slot>');
	if (window.ShadyCSS) window.ShadyCSS.prepareTemplate(meta.template, meta.elementName);
}

// class decorator: attaches shadow dom template string to the class
function template(templateString) {
	return Class => {
		var meta = getMetadata(Class);
		meta.templateString = templateString;
	};
}

// class decorator: attaches css stylesheet to the class
function css(urlOrStyle) {
	return Class => {
		var meta = getMetadata(Class);
		if (urlOrStyle.includes('.css')) {
			meta.styleString = `<style>@import '${ urlOrStyle }';</style>`;
		} else {
			meta.styleString = `<style>${ urlOrStyle }</style>`;
		}
	};
}

function nonenumerable(target, name, descriptor) {
	descriptor.enumerable = false;
	return descriptor;
}

// method decorator
// example: @observe('firstName', 'lastName') printName() {...}
function observe(...observedProperties) {
	return function (ClassProto, callbackName) {
		var meta = getMetadata(ClassProto.constructor);
		observedProperties.forEach(propName => {
			meta.get(propName).observers.push(callbackName);
		});
	};
}

// method decorator
// hooks into existing getter/setter (like @reflect) and accepts function that is called
// on value change, but before Ganymede gets to it so the value can be validated, limited, clipped, etc...
// TODO: make this work with simple properties (and turn them into getter/setter)
function validate(validator) {
	return (ClassProto, propName, descriptor) => {
		var originalSet = descriptor.set;
		function set(newValue) {
			var validated = validator.call(this, newValue, this);
			originalSet.call(this, validated);
		}
		descriptor.set = set;
		return descriptor;
	};
}

function autobind(ClassProto, methodName, descriptor) {
	var fn = descriptor.value;
	return {
		configurable: true,
		get() {
			var bound = fn.bind(this);
			Object.defineProperty(this, methodName, {
				value: bound,
				configurable: true,
				writable: true
			});
			return bound;
		}
	};
}

'use strict';

var _class;
var _temp;

var constructors = {};
var awaitPromises = [];

//var documentReady = promiseOnce(document, 'readystatechange', document.readyState === 'complete')

function awaitDocumentReady() {
	if (document.readyState === 'interactive') return Promise.resolve();else return promiseOnce(document, 'DOMContentLoaded');
}
function awaitPromisesReady() {
	return Promise.all(awaitPromises);
}

var ready = awaitDocumentReady().then(awaitPromisesReady);

// emit 'ganymede-ready' event to document when ganymede is ready
ready.then(() => emit(document, 'ganymede-ready'));

function registerElement(Class, options) {
	var meta = getMetadata(Class);
	meta.preventIdList = options.preventIdList;
	meta.preventEventEmitter = options.preventEventEmitter;
	//registerUnresolvedStyle(name)
	solidifyTemplate(meta);
	setupPropertyObservers(meta, Class);
	setupReflection(meta, Class);
	customElements.define(options.name, Class);
	constructors[Class.name] = Class;
	window[Class.name] = Class;
	return Class;
}

function customElement(arg) {
	if (arg.constructor === Object) {
		return Class => registerElement(Class, arg);
	} else if (arg.constructor === String) {
		return Class => registerElement(Class, { name: arg });
	} else {
		return registerElement(arg, { name: camelToKebab(arg.name) });
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
function ganymedeElement(...classes) {
	let GanymedeElement = class GanymedeElement extends Element {};
	// each class has different reflected/observed attributes

	GanymedeElement.observedAttributes = [];
	classes.unshift(GanymedeElement);
	return classes.reduce((curr, next) => next(curr));
}

// TODO: check this.ownerDocument.defaultView to see if we've been
//       inserted into a document with a browsing context, and avoid

var alreadyConnected = Symbol();

let Element = (_temp = _class = class Element extends HTMLElement {

	constructor() {
		super();
		var Class = this.constructor;
		var meta = getMetadata(Class);

		// create shadow DOM and inject template if is defined
		if (meta.template) {
			setupTemplate(this, meta);
			// create quick access list of all shadowroot thiss with [id]
			if (!meta.preventIdList) createIdList(this);
		}
		// extend this with EventEmitter API if not prevented
		setupEventListeners(this, meta);

		if (this.emit) this.emit('created');
	}

	// observedAttributes must be finalized at registration time


	connectedCallback() {
		// prevent setting up element after first connection
		if (this[alreadyConnected]) {
			if (this.emit) this.emit('connected');
			return;
		} else {
			this[alreadyConnected] = true;
			var Class = this.constructor;
			var meta = getMetadata(Class);

			// setups synchronization of properties decorated with @reflect
			// between the JS object and corresponding HTML tag attributes
			// Note: Also reads descriptor.initializer and injects it into
			//       this right away so theres no delay due to babel
			//       applying the property values at the end of constructor
			setupInstanceReflection(this, meta);
			setupDefaultValues(this, meta);

			// TODO: figure out a better way to call this after users constructor
			if (this.emit) this.emit('connected');
			// DOM elements are initialized top down and children are still unavailable
			// by the time element is 'connected'. 
			setTimeout(() => {
				// TODO, investigate: meta is shared for all instances, this 'constructed' thing is wrong
				meta.constructed = true;
				if (this.emit) this.emit('beforeready');
				if (this.ready) this.ready();
				if (this.emit) this.emit('ready');
				if (Class.preventReadyAnimation === undefined) this.setAttribute('ready', '');
			});
		}
	}

	disconnectedCallback() {
		if (this.emit) this.emit('disconnected');
		killEventListeners(this, getMetadata(this.constructor));
	}

	show() {
		this.emit('show');
	}

	hide() {
		this.emit('hide');
	}

}, _class.observedAttributes = [], _temp);

exports.constructors = constructors;
exports.awaitPromises = awaitPromises;
exports.ready = ready;
exports.customElement = customElement;
exports.ganymedeElement = ganymedeElement;
exports.$ = $;
exports.$$ = $$;
exports.reflect = reflect;
exports.defaultValue = defaultValue;
exports.on = on;
exports.once = once;
exports.emit = emit;
exports.scheduleEvent = scheduleEvent;
exports.template = template;
exports.css = css;
exports.nonenumerable = nonenumerable;
exports.observe = observe;
exports.validate = validate;
exports.autobind = autobind;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=ganymede.js.map
