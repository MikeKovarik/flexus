import {on, once, reflect, autobind, validate, observe} from 'ganymede'



export function isNodeAvailable(node) {
	return !!node
		&& !node.disabled
		&& !isAttrBlocked(node, 'disabled')
		&& !isAttrBlocked(node, 'hidden')
}

function isAttrBlocked(node, attrName) {
	var val = node.getAttribute(attrName)
	if (val === null) return false
	if (val === '') return true
	if (platform.screensize === 's' && val.includes('small'))  return true
	if (platform.screensize === 'm' && val.includes('medium')) return true
	if (platform.screensize === 'l' && val.includes('large'))  return true
	return false
}

function selectedValidator(newIndex, self) {
	if (self.selected === newIndex)
		return newIndex
	var children = this.children
	if (self.children.length === 0)
		return 0
	if (newIndex < 0) newIndex = 0
	if (newIndex > children.length -1) newIndex = children.length -1
	var target = children[newIndex]
	if (isNodeAvailable(target)) {
		return newIndex
	} else {
		return self.selected
	}
}



export let LinearSelectable = SuperClass => class extends SuperClass {

	@on('ready')
	onReady() {
		//console.log('LinearSelectable', this.children.length, this.children)
		//console.log('selected', this.querySelector('[selected]'))
		this._selectedChanged(this.selected)
	}

	@validate(selectedValidator)
	@reflect
	selected = 0

	@observe('selected')
	_selectedChanged(newIndex, oldIndex) {
		//console.log('_selectedChanged', newIndex, oldIndex)
		if (this.activeTab)
			this.activeTab.removeAttribute('selected')
		this.activeTab = this.children[newIndex]
		if (this.activeTab)
			this.activeTab.setAttribute('selected', '')
		this.emit('selected', newIndex)
	}


	linkToOtherSelectable(target) {
		//console.log('link', this, 'to target', target)
		this.selected = target.selected
		target.on('selected', newIndex => this.selected = newIndex)
		this.on('selected', newIndex => target.selected = newIndex)
	}


	select(index) {
		this.selected = index
	}
	prev() {
		this.selected--
	}
	next() {
		this.selected++
	}


}
