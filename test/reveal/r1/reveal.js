var bodyStyles = window.getComputedStyle(document.body)
var revealRadius = parseInt(bodyStyles.getPropertyValue('--reveal-outline-radius'))

var currentEvent
var reveals = new Set
var renderQueue = new Set

var pageX
var pageY

function debounce(callback, millis = 50) {
	var timeout
	return arg => {
		clearTimeout(timeout)
		timeout = setTimeout(() => callback(arg), millis)
	}
}

function throttleRaf(callback) {
	var raf
	var ticking = false
	return arg => {
		if (ticking) return
		ticking = true
		raf = requestAnimationFrame(() => {
			callback(arg)
			ticking = false
		})
	}
}

var onScrol = debounce(e => {
	reveals.forEach(reveal => reveal.updateScrollPosition(e.target))
})

var onMouseMove = throttleRaf(e => {
	pageX = e.pageX
	pageY = e.pageY
	reveals.forEach(reveal => reveal.renderSetup())
	renderQueue.forEach(cb => cb())
})

window.addEventListener('mousemove', onMouseMove)

window.addEventListener('scroll', onScrol, {
	capture: true,
	passive: true,
})


class UwpReveal {

	constructor(element) {

		this.element = element
		reveals.add(this)

		this.scrollTop = 0
		this.scrollLeft = 0

		this.top = 0
		this.right = 0
		this.bottom = 0
		this.left = 0

		this.x = 0
		this.y = 0

		this.showInnerReveal = true
		this.wasReachable = false
		this.isReachable = false
		this.isClicked = false

		this.renderOutline = this.renderOutline.bind(this)
		this.destroyOutline = this.destroyOutline.bind(this)
		this.renderInner = this.renderInner.bind(this)
		this.destroyInner = this.destroyInner.bind(this)
		this.onMouseEnter = this.onMouseEnter.bind(this)
		this.onMouseLeave = this.onMouseLeave.bind(this)
		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseUp = this.onMouseUp.bind(this)
		
		// cache initial sizing
		this.cacheElementSizing()

		// create elements onto which is the reveal rendered
		this.revealOutline = document.createElement('div')
		this.revealOutline.className = 'reveal outline'
		element.appendChild(this.revealOutline)
		// inner reveal requires additional element
		if (this.showInnerReveal) {
			this.revealInner = document.createElement('div')
			this.revealInner.className = 'reveal inner'
			element.appendChild(this.revealInner)
		}

		// additional events has to be listened to ensure inner reveal looks and behaves correctly
		if (this.showInnerReveal) {
			element.addEventListener('mouseenter', this.onMouseEnter)
			element.addEventListener('mouseleave', this.onMouseLeave)
			element.addEventListener('mousedown', this.onMouseDown)
			element.addEventListener('mouseup', this.onMouseUp)
		}

	}

	// Starts rendering inner reveal when mouse enters element.
	onMouseEnter() {
		// Refresh sizing while hovering over the element.
		this.cacheElementSizing()
		renderQueue.add(this.renderInner)
	}
	// Removes inner reveal when mouse leaves element.
	onMouseLeave() {
		renderQueue.delete(this.renderInner)
		renderQueue.add(this.destroyInner)
	}
	// Immediately renders inner reveal in clicked look.
	onMouseDown(event) {
		currentEvent = event
		this.isClicked = true
		this.render()
	}
	// Immediately releases clicked look of inner reveal.
	onMouseUp(event) {
		currentEvent = event
		this.isClicked = false
		this.render()
	}

	// Immediate local rendering.
	render() {
		this.calculateMousePosition()
		this.renderOutline()
		if (this.showInnerReveal)
			this.renderInner()
	}
	// Setup for async rendering handled globally by mousemove event listener.
	renderSetup() {
		this.calculateMousePosition()
		this.isReachable = this.isWithinReach()
		if (this.isReachable && !this.wasReachable) {
			renderQueue.add(this.renderOutline)
		} else if (!this.isReachable && this.wasReachable) {
			renderQueue.delete(this.renderOutline)
			renderQueue.add(this.destroyOutline)
		}
		this.wasReachable = this.isReachable
	}

	// Renders inner reveal in either clicked or hover look.
	renderInner() {
		if (this.isClicked)
			this.renderInnerClicked()
		else
			this.renderInnerHover()
	}
	// Renders inner reveal as a ring with a hole inside, indicating a mouse click.
	renderInnerClicked() {
		this.revealInner.style.background = `radial-gradient(
			circle var(--reveal-inner-radius-click) at ${this.x}px ${this.y}px,
			rgba(var(--foreground-rgb), 0) 20%,
			rgba(var(--foreground-rgb), var(--reveal-inner-opacity-click)) 60%,
			rgba(var(--foreground-rgb), 0) 100%
		)`
	}
	// Renders inner reveal as a circle fading into edges.
	renderInnerHover() {
		this.revealInner.style.background = `radial-gradient(
			circle var(--reveal-inner-radius) at ${this.x}px ${this.y}px,
			rgba(var(--foreground-rgb), var(--reveal-inner-opacity)),
			rgba(var(--foreground-rgb), 0)
		)`
	}
	// Renders outline reveal around the element.
	renderOutline() {
		this.revealOutline.style.webkitMaskImage = `radial-gradient(
			circle var(--reveal-outline-radius) at ${this.x}px ${this.y}px,
			#FFF 20%,
			transparent 100%
		)`
		/*this.revealOutline.style.background = `radial-gradient(
			circle var(--reveal-outline-radius) at ${this.x}px ${this.y}px,
			rgba(var(--foreground-rgb), var(--reveal-outline-opacity)) 20%,
			rgba(var(--foreground-rgb), 0) 100%
		)`*/
	}

	// Renders empty background into outline element and removes itself from render queue.
	// note: this method should not be called but invoked through renderQueue
	destroyOutline() {
		this.revealOutline.style.background = ''
		renderQueue.delete(this.destroyOutline)
	}
	// Renders empty background into inner element and removes itself from render queue.
	// note: this method should not be called but invoked through renderQueue
	destroyInner() {
		this.revealInner.style.background = ''
		renderQueue.delete(this.destroyInner)
	}

	isWithinReach() {
		if (pageX < this.left - revealRadius) return false
		if (pageX > this.right + revealRadius) return false
		if (pageY < this.top - revealRadius) return false
		if (pageY > this.bottom + revealRadius) return false
		return true
	}

	updateScrollPosition(relativeTo) {
		if (relativeTo.contains(this.element))
			this.cacheScrollOffset(relativeTo)
	}

	cacheScrollOffset(relativeTo) {
		this.scrollTop = relativeTo.scrollTop
		this.scrollLeft = relativeTo.scrollLeft
		this.calculateBounds()
	}
	cacheElementSizing() {
		this._top    = this.element.offsetTop
		this._left   = this.element.offsetLeft
		this._right  = this.left + this.element.offsetWidth
		this._bottom = this.top  + this.element.offsetHeight
		this.calculateBounds()
	}
	calculateBounds() {
		this.top    = this._top    - this.scrollTop
		this.left   = this._left   - this.scrollLeft
		this.right  = this._right  - this.scrollLeft
		this.bottom = this._bottom - this.scrollTop
	}
	calculateMousePosition() {
		this.x = pageX - this.left
		this.y = pageY - this.top
	}

}




var hoverables = document.querySelectorAll('button, [hoverable]')

Array.from(hoverables).forEach(element => new UwpReveal(element))