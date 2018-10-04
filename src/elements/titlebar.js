import {customElement, ganymedeElement, autobind} from 'ganymede'
import {app, platform, addReadyAnimation} from 'flexus'


//addReadyAnimation('flexus-titlebar')

@customElement
class FlexusTitlebar extends ganymedeElement() {

	ready() {
		if (platform.browser) {
			//this.style.display = 'none'
			this.remove()
			return
		}
		this.$minimize = this.querySelector('[icon="chrome-minimize"]')
		this.$maximize = this.querySelector('[icon="chrome-maximize"]')
		this.$unmaximize = this.querySelector('[icon="chrome-unmaximize"]')
						|| this.querySelector('[icon="chrome-restore"]')
		this.$close = this.querySelector('[icon="chrome-close"]')

		this.$minimize.addEventListener('click', e => app.minimize())
		this.$maximize.addEventListener('click', e => app.maximize())
		this.$unmaximize.addEventListener('click', e => app.unmaximize())
		this.$close.addEventListener('click', e => app.close())

		this.updateMaximized(false)

		app.on('maximize', e => this.updateMaximized(true))
		app.on('unmaximize', e => this.updateMaximized(false))
	}

	updateMaximized(maximized) {
		this.$maximize.style.display = maximized ? 'none' : ''
		this.$unmaximize.style.display = maximized ? '' : 'none'
	}

}
