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
export * from './query'

export * from './breakpoints'
export * from './Draggable'
export * from './Panel'
export * from './Scrollable'
export * from './LinearSelectable'
export * from './Visibility'

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

createMissingMeta('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')