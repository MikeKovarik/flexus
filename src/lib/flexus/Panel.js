import {on, once, reflect, observe, autobind, defaultValue} from 'ganymede'
import {clamp} from './utils.js'
import {platform} from './platform.js'
import {SCREENSIZE} from './breakpoints.js'



var overlayMaxOpacity = 0.7

// Panel requires to be used together with Visibility class
export let Panel = SuperClass => class extends SuperClass {
	
	@defaultValue(true)
	@reflect dragEdge

	@defaultValue(platform.material)
	@reflect overlayFade

//	@reflect overlayFade = true

	// todo rename to hasOverlay
	@defaultValue(true)
	@reflect overlayBg

	// docked
	@reflect pinnable = false
	@reflect pinned = false
	//@reflect pinned = Boolean
	// automaticaly show on larger screen, if the panel if its pinnable
	// false = panel does not show up automatically on larger screens, even if its pinnable
	// true  = panel becomes visible on larger screens if pinnable
	@reflect autoShow = Boolean
	// automaticaly hide after resizing down,
	// false = pinned panel becomes overlay on smaller screen and does not hide
	// true  = pinned panel becomes hidden on smaller screen
	@reflect autoHide = Boolean

	//@reflect dismissable = false
	@reflect panel = true
	hasOverlayBg = false
	@reflect overlayBg = Boolean

	@reflect top = Boolean
	@reflect right = Boolean
	@reflect bottom = Boolean
	@reflect left = Boolean

	zIndex = 200

	// [visible] = panel is in shown in overlay mode
	// [visible][pinned] = panel is in shown in pinned mode

	constructor() {
		super()
		// set soft default value
		if (this.overlayBg === undefined)
			this.overlayBg = true
		// store the default value for future state changes
		// note: this is only used by inheritors, since by the time constructor is called
		//       no attribute values were read and assigned yet
		this.__overlayBgDefault = this.overlayBg
	}

	//@once('ready')
	@once('beforeready')
	setupPanel() {
		//console.log('setupPanel --------------------------------------')
		//console.log(this)
		//console.log('this.hidden', this.hidden)
		//console.log('this.visible', this.visible)
		//console.log('this.pinned', this.pinned)
		//console.log('this.pinnable', this.pinnable)
		//console.log('---')
		if (!this.panel) return

		this.autoAssignPosition()

		var isForciblyVisible = this.visible === true
		var isForciblyHidden  = this.hidden === true

		if (this.autoShow === undefined)
			if (this.hidden)
				this.autoShow = false
			else
				this.autoShow = true
		if (this.autoHide === undefined)
			if (this.hidden)
				this.autoHide = true
			else
				this.autoHide = false

		if (this.hidden === undefined && this.visible === undefined)
			this.hidden = true
		else if (this.visible === true)
			this.hidden = false
		else if (this.hidden === true)
			this.visible = false
		else if (this.visible === false)
			this.hidden = true
		else if (this.hidden === false)
			this.visible = true
		// ensure visible/hidden are correctly loaded
		//this.configureVisibilityAttributes()
		// if [pinned] was manually enabled, store info about it as pinnable
		if (this.pinned)
			this.pinnable = true
		// if this panel can become pinned, only pin it if the screensize is right
		if (this.pinnable && this.autoShow && (isForciblyVisible || !isForciblyHidden))
		//if (this.pinnable && this.autoShow && this.hidden !== true)
			this.pinned = platform.screensize === 'l'
		else if (this.pinned === undefined)
			this.pinned = false
		// and if not, hide it (not to show big overlay)
		if (this.pinned)
			this.hidden = false
		//console.log('this.hidden', this.hidden)
		//console.log('this.visible', this.visible)
		//console.log('this.pinned', this.pinned)
		//console.log('this.pinnable', this.pinnable)
		//console.log('side', this.top, this.right, this.bottom, this.left)
		//if (this.hasOverlayBg)
		this.setupDragOverlay()
		//console.log('this.dragEdge', this.dragEdge, 'this.dragOrientation', this.dragOrientation)
		//if (this.dragEdge && this.dragOrientation)
		if (this.dragEdge)
			this.setupDragEdge()
		// NOTE: not using @on, nor @autobind because of inheritance
		// and possible changes by inheritors classes
		//this.on('show', () => this.onShow())
		//this.on('hide', () => this.onHide())
		this.applyDragVisibleState()
		if (this.id)
			this.attachInvokerListeners()
		// re render pinned
		//console.log('CALLING pinnedChanged')
		this.pinnedChanged()
		//console.log('CALLING applyVisibilityState')
		this.applyVisibilityState()
	}

	autoAssignPosition() {
		if (this.top || this.right || this.bottom || this.left) return
		if (this.hasAttribute('right') || this.hasAttribute('left')) return
		var next = this.nextElementSibling
		var prev = this.previousElementSibling
		if (next === null || next.localName !== 'flexus-view') {
			this.right = true
			//this.setAttribute('right', '')
		} else if (prev === null || prev.localName !== 'flexus-view') {
			this.left = true
			this.setAttribute('left', '')
		}
	}

	attachInvokerListeners() {
		// lets wait for a good measure
		setTimeout(() => this._attachInvokerListeners())
	}
	_attachInvokerListeners() {
		var nodes = Array.from(document.querySelectorAll(`[for="${this.id}"]`))
		nodes.forEach(node => {
			//console.log('node', node)
			// note: autobound #show(), #hide(), #toggle() are all inherited from Visibility class
			this.on(node, 'click', this.toggle)
		})
	}


	@on(document, 'screensize-update', self => self.panel)
	onResize() {
		if (platform.screensize === SCREENSIZE.LARGE) {
			//console.log('onResize LARGE')
			//console.log('this.pinned', this.pinned, '->', this.pinnable)
			this.pinned = this.pinnable
		} else {
			//console.log('onResize OTHER')
			//console.log('this.pinned', this.pinned, '->', false)
			this.pinned = false
		}
	}


	@on('show')
	onShowPanel(percentage) {
		//console.log('### onShowPanel')
		//if (!this.hidden) return
		this.dragPercentage = 1
		if (this.draggable)
			this.dragRender()
		// make overlay clickable
		if (this.overlayBg && this.overlayElement)
			this.overlayElement.show()
		// assign universal api [hidden] attribute
		// (css to be handled by inheritor)
		//this.removeAttribute('hidden')
		this.hidden = false
		this.applyDragVisibleState()
	}

	@on('hide')
	onHidePanel(percentage) {
		//console.log('### onHidePanel')
		//if (this.pinned) return
		//if (this.hidden) return
		this.dragPercentage = 0
		if (this.draggable)
			this.dragRender()
		// make overlay click through again
		if (this.overlayBg && this.overlayElement)
			this.overlayElement.hide()
		// assign universal api [hidden] attribute
		// (css to be handled by inheritor)
		//this.setAttribute('hidden', '')
		this.hidden = true
		this.applyDragHiddenState()
	}

	pin() {
		this.pinned = true
	}
	unpin() {
		this.pinned = false
	}

	// dock
	onPinPanel() {
		//console.log('### onPinPanel')
		//if (this.pinned) return
		this.overlayBg = false
		if (this.overlayElement)
			this.overlayElement.hide()
		if (this.autoShow) {
			//this.dragPercentage = 1
			//this.dragRender()
			//this.hidden = false
			this.show()
			this.dragRender()
		}
		this.draggable = false
		//this.dismissable = true
	}

	// undock
	onUnpinPanel() {
		//console.log('### onUnpinPanel')
		//if (!this.pinned) return
		this.overlayBg = this.__overlayBgDefault
		this.draggable = true
		if (this.overlayElement && this.overlayBg)
			this.overlayElement.show()
		if (this.autoHide) {
			//this.dragPercentage = 0
			//this.dragRender()
			this.hide()
		}
		//this.dismissable = false
	}

	// TODO: bug in ganymede does not automatically assign 'pinnedChanged' as observer.
	// Something must be wrong with the 'Changed' observer detection
	@observe('pinned')
	pinnedChanged() {
		if (this.pinned)
			this.onPinPanel()
		else
			this.onUnpinPanel()
	}

	hiddenChanged(hidden) {
		if (hidden === false && this.dragPercentage !== 1)
			this.show()
		else if (hidden === true && this.dragPercentage !== 0)
			this.hide()
	}

	applyVisibilityState() {
		if (this.hidden === true)
			this.hide()
		else if (this.hidden === false)
			this.show()
	}
	forceVisibilityState() {
		if (this.hidden === true) {
			this.hide()
			this.onHidePanel()
		} else if (this.hidden === false) {
			this.show()
			this.onShowPanel()
		}
	}



	// dragLeft is fixed, meaning the panel is on left side,
	// meaning it can be dragged (from active state) to left to close it
	// canDragLeft is state based and is true if the panel is openned
	// and then becomes false whereas canDragRight becomes true when closed
	applyDragVisibleState() {
		this.canDragUp = this.dragUp
		this.canDragRight = this.dragRight
		this.canDragDown = this.dragDown
		this.canDragLeft = this.dragLeft
	}
	applyDragHiddenState() {
		// pannel is hidden, set drag direction in which it can be dragged out
		// from over the edge
		this.canDragUp = false
		this.canDragRight = false
		this.canDragDown = false
		this.canDragLeft = false
		if (this.dragDown)	this.canDragUp = true
		if (this.dragLeft)	this.canDragRight = true
		if (this.dragUp)	this.canDragDown = true
		if (this.dragRight)	this.canDragLeft = true
	}

	setupDragOverlay() {
		//console.log('setupDragOverlay')
		this.overlayElement = createOverlay(this, this.overlayFade)
		//this.on(this.overlayElement, 'click', () => this.hide())
		this.on(this.overlayElement, 'click', () => this.onOverlayClick())
		this.on('drag-start', () => {
			if (!this.overlayBg) return
			this.overlayElement.dragstart()
			if (!this.overlayFade) return
			this.on('drag', this.overlayElement.drag)
		})
		this.on('drag-end', () => {
			if (!this.overlayBg) return
			this.overlayElement.dragend()
			if (!this.overlayFade) return
			this.off('drag', this.overlayElement.drag)
		})
	}

	// this is a separate function to be overriden by inheritors
	onOverlayClick() {
		this.hide()
	}

	setupDragEdge() {
		this.edgeElement = document.createElement('div')
		this.edgeElement.setAttribute('edge', '')
		this.appendChild(this.edgeElement)
		//console.log('setupDragEdge', this.edgeElement)
	}


	// todo, add event listener to pressing escape key to close view
	//@reflect closeByEscape = false
	setupEscClose() {
		if (!this.dismissable) return
		// TODO
	}

}

function createOverlay(overlayForElement, overlayFade) {
	var overlay = document.createElement('div')
	if (platform.neon)
		overlay.style.opacity = '0 !important'
	//console.warn('remove me')
	overlay.className = 'fx-overlay'
	overlay.setAttribute('hidden', '')
	if (overlayFade)
		overlay.setAttribute('fade', '')
	if (overlayForElement) {
		/*var zIndex = overlayForElement.zIndex
				|| overlayForElement.style.zIndex
				|| parseInt(getComputedStyle(overlayForElement).zIndex)
				|| 500*/
		var zIndex =  parseInt(getComputedStyle(overlayForElement).zIndex)
		overlay.style.zIndex = zIndex
		overlayForElement.before(overlay)
	}
	overlay.show = function(val) {
		overlay.style.opacity = ''
		overlay.removeAttribute('hidden')
	}
	overlay.hide = function(val) {
		overlay.style.opacity = ''
		overlay.setAttribute('hidden', '')
	}
	overlay.drag = percentage => {
		//console.log('drag', percentage)
		overlay.style.opacity = percentage * overlayMaxOpacity
	}
	overlay.dragstart = () => {
		//overlay.style.zIndex = this.zIndex - 1
		overlay.style.transition = 'none'
	}
	overlay.dragend = () => {
		overlay.style.transition = ''
	}
	return overlay
}
