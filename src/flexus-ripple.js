(function() {

	console.debug('loaded FLEXUS.RIPPLE')
	console.debug('Flexus.ripple todo: mousedown+hold first wave and then second wave on release (currently only one wave is rendered on mouseup)')
	console.debug('Flexus.ripple todo: change from click events to mousedown and mouseup (or rather pointer events)')
	console.debug('Flexus.ripple todo: turn ripple into custom flexus element through shadowmaster (but it is needed to handle #remove() from dom and reatacching properly = not applying custom element constructor over on the element again)')

	if (!Flexus.platform.material) return

	/*document.addEventListener('mousedown', e => {
		// todo
	})*/

	function onClick(e) {
		var node = e.target
		if (node.localName == 'button' && !node.hasAttribute('noripple')) {
			onValidClick(e, node)
			return
		}
		// note: use Flexus.traverse ?
		while (node !== null) {
			if (node.hasAttribute('clickable') || node.localName == 'a' && node.hasAttribute('fx-item')) {
				onValidClick(e, node)
				return
			}
			node = node.parentElement
		}
	}

	document.addEventListener('click', onClick)

	/*document.addEventListener('pointerdown', onClick)
	document.addEventListener('pointerup', e => {
		console.log('pointerup')
	})*/

	var recycledRipples = []
	var defaultDuration = 800

	function onValidClick(e, target) {
		if (e.target == target) {
			var x = e.offsetX
			var y = e.offsetY
		} else {
			var bbox = target.getBoundingClientRect()
			var x = e.x - bbox.left
			var y = e.y - bbox.top
		}
		(recycledRipples.shift() || new Ripple).play(target, x, y)
	}

	class Ripple {

		constructor(element, options) {
			this.rippleElement = document.createElement('flexus-ripple')
			this.onfinish = this.onfinish.bind(this)
			this.setupPlayer()
		}

		setupPlayer() {
			this.player = this.rippleElement.animate([{
				display: 'block',
				opacity: 'var(--ripple-opacity, 0.4)',
				transform: 'translate3d(-50%, -50%, 0) scale(0)'
			}, {
				display: 'none',
				opacity: 0,
				transform: 'translate3d(-50%, -50%, 0) scale(1)'
			}], {
				duration: defaultDuration,
				easing: 'ease-in'
			})
			this.player.onfinish = this.onfinish
			this.player.pause()
		}

		play(element, x, y) {
			// setup element and position
			this.element = element
			this.element.appendChild(this.rippleElement)
			this.reposition(x, y)
			// reset animation player
			this.player.pause()
			//this.player.duration = defaultDuration
			this.player.currentTime = 0
			this.player.play()
		}

		onfinish() {
			if (this.callback !== undefined) this.callback.call(this)
			this.rippleElement.remove()
			recycledRipples.push(this)
		}

		reposition(x, y) {
			this.x = x
			this.y = y

			var elementWidth = this.element.offsetWidth
			var elementHeight = this.element.offsetHeight

			if (this.centered) {
				// x a y je uprostred
				this.x = elementWidth / 2
				this.y = elementHeight / 2
			} else if (this.recentering) {
				// zkoriguje x a y smerem na stred
				var halfWidth = elementWidth / 2
				var halfHeight = elementHeight / 2
				this.x = (this.x - halfWidth) / 2 + halfWidth
				this.y = (this.y - halfHeight) / 2 + halfHeight
			}

			var longWidth = Math.max(this.x, elementWidth - this.x)
			var longHeight = Math.max(this.y, elementHeight - this.y)

			this.diameter = Math.sqrt((longWidth * longWidth) + (longHeight * longHeight))
			if (this.duration === undefined) {
				this.duration = 300
				// TODO - duration jeste ovlivnovat podle this.diameter (na mobilu je to pomale, na tabletu moc rychle)
				if (this.spill) {
				} else {
					this.duration = 400
				}
			}

			if (this.spill) {
				this.diameter *= 1.4
			} else {
				this.diameter *= 2
				this.element.style.overflow = 'hidden'
			}
			this.player.playbackRate = defaultDuration / this.duration

			this.rippleElement.style.width = this.rippleElement.style.height = this.diameter + 'px'
			this.rippleElement.style.left = this.x + 'px'
			this.rippleElement.style.top = this.y + 'px'
		}

	}

	var cssElement = document.createElement('style')
	cssElement.type = 'text/css'
	var rippleCss = `
	flexus-ripple {
		display: block;
		pointer-events: none;
		/*z-index: -1;*/
		position: absolute;
		border-radius: 50%;
		background-color: currentColor;
		background-color: var(--color-accent, currentColor);
		opacity: 0;
		transform: translate3d(-50%, -50%, 0) scale(1);
	}
	`
	if (cssElement.styleSheet)
		cssElement.styleSheet.cssText = rippleCss
	else
		cssElement.appendChild(document.createTextNode(rippleCss))

	document.head.appendChild(cssElement)

})()