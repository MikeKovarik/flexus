import {on, once, reflect, autobind, observe} from 'ganymede'
import {clamp, rafThrottle} from './utils.js'



//class Listeners extends Array {
//}

export let Scrollable = SuperClass => class extends SuperClass {

	scrollTarget = undefined
	scrollListeners = []

	isScrolledToTop = true
	isScrolledToBottom = true

	// keeps reflecting touch-action css property according to scroll position
	scrollReflectsTouchAction = false

	//@once('ready')
	setupScrollable(target) {
		target = this.scrollTarget || target
		// for now only available for scrolling on <main> elements
		if (!target || target.localName !== 'main') {
			this.scrollTarget = target = undefined
			return false
		}
		this.scrollTarget = target
		// merge local and preexisting scroll listeners in case scrollTarget is shared
		// between multiple consumers
		// WARNING: it is necessary to share single scrollListeners array by reference
		//          with everyone listening to the same scrollTarget
		var listeners = target.scrollListeners = target.scrollListeners || []
		listeners.push(...this.scrollListeners)
		this.scrollListeners = listeners
		// some scrollable elements need to update their touch-action in combination with Draggable
		if (this.scrollReflectsTouchAction) {
			listeners.push(this.onScrollChange)
			this.updateTouchAction()
		}
		this.executeScrollThrottled = rafThrottle(() => {
			var scrolled = this.scrolled
			for (var i = 0; i < listeners.length; i++)
				listeners[i](scrolled)
		})
		this.startScrollListening()
		return true
	}

	startScrollListening() {
		var target = this.scrollTarget
		if (this.scrollListeners.length === 0) return false
		if (target.scrollListenerActive) return false
		target.addEventListener('scroll', this.executeScrollThrottled, {passive: true})
		target.scrollListenerActive = true
		return true
	}
	endScrollListening() {
		var target = this.scrollTarget
		if (this.scrollListeners.length > 0) return false
		if (!target.scrollListenerActive) return false
		target.removeEventListener('scroll', this.executeScrollThrottled)
		target.scrollListenerActive = false
		return true
	}

	addScrollListeners(listener) {
		this.scrollListeners.push(listener)
		this.startScrollListening()
	}
	removeScrollListeners(listener) {
		var index = this.scrollListeners.indexOf(listener)
		if (index !== -1)
			this.scrollListeners.splice(index, 1)
		this.endScrollListening()
	}

	updateTouchAction() {
		if (this.isContentScrollable) {
			this.onScrollChange(this.scrolled)
			this.reflectTouchAction()
		} else {
			this.isScrolledToTop = true
			this.isScrolledToBottom = true
		}
	}

	@autobind onScrollChange(scrolled) {
		var max = this.maxScrollable
		if (scrolled <= 0) {
			//console.log('onScrollChange start', scrolled)
			this.isScrolledToTop = true
			this.isScrolledToBottom = false
		} else if (scrolled >= max) {
			//console.log('onScrollChange end', scrolled)
			this.isScrolledToTop = false
			this.isScrolledToBottom = true
		} else {
			//console.log('onScrollChange mid', scrolled)
			this.isScrolledToTop = false
			this.isScrolledToBottom = false
		}
	}

	@observe('isScrolledToTop', 'isScrolledToBottom')
	reflectTouchAction() {
		if (!this.scrollTarget) return
		if (this.isScrolledToTop && this.isScrolledToBottom)
			this.scrollTarget.style.touchAction = 'none'
		else if (this.isScrolledToTop)
			this.scrollTarget.style.touchAction = 'pan-down'
		else if (this.isScrolledToBottom)
			this.scrollTarget.style.touchAction = 'pan-up'
		else
			this.scrollTarget.style.touchAction = 'pan-y'
		//console.log('touch-action', this.scrollTarget.style.touchAction, this)
		//console.log('touch-action', this.scrollTarget.style.touchAction)
	}

	get scrolled() {
		return Math.round(this.scrollTarget.scrollTop)
	}
	// return true if content of scrolltarget is taller than whats visible
	get isContentScrollable() {
		var scrollTarget = this.scrollTarget
		return scrollTarget.scrollHeight !== scrollTarget.offsetHeight
	}
	get maxScrollable() {
		var scrollTarget = this.scrollTarget
		return scrollTarget.scrollHeight - scrollTarget.offsetHeight
	}

}


const UP     = -1
const RIGHT  = 1
const DOWN   = 1
const LEFT   = -1
const NO_DIR = 0

// class implementing Retractable is required to also inherit Scrollable
// it also asumes 'scrollTarget' is defined on ready event
export let Retractable = SuperClass => class extends SuperClass {

	static UP     = UP
	static RIGHT  = RIGHT
	static DOWN   = DOWN
	static LEFT   = LEFT
	static NO_DIR = NO_DIR

	@reflect retractable = true
	// direction from center
	retractDirMod = UP
/*
	@on('ready')
	onRetractableReady() {
		if (!this.retractable) return
		var thisStyle = this.style
		var pivot = 0
		var totalScrolled = 0
		var lastY = 0
		var timeout
		var inactivated = () => {
			if (Math.abs(lastY) < this.offsetHeight / 2) {
				pivot = totalScrolled
				this.show()
			} else {
				pivot = totalScrolled - this.offsetHeight
				this.hide()
			}
				'lastY', lastY,
				'totalScrolled', totalScrolled,
				'this.offsetHeight', this.offsetHeight,
				'|', lastY < this.offsetHeight / 2)
		}
		var onScroll = scrolled => {
			clearTimeout(timeout)
			timeout = setTimeout(inactivated, 400)
			var y = (scrolled - pivot) * this.retractDirMod
			totalScrolled = scrolled
			lastY = y
			thisStyle.transform = `translate3d(0px, ${y}px, 0)`
		}
		this.addScrollListeners(onScroll)
		this.registerKillback(() => this.removeScrollListeners(onScroll))
	}
*/
}

export function getParallaxApplicator(node) {
	var ratio = node.getAttribute('parallax')
	var {style} = node
	if (ratio === 'custom')
		return scrolled => console.warn('TODO: custom parallax')
	else {
		ratio = -Number(ratio || 0.2)
		return scrolled => style.transform = `translate3d(0, ${scrolled * ratio}px, 0)`
	}
}