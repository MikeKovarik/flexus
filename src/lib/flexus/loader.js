import {$, $$, emit, awaitPromises} from 'ganymede'
import {app} from './appElement'


var head = document.head

function loadStyle(path) {
	return new Promise((resolve, reject) => {
		var element = document.createElement('link')
		element.rel = 'stylesheet'
		element.type = 'text/css'
		element.href = path
		element.media = 'all'
		head.appendChild(element)
		element.onload = resolve
		element.onerror = reject
	})
}

function loadScript(path) {
	return new Promise((resolve, reject) => {
		var element  = document.createElement('script')
		element.src = path
		head.appendChild(element)
		element.onload = resolve
		element.onerror = reject
	})
}


function relativePath(path) {
	var split = path.split('/')
	split.pop()
	if (split.length)
		split.pop()
	else
		split.push('..')
	return (split.join('/') || '.') + '/'
}

var rootPath = relativePath(document.currentScript.getAttribute('src'))
export var path = {
	root: rootPath,
	lib: rootPath + 'lib/',
	css: rootPath + 'css/',
	elements: rootPath + 'elements/',
	polyfills: rootPath + 'polyfills/',
}

function isLoaded(partialPath) {
	return Array.from(document.scripts)
		.some(script => script.src.includes(partialPath))
}

// loading polyfills

function loadPolyfill(src) {
	var promise = loadScript(path.root + src)
	awaitPromises.push(promise)
}

// core set of custom elements polyfill
if (window.customElements === undefined) {
	if (!isLoaded('polyfills/custom-elements.min.js'))
		loadPolyfill('polyfills/custom-elements.min.js')
	if (!isLoaded('polyfills/shadydom.min.js'))
		loadPolyfill('polyfills/shadydom.min.js')
}

// Edge doesn't have :scope :scope selector 
var scopePoly = false
try {
	document.querySelector(':scope')
} catch(e) {
	scopePoly = true
}
if (scopePoly || Element.prototype.after === undefined)
	if (!isLoaded('polyfills/fx-polyfill.js'))
		loadPolyfill('polyfills/fx-polyfill.js')


// basic Element.animate() polyfill
if (Element.prototype.animate === undefined)
	loadPolyfill('polyfills/web-animations.min.js')
	//loadPolyfill('node_modules/web-animations-js/web-animations.min.js')

// extensions of Element.animate() to allow animation clip-path
if (!isLoaded('polyfills/animate-polyfill.js'))
	loadPolyfill('polyfills/animate-polyfill.js')

//console.log('loading polyfills')
Promise.all(awaitPromises).then(() => {
	//console.log('--- polyfills-loaded')
	emit(document, 'polyfills-loaded') // TODO: not firing
	emit(document, 'flexus-ready') // TODO: not firing
})



// utility function for hot-switching theme and loading styles
export function loadNeon() {
	var style = $('[href$="flexus-material.css"]')
	var icons = $('[href$="flexus-material-icons.css"]')
	Promise.all([
		loadStyle(path.css + 'flexus-neon.css'),
		loadStyle(path.css + 'flexus-neon-icons.css'),
	]).then(() => {
		platform.material = false
		platform.neon = true
		app.removeAttribute('material')
		app.setAttribute('neon', '')
		if (style) style.remove()
		if (icons) icons.remove()
	})
}
export function loadMaterial() {
	var style = $('[href$="flexus-neon.css"]')
	var icons = $('[href$="flexus-neon-icons.css"]')
	Promise.all([
		loadStyle(path.css + 'flexus-material.css'),
		loadStyle(path.css + 'flexus-material-icons.css'),
	]).then(() => {
		platform.neon = false
		platform.material = true
		app.removeAttribute('neon')
		app.setAttribute('material', '')
		if (style) style.remove()
		if (icons) icons.remove()
	})
}
export function swapDesign() {
	console.warn('TODO: flexus.swapDesign() not implemented yet')
}
export function swapTheme() {
	var darks = Array.from($$('[dark]'))
	var lights = Array.from($$('[light]'))
	darks.forEach(node => {
		node.removeAttribute('dark')
		node.setAttribute('light', '')
	})
	lights.forEach(node => {
		node.removeAttribute('light')
		node.setAttribute('dark', '')
	})
}


/*
function loadRipple() {
	var styles = Array.from(document.styleSheets)
					.map(style => style.href)
					.filter(href => href && href.includes('flexus'))
	//var design = 'material'
	var design = styles.some(path => path.includes('material')) ? 'material' : 'neon'

	if (design === 'material')
		loadScript(path.elements + 'flexus-ripple.js')

	document.addEventListener('DOMContentLoaded', function() {
		document.body.setAttribute(design, '')
	})
}
*/
