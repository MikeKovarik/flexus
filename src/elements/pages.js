import {on, validate, template, css, reflect, observe, customElement, ganymedeElement} from 'ganymede'
import {clamp, animation, platform, Draggable} from 'flexus'
import {LinearSelectable, isNodeAvailable} from 'flexus'
//import {queryDecorator} from './query.js'


var noop = () => {}

@customElement
@template(`
	<div id="track">
		<slot></slot>
	</div>
`)
@css(`
	:host {
		overflow: hidden;
		display: block;
		position: relative;
	}
	#track {
		padding: inherit;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		will-change: transform;
	}
	#track ::slotted(*) {
		padding: inherit;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		will-change: left;
	}
	:host,
	#track,
	#track ::slotted(*) {
		/* enable browser to handle vertical scrolling and js to handle horizontal dragging through pointer events */
		touch-action: pan-y;
	}
`)
class FlexusPages extends ganymedeElement(LinearSelectable, Draggable) {

	@reflect threshold = 0.3
	@reflect noSkipping = false
	@reflect cycle = false

	@reflect dragOrientation = 'horizontal'

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
	dragPointerType = 'touch'

	@reflect transition = 'slide' // options: slide, fade

	autoAdjustHeight = false

	// todo this does not need to be reflected back to attr
	/*@reflect*/ maxTransitionDuration = 800

	ready() {
		//console.log('ready')
		//console.log('this.selected', this.selected)
		this.setupPages()

		// set element as focusable (to be able to catch key events)
		this.setAttribute('tabindex', 0)

		// try to guess if height is not set and adjust flexus-page height according
		// to each inner page on navigation
		/*var bbox = this.getBoundingClientRect()
		if (this.style.height === '' && bbox.height < 60) {
			this.style.willChange = 'height'
			this.autoAdjustHeight = true
			this.style.transition = `200ms height`
		}*/
		if (this.autoAdjustHeight)
			this.adjustHeight()

		this.elementReady = true
	}

	disabledChanged() {
		console.log('disabledChanged()')
	}
	foobarChanged() {
		console.log('foobarChanged()')
	}

	disable() {
		// TODO: this depends on the way we're handling query based properties
		this.draggable = true
	}

	enable() {
		// TODO: this depends on the way we're handling query based properties
		this.draggable = false
	}

	calcDuration(distance) {
		//return 800
		var distance = Math.abs(distance)
		if (platform.material)
			return Math.min(animation.durationByDistance(distance), this.maxTransitionDuration)
		else
			return 150
	}

	setupPages() {
		//console.log('setupPages')
		this.pages = Array.from(this.children)
		//console.log('this.pages', this.pages)
		//console.log('this.selected', this.selected)
		this.selectedPage = this.pages[this.selected]
		//console.log('this.selectedPage', this.selectedPage)
		this.resetPages()
		// assign tabinex for each page so it can catch key events
		this.pages.forEach(page => {
			page.setAttribute('tabindex', 0)
		})
	}

	hidePage(page) {
		//console.log('hidePage', page)
		page.style.display = 'none'
		page.style.left = '0px'
		this.hidePageAttributes(page)
	}
	hidePageAttributes(page) {
		//console.log('hidePageAttributes', page)
		page.removeAttribute('selected')
		page.setAttribute('offscreen', '')
	}
	showPage(page, reposition = false) {
		//console.log('showPage', page)
		page.style.display = ''
		if (reposition) page.style.left = '0px'
		this.showPageAttributes(page)
	}
	showPageAttributes(page) {
		//console.log('showPageAttributes', page)
		page.setAttribute('selected', '')
		page.removeAttribute('offscreen')
	}

	//@on('$.track', 'transitionend')
	resetPages() {
		//this.$.track.style.transform = `translate3d(0px, 0px, 0)`
		this.pages.forEach(page => {
			if (page !== this.selectedPage)
				this.hidePage(page)
		})
		//console.log('this.selectedPage', this.selectedPage)
		this.showPage(this.selectedPage, true)
	}

	adjustHeight() {
		var setHeight = () => {
			var selectedPageBbox = this.selectedPage.getBoundingClientRect()
			var newPageHeight = selectedPageBbox.height
			//console.log('this.selectedPage', this.selectedPage.style.display)
			//console.log('newPageHeight', newPageHeight)
			this.style.height = `${newPageHeight}px`
			/*this.style.overflowY = 'hidden'
			animation.transition(this, {
				height: [`${oldPageHeight}px`, `${newPageHeight}px`]
			}, true).then(() => {
				this.style.overflowY = ''
			})*/
		}
		// set height now
		setHeight()
		// set height again in it was not ready before
		setTimeout(setHeight, 50)
	}

	selectedChanged(newIndex, oldIndex) {
		//console.log('PAGES selectedChanged', oldIndex, '->', newIndex)
		this.width = this.offsetWidth
		var pageDiff = oldIndex - newIndex
		var direction = pageDiff < 0 ? -1 : 1

		if (this.autoAdjustHeight)
			var oldPageHeight = this.selectedPage.getBoundingClientRect().height

		if (platform.material)
			this.selectedChangedMaterial(newIndex, pageDiff, direction)
		else
			this.selectedChangedNeon(newIndex, pageDiff, direction)

		this.emit('selected', newIndex)

		if (this.autoAdjustHeight)
			this.adjustHeight()
	}
	selectedChangedMaterial(newIndex, pageDiff, direction) {
		this.hidePageAttributes(this.selectedPage)
		this.selectedPage = this.pages[newIndex]
		this.showPageAttributes(this.selectedPage)

		var oldPage = this.selectedPage
		var newPage = this.pages[newIndex]
		if (this.currentAnimation) {
			this.currentAnimation.cancel()
			oldPage.style.display = 'none'
		} else {
			if (this.noSkipping)
				var distance = pageDiff * this.width
			else
				var distance = direction * this.width
			this.selectedPage.style.left = `${-distance}px`
			this.showPage(this.selectedPage)
			// animate
			var duration = this.calcDuration(distance)

			this.currentAnimation = this.$.track.animate([
				//{transform: `translate3d(0px, 0px, 0)`},
				{transform: `translate3d(${this.dragDistance}px, 0px, 0)`},
				{transform: `translate3d(${distance}px, 0px, 0)`},
			], {
				duration,
				easing: 'ease-in-out',
			})
			this.currentAnimation.finished.catch(noop)
			this.currentAnimation.oncancel = this.currentAnimation.onfinish = e => {
				this.dragDistance = 0
				this.currentAnimation = undefined
				this.resetPages()
				//oldPage.style.display = 'none'
			}

		}
	}
	selectedChangedNeon(newIndex, pageDiff, direction) {
		var distance = 12 * direction
		var oldPage = this.selectedPage
		var newPage = this.pages[newIndex]

		var fadeInNewPage = () => {
			newPage.style.display = ''
			this.showPageAttributes(newPage)
			var player = newPage.animate([
				{opacity: 0, transform: `translate3d(${-distance}px, 0px, 0)`},
				{opacity: 1, transform: `translate3d(0px, 0px, 0)`},
			], {
				easing: 'cubic-bezier(.17,.67,.24,.94)',
				duration: 320
			})
			player.pause()
			//player.play()
			setTimeout(() => player.play(), 40)
			player.oncancel = player.onfinish = e => {
				this.currentAnimation = undefined
			}
			this.currentAnimation = player
		}
		var fadeOutOldPage = () => {
			this.currentAnimation = oldPage.animate([
				{opacity: 1, transform: `translate3d(0px, 0px, 0)`},
				{opacity: 0, transform: `translate3d(${distance}px, 0px, 0)`},
			], {
				easing: 'ease-in',
				duration: 90
			})
			var oncancel = this.currentAnimation.oncancel = e => {
				oldPage.style.display = 'none'
				this.currentAnimation = undefined
			}
			this.currentAnimation.onfinish = e => {
				oncancel()
				fadeInNewPage()
			}
		}

		this.hidePageAttributes(oldPage)
		this.selectedPage = newPage
		if (this.currentAnimation) {
			this.currentAnimation.cancel()
			oldPage.style.display = 'none'
			fadeInNewPage()
		} else {
			fadeOutOldPage()
		}
	}

	showSiblingPages() {
		//console.log('showSiblingPages')
		this.prevPage = this.selectedPage.previousElementSibling
		this.nextPage = this.selectedPage.nextElementSibling
		//console.log('this.selectedPage', this.selectedPage)
		//console.log('this.prevPage', this.prevPage)
		//console.log('this.nextPage', this.nextPage)

		if (!this.prevPage && this.cycle) this.prevPage = this.lastElementChild
		if (!this.nextPage && this.cycle) this.nextPage = this.firstElementChild

		if (this.prevPage) {
			this.prevPage.style.left = `-${this.width}px`
			this.showPage(this.prevPage)
		}
		if (this.nextPage) {
			this.nextPage.style.left = `${this.width}px`
			this.showPage(this.nextPage)
		}
	}

	showMorePages() {
		// TODO
		// Show more then prev/next pages.
		// Useful for small tabs on big screen where finger can keep scrolling to further pages
		this.showSiblingPages() // for now
	}

	dragDistance = 0

	onDragStart(e) {
		//if (e.pointerType === 'mouse') return
		//console.log('onDragStart', e)
		if (this.transitioning) {
			// TODO if feasible: Do some quick snap (10-20ms?) from currently transitioned
			// position before resetting (basically, force transition to finish quicker)
			//this.$.track.style.transition = `transform 40ms`
			this.resetPages()
		}
		this.initX = e.clientX
		this.width = this.offsetWidth

		//if (window.innerWidht === this.width)
			this.showSiblingPages()
		//else
		//	this.showMorePages()

		if (!this.cycle) {
			this.leftClampDistance = this.selected * this.width
			this.rightClampDistance = ((this.pages.length - 1) - this.selected) * -this.width
		}
	}

	onDragMove(e) {
		//if (e.pointerType === 'mouse') return
		//console.log('onDragMove')
		this.dragDistance = e.clientX - this.initX
		if (!this.cycle)
			this.dragDistance = clamp(this.dragDistance, this.rightClampDistance, this.leftClampDistance)
		this._trackRender(this.dragDistance)
	}

	onDragEnd(e) {
		//if (e.pointerType === 'mouse') return
		//console.log('onDragEnd')
		this.transitioning = true
		var overThreshold = this.width * this.threshold < Math.abs(this.dragDistance)
		if (overThreshold) {
			var duration = this.calcDuration(this.width - Math.abs(this.dragDistance))
			//this.$.track.style.transition = `transform ${duration}ms`
			if (this.dragDistance > 0) {
				this._trackRender(0)
				this.selected -= 1
			} else {
				this._trackRender(0)
				this.selected += 1
			}
		} else {
			var duration = this.calcDuration(this.dragDistance)
			this._trackRender(0)
			//this.resetPages()
		}
	}

	_trackRender(distance) {
		//console.log('_trackRender', this.$.track.style.transition)
		this.$.track.style.transform = `translate3d(${distance}px, 0px, 0)`
	}

/*
	@on('keyup')
	onKeyup(data, e) {
		//console.log('keyup pages', e)
	}
*/

}

