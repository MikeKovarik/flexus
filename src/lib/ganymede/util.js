export var $ = document.querySelector.bind(document)
export var $$ = selector => Array.from(document.querySelectorAll(selector))

export function camelToKebab(string) {
	return string.split(/(?=[A-Z])/).join('-').toLowerCase()
}

export function kebabToCamel(string) {
	return string.replace(/-([a-z])/g, g => g[1].toUpperCase())
}

export function runAll(iterable) {
	iterable.forEach(fc => fc())
}