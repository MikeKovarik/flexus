// author: Michal Kovařík
// description: polyfill adding missing suppot for ':scope' selector and
//              prototype methods for Element


// polyfill missing :scope selector
/*
try {
	document.querySelector(':scope')
} catch(e) {
	console.warn('applied very naive polyfill of querySelector(:scope)')
	console.log('applied very naive polyfill of querySelector(:scope)')
	Element.prototype._querySelector = Element.prototype.querySelector
	Element.prototype._querySelectorAll = Element.prototype.querySelectorAll
	Element.prototype.querySelector = function(selector) {
		if (!selector.includes(':scope >'))
			return this._querySelector(selector)
		selector = selector.replace(/:scope >/g, '')
		var found = this._querySelectorAll(selector)
		if (found) {
			found = Array.from(found)
			found = found.find(node => node.parentElement === this)
		}
		return found
	}
	Element.prototype.querySelectorAll = function(selector) {
		if (!selector.includes(':scope >'))
			return this._querySelectorAll(selector)
		selector = selector.replace(/:scope >/g, '')
		var found = this._querySelectorAll(selector)
		if (found) {
			found = Array.from(found)
			found = found.filter(node => node.parentElement === this)
		}
		return found
	}
}
*/


// polyfill ChildNodes methods

var elProto = Element.prototype

function prepareNodeFragment(nodes) {
	var frag = document.createDocumentFragment()
	var node
	while (node = nodes.shift()) {
		if (typeof node === 'string')
			node = document.createTextNode(node)
		frag.appendChild(node)
	}
	return frag
}

if (elProto.prepend === undefined) {
	elProto.prepend = function(...args) {
		var newNodes = prepareNodeFragment(args)
		this.insertBefore(newNodes, this.firstChild)
	}
}
if (elProto.append === undefined) {
	elProto.append = function(...args) {
		var newNodes = prepareNodeFragment(args)
		this.appendChild(newNodes)
	}
}
if (elProto.before === undefined) {
	elProto.before = function(...args) {
		var newNodes = prepareNodeFragment(args)
		this.parentNode.insertBefore(newNodes, this)
	}
}
if (elProto.after === undefined) {
	elProto.after = function(...args) {
		if (this.nextSibling === null) {
			this.parentNode.append(...args)
		} else {
			var newNodes = prepareNodeFragment(args)
			this.parentNode.insertBefore(newNodes, this.nextSibling)
		}
	}
}
if (elProto.replaceWith === undefined) {
	elProto.replaceWith = function(...args) {
		var newNodes = prepareNodeFragment(args)
		this.parentNode.replaceChild(newNodes, this)
	}
}
if (elProto.remove === undefined) {
	elProto.remove = function() {
		this.parentNode.removeChild(this)
	}
}
