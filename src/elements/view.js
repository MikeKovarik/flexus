import {template, css, reflect, on, customElement, ganymedeElement, autobind, defaultValue} from 'ganymede'
import {platform, Visibility, Draggable, Panel, Scrollable} from 'flexus'
import {getParallaxApplicator, addReadyAnimation} from 'flexus'

// TODO: change Panel & [panel] to [modal]

addReadyAnimation('flexus-view')

@customElement
class FlexusView extends ganymedeElement(Visibility, Draggable, Panel, Scrollable) {
//class FlexusPanel extends mixin(Panel, Draggable) {

	@reflect draggable = false

	@reflect panel = false

	// side panels should be allowed to have sneakpeek in some cases
	// and we partially visible (like pinned drawer)
	// but not by default
	// and three state breakpoint

	// simple dragup have no states - they're alaways pinned to bottom
	// unless they are rearanged to be side by side

	// some sidepanes remain side panes no matter what (image/song details)
	// some sidepanes stick

	//constructor() {
	//	super()
	ready() {
		//console.log('------ View ready Visibility ------')
		//console.log(this)
		//console.log('this.hidden', this.hidden)
		//console.log('this.visible', this.visible)
		// pannels are hidden by default, all other views must be visible
		if (!this.panel && this.hidden !== true) {
			this.hidden = false
		} else if (this.panel && this.hidden) {
			// cancel out the default transition during setup period.
			this.style.transition = 'none'
			setTimeout(() => this.style.transition = '', 400)
		}

		window.view = this
		this.setupCloseButtons()
		this.configureLayout()

		this.main = this.querySelector('main')
		if (this.main) {
			this.scrollReflectsTouchAction = true
			this.setupScrollable(this.main)
			var parallaxNodes = Array.from(this.main.querySelectorAll('[parallax]'))
			var parallaxApplicators = parallaxNodes.map(getParallaxApplicator)
			if (parallaxApplicators.length) {
				this.addScrollListeners(scrolled => {
					parallaxApplicators.forEach(cb => cb(scrolled))
				})
			}
		}

		// inherited from Panel
		this.applyVisibilityState()
	}


	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	// TODO
	@reflect dragClose = false
	// draggable view can be dragged down to close by default
	// (unless draggable is temporarily disabled)
	@defaultValue(true)
	canDragDown = false
	// draggable view can be dragged down to close by default
	// (unless draggable is temporarily disabled)
	@defaultValue(false)
	canDragUp = false


	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// LAYOUT /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	// NOTE: View inherits from Panel, but not all Views are automatically Panel
	@reflect panel = false

	configureLayout() {

		// disabled due to MS Edge
		//this.sneakpeek = this.querySelector(':scope > [sneakpeek]')
		this.sneakpeek = Array.from(this.children).find(node => node.hasAttribute('sneakpeek'))

		//if (this.sneakpeek)
		//	this.on(this.sneakpeek, 'click', e => this.emit('show'))

		//if (this.hasAttribute('panel') || this.hasAttribute('side') || this.hasAttribute('sidepane')) {
		if (this.panel) {
			this.autoAssignPosition()
		} else {
			this.overlayBg = false
			this.showOverlayBg = false
		}
	}

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////// HIDE / SHOW ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	setupCloseButtons() {
		// lets wait for a good measure
		setTimeout(() => this._setupCloseButtons())
	}
	_setupCloseButtons() {
		var iconNames = ['arrow-back', 'arrow-left', 'close', 'x']
		// TODO: use :scope when Edge supports it
		// NOTE: Edge doesn't support :scope yet so this selector is a lot more open than I'd like to
		var selectors = iconNames.map(icon => `flexus-toolbar [icon="${icon}"]`)
		//var selectors = iconNames.map(icon => `:scope > flexus-toolbar [icon="${icon}"]`)
		selectors.push('[close]')
		var selector = selectors.join(', ')
		Array.from(this.querySelectorAll(selector))
			.filter(node => !node.hasAttribute('prevent-close'))
			.forEach(node => this.on(node, 'click', this.onCloseButtonClick))
	}

	@autobind onCloseButtonClick(val, {target}) {
		var isSearchOrSelection = target.parentElement.hasAttribute('search') || target.parentElement.hasAttribute('selection')
		if (isSearchOrSelection) return
		//if (!this.dismissable) return
		this.hide()
	}

	@on('show')
	onShow() {
		//if (this.sneakpeek)
		//	this.sneakpeek.style.opacity = ''
		this.removeAttribute('offscreen')
	}

	@on('hide')
	onHide() {
		//if (this.sneakpeek)
		//	this.sneakpeek.style.opacity = ''
		this.setAttribute('offscreen', '')
	}

	@on('drag')
	onDragSneakPeekRender(percentage) {
		if (this.sneakpeek)
			this.sneakpeek.style.opacity = 1 - percentage
	}

}
