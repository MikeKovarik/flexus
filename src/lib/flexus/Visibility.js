import {on, once, reflect, autobind, validate, observe} from 'ganymede'
import {reflectQuery} from 'flexus'


var promiseTimeout = millis => new Promise(resolve => setTimeout(resolve, millis))

var intersectionObserverAvailable = typeof IntersectionObserver !== 'undefined'

export let Visibility = SuperClass => class extends SuperClass {

	// todo implement visible in contrast to hidden
	// because some components that are usually hidden
	// need an explicit way to define they are visible

	@reflectQuery hidden = false
	visible = Boolean

	isOnScreen = false

	@on('ready')
	async setupIntersectionObserver() {
		if (intersectionObserverAvailable) {
			var options = {threshold: [0, 0.001]}
			var onObserve = ([entry]) => this.isOnScreen = entry.intersectionRatio > 0
			this.intObserver = new IntersectionObserver(onObserve, options)
			this.intObserver.observe(this)
			// Set initial value
			this.isOnScreen = this.offsetWidth !== 0
			this.isVisibleSetter()
			// Wait a tick to compensate for slow rendeing (usually in MVC frameworks)
			// to see if it's still false (out of screen) or if it's already rendered.
			if (this.isOnScreen) return
			await promiseTimeout()
			this.isOnScreen = this.offsetWidth !== 0
		} else {
			this.isVisible = !this.hidden
		}
		this.isVisibleSetter()
	}

	@observe('hidden')
	@observe('isOnScreen')
	isVisibleSetter() {
		this.isVisible = this.isOnScreen && !this.hidden
	}

	@once('ready')
	configureVisibilityAttributes() {
		//console.log('+++++ onready Visibility +++++')
		//console.log('this.visible', this.visible, this.hasAttribute('visible'))
		//console.log('this.hidden', this.hidden, this.hasAttribute('hidden'))
		// WARNING: at this point, attributes were read and if [visible] is defined
		//          both hidden and visible properties could be true. Setting hidden to false
		//          gets the ball rolling and keeps it properly synced
		if (this.visible === true)
			this.hidden = false
		else if (this.hidden === true)
			this.visible = false
		//console.log('this.visible', this.visible, this.hasAttribute('visible'))
		//console.log('this.hidden', this.hidden, this.hasAttribute('hidden'))
	}

	@observe('hidden')
	hiddenChangedReflector() {
		//console.log('hiddenChanged to', this.hidden, '|', this.__preventHiddenFromUpdatingVisible)
		if (this.__preventHiddenFromUpdatingVisible === true) {
			this.__preventHiddenFromUpdatingVisible = false
		} else {
			this.__preventVisibleFromUpdatingHidden = true
			//console.log('setting visible to', !this.hidden)
			this.visible = !this.hidden
			this.__preventVisibleFromUpdatingHidden = false
		}
	}

	@observe('visible')
	visibleChangedReflector() {
		//console.log('visibleChanged to', this.visible, '|', this.__preventVisibleFromUpdatingHidden)
		if (this.__preventVisibleFromUpdatingHidden === true) {
			this.__preventVisibleFromUpdatingHidden = false
		} else {
			this.__preventHiddenFromUpdatingVisible = true
			//console.log('setting hidden to', !this.visible)
			this.hidden = !this.visible
			this.__preventHiddenFromUpdatingVisible = false
		}
	}

	@autobind show() {
		this.emit('show')
	}

	@autobind hide() {
		this.emit('hide')
	}

	@autobind toggle() {
		if (this.hidden)
			this.show()
		else
			this.hide()
	}

	@autobind toggleVisibility() {
		if (this.hidden)
			this.show()
		else
			this.hide()
	}

}
