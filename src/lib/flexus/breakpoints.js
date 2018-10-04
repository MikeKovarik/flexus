import ganymede from 'ganymede'
import {reflect, emit} from 'ganymede'
import {platform} from './platform'
import {debounceEmit} from './utils'


// TODO: deprecate formfactor-update event

const SMALL  = 's'
const MEDIUM = 'm'
const LARGE  = 'l'

export const SCREENSIZE = {SMALL, MEDIUM, LARGE}

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

function applyQuery(mql, i) {
	// assigns true or false and given attribute value if mql matches
	var newValue = mql.attrVal
	var {attrName} = mql
	if (mql.matches) {
		platform[attrName] = newValue !== undefined && newValue !== null ? newValue : mql.matches
		if (isDocumentReady) document.documentElement.setAttribute(attrName, newValue)
	} else if (!newValue) {
		platform[attrName] = mql.matches
		if (isDocumentReady) document.documentElement.removeAttribute(attrName)
	}
}


// setup core screensize queries
var screensizes = ['s', 'm', 'l']
var computedStyle = getComputedStyle(document.documentElement)
var breakpointBetweenSmallAndMedium = computedStyle.getPropertyValue('--breakpoint-s-m')
var breakpointBetweenMediumAndLarge = computedStyle.getPropertyValue('--breakpoint-m-l')
var breakpoints = [breakpointBetweenSmallAndMedium, breakpointBetweenMediumAndLarge]
// returns three css queries (small, medium, large) covering screensize between the two breakpoints
var queries = makeBreakpointQueries(breakpoints)
var noop = () => {}
registerQuery(queries[0], applyQuery, emitScreensize, 'screensize', 's', 0)
registerQuery(queries[1], applyQuery, emitScreensize, 'screensize', 'm', 1)
registerQuery(queries[2], applyQuery, emitScreensize, 'screensize', 'l', 2)

var lastScreensize = platform.screensize
function emitScreensize() {
	// Skip if only the first of two queries fired. If so, the first was triggered beause it's changing from matchin
	// to false. And the new querie that just becomes matching has not yet called this function.
	if (lastScreensize === platform.screensize) return
	lastScreensize = platform.screensize
	emit(document, 'screensize-update')
	emit(document, 'formfactor-update')
}


// setup additional orientation queries
registerQuery('(orientation: portrait)',  applyQuery, emitUpdateOrientation, 'portrait')
registerQuery('(orientation: landscape)', applyQuery, emitUpdateOrientation, 'landscape')

var lastOrientation = platform.orientation
function emitUpdateOrientation() {
	if (lastOrientation === platform.orientation) return
	lastOrientation = platform.orientation
	emit(document, 'orientation-update')
	emit(document, 'formfactor-update')
}



var isDocumentReady = false

ganymede.ready.then(() => {
	isDocumentReady = true
	document.documentElement.setAttribute('screensize', platform.screensize)
	if (platform.portrait)  document.documentElement.setAttribute('portrait', '')
	if (platform.landscape) document.documentElement.setAttribute('landscape', '')
})


/*
export let Breakpointable = SuperClass => class extends SuperClass {

	@reflect breakpointState = Number

	constructor() {
		// TODO: implement api for inserting custom breakpoints to trigger on
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

Breakpointable.S = Breakpointable.SMALL  = SMALL
Breakpointable.M = Breakpointable.MEDIUM = MEDIUM
Breakpointable.L = Breakpointable.LARGE  = LARGE
*/
