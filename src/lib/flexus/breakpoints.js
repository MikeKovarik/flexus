import ganymede from 'ganymede'
import {reflect, observe, emit} from 'ganymede'
import {platform} from './platform'


var screensizes = ['s', 'm', 'l']

const SMALL  = 's'
const MEDIUM = 'm'
const LARGE  = 'l'

export const SCREENSIZE = {SMALL, MEDIUM, LARGE}

var screenSizeFlags = {
	s:   0b001,
	m:   0b010,
	l:   0b100,
	gts: 0b110,
	ltl: 0b011,
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

// helpers for transforming numbers into breakpoint queries
var makeFirstQuery = value => `(max-width: ${value}px)`
var makeLastQuery = value => `(min-width: ${value}px)`
var makeStepQuery = (a, b) => `${makeLastQuery(a)} and ${makeFirstQuery(b)}`

// transorms array of breakpoint numbers into queries describing these breakpoints
function makeBreakpointQueries(breakpoints) {
	//breakpoints = breakpoints.map(Number)
	breakpoints = breakpoints
		.map(num => parseInt(num))
		.filter(num => num) // for now just filter out empty breakpoints
	var queries = [makeFirstQuery(breakpoints[0])]
	var lastIndex = breakpoints.length - 1
	if (lastIndex > 0) {
		for (var i = 0; i < lastIndex; i++)
			queries.push(makeStepQuery(breakpoints[i], breakpoints[i + 1]))
	}
	queries.push(makeLastQuery(breakpoints[lastIndex]))
	return queries
}

function registerQueries(queries, onAlways, onUpdate, attrName, attrValues = []) {
	return queries.map((query, i) => {
		return registerQuery(query, onAlways, onUpdate, attrName, attrValues[i], i)
	})
}

function registerQuery(query, onAlways, onUpdate, attrName, attrValue = '', i = -1) {
	var mql = window.matchMedia(query)
	var listener = () => {
		onAlways(mql, i)
		onUpdate(mql, i)
	}
	var killback = () => mql.removeListener(listener)
	mql.addListener(listener)
	mql.attrName = attrName
	mql.attrVal = attrValue
	onAlways(mql, i)
	return killback
}


var documentReady = false
var htmlNode
ganymede.ready.then(() => {
	documentReady = true
	htmlNode = document.body.parentElement
	htmlNode.setAttribute('screensize', platform.screensize)
	if (platform.portrait)
		htmlNode.setAttribute('portrait', '')
	if (platform.landscape)
		htmlNode.setAttribute('landscape', '')
})
function applyQuery(mql, i) {
	// assigns true or false and given attribute value if mql matches
	if (mql.matches) {
		if (mql.attrVal)
			platform[mql.attrName] = mql.attrVal
		else
			platform[mql.attrName] = mql.matches
		if (documentReady)
			htmlNode.setAttribute(mql.attrName, mql.attrVal)
	} else if (!mql.attrVal) {
		platform[mql.attrName] = mql.matches
		if (documentReady)
			htmlNode.removeAttribute(mql.attrName)
	}
}


var debounceMap = new Map
// warning: very naive implementation for single event type.
//          add some memory to store events in (and prevent duplicates) if used broadly
function debounceEmit(target, eventName) {
	var debounceTimeout = debounceMap.get(eventName)
	clearTimeout(debounceTimeout)
	debounceTimeout = setTimeout(() => {
		emit(target, eventName)
		//console.log('emit', eventName)
	}, 50)
	//console.log('debounceEmit set', eventName, debounceTimeout)
	debounceMap.set(eventName, debounceTimeout)
}

function emitUpdateScreensize() {
	//console.log('emitUpdateScreensize')
	debounceEmit(document, 'screensize-update')
	debounceEmit(document, 'formfactor-update')
}
function emitUpdateOrientation() {
	//console.log('emitUpdateOrientation')
	debounceEmit(document, 'orientation-update')
	debounceEmit(document, 'formfactor-update')
}

function setupLocalBreakpointQueries(element, onAlways, onUpdate, attrName, attrValues) {
	var computed = getComputedStyle(element)
	var sm = computed.getPropertyValue('--breakpoint-s-m')
	var ml = computed.getPropertyValue('--breakpoint-m-l')
	var breakpoints = [sm, ml]
	var queries = makeBreakpointQueries(breakpoints)
	return registerQueries(queries, onAlways, onUpdate, attrName, attrValues)
}


// setup core screensize queries
setupLocalBreakpointQueries(document.documentElement, applyQuery, emitUpdateScreensize, 'screensize', screensizes)
//setupLocalBreakpointQueries(document.body, applyQuery, emitUpdateScreensize, 'screensize', screensizes)
// setup additional orientation queries
registerQuery('(orientation: portrait)', applyQuery, emitUpdateOrientation, 'portrait')
registerQuery('(orientation: landscape)', applyQuery, emitUpdateOrientation, 'landscape')
// inform other code relying on formfactor about the update

ganymede.ready.then(() => {
	emit(document, 'formfactor-update')
})



export let Breakpointable = SuperClass => class extends SuperClass {

	@reflect breakpointState = Number

	constructor() {
		super()
		//console.log('constructor', this)
		var applyQuery = (mql, i) => {
			if (!mql.matches) return
			//console.log('breakpoint', screensizes[i])
			this.breakpointState = screensizes[i]
		}
		var emitUpdate = (mql, i) => {
			if (!mql.matches) return
			this.emit('breakpoint', screensizes[i])
		}
		var killbacks = setupLocalBreakpointQueries(this, applyQuery, emitUpdate)
		killbacks.forEach(this.registerKillback)
	}

}

Breakpointable.SMALL  = Breakpointable.S = SMALL
Breakpointable.MEDIUM = Breakpointable.M = MEDIUM
Breakpointable.LARGE  = Breakpointable.L = LARGE

/*
	// number of max reached states
	statesCount = 1
	@reflect breakpoint = ''

	constructor() {
		super()
		if (this.breakpoint)
			this._setupBreapointQueries()
		else
			this._processBreapointQueries(getCssBreakpoints(this))
	}

	//@observe('breakpoint')
	_setupBreapointQueries() {
		if (!this.breakpoint) return
		var breakpoints = String(this.breakpoint).match(/\d+/g)
		if (!breakpoints) return
		this._processBreapointQueries(breakpoints)
	}
	_processBreapointQueries(breakpoints) {
		console.log(breakpoints)
		console.log(makeBreakpointQueries(breakpoints))
		var handleQuery = (mql, i) => {
			if (!mql.matches) return
			this.breakpointState = i
			this.emit('breakpoint', i)
		}
		var queries = makeBreakpointQueries(breakpoints)
		this.statesCount = queries.length
		queries
			.map(query => window.matchMedia(query))
			.forEach((mql, i) => {
				if (mql.matches)
					this.breakpointState = i
				var listener = mql => handleQuery(mql, i)
				mql.addListener(listener)
				this.registerKillback(() => mql.removeListener(listener))
			})
	}
*/