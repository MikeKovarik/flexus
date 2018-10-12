import {template, css, reflect, on, customElement, ganymedeElement, autobind, defaultValue} from 'ganymede'
import {platform, Visibility, Draggable, Panel, Scrollable} from 'flexus'
import {getParallaxApplicator, addReadyAnimation} from 'flexus'

// TODO: change Panel & [panel] to [modal]

addReadyAnimation('flexus-view')

createGlobalCss(`
flexus-input[icon]::before {
	position: absolute;
	left: 16px;
	pointer-events: none;
}
`)

@customElement
@css(`
	:host {
		display: inline-flex;
		height: 56px;
		position: relative;
		overflow: hidden;
		will-change: opacity, transform, color;
		--left: 16px;
	}
	:host([plain]) {
		--left: 0px;
	}
	:host([icon]) {
		--left: 48px;
	}

	:host([filled]) {
		background-color: rgba(var(--foreground-rgb), 0.05);
		border-radius: 4px 4px 0 0;
	}
	:host([outlined]) {
		border: 1px solid rgba(var(--foreground-rgb), 0.6);
		border-radius: 4px;
	}

	:host([plain]) {
		border: none;
		background: transparent;
	}
	:host([plain]) #bar {
		display: none;
	}

	* {
		box-sizing: border-box;
	}

	label,
	input {
		font-family: Roboto,sans-serif;
		-webkit-font-smoothing: antialiased;
		font-size: 16px;
		/*line-height: 1.75rem;*/
		font-weight: 400;
	}

	label {
		color: rgba(var(--foreground-rgb), 0.6);
		text-align: left;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		transform-origin: left top;
		will-change: transform;
		transition: transform .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);
		pointer-events: none;
		cursor: text;
		position: absolute;
		left: var(--left);
		top: 20px;
	}

	input {
		width: 100%;
		height: 100%;
		padding: 20px 12px 6px var(--left);
		border: none;
		outline: none;
		background: transparent;
	}

	#bar {
		background-color: rgba(var(--foreground-rgb), .42);
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0px;
		height: 1px;
		transition: color 150ms;
		will-change: color, height;
	}
	input:focus ~ #bar {
		background-color: var(--tint);
		height: 2px;
	}
	
	input:focus + label,
	input:not(:invalid) + label {
		transform: translateY(-50%) scale(0.75);
	}

`)
@template(`
	<input id="input" type="text" required>
	<label id="label"></label>
	<div id="bar"></div>
`)
class FlexusInput extends ganymedeElement() {

	@reflect label = ''
	@reflect type = 'text'

	@reflect filled = true
	// TODO: figure out central naming scheme (outlined/outline/seam/seamed)
	@reflect outlined = false
	// no background, no borders
	@reflect plain = Boolean

	// TODO
	@reflect required = Boolean

	ready() {
		if (this.plain) this.filled =  this.outlined = false
		if (this.outlined) this.filled = false

		this.$.input.value = this.value || ''
		this.$.label.innerText = this.label
		this.$.input.type = this.type

		this.cloneableEvents = ['input', 'change', 'focus', 'blur']
		this.updateableEvents = ['input', 'change']

		this.attachNativeListeners()
	}

	attachNativeListeners() {
		this.cloneableEvents.forEach(name => {
			this.$.input.addEventListener(name, this.redispatchEvent)
		})
		this.updateableEvents.forEach(name => {
			this.$.input.addEventListener(name, this.applyValue)
		})
	}

	@on('disconnected')
	removeNativeListeners() {
		this.cloneableEvents.forEach(name => {
			this.$.input.removeEventListener(name, this.redispatchEvent)
		})
		this.updateableEvents.forEach(name => {
			this.$.input.removeEventListener(name, this.applyValue)
		})
	}

	@autobind
	redispatchEvent(event) {
		var newEvent = new event.constructor(event.type, event)
		this.dispatchEvent(newEvent)
	}

	@autobind
	applyValue() {
		this.value = this.$.input.value
	}

	//@observe('label')
	labelChanged() {
		console.log('label changed', this.label)
		this.$.label.innerText = this.label
	}

	typeChanged() {
		console.log('type changed', this.type)
		this.$.input.type = this.type
	}

	// TODO: handle detaching

}

function createGlobalCss(css) {
	var style = document.createElement('style')
	style.type = 'text/css'
	style.innerHTML = css
	document.getElementsByTagName('head')[0].appendChild(style)
}