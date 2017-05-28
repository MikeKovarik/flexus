import {ganymedeElement, customElement, on, template, css, reflect, emit} from 'ganymede'
import {platform} from 'flexus'


@customElement
@css(`
	:host-context([top]),
	:host-context([right]),
	:host-context([bottom]),
	:host-context([top]) {
		position: absolute;
	}
	:host-context([top]) {
		top: 0;
	}
	:host-context([right]) {
		right: 0;
	}
	:host-context([bottom]) {
		bottom: 0;
	}
	:host-context([left]) {
		left: 0;
	}
	:host {
		display: inline-block;
	}
	#fab ::slotted(button) {
		font-size: 0 !important;
	}
	#rest {
		display: flex;
		flex-direction: column;
		position: absolute;
		right: calc(1rem + 8px);
	}
	:host-context([bottom]) #rest {
		flex-direction: column-reverse;
		bottom: calc(1rem + 56px + 16px);
	}
	:host-context([top]) #rest {
		top: calc(1rem + 56px);
	}
	#rest ::slotted(button) {
		min-width: initial !important;
		width: 40px !important;
		height: 40px !important;
		border-radius: 50% !important;
		box-shadow: 0px 3px 12px rgba(0,0,0,0.5);
		margin-top: 16px;
	}
	#rest ::slotted(button:not(:empty)) {
		font-size: 0 !important;
		padding: 0 0 0 8px !important;
	}

	/* reveal animation with code outside the shadow root */
	#rest ::slotted(button) {
		display: none !important;
	}
	:host([expanded]) #rest ::slotted(button) {
		display: flex !important;
	}
`)
@template(`
	<div id="fab">
		<slot name="fab"></slot>
	</div>
	<div id="rest">
		<slot></slot>
	</div>
`)
class FlexusFabdial extends ganymedeElement() {

	@reflect expanded = false

	ready() {
		var fab = this.querySelector('[fab]')
		fab.setAttribute('slot', 'fab')
		this.fab = fab
	}

	@on('$.fab', 'click')
	onFabClick() {
		if (this.expanded)
			this.collapse()
		else
			this.expand()
	}

	@on('$.rest', 'click')
	onRestClick() {
		console.log('onRestClick')
		this.collapse()
	}

	expand() {
		this.expanded = true
	}

	collapse() {
		this.$.rest.animate([
			{opacity: 1},
			{opacity: 0}
		], 70).onfinish = () => {
			this.expanded = false
		}
	}

}
