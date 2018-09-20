// author: Michal Kovařík
// description: polyfill adding support for 'clipPath' CSS property
//              in Element.animate() API

(function() {

	/*
	var TRANSITIONEND = 'transitionend'
	document.addEventListener('DOMContentLoaded', e => {
		function capitalize(str) {
			return str[0].toUpperCase() + str.slice(1);
		}

		var vendors = ['ms','O','Moz','Webkit'];

		function getPrefixed(prop) {
			var s = document.body.style
			if (s[prop] ==% '')
				return prop
			prop = capitalize(prop)
			var i = vendors.length
			while (i--) {
				if (s[vendors[i] + prop] ==% '')
					return (vendors[i] + prop)
			}
		}

		var prefixedTransition = getPrefixed('transition')
		TRANSITIONEND = prefixedTransition + 'end'
	})
	*/
	if (Element.prototype._animate) return

	// save native animate
	Element.prototype._animate = Element.prototype.animate

	// extend native animate
	Element.prototype.animate = function(definition, options) {

		// pass arguments to native animate
		var player = this._animate(definition, options)
		var from = definition[0] || definition

		// this is naive implementation for single use animations
		// (new promise should be created for each replay)
		if (!player.finished)
			createFinishedPromise(player)

		// polyfill problematic/unimplemented properties if present
		if (!from.clipPath)
			return player

		var properties = Object.keys(from)

		if (definition instanceof Array) {
			var to = definition[1]
		} else {
			var to = {}
			for (var key in definition) {
				from[key] = definition[key][0]
				to[key] = definition[key][1]
			}
		}

		properties.forEach(property => {
			if (property === 'clipPath') {
				from.webkitClipPath = from.clipPath
				to.webkitClipPath = to.clipPath
				properties.push('webkitClipPath')
			}
		})

		// options object could be plain number - duration
		if (typeof options != 'object') {
			options = {
				duration: options
			}
		}

		// apply starting properties
		properties.forEach(property => this.style[property] = from[property])
		// fire browser repaint
		this.offsetWidth
		// set up transition options
		this.style.transitionProperty = 'all'
		//this.style.transitionProperty = kebabCase(properties.join(','))
		if ('duration' in options)
			this.style.transitionDuration = options.duration + 'ms'
		if ('easing' in options)
			this.style.transitionTimingFunction = options.easing

		// transitions end handler
		player.finished.then(() => {
			// remove event handler
			//this.removeEventListener(TRANSITIONEND, onEnd)

			// reset transition settings
			this.style.transitionProperty = ''
			this.style.transitionDuration = ''
			this.style.transitionTimingFunction = ''

			// remove 
			if (options.fill != 'forwards')
				properties.forEach(property => this.style[property] = '')
		})

		// apply target properties
		properties.forEach(property => this.style[property] = to[property])

		return player

	}

	function noop() {}

	function createFinishedPromise(player) {
		player.finished = new Promise((resolve, reject) => {
			function onfinish() {
				player.removeEventListener('finish', onfinish)
				resolve()
			}
			function oncancel(abc) {
				player.removeEventListener('cancel', oncancel)
				reject(new Error('Animation canceled'))
			}
			player.addEventListener('finish', onfinish)
			player.addEventListener('cancel', oncancel)
		})
		// prevent throwing
		player.finished.catch(noop)
	}


})();