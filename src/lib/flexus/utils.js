import {scheduleEvent} from 'ganymede'
import {emit} from 'ganymede'

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

// like traverse() but returns result of condition check if it's not undefined or null
// e.g. find node with attribute and returns the value of the attribute. 
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
export function debounceEmit(target, eventName, millis = 50) {
	var debounceTimeout = debounceMap.get(eventName)
	clearTimeout(debounceTimeout)
	debounceTimeout = setTimeout(() => emit(target, eventName), millis)
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