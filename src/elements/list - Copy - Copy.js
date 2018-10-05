import {on, autobind, template, css, reflect, customElement, ganymedeElement, emit, observe} from 'ganymede'
import {platform, animation, traverseValue, clamp} from 'flexus'
import {matchFormFactorDef, rafThrottle} from 'flexus'



var removeDuration = 120
var fadeOutDuration = 120
var fadeInDuration = 120
var reflowDuration = 80
var addDuration = 120


var timeModifier = 20

const noop = () => {}

const VERTICAL = 1

function removeFromArray(array, item) {
	var index = array.indexOf(item)
	return array.splice(index, 1)
}

var curve = 'cubic-bezier(0.1, 0.9, 0.2, 1)'

function createAddAnimation(node, styles, options) {
	resetState(node, styles)
	var animation = node.animate(styles, options)
	animation.oncancel = () => resetState(node, styles)
	animation.onfinish = () => setFinalState(node, styles)
	// the promise would keep throwing errors on cancelation
	animation.finished.catch(noop)
	return animation
	/*setInitialState(node, styles)
	var animation = node.animate(styles, options)
	animation.oncancel = () => setInitialState(node, styles)
	animation.onfinish = () => setFinalState(node, styles)
	// the promise would keep throwing errors on cancelation
	animation.finished.catch(noop)
	return animation*/
}

function setInitialState(node, styles) {
	Object.keys(styles).forEach(key => {
		node.style[key] = styles[key][0]
	})
}
function setFinalState(node, styles) {
	Object.keys(styles).forEach(key => {
		node.style[key] = styles[key][1]
	})
}
function resetState(node, styles) {
	Object.keys(styles).forEach(key => {
		node.style[key] = ''
	})
}

@customElement
class FlexusList extends ganymedeElement() {

	orientation = VERTICAL

	ready() {
		this.updateVirtualList()
		var observer = new MutationObserver(this.onMutation)
		observer.observe(this, {childList: true})
	}
/*
	@autobind onMutation(mutations) {
		console.log('onMutation', mutations.length, mutations)
		mutations.forEach(mutation => {
			if (mutation.removedNodes.length) {
				console.log('MUTATION removed', mutation.removedNodes)
				var node = mutation.removedNodes[0]
				if (node.isBeingRemoved === undefined)
					node.isBeingRemoved = true
			}
			if (mutation.addedNodes.length) {
				console.log('MUTATION added', mutation.addedNodes)
				var node = mutation.addedNodes[0]
				if (!node.isBeingRemoved)
					node.isBeingAdded = true
				console.log('node.isBeingAdded', node.isBeingAdded)
			}
		})
		this.theActualReflowPhase()
	}
*/

	@autobind onMutation(mutations) {
		console.log('onMutation', mutations.length, mutations)

		var added   = this.postponedAdditions || []
		var removed = this.postponedRemovals  || []
		var moved   = this.postponedMoves     || []

		mutations.forEach(mutation => {
			if (mutation.removedNodes.length) {
				var node = mutation.removedNodes[0]
				// note: graceful removal is not differentiated at this point because we need
				// to know if this node is also added in the same tick (both removed and added mutations
				// in the same observations - which would mean the item was just moved and not removed)
				if (!node.wasRemovedForGood)
					removed.push(node)
			}
			if (mutation.addedNodes.length) {
				var node = mutation.addedNodes[0]
				if (node.isBeingReattachedForRemoval) {
					// The node was removed from DOM in last tick (forcibly, out of flexus-list lifecycle)
					// the removal was halted by reattaching the node back to DOM to be faded it out nicely.
					// That caused this mutation which we'll ignore since it is not actually a new item.
					node.isBeingReattachedForRemoval = false
					node.isBeingRemovedGracefuly = true
					removed.push(node)
				} else if (removed.includes(node)) {
					// The Node was both removed and added in the same tick (both mutations occured
					// in the same observation) which means it was repositioned withing DOM - moved.
					// We remove the node from removed array since it's not being faded out but retranslated
					removeFromArray(removed, node)
					moved.push(node)
				} else {
					// This is a new item (new element) freshly added to the list and needs to be faded in
					added.push(node)
				}
			}
		})
		console.log('added', added, 'removed', removed, 'moved', moved)

		var postponeAnimations = false

		// Now that nodes that only mode (were removed and then added again) are out of the way
		// we can handle removals and especially those that are ungraceful (directly removed from DOM)
		removed.forEach(node => {
			if (node.isBeingRemovedGracefuly)
				return
			postponeAnimations = true
			var lastIndex = this.items.indexOf(node)
			console.log('removed index', lastIndex)
			if (lastIndex > 0)
				this.items[lastIndex - 1].after(node)
			else
				this.prepend(node)
			removeFromArray(removed, node)
			node.isBeingReattachedForRemoval = true
		})

		console.log('postponeAnimations', postponeAnimations)
		if (postponeAnimations) {
			this.postponedAdditions = added
			this.postponedRemovals  = removed
			this.postponedMoves     = moved
		} else {
			this.executeAnimations(added, removed, moved)
			this.postponedAdditions = undefined
			this.postponedRemovals  = undefined
			this.postponedMoves     = undefined
		}
	}

	executeAnimations(added, removed, moved) {
		if (added.length === 0 && removed.length === 0 && moved.length === 0)
			return

		console.log('-------------------------------------------------------')
		console.log('- added', added)
		console.log('- removed', removed)
		console.log('- moved', moved)


		this.resetFlowCalculations()

		var oldItems = this.items
		var newItems = Array.from(this.children)

		// if there's more added items than removed (or vice versa)
		// all following items has to be shifted as well, whereas
		// equal ammounts allow for local edits (delimeted by min and max)
		var reflowUntilEnd = added.length !== removed.length
		// index of first modified item
		var min = newItems.length
		// index of last modified item
		var max = reflowUntilEnd ? newItems.length : 0

		var removalPromise = removed.map(node => {
			node.isBeingRemoved = true
			var index = oldItems.indexOf(node)
			min = Math.min(min, index)
			max = Math.max(max, index)
			console.log('* removed', node, index, node.textContent.trim())
			var animation = node.animate({
				opacity: [1, 0]
			}, {
				duration: 120 * timeModifier,
				timing: curve
			})
			animation.onfinish = () => {
				node.isBeingRemoved = undefined
				node.wasRemovedForGood = true
				node.remove()
				this.killTransitionAnimations()
			}
			return animation.finished
		})
		var additionPromise = added.map(node => {
			node.isBeingAdded = true
			var index = newItems.indexOf(node)
			min = Math.min(min, index)
			max = Math.max(max, index)
			var animation = node.animate({
				opacity: [0, 1]
			}, {
				duration: 120 * timeModifier,
				timing: curve
			})
			animation.onfinish = () => {
				node.isBeingAdded = undefined
				this.killTransitionAnimations()
			}
			return animation.finished
		})
		var movePromise = moved.map(node => {
			var newIndex = newItems.indexOf(node)
			var oldIndex = oldItems.indexOf(node)
			console.log('item moved from', oldIndex, 'to', newIndex)
			min = Math.min(min, newIndex, oldIndex)
			max = Math.max(max, newIndex, oldIndex)
			/*var animation = node.animate({
				opacity: [0, 1]
			}, {
				duration: 120 * timeModifier,
				timing: curve
			})
			return animation.finished*/
			return Promise.resolve()
		})

		console.log(min, max)

		if (min < max) {
			console.log('reflow items', min, 'through', max)
			console.log(oldItems, oldItems.slice(min, max + 1))
			console.log(newItems, newItems.slice(min, max + 1))
			//this.affected = newItems.slice(min, max + 1)
			this.affected = newItems.slice(min)
			this.reflowPhase()
		} else {
			console.log('theres nothing to reflow')
		}

		this.animationsDone = Promise.all([removalPromise, additionPromise])
		this.animationsDone.then(() => this.updateVirtualList())
	}

	killTransitionAnimations() {
		this.affected.forEach(node => {
			var animation = this.animations.get(node)
			if (!animation)
				return
			if (animation.playState === 'running')
				animation.cancel()
			else
				animation.oncancel()
		})
	}

	reflowPhase() {
		console.log('reflowPhase', this.affected)
		this.xOffset = 0
		this.yOffset = 0
		this.followingMode = 'remove'
		this.affected.forEach(node => {
			console.log(node, this.yOffset)
			this.reflowItem(node, this.xOffset, this.yOffset)
			if (node.isBeingAdded) {
				//this.moveDelay = 60 * timeModifier
				//this.moveDelay = 0
				this.increaseFlowOffset(node, -1)
				this.followingMode = 'add'
			}
			if (node.isBeingRemoved) {
				//this.moveDelay = 60 * timeModifier
				this.increaseFlowOffset(node, -1)
				this.followingMode = 'remove'
			}
			//this.moveDelay += 60
		})
	}

	increaseFlowOffset(node, modifier = 1) {
		if (this.orientation === VERTICAL) {
			this.yOffset += node.offsetHeight * modifier
		} else {
			this.xOffset += node.offsetWidth * modifier
		}
	}

	animations = new Map

	reflowItem(node, xOffset, yOffset) {
		var animation = this.animations.get(node)
		if (animation)
			animation.cancel()
		if (this.followingMode === 'add')
			var styles = {transform: [`translate(${xOffset}px, ${yOffset}px)`, `translate(0px, 0px)`]}
		else
			var styles = {transform: [`translate(0px, 0px)`, `translate(${xOffset}px, ${yOffset}px)`]}
		//if (node.textContent.trim().toLowerCase() === 'fifth' || node.textContent.trim().toLowerCase() === 'sixth') {
		//	console.log('FUCK THIS SHIT, tohle ma fungovat jen pro move')
		//	styles = {transform: [`translate(0px, -40px)`, `translate(0px, -40px)`]}
		//}
		console.log('reflowItem', node, this.followingMode, '|', styles.transform[0], styles.transform[1])
		animation = createAddAnimation(node, styles, {
			delay: this.moveDelay,
			duration: 80 * timeModifier,
			timing: curve
		})
		this.animations.set(node, animation)
	}

	resetFlowCalculations() {
		this.addDelay = 0
		this.removeDelay = 0
		this.moveDelay = 0

		this.xOffset = 0
		this.yOffset = 0
	}

/*
	theActualReflowPhase() {
		this.addedNodes = 0
		this.removedNodes = 0
		this.movedNodes = 0

		this.resetFlowCalculations()

		this.updateVirtualList() // TODO
		this.compositeList = this.items.slice()

		this.compositeList.forEach(node => {
			var xInit = this.xOffset
			var yInit = this.yOffset
			//node.style.transform = `translate(${this.xOffset}px, ${this.yOffset}px)`
			if (node, node.isBeingAdded) {
				//this.isBeingAdded = undefined
				this.increaseFlowOffset(node, -1)
				//node.style.opacity = 0
			}
			if (node, node.isBeingRemoved) {
				//node.isBeingRemoved = undefined
				this.increaseFlowOffset(node, 1)
			}

			if (node, node.isBeingAdded) {
				createAddAnimation(node, {
					opacity: [0, 1]
				}, {
					delay: 60 * timeModifier,
					duration: 120 * timeModifier,
					timing: 'linear'
				}).finished.then(() => node.isBeingAdded = undefined)
			} else {
				createAddAnimation(node, {
					transform: [`translate(${xInit}px, ${yInit}px)`, `translate(0px, 0px)`]
				}, {
					delay: 0 * timeModifier,
					duration: 80 * timeModifier,
					timing: curve
				})
			}

			console.log(this.xOffset, this.yOffset, node, node.isBeingAdded, node.isBeingRemoved)
		})
	}

	removeItem(node) {
		node.isBeingRemovedGracefuly = true
		// TODO - this has to be async tie in with already runnign animations
		this.executeAnimations([], [node], [])
	}

	_addedItem(node) {
		console.log('added', node, node.textContent.trim())
		console.log(this.items)
		var oldItems = this.items
		this.items = Array.from(this.children)
		console.log(this.items)
	}

	_removeItem(node) {
		console.log(this.items)
		this.items = Array.from(this.children)
		console.log(this.items)

		// TODO - setTimeout and debounce all removes and adds
		//      - store old list with all removed items still present and new ones already added
		//      - each item has the state (added/removed) marked
		//      - iterate over each item and keep incrementing/decrementing offset (and animate affected if necessary)
		this.oldList

		this.resetFlowCalculations()

		var index = this.items.indexOf(node)
		var affected = this.items.slice(index + 1)

		this.moveDelay += 60
		if (this.orientation === VERTICAL) {
			this.yOffset = -node.offsetHeight
		} else {
			this.xOffset = -node.offsetWidth
		}

		this.recalculate(node, affected)
	}

	recalculate(node, affected) {
		var hasReflow = false

		if (affected.length)
			hasReflow = true

		//this.addDelay += 60

		node.style.opacity = 0
		var animation = node.animate([
			{opacity: 1},
			{opacity: 0},
		], {
			delay: this.removeDelay,
			duration: fadeOutDuration,
			timing: 'linear'
		})
		animation.onfinish = () => {
			node.remove()
			affected.forEach(affectedNode => {
				var animation = this.animations.get(affectedNode)
				if (animation.playState === 'running')
					animation.cancel()
				else
					animation.oncancel()
			})
		}

		if (hasReflow)
			this.reflowPhase(affected, this.xOffset, this.yOffset)
	}
*/
	updateVirtualList() {
		this.items = Array.from(this.children)
	}

}




/*

@customElement
class FlexusList extends ganymedeElement() {

	orientation = VERTICAL

	ready() {
		this.updateVirtualList()
		var observer = new MutationObserver(this.onMutation)
		observer.observe(this, {childList: true})
	}

	@autobind onMutation(mutations) {
		console.log('onMutation', mutations.length, mutations)
		//this.updateVirtualList()
		mutations.forEach(mutation => {
			if (mutation.removedNodes.length) {
				console.log('MUTATION removed', mutation.removedNodes)
				var node = mutation.removedNodes[0]
				if (!node.isBeingRemoved)
					this.removeItem(node, mutation)
			}
			if (mutation.addedNodes.length) {
				console.log('MUTATION added', mutation.addedNodes)
				var node = mutation.addedNodes[0]
				if (node.isBeingRemoved)
					this.removeItem(node)
				else
					this._addedItem(node)
			}
		})
	}

	removeItem(node, mutation) {
		console.log('removeItem', node, node.textContent.trim())
		node.isBeingRemoved = true
		if (mutation) {
			this._removeItemAbruptly()
		} else {
			this._removeItemNaturally()
		}
	}

	_removeItemAbruptly() {
		// removeItem has been called from mutation observer which
		// means the node was abrubtly removed by DOM api and not the list itself.
		// Node is therefore reattached for a moment to run fade-out animation on it
		var prev = mutation.previousSibling
		var next = mutation.nextSibling
		if (prev)
			prev.after(node)
		else
			next.before(node)
	}
	_removeItemNaturally() {
		this._removeItem(node)
	}

	startAnimations() {
	}

	_addedItem(node) {
		console.log('added', node, node.textContent.trim())
		console.log(this.items)
		var oldItems = this.items
		this.items = Array.from(this.children)
		console.log(this.items)
	}

	_removeItem(node) {
		console.log(this.items)
		this.items = Array.from(this.children)
		console.log(this.items)

		// TODO - setTimeout and debounce all removes and adds
		//      - store old list with all removed items still present and new ones already added
		//      - each item has the state (added/removed) marked
		//      - iterate over each item and keep incrementing/decrementing offset (and animate affected if necessary)
		this.oldList

		this.setupAnimations()

		var index = this.items.indexOf(node)
		var affected = this.items.slice(index + 1)

		this.moveDelay += 60
		if (this.orientation === VERTICAL) {
			this.yOffset = -node.offsetHeight
		} else {
			this.xOffset = -node.offsetWidth
		}

		this.recalculate(node, affected)
	}

	setupAnimations() {
		this.addDelay = 0
		this.removeDelay = 0
		this.moveDelay = 0

		this.xOffset = 0
		this.yOffset = 0
	}

	recalculate(node, affected) {
		var hasReflow = false

		if (affected.length)
			hasReflow = true

		//this.addDelay += 60

		node.style.opacity = 0
		var animation = node.animate([
			{opacity: 1},
			{opacity: 0},
		], {
			delay: this.removeDelay,
			duration: fadeOutDuration,
			timing: 'linear'
		})
		animation.onfinish = () => {
			node.remove()
			affected.forEach(affectedNode => {
				var animation = this.animations.get(affectedNode)
				if (animation.playState === 'running')
					animation.cancel()
				else
					animation.oncancel()
			})
		}

		if (hasReflow)
			this.reflowPhase(affected, this.xOffset, this.yOffset)
	}

	reflowPhase(affected, xOffset, yOffset) {
		affected.forEach(node => {
			this.reflowItem(node, xOffset, yOffset)
		})
	}

	animations = new Map

	reflowItem(node, xOffset, yOffset) {
		var animation = this.animations.get(node)
		if (animation)
			animation.cancel()
		animation = node.animate([
				{transform: `translate(0px, 0px)`},
				{transform: `translate(${xOffset}px, ${yOffset}px)`},
			], {
				delay: this.moveDelay,
				duration: reflowDuration,
				timing: 'cubic-bezier(0.1, 0.9, 0.2, 1)'
			})
		// using `onfinish` callback because it's faster than `finished.then()` promise ...
		animation.onfinish = () => {
			node.style.transform = `translate(${xOffset}px, ${yOffset}px)`
		}
		animation.oncancel = () => {
			node.style.transform = `translate(0px, 0px)`
		}
		// ... but the promise would keep throwing errors on cancelation
		animation.finished.catch(noop)
		this.animations.set(node, animation)
	}

	updateVirtualList() {
		this.items = Array.from(this.children)
	}

}

*/