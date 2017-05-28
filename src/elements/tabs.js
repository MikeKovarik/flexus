import ganymede from 'ganymede'
import {autobind} from 'ganymede'
import {_, on, validate, template, css, reflect, observe, customElement, ganymedeElement, draggable} from 'ganymede'
import {clamp, animation, platform} from 'flexus'
import {LinearSelectable, isNodeAvailable, rafThrottle} from 'flexus'


/*
function createResizeDetector(element, callback) {
	if (element.resizeDetector)
		return
	var iframe = document.createElement('iframe')
	var resizeRAF
	function listener(e) {
		if (resizeRAF) cancelAnimationFrame(resizeRAF)
		resizeRAF = requestAnimationFrame(callback)
	}
	element.resizeDetector = {
		listener,
		iframe
	}
	(element.shadowRoot || element).appendChild(iframe)
	iframe.contentWindow.addEventListener('resize', listener)
}
*/
function hybridCustomComponent(element, Class) {
	return undefined
}

function whenReady(element, callback) {
	function listener() {
		element.removeEventListener('ready', listener)
		callback()
	}
	element.addEventListener('ready', listener)
}

function getDirection(newIndex, oldIndex) {
	return oldIndex > newIndex ? 'left' : oldIndex < newIndex ? 'right' : 'none'
}

function selectedValidator(newIndex, self) {
	var children = this.children
	if (newIndex < 0) newIndex = 0
	if (newIndex > children.length -1) newIndex = children.length -1
	var target = children[newIndex]
	if (isNodeAvailable(target)) {
		return newIndex
	} else {
		return self.selected
	}
}

function pickClosest(children, target, newIndex, oldIndex) {
	var direction = getDirection(newIndex, oldIndex)
	if (direction === 'right') {
		while (target) {
			target = target.nextElementSibling
			if (target && isNodeAvailable(target)) break
		}
	}
	if (direction === 'left') {
		while (target) {
			target = target.previousElementSibling
			if (target && isNodeAvailable(target)) break
		}
	}
	if (target)
		return [...children].indexOf(target)
	else
		return oldIndex
}

@customElement
@template(`
	<div id="tabs">
	<!--div id="tabsinner"-->
		<slot></slot>
		<div id="bar" class="transition"></div>
	<!--/div-->
	</div>
`)
@css(`
	/*:host {
		color: var(--tabs-foreground, var(--theme-primary));
	}
	:host-context([tinted]) {
		color: var(--tabs-foreground, currentColor);
	}*/

	#tabs {
		display: flex;
		width: 100%;
		transition: transform 150ms;
		position: relative;
	}
	:host([center]) #tabs {
		justify-content: center;
	}
	:host([centered]) #tabs {
		padding-left: 50%;
		width: initial;
	}
	#tabsinner {
		display: flex;
	}

	#bar {
		height: 2px;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		transform-origin: left center;
		transition: transform;
		background-color: var(--tabs-bar, var(--primary, currentColor));
	}
	/* note this naive selector wont work if [primary] will be platform based
	... like primary="tablet" . more complex selector would be needed in that case*/
	#bar {
		background-color: var(--tabs-bar, var(--tint));
	}
	:host-context([tinted]) #bar {
		background-color: var(--tabs-bar, var(--accent, var(--foreground)));
	}
	/*:host([colorless-bar]) #bar {
		background-color: var(--tabs-bar, currentColor);
	}*/
	:host([no-bar]) #bar {
		display: none;
	}
	#bar.transition {
		transition-duration: 150ms;
		/*transition-duration: 150ms;
		transition-timing-function: cubic-bezier(0.4, 0.0, 1, 1);*/
		/*transition-duration: 0.18s;
		transition-timing-function: cubic-bezier(0.0, 0.0, 0.2, 1);*/
	}

`)
class FlexusTabs extends ganymedeElement(LinearSelectable) {

	preseted = false
	@reflect center = Boolean
	@reflect fixed = Boolean
	//@reflect indent = Boolean
	@reflect subtle = Boolean
	// TODO: make new decorator to be only one-way.
	// I don't expect [centered] to be changed from inside.
	// Only listen for changes on the attribute
	@reflect centered = Boolean

	// inspired by paper-tabs
	@reflect noBar = false
	@reflect noSlide = false
	@reflect noInk = false
	//@reflect scrollable = false
	// Causes scrollable tabs to stretch to fit their container if the tabs don't need to scroll
	// IDEA: rename to stretchContainer (and [fixed] to [stretch/ed])
	@reflect fitContainer = false
	// Use when tabs are positioned below the content they control.
	// The selection bar will be shown at the top of the tabs
	@reflect alignBottom = false
	// Selects the tab right away, rather than focusing it and waiting for confirmation (enter key)
	@reflect autoselect = false
	@reflect autoConnect = true
	/**
	 * The delay (in milliseconds) between when the user stops interacting
	 * with the tabs through the keyboard and when the focused item is
	 * automatically selected (if `autoselect` is true).
	 */
	autoselectDelay = 0

	// Temp storage of click events or elements (of the tabs)
	// uppon selection. It is then passed to toolbar as
	// an origin of background transition animations
	lastTransitionSource = undefined

	ready() {
		//console.log('tabs ready')

		// set element as focusable (to be able to catch key events)
		this.setAttribute('tabindex', 0)

		this.setupResizeDetector()

		//if (this.centered)
		//if (this.hasAttribute('centered'))
		//	this.setupCentered()

		//this.parentView = document.querySelector('flexus-view')
		this.setupToolbar()
		this.updateToolbar()

		if (this.autoConnect)
			this.setupPages()

		var parentName = this.parentElement.localName
		if (parentName !== 'flexus-toolbar' && parentName !== 'flexus-view')
			this.subtle = true

		this.selectedChanged(this.selected)

		// slow down resize callback by using requestAnimationFrame
		this.onResize = rafThrottle(this.render)
		// note: resize events cannot be listened to passively
		this.on(window, 'resize', this.onResize)
		// fix misligned tab bar due to ongoing rendering
		setTimeout(this.render, 100)
	}

	@on('beforeready')
	applyPresentIfApplicable() {
		if (this.fixed === undefined
		 && this.scrollable === undefined
		 && this.center === undefined
		 && this.centered === undefined)
			this.preset()
	}

	setupResizeDetector() {
		// TODO
		var width = this.offsetWidth
		if (width != window.innerWidth) {
			// element resize detector z toolbaru			
		} else {
			// naslouchat na window resize
		}
		// ALSO: pokud se zmeni formfactor zpusobem ze puvodni podminka vyplni
		// (kvuli dvoum view vele sebe), potom prestat naslouchat na window
		// resize a aplikovat vlastni resize detector
	}

	preset() {
		//console.log('preset')
		this.preseted = true
		var width = this.offsetWidth
		//console.log(this.$.tabs.offsetWidth, width)
		//if (this.$.tabs.offsetWidth > width)
		//	console.log('TODO scroling')
		var parentName = this.parentElement.localName
		var autofixing = platform.phone && (parentName === 'flexus-toolbar' || parentName === 'flexus-view')
		if (this.indent) {
			width -= 56
			//width -= Number(window.getComputedStyle(this).paddingLeft)
		}
		var children = Array.from(this.children)
		var textContent = this.textContent.trim()
		if (textContent.length === 0) {
			// only icon tabs
			//if (children.length <= 6) {
			if (width / children.length >= 48) {
				var computed = window.getComputedStyle(children[0])
				this.fixed = true
				this.scrollable = false
			} else {
				this.fixed = false
				this.scrollable = true
			}
		} else {
			// further process the textContent
			textContent = textContent.replace(/\s+/g, ' ')
			//if (textContent.length <= 40 || children.length <= 4) {
			if (textContent.length <= width / 10) {
				// NOTE: this works well with pohones, try to make
				// this for phablets as well
				this.fixed = true
				this.scrollable = false
			} else {
				this.fixed = false
				this.scrollable = true
			}
		}
		//console.log(textContent.length, textContent)
	}

	assurePagesElement(target) {
		if (target.localName !== 'flexus-pages')
			return hybridCustomComponent(target, ganymede.constructors.FlexusPages)
		return target
	}
	setupPages() {
		var pages
		//pages = this.parentView.children[1]
		if (this.nextElementSibling && this.nextElementSibling.localName === 'flexus-pages')
			pages = this.nextElementSibling
		if (!pages && this.toolbar)
			pages = this.assurePagesElement(this.toolbar.nextElementSibling)
		if (!pages && this.hasAttribute('for')) {
			var id = this.getAttribute('for')
			var target = document.querySelector(`#${id}`)
			if (target)
				pages = this.assurePagesElement(target)
		}
		if (!pages) return
		whenReady(pages, e => {
			//console.log('tabs ready')
			pages.linkToOtherSelectable(this)
			//pages.linkToTabs(this)
		})
	}

	setupCentered() {
		var width = this.firstElementChild.offsetWidth
		this.$.tabs.style.paddingLeft = `calc(50% - ${width/2}px)`
		this.on('selected', () => {
			var offset = this.activeTab.offsetLeft - this.firstElementChild.offsetLeft
			//console.log(offset)
			this.$.tabs.style.transition = `transform 0.2s`
			this.$.tabs.style.transform = `translate(-${offset}px)`
		})
	}

	setupToolbar() {
		if (this.parentElement.localName === 'flexus-toolbar')
			this.toolbar = this.parentElement
		else if (this.parentElement.parentElement.localName === 'flexus-toolbar')
			this.toolbar = this.parentElement.parentElement

		if (this.toolbar) {
			var toolbarTitle = this.toolbar.querySelector('h1,h2,h3')
			if (toolbarTitle && !toolbarTitle.textContent.trim()) {
				this.toolbarTitle = toolbarTitle
				this.canUpdateTitle = true
			}
			if (this.toolbar.hasAttribute('tinted')) {
				this.canUpdateBackground = true
			}
		}
	}

	updateToolbar(direction) {
		console.log('updateToolbar')

		var tab = this.children[this.selected]
		// tell toolbar where to start the animation from
		// - either the click event and its position, or the target tab element
		var toolbar = this.toolbar
		
		if (this.canUpdateTitle) {
			var title = tab.title || tab.textContent
			if (direction === undefined) {
				this.toolbarTitle.textContent = title
			} else {
				var distance = direction === 'left' ? -16 : 16
				animation
					.swapContent(this.toolbarTitle, distance)
					.then(() => this.toolbarTitle.textContent = title)
			}
		}

		if (this.canUpdateBackground) {
			switch (toolbar.bgTransition) {
				case 'origin':
					toolbar.bgTransitionSource = tab
					break
				case 'edge':
					toolbar.bgTransitionSource = direction
					break
				//case 'position':
				default:
					toolbar.bgTransitionSource = this.lastTransitionSource
					break
			}
			this.lastTransitionSource = undefined
			var tabPrimary = tab.getAttribute('primary')
			var tabAccent = tab.getAttribute('accent')
			
			if (tabPrimary)
				toolbar.setAttribute('primary', tabPrimary)
			else
				toolbar.removeAttribute('primary')
			if (tabAccent)
				toolbar.setAttribute('accent', tabAccent)
			else
				toolbar.removeAttribute('accent')
		}
	}

	selectedChanged(newIndex, oldIndex) {
		// TODO? add [hidden] to all non selected pages
		this.render()
		var direction = oldIndex > newIndex ? 'left' : 'right'
		this.updateToolbar(direction)
	}

	@on('keyup')
	onKeyup(data, e) {
		//console.log('keyup tabs', e)
		var newIndex
		if (e.keyCode === 37) {
			// left arrow
			e.preventDefault()
			//console.log('left', this.selected, '->', this.selected - 1)
			newIndex = this.selected - 1
		} else if (e.keyCode === 39) {
			// right arrow
			e.preventDefault()
			newIndex = this.selected + 1
			//console.log('right', this.selected, '->', this.selected + 1)
		}
		if (newIndex !== undefined) {
			var children = this.children
			var target = children[newIndex]
			if (target && !isNodeAvailable(target))
				newIndex = pickClosest(children, target, newIndex, this.selected)
			// save tab element as an animation origin for toolbar background transition
			this.lastTransitionSource = this.children[newIndex]
			//console.log('onKeyup set', newIndex)
			this.selected = newIndex
		}
		/*
		if (this.autoselect) {
		  this._scheduleActivation(this.focusedItem, this.autoselectDelay);
		}
		*/
	}

	@on('click')
	onClick(data, e) {
		e.preventDefault()
		// save event as an animation origin for toolbar background transition
		this.lastTransitionSource = e
		var index = Array.from(this.children).indexOf(e.target)
		//console.log('onClick', index)
		if (index === -1) return
		//console.log('setting selected to', index)
		this.selected = index
	}

	@autobind render() {
		if (this.activeTab === undefined) return

		if (this.centered) {
			var offset = this.activeTab.offsetLeft - this.firstElementChild.offsetLeft
			//console.log(offset)
			offset += this.activeTab.offsetWidth / 2
			offset = Math.round(offset)
			this.$.tabs.style.transform = `translate(-${offset}px)`
		}


		var scaleX = this.activeTab.offsetWidth / this.$.tabs.offsetWidth
		var translateX = this.activeTab.offsetLeft
		this.$.bar.style.transform = `translate3d(${translateX}px, 0, 0) scaleX(${scaleX})`
	}

	@on(document, 'formfactor-update')
	formfactorUpdate() {
		this.$.tabs.style.transition = 'none'
		this.render()
		this.$.tabs.offsetLeft
		this.$.tabs.style.transition = ''
	}

	focusTabs(index) {
	}

}






