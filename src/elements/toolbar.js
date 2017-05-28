import {on, autobind, template, css, reflect, customElement, ganymedeElement, emit, observe} from 'ganymede'
import {platform, animation, traverseValue, Retractable, Scrollable, clamp} from 'flexus'
import {getParallaxApplicator, matchFormFactorDef, addReadyAnimation, rafThrottle} from 'flexus'


function hasAttribute(attrName) {
	return node => node.hasAttribute(attrName)
}

function isSectionDistinct(target) {
	return target.hasAttribute('tinted')
		|| target.hasAttribute('light')
		|| target.hasAttribute('dark')
		|| target.hasAttribute('card')
		|| target.hasAttribute('lighter')
		|| target.hasAttribute('darker')
}

function sum(array, extractor) {
	var result = 0
	if (extractor) {
		for (var i = 0; i < array.length; i++)
			result += extractor(array[i])
	} else {
		for (var i = 0; i < array.length; i++)
			result += array[i]
	}
	return result
}

addReadyAnimation('flexus-toolbar')

/*
@css(`
	.custom-bg {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: -1;
	}
	.custom-bg ::slotted(*) {
		position: absolute !important;
		top: 0 !important;
		width: 100% !important;
		height: 100% !important;
		background-color: var(--theme-primary) !important;
		transition: none;
	}
	.flexible {
		position: relative;
	}
	.before-overlay,
	.after-overlay {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 1;
	}
	.before-overlay {
		top: 0;
	}
	.after-overlay {
		bottom: 0;
	}
	.mainslot {
		position: relative;
	}
`)
@template(`
	<div id="slot-main">
		<slot name="main"></slot>
	</div>


	<div class="mainslot"><slot></slot></div>

	<div><slot name="before"></slot></div>
	<div class="flexible">
		<div class="before-overlay"><slot name="before-overlay"></slot></div>
		<slot name="flexible"></slot>
		<div class="after-overlay"><slot name="after-overlay"></slot></div>
	</div>
	<div><slot name="after"></slot></div>

	<div class="custom-bg" id="custom-bg-old">
		<slot name="custom-bg-old"></slot>
	</div>
	<div class="custom-bg" id="custom-bg-new">
		<slot name="custom-bg-new"></slot>
	</div>
`)
*/
@customElement
@css(`
	:host {
		contain: content;
	}

	.custom-bg {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: -1;
	}
	.custom-bg ::slotted(*) {
		position: absolute !important;
		top: 0 !important;
		width: 100% !important;
		height: 100% !important;
		background-color: var(--theme-primary) !important;
		transition: none;
	}

	#wrapper {
		display:flex;
		flex-direction: row;
	}
		#center {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			max-width: 100%;
		}
			#before,
			#after {
				position: relative;
				z-index: 1;
			}
				.overlay {
					position: absolute;
					left: 0;
					right: 0;
					z-index: 1;
				}
				#before .overlay {
					top: 100%;
				}
				#after .overlay {
					bottom: 100%;
				}
			#collapsible {
				position: relative;
				display: flex;
				flex-direction: column;
				flex: 1;
				overflow: hidden;
			}
				#parallaxwrap {
					overflow: hidden;
				}
`)
@template(`
	<slot></slot>
	<div id="wrapper" style="display:flex;flex-direction:row;align-items:stretch;">
		<div id="left"><slot name="left"></slot></div>
		<div id="center" style="position: relative;flex: 1;display: flex;flex-direction: column;max-width: 100%;">
			<div id="before" style="position:relative;z-index:10;">
				<slot name="before"></slot>
				<div class="overlay" style="position: absolute;left:0;right:0;z-index:1;top:100%;">
					<slot name="before-overlay"></slot>
				</div>
			</div>
			<div id="collapsible" style="position: relative;display: flex;flex-direction: column;flex: 1;overflow: hidden;">
				<div id="parallaxwrap" style="overflow: hidden;">
					<slot name="collapsible"></slot>
				</div>
			</div>
			<div id="after" style="position:relative;z-index:1;">
				<div class="overlay" style="position: absolute;left:0;right:0;z-index:1;bottom:100%;">
					<slot name="after-overlay"></slot>
				</div>
				<slot name="after"></slot>
			</div>
		</div>
		<div id="right"><slot name="right"></slot></div>
	</div>
`)
class FlexusToolbar extends ganymedeElement(Retractable, Scrollable) {

	@reflect primary = String
	@reflect multisection = false
	@reflect retractable = false

	@reflect waterfall = false
	@reflect elevation = 2

	isAboveContent = false
	// TODO implement
	// switch for enabling/disabling creating additional space in the content after toolbar
	// in situatin when toolbar has position:absolute. Like with [transparent] or [translucent]
	// sometimes the content should fill most of the space beneath the toolbar (picture gallery)
	// and sometimes it should have space and only go under the toolbar when scrolling
	@reflect mirrorHeight = true

	// values: position, origin, edge, center, fade, none
	// slide: slides section from left to right and falls back to fade when background is changed by tabs
	//@reflect bgTransition = platform.material ? 'position' : 'slide'
	@reflect bgTransition = platform.material ? 'position' : 'fade'
	// default transition for section showing/hiding
	// values: fade, slide, (position/origin/circle???)
	//@reflect transition = String

	//constructor() {
	//	super()
	//	//console.log('toolbar constructor')
	//connectedCallback() {
	//	super.connectedCallback()
	ready() {

		window.toolbar = this

		this.parentView = this.parentElement
		var children = Array.from(this.children)

		// note: this might be better to move to view
		var scrollTargetCandidate = this.parentView.scrollTarget || this.nextElementSibling
		var canScroll = this.setupScrollable(scrollTargetCandidate)

		if (!this.multisection)
			this.multisection = children.some(node => {
				var name = node.localName
				return name === 'section' || name === 'flexus-tabs' || name === 'img'
			})

		if (this.multisection) {
			this.setupMultisection()
		}

		//this.retractable = true
		if (this.retractable) {
			// todo retractable
			this.measureHeight()
		}

		this.setupCustomLayout()

		if (this.collapsible || this.retractable) {
			// collapsible toolbars are alway positioned absolutely and above content
			this.isAboveContent = true
		}

		if (this.hasAttribute('tinted'))
			if (this.bgTransition !== 'none' && this.bgTransition !== 'fade')
				this.setupBgTransition()
/*
		if (this.hasAttribute('translucent') || this.hasAttribute('transparent')) {
			// NOTE: sometimes its desirable (picture gallery) but sometimes not
			//this.setAttribute('absolute-top', '')
			this.isAboveContent = true
			//console.log('TODO: toolbar is translucent and has ben set absolute-top. Needs to be padded from bottom as well')
		}
*/
		if (this.isAboveContent) {
			this.setAttribute('absolute-top', '')
			// height of the toolbar has to be mirrored underneath toolbar to correctly
			// offset content under toolbar
			if (this.mirrorHeight)
				this.setupClone()
		}

		// scroll effects

		//console.log('this.waterfall', this.waterfall)
		if (this.waterfall) {
			// idea: this could be bound to some additional event signaling 'flexheight-depleted'
			// or 'collapse-start' / 'collapse-end'
			this.elevation = 0
			//console.log('this.elevation', this.elevation)
			let listener = scrolled => {
				this.elevation = scrolled > this.collapsileHeight ? 2 : 0
				//console.log('scrolled', scrolled, '|', this.elevation)
			}
			this.addScrollListeners(listener)
			this.registerKillback(() => this.removeScrollListeners(listener))
		}

		if (this.overlap && this.$.overlap) {
			var overlapClassList = this.$.overlap.classList
			var isHidden = false
			this.scrollListeners.push(scrolled => {
				if (scrolled > 0) {
					if (!isHidden) {
						overlapClassList.add('hide')
						isHidden = true
					}
				} else {
					if (isHidden) {
						overlapClassList.remove('hide')
						isHidden = false
					}
				}
			})
		}

		//if (this.mainSection) {
		//	var title = this.querySelector('[title], h1, h2, h3')
		//}

	}




	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// SECTIONS //////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////





	setupMultisection() {
		var sections = Array.from(this.children)

		this.mainSection = sections.find(node => node.hasAttribute('main')) || sections[0]

		this.selectionSection = sections.find(node => node.hasAttribute('selection'))

		this.searchSection = sections.find(node => node.hasAttribute('search'))

		var collapsibleSelector = ':scope > img, :scope > [collapse], :scope > [flexible]'

		var collapsibleSections
		var stickySections = Array.from(this.querySelectorAll(':scope > [sticky]'))
		//console.log('stickySections', stickySections)
		if (stickySections.length === 0) {
			collapsibleSections = Array.from(this.querySelectorAll(collapsibleSelector))
			//console.log('-collapsibleSections', collapsibleSections)
			stickySections = sections.filter(section => !collapsibleSections.includes(section))
		} else {
			//collapsibleSections = sections.filter(section => !stickySections.includes(section))
			collapsibleSections = sections.filter(section => {
				return !stickySections.includes(section) && !section.hasAttribute('overlay')
			})
			//console.log('+collapsibleSections', collapsibleSections)
		}
		this.collapsibleSections = collapsibleSections
		this.stickySections = stickySections

		// todo, simplify flexible/collapsible
		this.flexSection = this.querySelector(':scope > img, :scope > [flexible]')

		if (this.selectionSection) {
			this.selection = true
			this.setupSelection()
		}
		if (this.searchSection) {
			this.search = true
			this.setupSearch()
		}
		//console.log('this.collapsibleSections', this.collapsibleSections)
		if (collapsibleSections.length) {
			this.collapsible = true
			this.setupCollapsible()
		}

	}


	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// COLLAPSIBLE //////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////

	setupCollapsible() {
		var sections = Array.from(this.children)

		// split remaining section before and after the collapsible
		var firstCollapsible = this.collapsibleSections[0]
		var lastCollapsible = this.collapsibleSections[this.collapsibleSections.length - 1]

		//console.log('this.collapsibleSections', this.collapsibleSections)
		//console.log('firstCollapsible', firstCollapsible)
		//console.log('lastCollapsible', lastCollapsible)

		var before = sections.slice(0, sections.indexOf(firstCollapsible))
		var after = sections.slice(sections.indexOf(lastCollapsible) + 1, sections.length)
		//console.log('before', before)
		//console.log('after', after)

		// redistribute non sticky sections into shadow dom as collapsible
		this.collapsibleSections.forEach(section => {
			section.setAttribute('collapse', '')
			section.setAttribute('slot', 'collapsible')
		})
		this.stickySections.forEach(section => {
			section.setAttribute('sticky', '')
		})

		// redistribute other sections appropriate slot before/after and possibly overlay
		before.forEach(s => s.setAttribute('slot', s.hasAttribute('overlay') ? 'before-overlay' : 'before'))
		after.forEach(s => s.setAttribute('slot', s.hasAttribute('overlay') ? 'after-overlay' : 'after'))
		// list all sticky sections that should not count towards collapsible distance
		this.stickyOverlaySections = Array.from(this.querySelectorAll('[sticky][overlay]'))

		//this.on('collapse', this.dragRender)
		//this.on('retract', this.dragRender)

		/*this.flexibleImg = this.flexSection.localName === 'img'
		if (this.flexibleImg) {
			if (this.flexSection.getAttribute('parallax') === '')
				this.flexSection.setAttribute('parallax', '0.5')
			if (this.flexSection.getAttribute('fade') === null)
				this.flexSection.setAttribute('fade', '')
		}*/

		// set defaults
		if (this.flexSection) {
			var parallaxValue = this.flexSection.getAttribute('parallax')
			if (parallaxValue === '' || parallaxValue === null)
				this.flexSection.setAttribute('parallax', '0.5')
			if (this.flexSection.getAttribute('fade') === null)
				this.flexSection.setAttribute('fade', '')
		//}
		//if (this.flexibleImg) {
			var parallaxWrapStyle = this.$.parallaxwrap.style
			this.on('collapse', ([p, s, capped]) => {
				//console.log('collapse', p, s, capped)
				parallaxWrapStyle.transform = `translate3d(0px, ${capped}px, 0)`
			})
		}

		this.setupFadeNodes()
		this.setupParallaxNodes()

		// wait for nodes to rerender after their redistribution
		setTimeout(() => this.setupCollapsibleScroll())
	}


	findAttrNodes(name) {
		var nodes = Array.from(this.querySelectorAll(`[${name}]`))
		var active = []
		var inactive = []
		nodes.forEach(node => {
			var res = matchFormFactorDef(node.getAttribute(name))
			var stack = res ? active : inactive
			stack.push(node)
		})
		return [active, inactive]
	}

	@on(document, 'formfactor-update')
	setupFadeNodes() {
		var [activeNodes, inactiveNodes] = this.findAttrNodes('fade')
		this.fadeNodes = activeNodes
		if (activeNodes.length) {
			this.renderFade = ([percentage, scrolled, capped]) => {
				var opacity = 1 - percentage
				this.fadeNodes.forEach(node => node.style.opacity = opacity)
			}
			this.on('collapse', this.renderFade)
		} else if (this.renderFade) {
			this.off('collapse', this.renderFade)
			this.renderFade = undefined
		}
		if (inactiveNodes.length) {
			inactiveNodes.forEach(node => node.style.opacity = 1)
		}
	}

	@on(document, 'formfactor-update')
	setupParallaxNodes() {
		//console.log('setupParallaxNodes', this.flexibleImg, this.flexSection.getAttribute('parallax'))
		var [activeNodes, inactiveNodes] = this.findAttrNodes('parallax')
		//console.log('parallax', activeNodes, inactiveNodes)
		this.parallaxNodes = activeNodes
		if (activeNodes.length) {
			this.renderParallax = ([percentage, scrolled, capped]) => {
				var ratio = 0.5
				var transform = `translate3d(0px, ${-capped * ratio}px, 0)`
				this.parallaxNodes.forEach(node => node.style.transform = transform)
			}
			this.on('collapse', this.renderParallax)
		} else if (this.renderParallax) {
			this.off('collapse', this.renderParallax)
			this.renderParallax = undefined
		}
		if (inactiveNodes.length) {
			inactiveNodes.forEach(node => node.style.transform = `translate3d(0px, 0px, 0)`)
		}
	}

	@on('collapse')
	@on('retract')
	dragRender([percentage, scrolled, capped]) {
		this.style.transform = `translate3d(0px, ${-capped}px, 0)`
	}

	@on('collapse')
	renderCollapse([percentage, scrolled, capped]) {
		this.$.before.style.transform = `translate3d(0px, ${capped}px, 0)`
	}

	// minimal height toolbar can have before it start's to collapse
	collapsedHeight = 0
	// ammount of px, that can be scrolled to collapse and squeeze the collapsible space
	collapsileHeight = 0

	// calculates distance that can be squeezed by scrolling
	measureHeight() {
		if (this.collapsible) {
			if (this.customLayout && this.measureCollapsibleHeightCustom) {
				this.collapsileHeight = this.measureCollapsibleHeightCustom()
			} else {
				function sectionHeight(section) {
					if (section.hasAttribute('card')) {
						var style = getComputedStyle(section)
						return section.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom)
					} else {
						return section.offsetHeight
					}
				}
				this.collapsileHeight = sum(this.collapsibleSections, sectionHeight)
				this.collapsileHeight -= sum(this.stickyOverlaySections, sectionHeight)
			}
		} else {
			this.collapsileHeight = 0
		}
		this.height = this.offsetHeight
		this.collapsedHeight = this.height - this.collapsileHeight
		if (this.expander)
			this.expander.style.height = `${this.height}px`
		if (this.clone)
			this.clone.style.height = `${this.height}px`
	}

	resetScroll() {
		//if (!this.collapsible) return
		this.measureHeight()
		this.scrollTarget.scrollTop = 0
		if (this.onScrollTransformer)
			this.onScrollTransformer(0)
	}
	refreshScroll() {
		this.measureHeight()
		if (this.onScrollTransformer)
			this.onScrollTransformer(this.scrollTarget.scrollTop)
	}

	setupCollapsibleScroll() {
		//console.log('- setupCollapsibleScroll')
		this.measureHeight()
		//console.log('this.collapsileHeight', this.collapsileHeight)
		// disabled: hidden pages in master-detail are hidden and thus their collapseHeight
		//           cannot be calculated at the moment. but they are collapsible
		//if (this.collapsileHeight === 0) return

		var lastCollapse = 0
		var lastRetract = 0
		// respond to 'scroll' event on scrollTarget by firing custom 'transform'
		// event for toolbar to be able to udpate styles if needed
		var onScrollTransformer = this.onScrollTransformer = scrolled => {
			//console.log('onScrollTransformer', scrolled, this.collapsible, this.collapsileHeight)
			if (this.collapsible) {
				var capped = clamp(scrolled, 0, this.collapsileHeight)
				if (lastCollapse === capped) return
				lastCollapse = capped
				var percentage = capped / this.collapsileHeight
				this.emit('collapse', [percentage, scrolled, capped])
			}
			if (this.retractable) {
				var capped = clamp(scrolled, 0, this.height)
				if (lastRetract === capped) return
				lastRetract = capped
				var percentage = capped / this.collapsedHeight
				this.emit('retract', [percentage, scrolled, capped])
			}
		}

		this.addScrollListeners(onScrollTransformer)
		this.registerKillback(() => this.removeScrollListeners(onScrollTransformer))

		this.on(document, 'formfactor-update', () => {
			//setTimeout(() => {
				lastCollapse = 0
				lastRetract = 0
				onScrollTransformer(this.scrolled)
			//})
		})
	}

	setupCustomLayout() {
		var animateTitle = true
		var animateImg = true
		//var groove = platform.neon && this.querySelector('img, [collapse], [collapsible], [flexible]')
		var groove = this.hasAttribute('grove')

		if (groove) {
			this.on('collapse', ([percentage, scrolled, capped]) => {
				this.$.center.style.transform = `translate3d(${-capped}px, 0px, 0)`
			})
			if (animateImg) {
				this.customLayout = true
				var img = this.querySelector(':scope > img')
				if (img) {
					var minSize = 80
					var maxSize = 230
					this.measureCollapsibleHeightCustom = () => maxSize - minSize
					img.setAttribute('slot', 'left')
					img.style.transformOrigin = 'left top'
					this.on('collapse', ([percentage, scrolled, capped]) => {
						var imgSize = clamp(maxSize - capped, minSize, maxSize)
						var imgScale = imgSize / maxSize
						img.style.transform = `translate3d(0px, ${capped}px, 0) scale(${imgScale})`
					})
				}
			}
			if (animateTitle) {
				console.warn('todo: collapsible title')
				var title = this.querySelector('[title], h1, h2, h3')
				var computed = getComputedStyle(title)
				title.style.transformOrigin = 'left top'
				var startSize = parseInt(computed.fontSize)
				var endSize = 27
				var temp1 = endSize / startSize
				var temp2 = 1 - temp1
				//console.log(startSize, endSize, temp1, temp2)
				this.on('collapse', ([percentage, scrolled, capped]) => {
					//var titleScale = (percentage * temp2) + temp1
					var titleScale = 1 - (percentage * temp2)
					title.style.transform = `scale(${titleScale})`
				})
			}
		}
	}

	setupClone() {
		//console.log('setupClone')
		this.expander = document.createElement('div')
		this.scrollTarget.prepend(this.expander)
		var img = this.querySelector('img')
		if (img) {
			var applyBackground = () => {
				this.clone.style.backgroundImage = `url(${img.src})`
			}
			this.clone = document.createElement('div')
			this.clone.style.backgroundImage = `url(${img.src})`
			this.clone.setAttribute('absolute-top', '')
			this.clone.classList.add('fx-toolbar-expander')
			this.clone.classList.add('img')
			this.scrollTarget.prepend(this.clone)
			img.onload = applyBackground
			applyBackground()
			this.on('collapse', ([percentage, scrolled, capped]) => {
				this.clone.style.transform = `translate3d(0px, ${-capped}px, 0)`
			})
		}
		this.measureHeight()

		// slow down resize callback by using requestAnimationFrame
		this.onResize = rafThrottle(() => {
			this.measureHeight()
			//console.log('resize')
		})
		// note: resize events cannot be listened to passively
		this.on(window, 'resize', this.onResize)
	}















	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// SOMETHING //////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////



	getTransition(section, showDefault = this.bgTransition, hideDefault = showDefault) {
		var sectionTransition = this.getAttribute('transition') || section.getAttribute('transition')
		var showTransition = this.getAttribute('transition-show') || section.getAttribute('transition-show') || sectionTransition || showDefault
		var hideTransition = this.getAttribute('transition-hide') || section.getAttribute('transition-hide') || sectionTransition || hideDefault
		// Change transition to 'fade' if the the toolbar-default or custom section transition
		// is circular (position, origin, center, edge) but on section
		// that shares the same background as the toolbar (which wouldn't work because
		// of transparent background)
		if (!isSectionDistinct(section)) {
			if (showTransition !== 'none' && showTransition !== 'slide')
				showTransition = 'fade'
			if (hideTransition !== 'none' && hideTransition !== 'slide')
				hideTransition = 'fade'
		}
		return [showTransition, hideTransition]
	}


	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// SELECTION //////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////


	setupSelection() {
		var selectionSection = this.selectionSection

		if (platform.material) {
			var [selectionShowTransition, selectionHideTransition]
				= this.getTransition(selectionSection, 'position', 'fade')
		} else {
			var [selectionShowTransition, selectionHideTransition]
				= this.getTransition(selectionSection, 'fade')
		}
		this.selectionShowTransition = selectionShowTransition
		this.selectionHideTransition = selectionHideTransition


		selectionSection.setAttribute('absolute-top', '')
		selectionSection.style.visibility = 'hidden'
		this.selectionOpen = false

		// the very first child (button) of the search section will be closing it
		this.selectionCloseButton = selectionSection.children[0]
		this.selectionCloseButton.addEventListener('click', e => {
			e.preventDefault()
			emit(this.parentView, 'selection-hide')
		})
	}

	tempSelectionShow() {
		//console.log('tempSelectionShow')
		var selectionSection = this.selectionSection
		this.originalMainAttributes = []

		selectionSection.style.backgroundColor  = 'transparent'
		//console.log('selectionSection.style', selectionSection.style)

		if (this.hasAttribute('tinted'))
			this.originalMainAttributes.push(['tinted'])
		if (this.hasAttribute('light'))
			this.originalMainAttributes.push(['light'])
		if (this.hasAttribute('dark'))
			this.originalMainAttributes.push(['dark'])
		if (this.hasAttribute('primary'))
			this.originalMainAttributes.push(['primary', this.getAttribute('primary')])
		if (this.hasAttribute('accent'))
			this.originalMainAttributes.push(['accent', this.getAttribute('accent')])

		if (selectionSection.hasAttribute('tinted')) {
			var primary = selectionSection.getAttribute('primary')
			if (primary)
				this.setAttribute('primary', primary)
		} else {
			this.removeAttribute('tinted')
		}
		if (selectionSection.hasAttribute('light'))
			this.setAttribute('light', '')
		if (selectionSection.hasAttribute('dark'))
			this.setAttribute('dark', '')
	}
	tempBigassSelectionHide() {
			this.removeAttribute('tinted')
			this.removeAttribute('light')
			this.removeAttribute('dark')
			this.removeAttribute('primary')
			this.removeAttribute('accent')
			this.originalMainAttributes.forEach(attr => {
				this.setAttribute(attr[0], attr[1] || '')
			})
	}

	@on('parentView', 'selection-show', self => self.selection)
	showSelection(animationOrigin, e) {
		// TODO: show toolbar if its hidden (due to scrolling)
		if (!this.selection) return
		if (this.searchOpen) this.hideSearch()
		if (this.selectionOpen) return
		this.selectionOpen = true

		//console.log(this.selectionSection.hasAttribute('light'))

		this.tempSelectionShow()

		switch (this.selectionShowTransition) {
			case 'edge':
				animation.circle.show(this.selectionSection, 'bottom')
				break
			case 'center':
			//console.log('show center')
				animation.circle.show(this.selectionSection, 'center')
				break
			case 'origin':
			case 'position':
				animation.circle.show(this.selectionSection, animationOrigin)
				break
			case 'slide':
				animation.slideOut.left(this.mainSection)
				animation.slideIn.left(this.selectionSection)
				break
			case 'none':
				this.mainSection.style.visibility = 'hidden'
				this.selectionSection.style.visibility = ''
			default:
				this.mainSection.setAttribute('hiding', '')
				this.selectionSection.setAttribute('showing', '')
				var fadeDuration = platform.material ? 200 : 80
				animation.fade.out(this.mainSection, fadeDuration)
				animation.fade.in(this.selectionSection, fadeDuration)
					.then(() => {
						this.mainSection.removeAttribute('hiding')
						this.selectionSection.removeAttribute('showing')
					})
				break
		}
	}

	@on('parentView', 'selection-hide', self => self.selection)
	hideSelection(e) {
		if (!this.selection) return
		if (!this.selectionOpen) return
		this.selectionOpen = false

		this.tempBigassSelectionHide()

		switch (this.selectionHideTransition) {
			case 'edge':
				animation.circle.hide(this.selectionSection, 'bottom')
				this.mainSection.style.visibility = ''
				break
			case 'center':
				animation.circle.hide(this.selectionSection, 'center')
				this.mainSection.style.visibility = ''
				break
			case 'origin':
			case 'position':
				animation.circle.hide(this.selectionSection, e)
				this.mainSection.style.visibility = ''
				break
			case 'slide':
				animation.slideOut.right(this.selectionSection)
				animation.slideIn.right(this.mainSection)
				break
			case 'none':
				this.selectionSection.style.visibility = 'hidden'
				this.mainSection.style.visibility = ''
			default:
				this.selectionSection.setAttribute('hiding', '')
				this.mainSection.setAttribute('showing', '')
				var fadeDuration = platform.material ? 200 : 80
				animation.fade.out(this.selectionSection, fadeDuration)
				animation.fade.in(this.mainSection, fadeDuration)
					.then(() => {
						this.selectionSection.removeAttribute('hiding')
						this.mainSection.removeAttribute('showing')
					})
				break
		}

	}


	//@on('click')
	//onclick1(data, e) {
	//	if (this.search
	//	&& e.target.getAttribute
	//	&& e.target.getAttribute('icon') === 'search')
	//		emit(this.parentView, 'search-show')
	//}
	@on('parentView', 'click', self => self.selection)
	onclick2(data, e) {
		var {target} = e
		// TODO [selectable]
		if (target.getAttribute
		&& target.getAttribute('type') === 'checkbox') {
			var checkboxes = this.parentView.querySelectorAll('input[type="checkbox"]')
			checkboxes = Array.from(checkboxes)
			var anyChecked = checkboxes.some(checkbox => checkbox.checked)
			if (anyChecked)
				emit(this.parentView, 'selection-show', e)
			else
				emit(this.parentView, 'selection-hide', e)
		}
	}



	setupSearch() {
		// TODO - android only. winjs does not have cards and card search will be rendered as usual input
		// idea: - normal (invisible) search input remains invisible (in both android and winjs)
		//       - card search input will look as card in android, and as bordered input in winjs (like in many win10 apps there is visible textbox in the toolbar)
		var searchSection = this.searchSection

		if (platform.material && searchSection.hasAttribute('card')) {
			// card takes 64px height space (48 + margin) even on phone
			// and main section has to have the same height to prevent janky transition
			this.setAttribute('hascard', '')
			//this.mainSection.style.height = '64px';
			var defaultTransition = 'position'
		} else {
			var defaultTransition = 'fade'
		}
		
		var [searchShowTransition, searchHideTransition]
			= this.getTransition(searchSection, defaultTransition)
		this.searchShowTransition = searchShowTransition
		this.searchHideTransition = searchHideTransition

		// search section has to overlay the main section to blend them in animation
		searchSection.setAttribute('absolute-top', '')
		// hide the section for now. only the main section is visible
		searchSection.style.visibility = 'hidden'
		this.searchOpen = false

		// get search icon to show the section
		//this.searchButton = _.find(this.mainSection.children, child => child.getAttribute('icon') == 'search')
		this.searchButton = this.mainSection.querySelector('[icon="search"]')
		// the very first child (button) of he search section will be closing it
		this.searchCloseButton = searchSection.children[0]

		// todo - memory leak
		if (this.searchButton)
			this.searchButton.addEventListener('click', e => emit(this.parentView, 'search-show'))
		if (this.searchCloseButton)
			this.searchCloseButton.addEventListener('click', e => emit(this.parentView, 'search-hide'))
	}

	@on('parentView', 'search-show', self => self.search)
	showSearch() {
		if (!this.search) return
		if (this.searchOpen) return
		this.searchOpen = true
		var searchSection = this.searchSection

		if (this.searchShowTransition == 'position') {
			var finished = animation.circle.show(searchSection, this.searchButton)
		} else if (this.searchShowTransition == 'fade') {
			var finished = animation.fade.in(searchSection)
		} else if (this.searchShowTransition == 'slide') {
			var finished = animation.slideIn.left(searchSection)
		} else {
			searchSection.style.visibility = ''
			var finished = Promise.resolve()
		}
		// focus the search input
		var searchInput = searchSection.querySelector('input:not([type="checkbox"])')
		finished.then(() => searchInput.focus())
	}

	@on('parentView', 'search-hide', self => self.search)
	hideSearch() {
		if (!this.search) return
		if (!this.searchOpen) return
		this.searchOpen = false
		var searchSection = this.searchSection
		
		if (this.searchHideTransition == 'position') {
			animation.circle.hide(searchSection, this.searchButton)
		} else if (this.searchHideTransition == 'fade') {
			animation.fade.out(searchSection)
		} else {
			searchSection.style.visibility = 'hidden'
			var finished = Promise.resolve()
		}
		this.searchOpen = false
	}













	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// HIDE / SHOW //////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////



	show() {
		this.emit('show')
	}

	hide() {
		this.emit('hide')
	}

	thresholdRetractableHeight = 0

	@on('show')
	onShow() {
		//console.log('onShow')
		//if (this.retractable)
		var y = this.thresholdRetractableHeight
		this.style.transform = `translate3d(0px, ${y}px, 0)`
		//this.animate.transform = `translate3d(0px, ${-capped}px, 0)`
	}

	@on('hide')
	onHide() {
		//console.log('onHide')
		this.style.transform = `translate3d(0px, -100%, 0)`
	}






	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// BACKGROUND TRANSITION //////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////




	// NOTE: not nice, but there's no other way to access outer css from shadow dom
	setupBgTransition() {
		this.oldBgElement = document.createElement('div')
		this.newBgElement = document.createElement('div')
		this.oldBgElement.style.display = 'none'
		this.newBgElement.style.display = 'none'
		this.oldBgElement.setAttribute('slot', 'custom-bg-old')
		this.newBgElement.setAttribute('slot', 'custom-bg-new')
		this.appendChild(this.oldBgElement)
		this.appendChild(this.newBgElement)
		this.oldBgWrapper = this.$['custom-bg-old']
		this.newBgWrapper = this.$['custom-bg-new']
	}

	// [primary] color changed
	primaryChanged(newValue, oldValue) {
		if (this.bgTransition !== 'none' && this.bgTransition !== 'fade') {
			oldValue = oldValue || traverseValue(this.parentElement, node => node.getAttribute('primary'))
			this.transitionBackground(oldValue, newValue)
		}
	}

	// animate transition from old background to new one
	transitionBackground(oldPrimary, newPrimary) {
		/*this.oldBgElement.style.display = 'block'
		this.newBgElement.style.display = 'block'
		this.oldBgElement.setAttribute('primary', oldPrimary)
		this.newBgElement.setAttribute('primary', newPrimary)

		var from = this.bgTransition === 'center' ? 'center' : this.bgTransitionSource
		animation.circle.show(this.newBgWrapper, from)
			.then(() => {
				this.oldBgElement.style.display = 'none'
				this.newBgElement.style.display = 'none'
			})

		this.bgTransitionSource = undefined*/
	}













}

window.FlexusToolbar
