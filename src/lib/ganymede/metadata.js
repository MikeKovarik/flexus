import {camelToKebab, kebabToCamel} from './util'


var meta = Symbol('Metadata')

export function getMetadata(Class) {
	if (!Class[meta])
		Class[meta] = new Metadata(Class)
	return Class[meta]
}

class Metadata {
	// TODO: Let the class extend Map instead of using this map
	//       when extending builtins is implemented in browsers
	properties = new Map
	attributes = new Map

	template = undefined
	//reflections = []
	initializers = []
	scheduledEvents = []
	scheduledOnce = []

	constructor(Class) {
		// TODO clone inherited metadata
		//var Super = Object.getPrototypeOf(Class)
		//Class[meta] = Metadata.clone(Super[meta])
		this.className = Class.name
		this.elementName = camelToKebab(Class.name)
	}

	get(propName) {
		return this.getProp(propName)
	}

	_createPropAttr(propName, attrName) {
		var propMeta = new PropAttrMeta(propName, attrName)
		this.properties.set(propName, propMeta)
		this.attributes.set(attrName, propMeta)
		return propMeta
	}

	getProp(propName) {
		if (!this.properties.has(propName))
			return this._createPropAttr(propName, camelToKebab(propName))
		else
			return this.properties.get(propName)
	}

	getAttr(attrName) {
		if (!this.attributes.has(attrName))
			return this._createPropAttr(kebabToCamel(attrName), attrName)
		else
			return this.attributes.get(attrName)
	}

	forEach(callback) {
		this.properties.forEach(callback)
	}

}

class PropAttrMeta {

	constructor(propName, attrName) {
		this.propName = propName
		this.attrName = attrName
		this.symbol = Symbol(propName)
	}

	observers = []
	type = undefined
	reflect = false
	reflectSkip = false
	deserializeSkip = false
	getsetAttached = false
	// original getter/setter of the property
	getter = undefined
	setter = undefined

	// comes from descriptor.initializer() to determine initial value or type
	initValue = undefined
	// comes from @defaultValue descriptor and only assigns value if initial is undefined
	defaultValue = undefined
}