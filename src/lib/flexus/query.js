import {getMetadata, reflect} from 'ganymede'
import {platform} from './platform'


// TODO: Implement API for canceling query from updating value
// usecase: flexus-tabs has preset that changes the way it is rendered if the tabs
// are icons, icons+text, only text. and it changes based on the combination.
// by default [fixed] is only on phones, but in some cases there has to be manual override

/*
// QUERY PART CAN LOOK LIKE:
{
	screensize: undefined, // 'xs', 's', 'm', 'l', 'xl'
	inputType: undefined, // 'touch', ?mouse/nontouch?
	design: undefined, // 'material', 'fluent'
	theme: undefined, // 'dark', 'light'
}
*/

export function reflectQuery(proto, propName, desc) {
	// TODO: translate propName to kebab-case
	// TODO: it'd be better to integrate deeper into ganymede
	var Class = proto.constructor
	var meta = getMetadata(Class)
	var propMeta = meta.get(propName)
	var initialBuiltinValue = desc.initializer && desc.initializer()
	var sharedQuery = new Query(initialBuiltinValue)
	meta.initializers.push(element => {
		var attrValue = element.getAttribute(propMeta.attrName)
		if (attrValue === null) {
			// Attribute is not present on the element.
			// User did not override anything and allowed us to apply query.
			// Use default query to save resources.
			var query = sharedQuery
		} else if (attrValue === '') {
			// Attribute is present on the element without any query.
			// It's effectively 'true' value at all times. No need to use query
			return
		} else {
			// User specified custom query. Use it.
			var query = new Query(attrValue)
		}
		element[propName + 'Query'] = query
		var updateValue = () => element[propName] = query.valid
		updateValue()
		var scopes = query.getScopes()
		if (scopes.includes('screensize'))
			document.addEventListener('screensize-update', updateValue)
	})
	return reflect(proto, propName, desc)
}

class Query extends Array {

	constructor(queryString) {
		super()
		this.add(queryString)
	}

	add(queryString) {
		if (queryString === true || queryString === 'true')
			return this.push({valid: true})
		if (queryString === false || queryString === 'false')
			return this.push({valid: false})
		if (typeof queryString !== 'string') return
		var newParts = queryString.split(' ').map(part => new QueryPart(part))
		this.push(...newParts)
	}

	getScopes() {
		return this
			.map(part => Object.entries(part))
			.flat()
			.filter(entry => entry[1] !== undefined)
			.map(entry => entry[0])
			.filter(entry => entry)
	}

	get valid() {
		return this.some(p => p.valid)
	}

}

class QueryPart {

	orientation = undefined // 'portrait', 'landscape'
	screensize = undefined // 'xs', 's', 'm', 'l', 'xl'
	inputType = undefined // 'touch', ?mouse/nontouch?
	design = undefined // 'material', 'fluent'
	theme = undefined // 'dark', 'light'

	constructor(partString) {
		// this enables more complex queries like material-touch (availabel only on touch devices with material design)
		partString.split('-').map(part => this.applyPart(part))
	}

	applyPart(part) {
		switch (part) {
			case 's':
			case 'small':
				return this.screensize = 's'
			case 'm':
			case 'medium':
				return this.screensize = 'm'
			case 'l':
			case 'large':
				return this.screensize = 'l'
			case 'material':
				return this.design = 'material'
			case 'neon':   // TODO: delete once neon is renamed to fluent
			case 'fluent': // TODO: delete once neon is renamed to fluent
				return this.design = 'neon'
			case 'touch':
				return this.inputType = 'touch'
			case 'nontouch':
			case 'mouse':
				return this.inputType = 'nontouch'
			case 'light':
			case 'dark':
				return this.theme = part
			case 'portrait':
			case 'landscape':
				return this.orientation = part
		}
	}

	// TODO: solve 'xs' and 's' problem ...
	// either part.screensize.includes(platform.screensize)
	// or     platform.screensize.includes(part.screensize)
	get valid() {
		var {screensize, inputType, design, theme} = this
		return (screensize !== undefined ? screensize === platform.screensize : true)
			&& (inputType !== undefined ? inputType === platform.inputType : true)
			&& (design !== undefined ? design === platform.design : true)
			&& (theme !== undefined ? theme === platform.theme : true)
	}

}



export function queryAttrAvailability(node, attrName) {
	var val = node.getAttribute(attrName)
	if (val === null) return false
	if (val === '') return true
	if (attrName === 'disabled' && val === 'disabled') return true
	var part = new QueryPart(val)
	console.log('part.valid', part.valid)
	return part.valid
}




/*

OLDER API for looking for verifying non-reactive non-ganymede attributes on non-custom-components.
// TODO: reimplement this. some do the querying and checking on static elements themselves

var screenSizeFlags = {
	s:   0b001,
	m:   0b010,
	l:   0b100,
	gts: 0b110, // no longer used, we're using combination of 'm l' instead of gts
	ltl: 0b011, // no longer used, we're using combination of 's m' instead of ltl
}

export function matchFormFactorDef(def) {
	if (screenSizeFlags[def] === undefined) {
		// custom value applicable for all formfactors
		return true
	} else {
		// query to enable only for certain formfactors
		def = screenSizeFlags[def]
		var ss = screenSizeFlags[platform.screensize]
		return (def & ss) > 0
	}
}
*/