import {_, on, template, css, reflect, customElement, ganymedeElement, emit} from 'ganymede'
import {app, platform, Visibility, Draggable, Panel} from 'flexus'
import {addReadyAnimation, SCREENSIZE} from 'flexus'



app.on('click', ({target}) => {
	if (target.matches('flexus-toolbar [icon="menu"]'))
		app.emit('drawer-toggle')
	if (target.matches('flexus-drawer [icon="menu"]'))
		app.emit('drawer-toggle')
})

var overlayMaxOpacity = 0.7

/*
POSSIBILITIES

3 states (music)
	- phone, not pinned, expandable, overlay
	- pinned, expandable, overlay
	- pinned expanded sqeeze

1 state (weather)
	- pinned, expandable, overlay

2 states ()
	- phone, not pinned, expandable, overlay
	- pinned, expandable, overlay

2 states (mycar)
	- phone, not pinned, expandable, overlay
	- pinned expanded sqeeze

2 states (recipe keeper)
	- pinned, expandable, overlay
	- pinned expanded sqeeze

*/

addReadyAnimation('flexus-drawer')

var cssStyles = `
	.overflow {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
	}
	.slot-scrollable {
		flex:1;
		overflow-x: hidden;
		overflow-y: auto;
		touch-action: pan-y;
	}
	slot {
		display: block;
	}
`

if (platform.material) {
	cssStyles += `
		.slot-scrollable {
			display: block;
			padding: 8px 0;
		}
		.slot-bottom {
			display: block;
			padding: 8px 0;
			border-top: 1px solid var(--seam-color);
		}
	`
}

@customElement
@css(cssStyles)
@template(`
	<div class="overflow">
		<slot name="top"></slot>
		<div class="slot-scrollable">
			<slot></slot>
		</div>
		<slot class="slot-bottom" name="bottom"></slot>
	</div>
	<slot name="edge"></slot>
`)
//class FlexusDrawer extends Element {
class FlexusDrawer extends ganymedeElement(Visibility, Draggable, Panel/*, Breakpointable*/) {

	//@reflect dragOrientation = 'horizontal'
	dragPercentage = 0
	// TODO: reflect once

	// BASED ON MATERIAL DESIGN
	// below toolbar
	//@reflect clipped = false
	// above toolbar /next to toolbar
	//@reflect fullHeight = true
	// todo: card
	//@reflect floating = false

	// Panel class overrides
	//@reflect pinned = platform.neon
	//@reflect left = true

	@reflect collapsed = Boolean
	/*@reflect*/ collapsible = false
	@reflect expandable = false

	constructor() {
		super()
		this.left = true
		this.pinnable = true
		this.autoHide = true
		//this.pinned = platform.neon
		//this.hidden = true
		window.drawer = this
		this.collapsible = platform.neon

		// if [collapsed] is specifier, it should never automatically expand
		if (this.hasAttribute('collapsed'))
			this.expandable = false
	}

	ready() {
		//console.log('------------------------------------ drawer ready')
		//console.log('this.collapsed', this.collapsed)
		//console.log('this.pinned', this.pinned)
		//if (this.clipped) this.fullHeight = false
		//if (this.fullHeight) this.clipped = false
		this.overrideVisibilityEvents()
		this.redistributeShadowNodes()
		this.setupHamburger()
		this.onResize()
		this.applyVisibilityState()
		//this.autoAssignPosition()
	}

	// automatically hides
	// TODO: rename properties to dismiss - a more universal attribute
	@on('click') 
	onClickCloseHandler(value, {target}) {
		if (target === this.hamburger) return
		if (target === this) return
		console.log('click', target)
		if (target.localName === 'a' && target.href)
			return this.softHide()
		var preventDismiss = target.hasAttribute('prevent-dismiss')
		console.log('preventDismiss', preventDismiss)
		if (!preventDismiss)
			this.softHide()
	}

	// automatically hides hamburger button from all toolbars and only keeeps the one
	// in drawer. Hamburgers are of course shown when drawer is not pinned
	setupHamburger() {
		if (!platform.neon) return
		var hamburger = this.querySelector('[icon="menu"]')
		if (!hamburger) {
			hamburger = document.createElement('div')
			hamburger.setAttribute('fx-item', '')
			hamburger.setAttribute('icon', 'menu')
			this.prepend(hamburger)
		}
		this.hamburger = hamburger
		this.setAttribute('has-hamburger', '')
	}

	@on(document, 'screensize-update')
	onResize() {
		//console.log('onResize', platform.screensize)
		switch (platform.screensize) {
			case SCREENSIZE.SMALL:
				this.dragPercentage = 0
				this.hidden = true
				this.pinned = false
				this.draggable = true
				this.collapsed = false
				app.root.removeAttribute('drawer-pinned')
				if (platform.neon) {
					// TODO: Neon's inline overlay state in medium screensize
					//this.overlayBg = this.__overlayBgDefault
				}
				break
			case SCREENSIZE.MEDIUM:
				if (platform.neon) {
					this.dragPercentage = 1
					this.hidden = false
					this.pinned = true
					this.draggable = false
					this.collapsed = true
					app.root.setAttribute('drawer-pinned', '')
					// TODO: Neon's inline overlay state in medium screensize
					//this.overlayBg = this.__overlayBgDefault
				}
				if (platform.material) {
					this.dragPercentage = 0
					this.hidden = true
					this.pinned = false
					this.draggable = true
					this.collapsed = false
				}
				break
			case SCREENSIZE.LARGE:
				if (platform.neon) {
					this.dragPercentage = 1
					this.hidden = false
					this.pinned = true
					this.draggable = false
					if (this.expandable) {
						this.collapsed = false
					} else {
						this.collapsed = true
					}
					//this.collapsed = false
					app.root.removeAttribute('drawer-pinned')
					// TODO: Neon's inline overlay state in medium screensize
					//this.overlayBg = false
				}
				if (platform.material) {
					this.dragPercentage = 0
					this.hidden = true
					this.pinned = false
					this.draggable = true
					this.collapsed = false
					//this.collapsed = false
				}
				break
		}
	}

	redistributeShadowNodes() {
		var children = Array.from(this.children)
		children
			.filter(node => node.hasAttribute('bottom'))
			.forEach(node => {
				node.setAttribute('slot', 'bottom')
				node.removeAttribute('bottom')
			})
		children
			.filter(node => node.hasAttribute('top'))
			.forEach(node => {
				node.setAttribute('slot', 'top')
				node.removeAttribute('top')
			})
		var toolbar = this.querySelector('flexus-toolbar')
		if (toolbar)
			toolbar.setAttribute('slot', 'top')
	}

	overrideVisibilityEvents() {
		//console.log('this.overlayFade drawer', this.overlayFade, this._overlayFadeDefault)
		// add event listener to app (and register killack through elements lifecycle) 
		app.on('drawer-show', e => this.emit('show'))
		app.on('drawer-hide', e => this.emit('hide'))
		app.on('drawer-toggle', e => this.emit('toggle'))
	}

	// overwrite Panel's show & hide methods by emitting
	// events to app as well since drawer is only one and it's
	// desired to be accessible through public events 
	show() {
		app.emit('drawer-show')
	}
	hide() {
		app.emit('drawer-hide')
	}
	toggle() {
		app.emit('drawer-toggle')
	}

/*
	@on('toggle')
	onToggle() {
		if (this.dragPercentage === 0)
			this.show()
		else
			this.hide()
	}
*/
	@on('toggle')
	onToggle() {
		if (platform.screensize !== SCREENSIZE.SMALL
		&& platform.neon
		&& this.visible
		&& this.collapsible) {
			this.toggleCollapse()
		} else {
			this.toggleVisibility()
		}
	}

	toggleCollapse() {
		this.collapsed = !this.collapsed
	}

	softHide() {
		//console.log('softHide')
		if (this.collapsible) {
			if (platform.screensize === SCREENSIZE.MEDIUM && !this.collapsed) {
				this.collapse()
			} else if (platform.screensize !== SCREENSIZE.LARGE) {
				this.hide()
			}
		} else {
			this.hide()
		}
	}
/*
	// TODO implement overlay in Neon medium screensize
	onOverlayClick() {
		//console.log('onOverlayClick')
		if (platform.screensize === SCREENSIZE.MEDIUM
		&& platform.neon
		//&& this.visible
		&& this.collapsible) {
			this.collapse()
		} else {
			//console.log('hide')
		}
	}

	toggleCollapse() {
		//console.log('toggleCollapse()')
		this.collapsed = !this.collapsed
		//if (this.collapsed)
		//	this.expand()
		//else
		//	this.collapse()
	}
*/
	collapse() {
		//console.log('collapse()')
		this.collapsed = true
		if (this.overlayElement)
			this.overlayElement.hide()
	}
	expand() {
		//console.log('expand()')
		this.collapsed = false
		if (this.overlayElement && this.overlayBg)
			this.overlayElement.show()
	}

}

/*
@customElement
@css(`
	:host {
		display: flex;
		width: 300px;
		background-color: gray;
		position: absolute;
		right: 0px;
		top: 0;
		bottom: 0;
		height: 100%;
		z-index: 99;
	}
	:host([hidden]) {
		visibility: visible !important;
	}
	#edge {
		position: absolute;
		right: 100%;
		width: 20px;
		top: 0;
		bottom: 0;
		background-color: green;
		opacity: 0.4;
	}
`)
@template(`
	<slot></slot>
	<div id="edge"></div>
`)
class FlexusPanel extends mixin(Panel, Draggable) {

	draggable = 'horizontal'
	//dragPercentage = 0

	overlay = false

	@reflect hidden = false
	hiddenChanged() {
		// TODO - integrate with show/hide events
	}

}
*/
