//import * as ganymede from 'ganymede'
import ganymede, {$$, $, emit} from 'ganymede'
export {$$, $, ready} from 'ganymede'
// NOTE: Can't use 'export * from ganymede' because rollup is unable to resolve dependencies

import './theme'
import './battery'

export * from './appElement'
export * from './app'
export * from './platform'
export * from './animation'
export * from './utils'
export * from './iridescent'
export * from './loader'
export * from './resizeDetector'
export * from './raf'

export * from './breakpoints'
export * from './Draggable'
export * from './Panel'
export * from './Scrollable'
export * from './LinearSelectable'
export * from './Visibility'

//import {RenderManager} from './raf.js'
//export var render = new RenderManager


// ----------------------------------------------------------------------------------------------------------------------
// --------------------------------------------- CORE -------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

/*
function getFlexusPath() {
	// get attribute instead of property which would contain the whole origin with http://
	var scriptPath = document.currentScript.getAttribute('src')
	console.log('scriptPath', scriptPath)
	if (scriptPath.includes('/')) {
		var split = scriptPath.split('/')
		split.pop()
		return split.join('/') + '/'
	} else {
		return ''
	}
}

export var flexusRootPath = getFlexusPath()
export var libPath = flexusRootPath + 'lib/'
export var elementsPath = flexusRootPath + 'elements/'
export var cssPath = flexusRootPath + 'css/'
*/


import {platform} from './platform.js'


function createMissingTag(tagName, idName, idValue, contentName, contentValue, override = false) {
	var node = document.head.querySelector(`${tagName}[${idName}="${idValue}"]`)
	if (node && !override) return
	if (!node) {
		node = document.createElement(tagName)
		node[idName] = idValue
		document.head.appendChild(node)
	}
	node[contentName] = contentValue
}

function createMissingMeta(idName, contentName, override) {
	createMissingTag('meta', 'name', idName, 'content', contentName, override)
}
function createMissingLink(idName, contentName, override) {
	createMissingTag('link', 'rel', idName, 'href', contentName, override)
}
/*
function createMissingMeta(name, content, override = false) {
	var meta = document.head.querySelector(`meta[name="${name}"]`)
	if (meta && !override) return
	if (!meta) {
		meta = document.createElement('meta')
		meta.name = name
		document.head.appendChild(meta)
	}
	meta.content = content
}
*/
// progressive web app
export var pwa = !platform.app
export var title = 'Flexus Test App'
export var description = 'Flexus description'

//createMissingMeta('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
createMissingMeta('viewport', 'width=device-width, user-scalable=no')

// give user time to opt out from setting up web app meta tags
setTimeout(() => {
	if (!pwa) return
	// NOTE: these do not override existing meta tags
	createMissingMeta('mobile-web-app-capable', 'yes')
	createMissingMeta('apple-mobile-web-app-capable', 'yes')
	//<meta name="apple-mobile-web-app-status-bar-style" content="black">
	//<meta name="msapplication-TileColor" content="#2196F3">//

	createMissingMeta('application-name', title)
	createMissingMeta('apple-mobile-web-app-title', title)
	createMissingMeta('description', description)
	// TODO title
	createMissingLink('manifest', 'manifest.json')
}, 200)

