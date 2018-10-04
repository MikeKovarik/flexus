import {on, once, reflect, observe, autobind, defaultValue} from 'ganymede'
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

	@reflect draggable = true
	//@reflect dragOrientation = 'vertical'
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

	// TODO: implement this
	// usecase: flexus-pages are only draggable on touch devices. not with mouse.
	// possible alternative approach: add option to limit draggable to touch/mouse events
	enableDraggable() {}
	disableDraggable() {}

	//@once('beforeready')
	@once('ready')
	setupDraggable() {
		console.log('setupDraggable', this.dragPercentage, this.hidden, this)
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
		this.addEventListener('pointerdown', this.onDragStart)
		this.registerKillback(() => this.removeEventListener('pointerdown', this.onDragStart))
	}

	@autobind onDragStart(e) {
		// only continue if can drag
		if (!this.draggable) return
		//if (!this.dragOrientation) return
		// default event handling and attaching following listeners
		e.stopPropagation()
		//if (e.pointerType == 'mouse')
		//	e.preventDefault()
		this.dragSkipFirstMoveBeforeCancel = true
		document.addEventListener('pointercancel', this.onDragEnd)
		document.addEventListener('pointermove', this.onDragMove)
		document.addEventListener('pointerup', this.onDragEnd)
		this.dragStartHandler(e)
	}
	@autobind onDragMove(e) {
		// default event handling
		e.stopPropagation()
		if (this.dragSkipFirstMoveBeforeCancel)
			return this.dragSkipFirstMoveBeforeCancel = false
		this.dragMoveHandler(e)
	}
	@autobind onDragEnd(e) {
		// default event handling
		e.stopPropagation()
		//e.preventDefault()
		document.removeEventListener('pointercancel', this.onDragEnd)
		document.removeEventListener('pointermove', this.onDragMove)
		document.removeEventListener('pointerup', this.onDragEnd)
		this.dragEndHandler(e)
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

	dragStartHandler(e) {
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
	dragMoveHandler(e) {
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
	dragEndHandler(e) {
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


