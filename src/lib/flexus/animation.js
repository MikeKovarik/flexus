import {traverse} from './utils'


function pythagorean(a, b) {
	return Math.sqrt(a*a + b*b)
}

function durationByDistance(distance) {
	// 200 + 13x^0.5
	//return 200 + 12 * Math.sqrt(distance)
	return 100 + 11 * Math.sqrt(distance) || 0
}

function eventPositionInContainer(e, container) {
	var containerBbox = container.getBoundingClientRect()
	var x = e.x - containerBbox.left
	var y = e.y - containerBbox.top
	var width = containerBbox.width
	var height = containerBbox.height
	//console.log(x, y, width, height)
	if (x > width)  x = width
	if (y > height) y = height
	//console.log(x, y, width, height)
	return {x, y, width, height}
}
function nodePositionInContainer(node, container) {
	var nodeBbox = node.getBoundingClientRect()
	var containerBbox = container.getBoundingClientRect()
	var x = nodeBbox.left - containerBbox.left + (nodeBbox.width / 2)
	var y = nodeBbox.top - containerBbox.top + (nodeBbox.height / 2)
	var width = containerBbox.width
	var height = containerBbox.height
	if (x > width)  x = width
	if (y > height) y = height
	return {x, y, width, height}
}

export var animation = {

	durationByDistance,


	circle: {

		_calculate(element, from) {
			//var x = e.layerX
			//var y = e.layerY
			var position
			if (typeof from === 'string') {
				position = from
				var x = 0
				var y = 0
				var width = element.offsetWidth
				var height = element.offsetHeight
			} else if (from instanceof Element) {
				var {x, y, width, height} = nodePositionInContainer(from, element)
				position = `${x}px ${y}px`
			} else if (from instanceof Event) {
				var {x, y, width, height} = eventPositionInContainer(from, element)
				position = `${x}px ${y}px`
			}
			var a = (x > width / 2)  ? x : width - x
			var b = (y > height / 2) ? y : height - y
			// distance to the furthest corner
			var distance = pythagorean(a, b)
			return {position, distance}
		},

		_setup(element, from, duration) {
			if (from) {
				var {position, distance} = this._calculate(element, from)
			} else {
				var position = 'center'
				var distance = pythagorean(element.offsetWidth, element.offsetHeight)
			}
			if (!duration)
				duration = durationByDistance(distance)
			return {position, distance, duration}
		},

		show(element, from, duration) {
			//console.log('from', from)
			var {position, distance, duration} = this._setup(element, from, duration)
			//console.log('position', position)
			//console.log('distance', distance)
			//console.log('duration', duration)
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
			element.style.visibility = ''
			var finished = element.animate([
				{clipPath: `circle(0px at ${position})`},
				{clipPath: `circle(${distance}px at ${position})`}
			], {
				duration,
				easing: 'ease-in-out'
			}).finished
			return finished
		},

		hide(element, from, duration) {
			var {position, distance, duration} = this._setup(element, from, duration)
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
			var finished = element.animate([
				{clipPath: `circle(${distance}px at ${position})`},
				{clipPath: `circle(0px at ${position})`}
			], {
				duration,
				easing: 'ease-in-out'
			}).finished
			finished.then(() => element.style.visibility = 'hidden')
			return finished
		},

	},


	fade: {

		in(element, duration = 140) {
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
				element.style.visibility = ''
			return element.animate([
				{opacity: 0},
				{opacity: 1}
			], duration).finished
		},

		out(element, duration = 140) {
			var finished = element.animate([
				{opacity: 1},
				{opacity: 0}
			], duration).finished
			finished.then(() => element.style.visibility = 'hidden')
			return finished
		},
/*
		outAndKeepDisplayed(element) {
			return new Promise(resolve => {
				element.animate([
					{opacity: 1},
					{opacity: 0}
				], 100).onfinish = () => {
					element.style.opacity = 1 // to be removed when animate-polyfill fixed TODO
					//element.style.display = 'none'
					resolve()
				}	
			})
		}
*/
	},


	slideIn: {

		left(element) {
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
			element.style.visibility = ''
			var animation = element.animate([
				{opacity: 0, transform: 'translate3d(10%,0,0)'},
				{opacity: 1, transform: 'translate3d(0%,0,0)'}
			], {
				duration: 100, // ???
				easing: 'ease-out' // ???
			})
			return animation.finished
		},

		right(element) {
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
			element.style.visibility = ''
			var animation = element.animate([
				{opacity: 0, transform: 'translate3d(-10%,0,0)'},
				{opacity: 1, transform: 'translate3d(0%,0,0)'}
			], {
				duration: 100, // ???
				easing: 'ease-out' // ???
			})
			return animation.finished
		}

	},


	slideOut: {

		left(element) {
			var animation = element.animate([
				{opacity: 1, transform: 'translate3d(0%,0,0)'},
				{opacity: 0, transform: 'translate3d(-10%,0,0)'}
			], {
				duration: 100, // ???
				easing: 'ease-out' // ???
			})
			animation.finished.then(() => element.style.visibility = 'hidden')
			return animation.finished
		},

		right(element) {
			var animation = element.animate([
				{opacity: 1, transform: 'translate3d(0%,0,0)'},
				{opacity: 0, transform: 'translate3d(10%,0,0)'}
			], {
				duration: 100, // ???
				easing: 'ease-out' // ???
			})
			animation.finished.then(() => element.style.visibility = 'hidden')
			return animation.finished
		}

	},

	rotateIcon: {

		show(element) {
			_.forEach(element.children, element => {
				if (element.localName == 'button' && element.hasAttribute('icon')) {
					anim(element)
				}
			})
			function anim(element) {
				element.animate([
					{transform: 'rotate(-180deg)'},
					{transform: 'rotate(0deg)'}
				], {
					duration: 300,
					easing: 'ease-in-out'
				})
			}
		},

		hide(element) {
			_.forEach(element.children, element => {
				if (element.localName == 'button' && element.hasAttribute('icon')) {
					anim(element)
				}
			})
			function anim(element) {
				element.animate([
					{transform: 'rotate(0deg)'},
					{transform: 'rotate(180deg)'}
				], {
					duration: 300,
					easing: 'ease-in-out'
				})
			}
		}

	},

	swapContent(element, distance = 16, duration = 240) {
		var halfDuration = duration / 2
		var visibleState = {
			opacity: 1,
			transform: `translate3d(0px, 0, 0)`
		}
		var slideOutState = {
			opacity: 0,
			transform: `translate3d(${-distance}px, 0, 0)`
		}
		var slideInState = {
			opacity: 0,
			transform: `translate3d(${distance}px, 0, 0)`
		}
		element.style.transitionDelay = duration + 'ms'
		return new Promise(resolve => {
			element
				.animate([visibleState, slideOutState], halfDuration)
				.onfinish = () => {
					resolve()
					element.style.transitionDelay = ''
					element.style.transition = 'none'
					element
						.animate([slideInState, visibleState], halfDuration)
						.onfinish = () => {
							element.style.transition = ''
						}
				}
		})
	},


	slideX: {
		show(element, from, to, duration, easing) {
			element.style.display = ''
			element.animate([{
				transform: `translate3d(${from}, 0px, 0)`
			}, {
				transform: `translate3d(${to}, 0px, 0)`
			}], duration)
		},
		hide(element, from, to, duration, easing) {
			element.animate([{
				transform: `translate3d(${from}, 0px, 0)`
			}, {
				transform: `translate3d(${to}, 0px, 0)`
			}], duration).onfinish = e => {
				element.style.display = 'none'
			}
		}
	},



	// experimental
	transition(element, values, keep, duration) {
		var from = {}
		var to = {}
		for (let key in values) {
			from[key] = values[key][0]
			to[key] = values[key][1]
		}
		if (typeof duration !== 'number') {
			if (duration === undefined)
				var prop = Object.keys(values)[0]
			else
				var prop = duration
			var distance = Math.abs(parseInt(from[prop]) - parseInt(to[prop]))
			duration = durationByDistance(distance)
		}
		var player = element.animate([from, to], {
			duration,
			easing: 'ease-in-out'
		})
		if (keep)
			player.finished.then(() => {
				for (let key in to) {
					element.style[key] = to[key]
				}
			})
		return player.finished
	}

}
