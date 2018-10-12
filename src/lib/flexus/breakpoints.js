import ganymede from 'ganymede'
import {reflect, emit} from 'ganymede'
import {platform} from './platform'
import {debounceEmit} from './utils'


// TODO: deprecate formfactor-update event

// TODO: move this (especially tabletmode and orientation detection) into platform-detect library

var htmlNode = document.documentElement

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

// setup core screensize queries
var computedStyle = getComputedStyle(htmlNode)
var breakpointBetweenSmallAndMedium = computedStyle.getPropertyValue('--breakpoint-s-m')
var breakpointBetweenMediumAndLarge = computedStyle.getPropertyValue('--breakpoint-m-l')
var breakpoints = [breakpointBetweenSmallAndMedium, breakpointBetweenMediumAndLarge]
// returns three css queries (small, medium, large) covering screensize between the two breakpoints
var queries = makeBreakpointQueries(breakpoints)

registerQuery(queries[0], bool => bool && setScreenSize('s'))
registerQuery(queries[1], bool => bool && setScreenSize('m'))
registerQuery(queries[2], bool => bool && setScreenSize('l'))

function setScreenSize(string) {
	platform.screensize = string
	setAttribute('screensize', platform.screensize)
	emit(document, 'screensize-update')
	emit(document, 'formfactor-update')
}

registerQuery('(pointer: coarse)', bool => {
	platform.tabletMode = bool
	setAttribute('tablet-mode', platform.tabletMode)
})

registerQuery('(orientation: portrait)', bool => {
	platform.portrait = bool
	platform.landscape = !bool
	platform.orientation = bool ? 'portrait' : 'landscape'
	setAttribute('portrait', platform.portrait)
	setAttribute('landscape', platform.landscape)
	//setAttribute('orientation', platform.orientation)
	emit(document, 'orientation-update')
	emit(document, 'formfactor-update')
})



function setAttribute(name, value) {
	if (value === false)
		htmlNode.removeAttribute(name)
	else if (value === true)
		htmlNode.setAttribute(name, '')
	else
		htmlNode.setAttribute(name, value)
}

function registerQuery(query, handler) {
	var mql = window.matchMedia(query)
	handler(mql.matches)
	var listener = () => handler(mql.matches)
	mql.addListener(listener)
	return () => mql.removeListener(listener)
}