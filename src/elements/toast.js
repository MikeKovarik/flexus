import {template, css, reflect, on, customElement, ganymedeElement} from 'ganymede'
import {platform, Visibility} from 'flexus'
import flexus from 'flexus'


@customElement
class FlexusToast extends ganymedeElement() {
//class FlexusToast extends ganymedeElement(Visibility) {

	constructor(text, duration) {
		super()
		if (this.children.length === 0 && text) {
			this.textContent = text
			this.duration = duration
			this.show()
		}
	}

	show(duration = this.duration) {
		this.style.display = 'flex'
		setTimeout(() => this.hide(), duration)
	}

	hide() {
		this.remove()
	}

	@on('click')
	onClick(data, {target}) {
		if (target.localName === 'button')
			this.hide()
	}

}

flexus.toast = function(text, duration = 4000) {
	var toast = new FlexusToast(text, duration)
	flexus.app.appendChild(toast)
}