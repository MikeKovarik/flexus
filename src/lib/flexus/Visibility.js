import {on, once, reflect, autobind, validate, observe} from 'ganymede'


export let Visibility = SuperClass => class extends SuperClass {

	// todo implement visible in contrast to hidden
	// because some components that are usually hidden
	// need an explicit way to define they are visible

	@reflect hidden = Boolean
	@reflect visible = Boolean

	@once('ready')
	configureVisibilityAttributes() {
		//console.log('+++++ onready Visibility +++++')
		//console.log('this.visible', this.visible, this.hasAttribute('visible'))
		//console.log('this.hidden', this.hidden, this.hasAttribute('hidden'))
		// WARNING: at this point, attributes were read and if [visible] is defined
		//          both hidden and visible properties could be true. Setting hidden to false
		//          gets the ball rolling and keeps it properly synced
		if (this.visible)
			this.hidden = false
		else if (this.hidden)
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
		//console.log('toggle', this.hidden, this.visible)
		if (this.hidden)
			this.show()
		else
			this.hide()
	}

	@autobind toggleVisibility() {
		//console.log('toggle', this.hidden, this.visible)
		if (this.hidden)
			this.show()
		else
			this.hide()
	}

}
