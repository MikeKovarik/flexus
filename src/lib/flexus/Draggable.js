import {on, once, reflect, observe, autobind} from 'ganymede'
import {clamp} from './utils.js'
import {platform} from './platform.js'


const TOP    = -1
const RIGHT  = 1
const BOTTOM = 1
const LEFT   = -1
const NO_DIR = 0

export let Draggable = SuperClass => class extends SuperClass {

	static TOP    = TOP
	static RIGHT  = RIGHT
	static BOTTOM = BOTTOM
	static LEFT   = LEFT
	static NO_DIR = NO_DIR


	// TODO: make the attribute screensize aware
	// PROBLEM: ideally here we'd extend Draggable's [draggable] property which is reflected to element
	// but here there are two tings clashing. 1) in this element we want draggability enabled only on touch
	// and 2) we want to give user ability to further limit when draggability is enabled/disabled.
	// for example <flexus-pages> is draggable only on small devices and not not large monitor where the pages
	// are displayed both alongside each other, effectively disabling functionality of <flexus-pages>
	// TODO: ideally we need to introduce multiple layers of conditions.
	// 1) Element's core - not overridable by user, e.g. <flexus-pages> can only be dragged on touch screens
	// 2) Element's default - overridable by user, e.g. <flexus-page draggable="s">
	// 3) External temporary override - App itself can enable/disable some properties ([draggable] and with it
	//    the whole Draggable mixin) or whole element (<flexus-page> and all of its actions)
	//    at any time for any period of time. Overruling everything, no matter the screensize or any builtin query.
	//@reflect draggable = 'touch'
	// For now we're adding another internal property.
	dragPointerType = undefined

	@reflect draggable = true
	@reflect dragOrientation = String

	// threshold
	dragThresholdDisable = false
	dragThreshold = 0.15
	// current position percentage
	dragPercentage = 0
	// direction from center (from percentage 1) in the drag is available
	dragDirMod = NO_DIR

	setupDraggableDirection() {
		this.dragUp		= this.dragUp	 || this.top    || this.hasAttribute('top')
		this.dragRight	= this.dragRight || this.right  || this.hasAttribute('right')
		this.dragDown	= this.dragDown	 || this.bottom || this.hasAttribute('bottom')
		this.dragLeft	= this.dragLeft	 || this.left   || this.hasAttribute('left')
		if (this.dragUp)	this.dragDirMod = TOP
		if (this.dragRight)	this.dragDirMod = RIGHT
		if (this.dragDown)	this.dragDirMod = BOTTOM
		if (this.dragLeft)	this.dragDirMod = LEFT
		if (!this.dragOrientation) {
			if (this.dragRight || this.dragLeft)
				this.dragOrientation = 'horizontal'
			else if (this.dragUp || this.dragDown)
				this.dragOrientation = 'vertical'
		}
	}

	//@once('beforeready')
	@once('ready')
	setupDraggable() {
		this.setupDraggableDirection()
		if (!this.dragOrientation) return
		this.setupDraggableHandlers()
		if (!this.dragThresholdDisable)
			this.setupDraggableThreshold()
		//this.setupWheel()
		this.dragRender()
	}

	setupDraggableThreshold() {
		this.on('drag-start', e => {
			if (this.dragPercentage === 0)
				this.dragThresholdTarget = this.dragThreshold
			else
				this.dragThresholdTarget = this.dragPercentage - this.dragThreshold
		})
		this.on('drag-end', e => {
			if (!this.dragMoved) return
			if (this.dragPercentage > this.dragThresholdTarget)
				this.emit('show')
			else
				this.emit('hide')
		})
	}


	///////////////////////////////////////////////////////////////////////////
	///////////////////////////// EVENT LISTENERS /////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	setupDraggableHandlers() {
		this.addEventListener('pointerdown', this._onPointerDown)
		this.disableDraggableHandlers = () => this.removeEventListener('pointerdown', this._onPointerDown)
		this.registerKillback(this.disableDraggableHandlers)
	}

	// Noop that gets overwritten with setupDraggableHandlers()
	// TODO: This (method, not refference) should get called anytime this.draggable is set to false
	disableDraggableHandlers() {}

	@autobind _onPointerDown(e) {
		// only continue if can drag
		if (!this.draggable) return
		if (this.dragPointerType && e.pointerType !== this.dragPointerType) return
		// default event handling and attaching following listeners
		e.stopPropagation()
		this.dragSkipFirstMoveBeforeCancel = true
		document.addEventListener('pointercancel', this._onPointerUp)
		document.addEventListener('pointermove', this._onPointerMove)
		document.addEventListener('pointerup', this._onPointerUp)
		this.onDragStart(e)
	}
	@autobind _onPointerMove(e) {
		// default event handling
		e.stopPropagation()
		if (this.dragSkipFirstMoveBeforeCancel)
			return this.dragSkipFirstMoveBeforeCancel = false
		this.onDragMove(e)
	}
	@autobind _onPointerUp(e) {
		// default event handling
		e.stopPropagation()
		document.removeEventListener('pointercancel', this._onPointerUp)
		document.removeEventListener('pointermove', this._onPointerMove)
		document.removeEventListener('pointerup', this._onPointerUp)
		this.onDragEnd(e)
	}


	///////////////////////////////////////////////////////////////////////////
	///////////////////////// MUNIPULATION & RENDERING ////////////////////////
	///////////////////////////////////////////////////////////////////////////


	getDragDistance() {
		if (this.dragOrientation === 'horizontal')
			return this.offsetWidth
		else if (this.dragOrientation === 'vertical')
			return this.offsetHeight
	}
	getDragPosition(e) {
		if (this.dragOrientation === 'horizontal')
			return e.x
		else if (this.dragOrientation === 'vertical')
			return e.y
	}

	onDragStart(e) {
		// individual code
		this.totalDistance = this.getDragDistance()
		// horizontal code
		this.initDragPosition = this.getDragPosition(e)
		// shared code
		this.dragMoved = false
		this.dragInitPercentage = this.dragPercentage
		// show [dragging] attribute for elements to suppres transitions, etc...
		this.setAttribute('dragging', '')
		this.emit('drag-start')
	}
	onDragMove(e) {
		//e.preventDefault()
		// only continue if can drag
		//if (!this.dragOrientation) return
		var dragged = this.getDragPosition(e) - this.initDragPosition
		// move events gets fired even though move didnt happen
		if (dragged !== 0)
			this.dragMoved = true
		//var percentage = this.dragInitPercentage - (dragged / this.totalDistance)
		var percentage = this.dragInitPercentage - ((dragged / this.totalDistance) * this.dragDirMod)
		this.dragPercentage = clamp(percentage, 0, 1)
		//this.dragPercentage = clamp(percentage, this.dragClampMin, this.dragClampMax)
		this.dragRender(this.dragPercentage)
		this.emit('drag', this.dragPercentage)
	}
	onDragEnd(e) {
		// only continue if can drag
		//if (!this.dragOrientation) return
		// remove [dragging] attribute for elements to reenable transitions, etc...
		this.removeAttribute('dragging')
		this.emit('drag-end')
	}

	//@on('drag')
	dragRender(percentage = this.dragPercentage) {
		var value = (1 - percentage) * this.dragDirMod * 100
		//console.log('dragRender', value, percentage, this.dragPercentage, this.hidden, this.visible, this)
		this._dragRender(value)
	}
	_dragRender(value) {
		if (this.dragOrientation === 'horizontal')
			this._dragRenderHorizontal(value)
		else
			this._dragRenderVertical(value)
	}
	_dragRenderHorizontal(value) {
		this.style.transform = `translate3d(${value}%, 0px, 0)`
	}
	_dragRenderVertical(value) {
		this.style.transform = `translate3d(0px, ${value}%, 0)`
	}


}

// probably temporary function, to be deleted
function isDescendant(parent, child) {
	var node = child.parentNode
	while (node !== null) {
		if (node === parent)
			return true
		node = node.parentNode
	}
	return false
}


