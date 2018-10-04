import {getMetadata} from './metadata'


// property decorator

export function reflect(ClassProto, propName, descriptor) {
	//console.log('reflect', propName)
	var Class = ClassProto.constructor
	var meta = getMetadata(Class)
	var propMeta = meta.get(propName)
	propMeta.reflect = true
	// register attribute for observation in custom elements API
	Class.observedAttributes.push(propName)

	// type of initializer properties can be discovered before registration
	// Note: can't do the same with getters. Their value is accessible after instatiation
	if (descriptor.initializer) {
		var initValue = descriptor.initializer()
		//console.log('initValue', propName, initValue)
		descriptor.initializer = undefined
		descriptor.writable = true
		if (!determineType(initValue, propMeta))
			initValue = undefined
		meta.initializers.push(context => context[propMeta.symbol] = initValue)
	}
	//return setupGetSet(ClassProto, descriptor, propMeta, meta)
	//console.log('setupGetSet (reflect)', propName, propMeta.getsetAttached)
	var output = setupGetSet(ClassProto, descriptor, propMeta, meta)
	Object.defineProperty(ClassProto, propName, output)
	return output
}

// decorator
export function defaultValue(value) {
	return (ClassProto, propName, descriptor) => {
		var Class = ClassProto.constructor
		var meta = getMetadata(Class)
		var propMeta = meta.get(propName)
		propMeta.defaultValue = value
		if (descriptor.initializer === null)
			descriptor.initializer = () => value.constructor
	}
}


export function setupPropertyObservers(meta, Class) {
	var ClassProto = Class.prototype

	// automatically turn all methods ending with 'Changed' into observer
	Object.getOwnPropertyNames(ClassProto).forEach(methodName => {
		// only focus at methods ending with 'Changed'
		if (!methodName.endsWith('Changed')) return
		// register method as observer in metadata
		var propName = methodName.slice(0, -7)
		var propMeta = meta.get(propName)
		if (!propMeta.observers.includes(methodName))
			propMeta.observers.push(methodName)
	})

	// attach the actual listeners
	meta.forEach(propMeta => {
		if (propMeta.observers.length === 0) return
		var {propName} = propMeta
		// extend property into get/set
		var descriptor = Object.getOwnPropertyDescriptor(ClassProto, propName)
		if (!descriptor) descriptor = getDefaultDescriptor()
		//if (descriptor.configurable === false) return
		//console.log('setupGetSet (setupPropertyObservers)', propName, propMeta.getsetAttached)
		if (!propMeta.getsetAttached) {
			descriptor = setupGetSet(ClassProto, descriptor, propMeta, meta)
			Object.defineProperty(ClassProto, propName, descriptor)
		}
	})
}

function getDefaultDescriptor() {
	return {
		value: undefined,
		enumerable: true,
		writable: true,
		configurable: true
	}
}


export function setupReflection(meta, Class) {
	//var oldCallback = Class.prototype.attributeChangedCallback
	Class.prototype.attributeChangedCallback = function(attrName, oldValue, newValue) {
		deserializeAttribute(this, meta.get(attrName))
		//if (oldCallback) oldCallback.call(this, attrName, oldValue, newValue)
	}
}

export function setupInstanceReflection(element, meta) {
	meta.initializers.forEach(initializer => initializer(element))
		
	meta.forEach(propMeta => {
		if (propMeta.reflect) {
			if (propMeta.type === Boolean) {
				// short circuit the deserialization if type is Boolean
				// and shortcut for 'false' value is present.
				// That is: attribute name with 'no' or 'not' prefix
				// therefore no-attribute-name
				// instead of the attribute-name="false"
				if (element.hasAttribute(`not-${propMeta.attrName}`)) {
					element.removeAttribute(`not-${propMeta.attrName}`)
					element.setAttribute(propMeta.attrName, 'false')
				}
				if (element.hasAttribute(`no-${propMeta.attrName}`)) {
					element.removeAttribute(`no-${propMeta.attrName}`)
					element.setAttribute(propMeta.attrName, 'false')
				}
			}
			// Deserialize is called even though there might be no attribute on element
			// and that's because of setting types and initializing everything correctly
			var initAttrValue = _deserialize(element, propMeta, true)
			// WARNING: Third parameter kicks off the deserializeSkip/reflectSkip manually
			// if element initial doesn't have the attribute to deserialize
			// It's because attributeChangedCallback() gets fired only after existing attribute has changed
			// and this throws off the deserializeSkip/reflectSkip lifecycle
			_reflect(element, propMeta, initAttrValue !== null)
		} else if (propMeta.observers.length) {
			// type of getter can only be discovered after instatiation (not during registration)
			var value = element[propMeta.propName]
			determineType(value, propMeta)
		}
	})
}

export function setupDefaultValues(element, meta) {
	meta.properties.forEach(({propName, defaultValue}) => {
		if (defaultValue === undefined) return
		element[`_${propName}Default`] = defaultValue
		if (element[propName] === undefined)
			element[propName] = defaultValue
	})
}



function setupGetSet(ClassProto, descriptor, propMeta, meta) {
	var {propName, reflect, observers, symbol} = propMeta

	//if (propMeta.getsetAttached)
	//	return Object.getOwnPropertyDescriptor(ClassProto, propName) || descriptor
	//if (propMeta.getsetAttached) return descriptor

	//console.log('setupGetSet', propName, propMeta)
	if (descriptor.get && descriptor.set) {
		// decorated property is already a getter/setter
		var getter = descriptor.get
		var setter = descriptor.set
	} else {
		var symbol = propMeta.symbol
		var getter = function() {
			return this[symbol]
		}
		var setter = function(newValue) {
			this[symbol] = newValue
		}
	}

	function set(newValue) {
		//console.log('_set', propName, newValue)
		// preventing infinite loop that NaN tends to ends up in
		if (Number.isNaN(newValue) && Number.isNaN(value))
			return value = NaN
		var oldValue = getter.call(this)
		if (oldValue === newValue)
			return
		setter.call(this, newValue)
		if (reflect)
			reflectProperty(this, propMeta)

		//console.log('SETTER', propName, newValue)

		// call observers if there are any. And do so only after element is constructed
		// (ignore all observers during bootrapping the deserialize/reflect phase)
		if (observers.length && this.isReady)
			observers.forEach(observerName => this[observerName](newValue, oldValue))
	}

	propMeta.getsetAttached = true

	return {
		configurable: true,
		get: getter,
		set,
	}
}


// returns bool isPrimitive
function determineType(value, propMeta) {
	if (value !== undefined && value !== null && value.constructor !== Function) {
		propMeta.type = value.constructor
		return true
	} else {
		propMeta.type = value
		return false
	}
}




// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------ ELEMENT ATTRIBUTE TO OBJECT PROPERTY DESERIALIZATION ---------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------


function deserializeAttribute(element, propMeta) {
	//console.log('deserialize', propMeta.propName, propMeta.deserializeSkip ? 'SKIP' : 'OK')
	if (propMeta.deserializeSkip)
		propMeta.deserializeSkip = false
	else
		_deserialize(element, propMeta)
}

function _deserialize(element, propMeta, avoidIfHasValue = false) {
	//console.log('_deserialize', propMeta.propName)
	// prevent endless loop by preventing next reflection (which will be triggered by this deserialization)
	var {propName, type} = propMeta
	var attrValue = element.getAttribute(propMeta.attrName)
	//console.log('attrValue', attrValue)
	//console.log('DESERIALIZE', propMeta.type, propName, attrValue)
	//var propValue = element[propName]
	//if (avoidIfHasValue && propValue !== undefined && attrValue === null) return
	if (avoidIfHasValue && attrValue === null) return attrValue
	//console.log('reflectSkip', propMeta.propName)
	// prevent reactiong (setting value will trigget setter which will trigger reflection)
	propMeta.reflectSkip = true
	if (type === Boolean) {
		if (attrValue !== 'false' && attrValue !== null) {
			//console.log('XXX A', propName, true)
			element[propName] = true
		} else {
			//console.log('XXX B')
			element[propName] = false
		}
	} else if (type === Number) {
		element[propName] = attrValue === null ? undefined : +attrValue || 0
	} else if (type === String) {
		element[propName] = attrValue === null ? undefined : attrValue
	} else {
		// custom type handler
		type(element, propName, attrValue)
	}
	// all synchronous reactions were prevented at this point, reset
	propMeta.reflectSkip = false
	return attrValue
}


// ----------------------------------------------------------------------------------------------------------------------
// ------------------------------ PROPERTY TO ELEMENT ATTRIBUTE REFLECTION ---------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

function reflectProperty(element, propMeta) {
	//console.log('reflect', propMeta.propName, propMeta.reflectSkip ? 'SKIP' : 'OK')
	//console.log('reflectProperty', propMeta.propName, propMeta.attrName, '|', propMeta.reflectSkip ? 'SKIP' : 'PASS')
	if (propMeta.reflectSkip)
		propMeta.reflectSkip = false
	else
		_reflect(element, propMeta)
}
function _reflect(element, propMeta, canSkipDeserialize = true) {
	//console.log('_reflect', propMeta.propName, '|', canSkipDeserialize)
	// prevent endless loop by preventing next deserialization (which will be triggered by this reflection)
	propMeta.deserializeSkip = canSkipDeserialize
	var attrName = propMeta.attrName
	var propValue = element[propMeta.propName]
	//console.log('reflect', attrName, propValue)
	if (propValue === undefined) {
		element.removeAttribute(attrName)
		return
	}
	if (propValue === true)
		element.setAttribute(attrName, '')
	else if (propValue === false)
		element.removeAttribute(attrName)
	else
		element.setAttribute(attrName, propValue)
}
