import {getMetadata, reflect} from 'ganymede'
import {platform} from './platform'


export function reflectQuery(proto, propName, desc) {
	// TODO: translate propName to kebab-case
	// TODO: it'd be better to integrate deeper into ganymede
	var Class = proto.constructor
	var meta = getMetadata(Class)
	var propMeta = meta.get(propName)
	var initialBuiltinValue = desc.initializer && desc.initializer()
	meta.initializers.push(element => {
		var attrValue = element.getAttribute(propMeta.attrName)
		var query = new Query(attrValue)
		var updateValue = () => element[propName] = query.valid
		updateValue()
		element[propName + 'Query'] = query
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


/*
// QUERY PART CAN LOOK LIKE:
{
	screensize: undefined, // 'xs', 's', 'm', 'l', 'xl'
	inputType: undefined, // 'touch', ?mouse/nontouch?
	design: undefined, // 'material', 'fluent'
	theme: undefined, // 'dark', 'light'
}
*/



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