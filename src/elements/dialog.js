import {template, css, reflect, customElement, Element} from 'ganymede'
//import {platform} from 'flexus'

// TODO - MDN <dialog>

@customElement
@template(`
	<slot></slot>
	<div id="actions">
		<slot name="actions"></slot>
	</div>
`)
@css(`
	#actions {
		margin: 24px -2px -2px -2px;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	#actions ::slotted(*) {
		flex: 1;
	}
	:host([actions="1"]) #actions ::slotted(*) {
		flex: 0.5;
	}
	/*@media (max-width: 300px) {
		#actions {
			flex-direction: column;
		}
	}*/
`)
class FlexusDialog extends Element {

	@reflect visible = false
	@reflect actions = 0

	ready() {
		var buttons = Array.from(this.querySelectorAll('button'))
		buttons.forEach(button => button.setAttribute('slot', 'actions'))
		this.actions = buttons.length
	}

	show() {
		this.visible = true
	}

	hide() {
		this.visible = false
	}

}
