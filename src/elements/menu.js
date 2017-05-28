import {template, css, reflect, customElement, ganymedeElement} from 'ganymede'
import {platform, isTouchEvent, Visibility} from 'flexus'


@customElement
@css(platform.neon ? `
	:host {
		padding: 8px 0;
		flex-direction: column;
		display: none;
		border: 1px solid var(--color-contour, rgba(var(--theme-base), 0.35));
		background-color: var(--color-menu-bg, var(--color-bg));
		text-align: left !important;
	}

	/*:host-context([light]) {
		background-color: #f2f2f2;
	}
	:host-context([dark]) {
		background-color: #2b2b2b;
	}*/

	:host-context([light]) {
		--color-bg: #f2f2f2;
	}
	:host-context([dark]) {
		--color-bg: #2b2b2b;
	}
	:host([light]) {
		--color-bg: #f2f2f2;
	}
	:host([dark]) {
		--color-bg: #2b2b2b;
	}

	:host([narrow]) {
		padding: 0;
	}
	.wrapper ::slotted(*:not(hr)) {
		align-items: center;
		justify-content: flex-start !important;
		text-align: left !important;
		display: flex !important;
		margin: 0 !important;
		padding: 0 12px !important;
		height: 32px !important;
		min-height: initial !important;
		width: 100% !important;
		min-width: initial !important;
		background-color: transparent !important;
		border: none !important;
		transition: transform 0.2s;
		font-size: 15px !important;
		letter-spacing: 0 !important;
	}
	:host-context([touch]) .wrapper ::slotted(*:not(hr)) {
		height: 44px !important;
	}
	.wrapper ::slotted(*:not(hr):active) {
		transform: scale(0.98) !important;
	}

	.wrapper ::slotted(*:not(hr):hover) {
		background-color: rgba(var(--foreground-rgb), 0.1) !important;
	}
	.wrapper ::slotted(*:not(hr):active) {
		background-color: rgba(var(--foreground-rgb), 0.2) !important;
	}

	.wrapper ::slotted(hr) {
		border: none !important;
		width: initial !important;
		height: 1px !important;
		margin: 4px 12px !important;
		display: block !important;
	}
	
	/*.wrapper ::slotted([icon]):before {*/
	::slotted([icon]::before),
	::slotted([icon])::before {
		outline: 2px solid red !important;
	}
` : `
`)
@template(`
	<div class="wrapper">
		<slot></slot>
	</div>
`)
class FlexusMenu extends ganymedeElement(Visibility) {

	constructor() {
		super()
		//this.style.position = 'absolute'
		//this.style.backgroundColor = '#2b2b2b'
		//this.style.border = '1px solid #767676'
		//this.style.zIndex = '9999'
		console.log('constructor menu')
	}

	hiddenChanged() {
		console.log('MENU hiddenChanged')
		this.style.display = this.hidden ? 'none' : 'inline-block'
		console.log('this.style.display', this.style.display)
	}

}


