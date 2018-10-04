import {_, template, css, reflect, on, customElement, ganymedeElement, autobind} from 'ganymede'
import {animation, platform, clamp, Breakpointable} from 'flexus'


var animationRuleLists = {
	text: ['fontSize', 'fontWeight', 'backgroundColor', 'color'],
	//image: ['backgroundColor', /*'width', 'height',*/ 'borderRadius'],
	image: [],
}

function showView(view) {
	view.removeAttribute('hidden')
}
function hideView(view) {
	view.setAttribute('hidden', '')
}

//@template(`
//	<slot></slot>
//	<pre id="state"></pre>
//`)
//@css(`
//#state {
//	position: absolute;
//	z-index: 999;
//	left: 5px;
//	bottom: 5px;
//	padding: 5px;
//	background-color: rgba(0,0,0,0.5)
//}
//`)

@customElement
class FlexusScene extends ganymedeElement(Breakpointable) {

	//@reflect vertical = PlatformBool

	@reflect selected = 'master'

	@reflect type = String
	//@reflect noOverlay = undefined
	@reflect dismissable = undefined

	transitionDuration = 300

	ready() {
	}

	ready() {
		this.master = this.querySelector(':scope > [master]')
		this.detail = this.querySelector(':scope > [detail]')
		if (!this.master) {
			var views = Array.from(this.querySelectorAll('flexus-view'))
			this.master = views[0]
			this.detail = views[1]
			this.master.setAttribute('master', '')
			this.detail.setAttribute('detail', '')
		}
		this.detailToolbar = this.detail.querySelector('flexus-toolbar')
		console.log(this.detail)
		console.log(this.detailToolbar)
/*
		if (platform.screensize === 's') {
			if (this.selected === 'master')
				this.hideDetail()
			else
				this.showDetail()
		}
*/
		if (this.type === 'master-detail') {
			this.resizeMasterDetail()
			this.on(document, 'screensize-update', this.resizeMasterDetail)
		}

	}

	@autobind resizeMasterDetail() {
		console.log('--------- resizeMasterDetail --------------')
		console.log('platform.screensize', platform.screensize)
		console.log('this.selected', this.selected)
		if (this.selected === 'detail') {
			if (platform.screensize === 's')
				this.navigateToDetail()
			else
				this.showDetail()
		} else {
			this.hideDetail()
		}
		if (this.detailToolbar)
			this.detailToolbar.refreshScroll()
	}


	@on('click')
	onClick(value, {target}) {
		if (target.matches(`[show-detail],
							flexus-view[master] a[href]:not([show-detail="false"]),
							flexus-view[master] a[href]:not([show-detail="false"]) > *`))
			this.navigateToDetail()
		if (target.matches('flexus-view[detail] [icon="arrow-back"]:not([hide-detail="false"]), [hide-detail]'))
			this.hideDetail()
	}

	navigateToDetail() {
		this.showDetail()
		if (this.detailToolbar) {
			this.detailToolbar.resetScroll()
			/*if (this.detailToolbar.scrollTarget.scrollTop)
				this.detailToolbar.scrollTarget.scrollTop = 0
				setTimeout(() => this.detailToolbar.scrollTarget.scrollTop = 0, 500)
			if (this.detailToolbar.measureHeight) {
				// measure immediately
				this.detailToolbar.measureHeight()
				// do another measurement in case the first one was too soon
				setTimeout(() => this.detailToolbar.measureHeight(), 500)
			}*/
		} else if (this.detail.scrollTarget)
			this.detail.scrollTarget.scrollTop = 0
	}

	showDetail() {
		console.log('showDetail')
		this.selected = 'detail'
		showView(this.detail)
		if (platform.screensize === 's')
			hideView(this.master)
		else
			showView(this.master)
	}

	hideDetail() {
		console.log('hideDetail')
		this.selected = 'master'
		showView(this.master)
		if (platform.screensize === 's')
			hideView(this.detail)
		else
			showView(this.detail)
	}

	@on('detail', 'show')
	onDetailShow() {
		console.log('onDetailShow')
		hideView(this.master)
		//showView(this.detail)
		this.selected = 'detail'
	}

	@on('detail', 'hide')
	onDetailHide() {
		console.log('onDetailHide')
		showView(this.master)
		//hideView(this.detail)
		this.selected = 'master'
	}
/*
	masterShow() {
		showView(this.master)
		hideView(this.detail)
		this.selected = 'master'
	}
	detailHide() {
		showView(this.master)
		hideView(this.detail)
		this.selected = 'master'
	}

	masterHide() {
		hideView(this.master)
		showView(this.detail)
		this.selected = 'detail'
	}
	detailShow() {
		hideView(this.master)
		showView(this.detail)
		this.selected = 'detail'
	}
*/


/*
	animateViews(toBeHiddenView, toBeShownView) {
		//this.emit('change', 'detail')
		//this.hideView(this.master)

		var addHelperAttrs = () => {
			this.detail.setAttribute('fit', '')
			toBeHiddenView.style.zIndex = 0
			toBeShownView.style.zIndex = 1
		}
		var removeHelperAttrs = () => {
			this.detail.removeAttribute('fit')
			toBeHiddenView.style.zIndex = ''
			toBeShownView.style.zIndex = ''
		}

		addHelperAttrs()
		//this.showView(toBeShownView)
		
		toBeHiddenView.setAttribute('offscreen', '')
		toBeShownView.removeAttribute('offscreen')
		toBeShownView.removeAttribute('hidden')

		toBeHiddenView.setAttribute('hiding', '')
		toBeShownView.setAttribute('showing', '')

		this.viewAnimation = toBeShownView.animate({
			opacity: [0, 1],
		}, {
			duration: this.transitionDuration
		})

		this.viewAnimation.finished.then(() => {
			removeHelperAttrs()
			//this.hideView(toBeHiddenView)
			toBeHiddenView.setAttribute('hidden', '')
			toBeHiddenView.removeAttribute('hiding')
			toBeShownView.removeAttribute('showing')
		})
	}

	animateDetails(direction) {
		if (!this.masterOrigin) return
		var animationPoints = Array.from(this.masterOrigin.querySelectorAll('[animate]'))
		animationPoints.forEach(origin => {
			var animationName = origin.getAttribute('animate')
			var target = this.detail.querySelector(`[animate="${animationName}"]`)
			if (!target) return
			if (direction)
				this.animateDetail(origin, target)
			else
				this.animateDetail(target, origin)
		})
	}

	animateDetail(origin, target) {
		var originBbox = origin.getBoundingClientRect()
		var targetBbox = target.getBoundingClientRect()
		var originStyle = window.getComputedStyle(origin)
		var targetStyle = window.getComputedStyle(target)

		var distanceX = targetBbox.left - originBbox.left
		var distanceY = targetBbox.top - originBbox.top
		var duration = animation.durationByDistance(Math.abs(distanceY))

		if (isImage(origin) || isImage(target)) {
			var ruleList = animationRuleLists.image
			var doScale = true
		} else {
			var ruleList = animationRuleLists.text
			var doScale = false
		}

		var rules = {}
		ruleList.forEach(key => {
			rules[key] = [originStyle[key], targetStyle[key]]
		})

		if (doScale) {
			var blank = 'translate3d(0px, 0px, 0) scale(1)'
			var originCenterX = originBbox.left + (originBbox.width / 2)
			var originCenterY = originBbox.top + (originBbox.height / 2)
			var targetCenterX = targetBbox.left + (targetBbox.width / 2)
			var targetCenterY = targetBbox.top + (targetBbox.height / 2)
			var distanceX = targetCenterX - originCenterX
			var distanceY = targetCenterY - originCenterY
			var originEndScale = targetBbox.width / originBbox.width
			var targetStartScale = originBbox.width / targetBbox.width
			var originEnd   = `translate3d(${distanceX}px, ${distanceY}px, 0) scale(${originEndScale})`
			var targetStart = `translate3d(${-distanceX}px, ${-distanceY}px, 0) scale(${targetStartScale})`
			var originRules = Object.assign({transform: [blank, originEnd]}, rules)
			var targetRules = Object.assign({transform: [targetStart, blank]}, rules)
		} else {
			var blank = 'translate3d(0px, 0px, 0)'
			var originEnd   = `translate3d(${distanceX}px, ${distanceY}px, 0)`
			var targetStart = `translate3d(${-distanceX}px, ${-distanceY}px, 0)`
			var originRules = Object.assign({transform: [blank, originEnd]}, rules)
			var targetRules = Object.assign({transform: [targetStart, blank]}, rules)
		}

		var options = {
			duration,
			easing: 'ease-in-out'
		}

		var originAnimation
		var targetAnimation

		if (this.transitionDuration > duration) {
			options.fill = 'forwards'
			this.viewAnimation.finished.then(() => {
				originAnimation.cancel()
				targetAnimation.cancel()
			})
		}

		originAnimation = origin.animate(originRules, options)
		targetAnimation = target.animate(targetRules, options)

		Promise.all([
			originAnimation.finished,
			targetAnimation.finished,
		]).then(() => {
		})
	}
*/
}


function isImage(target) {
	return target.localName === 'img' || target.style.backgroundImage || target.hasAttribute('avatar')
}