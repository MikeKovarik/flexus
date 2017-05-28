import {getMetadata} from './metadata'


//var polyfillShadowCss = window.ShadyCSS && navigator.userAgent.includes('Edge')

// creates shadow dom inside element and injects template into it
export function setupTemplate(element, meta) {
	var clonedTemplate = document.importNode(meta.template.content, true)
	element.attachShadow({mode: 'open'})
	element.shadowRoot.appendChild(clonedTemplate)
	if (window.ShadyCSS && ShadyCSS.styleElement)
		ShadyCSS.styleElement(element)
	else if (window.ShadyCSS && ShadyCSS.applyStyle)
		ShadyCSS.applyStyle(element)
}

// find all elements with id inside shadowRoot and assign them to element.$
export function createIdList(element) {
	var $ = element.$ = {}
	if (element.shadowRoot == null) return
	Array.from(element.shadowRoot.querySelectorAll('[id]'))
		.forEach(element => {
			$[element.id] = element
		})
}


// ------------------------------------- DECORATORS ------------------------------------------

// created template element out of given template string (for performance)
// and also polyfills styles for older browsers
export function solidifyTemplate(meta) {
	if (!(meta.templateString || meta.styleString)) return
	meta.template = document.createElement('template')
	meta.template.innerHTML = (meta.styleString || '') + (meta.templateString || '<slot></slot>')
	if (window.ShadyCSS)
		window.ShadyCSS.prepareTemplate(meta.template, meta.elementName)
}

// class decorator: attaches shadow dom template string to the class
export function template(templateString) {
	return Class => {
		var meta = getMetadata(Class)
		meta.templateString = templateString
	}
}

// class decorator: attaches css stylesheet to the class
export function css(urlOrStyle) {
	return Class => {
		var meta = getMetadata(Class)
		if (urlOrStyle.includes('.css')) {
			meta.styleString = `<style>@import '${urlOrStyle}';</style>`
		} else {
			meta.styleString = `<style>${urlOrStyle}</style>`
		}
	}
}