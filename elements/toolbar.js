(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede'), require('flexus')) :
	typeof define === 'function' && define.amd ? define('toolbar', ['ganymede', 'flexus'], factory) :
	(factory(global.ganymede,global.flexus));
}(this, (function (ganymede,flexus) { 'use strict';

var _dec;
var _dec2;
var _dec3;
var _dec4;
var _dec5;
var _dec6;
var _dec7;
var _dec8;
var _dec9;
var _dec10;
var _dec11;
var _dec12;
var _dec13;
var _dec14;
var _class;
var _desc;
var _value;
var _class2;
var _descriptor;
var _descriptor2;
var _descriptor3;
var _descriptor4;
var _descriptor5;
var _descriptor6;
var _descriptor7;

function _initDefineProp(target, property, descriptor, context) {
	if (!descriptor) return;
	Object.defineProperty(target, property, {
		enumerable: descriptor.enumerable,
		configurable: descriptor.configurable,
		writable: descriptor.writable,
		value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
	});
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

function _initializerWarningHelper(descriptor, context) {
	throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

function hasAttribute(attrName) {
	return node => node.hasAttribute(attrName);
}

function isSectionDistinct(target) {
	return target.hasAttribute('tinted') || target.hasAttribute('light') || target.hasAttribute('dark') || target.hasAttribute('card') || target.hasAttribute('lighter') || target.hasAttribute('darker');
}

function sum(array, extractor) {
	var result = 0;
	if (extractor) {
		for (var i = 0; i < array.length; i++) result += extractor(array[i]);
	} else {
		for (var i = 0; i < array.length; i++) result += array[i];
	}
	return result;
}

flexus.addReadyAnimation('flexus-toolbar');

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
let FlexusToolbar = (_dec = ganymede.css(`
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
`), _dec2 = ganymede.template(`
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
`), _dec3 = ganymede.on(document, 'formfactor-update'), _dec4 = ganymede.on(document, 'formfactor-update'), _dec5 = ganymede.on('collapse'), _dec6 = ganymede.on('retract'), _dec7 = ganymede.on('collapse'), _dec8 = ganymede.on('parentView', 'selection-show', self => self.selection), _dec9 = ganymede.on('parentView', 'selection-hide', self => self.selection), _dec10 = ganymede.on('parentView', 'click', self => self.selection), _dec11 = ganymede.on('parentView', 'search-show', self => self.search), _dec12 = ganymede.on('parentView', 'search-hide', self => self.search), _dec13 = ganymede.on('show'), _dec14 = ganymede.on('hide'), ganymede.customElement(_class = _dec(_class = _dec2(_class = (_class2 = class FlexusToolbar extends ganymede.ganymedeElement(flexus.Retractable, flexus.Scrollable) {
	constructor(...args) {
		var _temp;

		return _temp = super(...args), _initDefineProp(this, 'primary', _descriptor, this), _initDefineProp(this, 'multisection', _descriptor2, this), _initDefineProp(this, 'retractable', _descriptor3, this), _initDefineProp(this, 'waterfall', _descriptor4, this), _initDefineProp(this, 'elevation', _descriptor5, this), this.isAboveContent = false, _initDefineProp(this, 'mirrorHeight', _descriptor6, this), _initDefineProp(this, 'bgTransition', _descriptor7, this), this.collapsedHeight = 0, this.collapsileHeight = 0, this.thresholdRetractableHeight = 0, _temp;
	}
	// TODO implement
	// switch for enabling/disabling creating additional space in the content after toolbar
	// in situatin when toolbar has position:absolute. Like with [transparent] or [translucent]
	// sometimes the content should fill most of the space beneath the toolbar (picture gallery)
	// and sometimes it should have space and only go under the toolbar when scrolling


	// values: position, origin, edge, center, fade, none
	// slide: slides section from left to right and falls back to fade when background is changed by tabs
	//@reflect bgTransition = platform.material ? 'position' : 'slide'


	// default transition for section showing/hiding
	// values: fade, slide, (position/origin/circle???)
	//@reflect transition = String

	//constructor() {
	//	super()
	//	//console.log('toolbar constructor')
	//connectedCallback() {
	//	super.connectedCallback()
	ready() {

		window.toolbar = this;

		this.parentView = this.parentElement;
		var children = Array.from(this.children);

		// note: this might be better to move to view
		var scrollTargetCandidate = this.parentView.scrollTarget || this.nextElementSibling;
		var canScroll = this.setupScrollable(scrollTargetCandidate);

		if (!this.multisection) this.multisection = children.some(node => {
			var name = node.localName;
			return name === 'section' || name === 'flexus-tabs' || name === 'img';
		});

		if (this.multisection) {
			this.setupMultisection();
		}

		//this.retractable = true
		if (this.retractable) {
			// todo retractable
			this.measureHeight();
		}

		this.setupCustomLayout();

		if (this.collapsible || this.retractable) {
			// collapsible toolbars are alway positioned absolutely and above content
			this.isAboveContent = true;
		}

		if (this.hasAttribute('tinted')) if (this.bgTransition !== 'none' && this.bgTransition !== 'fade') this.setupBgTransition();
		/*
  		if (this.hasAttribute('translucent') || this.hasAttribute('transparent')) {
  			// NOTE: sometimes its desirable (picture gallery) but sometimes not
  			//this.setAttribute('absolute-top', '')
  			this.isAboveContent = true
  			//console.log('TODO: toolbar is translucent and has ben set absolute-top. Needs to be padded from bottom as well')
  		}
  */
		if (this.isAboveContent) {
			this.setAttribute('absolute-top', '');
			// height of the toolbar has to be mirrored underneath toolbar to correctly
			// offset content under toolbar
			if (this.mirrorHeight) this.setupClone();
		}

		// scroll effects

		//console.log('this.waterfall', this.waterfall)
		if (this.waterfall) {
			// idea: this could be bound to some additional event signaling 'flexheight-depleted'
			// or 'collapse-start' / 'collapse-end'
			this.elevation = 0;
			//console.log('this.elevation', this.elevation)
			let listener = scrolled => {
				this.elevation = scrolled > this.collapsileHeight ? 2 : 0;
				//console.log('scrolled', scrolled, '|', this.elevation)
			};
			this.addScrollListeners(listener);
			this.registerKillback(() => this.removeScrollListeners(listener));
		}

		if (this.overlap && this.$.overlap) {
			var overlapClassList = this.$.overlap.classList;
			var isHidden = false;
			this.scrollListeners.push(scrolled => {
				if (scrolled > 0) {
					if (!isHidden) {
						overlapClassList.add('hide');
						isHidden = true;
					}
				} else {
					if (isHidden) {
						overlapClassList.remove('hide');
						isHidden = false;
					}
				}
			});
		}

		//if (this.mainSection) {
		//	var title = this.querySelector('[title], h1, h2, h3')
		//}
	}

	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// SECTIONS //////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////


	setupMultisection() {
		var sections = Array.from(this.children);

		this.mainSection = sections.find(node => node.hasAttribute('main')) || sections[0];

		this.selectionSection = sections.find(node => node.hasAttribute('selection'));

		this.searchSection = sections.find(node => node.hasAttribute('search'));

		var collapsibleSelector = ':scope > img, :scope > [collapse], :scope > [flexible]';

		var collapsibleSections;
		var stickySections = Array.from(this.querySelectorAll(':scope > [sticky]'));
		//console.log('stickySections', stickySections)
		if (stickySections.length === 0) {
			collapsibleSections = Array.from(this.querySelectorAll(collapsibleSelector));
			//console.log('-collapsibleSections', collapsibleSections)
			stickySections = sections.filter(section => !collapsibleSections.includes(section));
		} else {
			//collapsibleSections = sections.filter(section => !stickySections.includes(section))
			collapsibleSections = sections.filter(section => {
				return !stickySections.includes(section) && !section.hasAttribute('overlay');
			});
			//console.log('+collapsibleSections', collapsibleSections)
		}
		this.collapsibleSections = collapsibleSections;
		this.stickySections = stickySections;

		// todo, simplify flexible/collapsible
		this.flexSection = this.querySelector(':scope > img, :scope > [flexible]');

		if (this.selectionSection) {
			this.selection = true;
			this.setupSelection();
		}
		if (this.searchSection) {
			this.search = true;
			this.setupSearch();
		}
		//console.log('this.collapsibleSections', this.collapsibleSections)
		if (collapsibleSections.length) {
			this.collapsible = true;
			this.setupCollapsible();
		}
	}

	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// COLLAPSIBLE //////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////

	setupCollapsible() {
		var sections = Array.from(this.children);

		// split remaining section before and after the collapsible
		var firstCollapsible = this.collapsibleSections[0];
		var lastCollapsible = this.collapsibleSections[this.collapsibleSections.length - 1];

		//console.log('this.collapsibleSections', this.collapsibleSections)
		//console.log('firstCollapsible', firstCollapsible)
		//console.log('lastCollapsible', lastCollapsible)

		var before = sections.slice(0, sections.indexOf(firstCollapsible));
		var after = sections.slice(sections.indexOf(lastCollapsible) + 1, sections.length);
		//console.log('before', before)
		//console.log('after', after)

		// redistribute non sticky sections into shadow dom as collapsible
		this.collapsibleSections.forEach(section => {
			section.setAttribute('collapse', '');
			section.setAttribute('slot', 'collapsible');
		});
		this.stickySections.forEach(section => {
			section.setAttribute('sticky', '');
		});

		// redistribute other sections appropriate slot before/after and possibly overlay
		before.forEach(s => s.setAttribute('slot', s.hasAttribute('overlay') ? 'before-overlay' : 'before'));
		after.forEach(s => s.setAttribute('slot', s.hasAttribute('overlay') ? 'after-overlay' : 'after'));
		// list all sticky sections that should not count towards collapsible distance
		this.stickyOverlaySections = Array.from(this.querySelectorAll('[sticky][overlay]'));

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
			var parallaxValue = this.flexSection.getAttribute('parallax');
			if (parallaxValue === '' || parallaxValue === null) this.flexSection.setAttribute('parallax', '0.5');
			if (this.flexSection.getAttribute('fade') === null) this.flexSection.setAttribute('fade', '');
			//}
			//if (this.flexibleImg) {
			var parallaxWrapStyle = this.$.parallaxwrap.style;
			this.on('collapse', ([p, s, capped]) => {
				//console.log('collapse', p, s, capped)
				parallaxWrapStyle.transform = `translate3d(0px, ${ capped }px, 0)`;
			});
		}

		this.setupFadeNodes();
		this.setupParallaxNodes();

		// wait for nodes to rerender after their redistribution
		setTimeout(() => this.setupCollapsibleScroll());
	}

	findAttrNodes(name) {
		var nodes = Array.from(this.querySelectorAll(`[${ name }]`));
		var active = [];
		var inactive = [];
		nodes.forEach(node => {
			var res = flexus.matchFormFactorDef(node.getAttribute(name));
			var stack = res ? active : inactive;
			stack.push(node);
		});
		return [active, inactive];
	}

	setupFadeNodes() {
		var [activeNodes, inactiveNodes] = this.findAttrNodes('fade');
		this.fadeNodes = activeNodes;
		if (activeNodes.length) {
			this.renderFade = ([percentage, scrolled, capped]) => {
				var opacity = 1 - percentage;
				this.fadeNodes.forEach(node => node.style.opacity = opacity);
			};
			this.on('collapse', this.renderFade);
		} else if (this.renderFade) {
			this.off('collapse', this.renderFade);
			this.renderFade = undefined;
		}
		if (inactiveNodes.length) {
			inactiveNodes.forEach(node => node.style.opacity = 1);
		}
	}

	setupParallaxNodes() {
		//console.log('setupParallaxNodes', this.flexibleImg, this.flexSection.getAttribute('parallax'))
		var [activeNodes, inactiveNodes] = this.findAttrNodes('parallax');
		//console.log('parallax', activeNodes, inactiveNodes)
		this.parallaxNodes = activeNodes;
		if (activeNodes.length) {
			this.renderParallax = ([percentage, scrolled, capped]) => {
				var ratio = 0.5;
				var transform = `translate3d(0px, ${ -capped * ratio }px, 0)`;
				this.parallaxNodes.forEach(node => node.style.transform = transform);
			};
			this.on('collapse', this.renderParallax);
		} else if (this.renderParallax) {
			this.off('collapse', this.renderParallax);
			this.renderParallax = undefined;
		}
		if (inactiveNodes.length) {
			inactiveNodes.forEach(node => node.style.transform = `translate3d(0px, 0px, 0)`);
		}
	}

	dragRender([percentage, scrolled, capped]) {
		this.style.transform = `translate3d(0px, ${ -capped }px, 0)`;
	}

	renderCollapse([percentage, scrolled, capped]) {
		this.$.before.style.transform = `translate3d(0px, ${ capped }px, 0)`;
	}

	// minimal height toolbar can have before it start's to collapse

	// ammount of px, that can be scrolled to collapse and squeeze the collapsible space


	// calculates distance that can be squeezed by scrolling
	measureHeight() {
		if (this.collapsible) {
			if (this.customLayout && this.measureCollapsibleHeightCustom) {
				this.collapsileHeight = this.measureCollapsibleHeightCustom();
			} else {
				function sectionHeight(section) {
					if (section.hasAttribute('card')) {
						var style = getComputedStyle(section);
						return section.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
					} else {
						return section.offsetHeight;
					}
				}
				this.collapsileHeight = sum(this.collapsibleSections, sectionHeight);
				this.collapsileHeight -= sum(this.stickyOverlaySections, sectionHeight);
			}
		} else {
			this.collapsileHeight = 0;
		}
		this.height = this.offsetHeight;
		this.collapsedHeight = this.height - this.collapsileHeight;
		if (this.expander) this.expander.style.height = `${ this.height }px`;
		if (this.clone) this.clone.style.height = `${ this.height }px`;
	}

	resetScroll() {
		//if (!this.collapsible) return
		this.measureHeight();
		this.scrollTarget.scrollTop = 0;
		if (this.onScrollTransformer) this.onScrollTransformer(0);
	}
	refreshScroll() {
		this.measureHeight();
		if (this.onScrollTransformer) this.onScrollTransformer(this.scrollTarget.scrollTop);
	}

	setupCollapsibleScroll() {
		//console.log('- setupCollapsibleScroll')
		this.measureHeight();
		//console.log('this.collapsileHeight', this.collapsileHeight)
		// disabled: hidden pages in master-detail are hidden and thus their collapseHeight
		//           cannot be calculated at the moment. but they are collapsible
		//if (this.collapsileHeight === 0) return

		var lastCollapse = 0;
		var lastRetract = 0;
		// respond to 'scroll' event on scrollTarget by firing custom 'transform'
		// event for toolbar to be able to udpate styles if needed
		var onScrollTransformer = this.onScrollTransformer = scrolled => {
			//console.log('onScrollTransformer', scrolled, this.collapsible, this.collapsileHeight)
			if (this.collapsible) {
				var capped = flexus.clamp(scrolled, 0, this.collapsileHeight);
				if (lastCollapse === capped) return;
				lastCollapse = capped;
				var percentage = capped / this.collapsileHeight;
				this.emit('collapse', [percentage, scrolled, capped]);
			}
			if (this.retractable) {
				var capped = flexus.clamp(scrolled, 0, this.height);
				if (lastRetract === capped) return;
				lastRetract = capped;
				var percentage = capped / this.collapsedHeight;
				this.emit('retract', [percentage, scrolled, capped]);
			}
		};

		this.addScrollListeners(onScrollTransformer);
		this.registerKillback(() => this.removeScrollListeners(onScrollTransformer));

		this.on(document, 'formfactor-update', () => {
			//setTimeout(() => {
			lastCollapse = 0;
			lastRetract = 0;
			onScrollTransformer(this.scrolled);
			//})
		});
	}

	setupCustomLayout() {
		var animateTitle = true;
		var animateImg = true;
		//var groove = platform.neon && this.querySelector('img, [collapse], [collapsible], [flexible]')
		var groove = this.hasAttribute('grove');

		if (groove) {
			this.on('collapse', ([percentage, scrolled, capped]) => {
				this.$.center.style.transform = `translate3d(${ -capped }px, 0px, 0)`;
			});
			if (animateImg) {
				this.customLayout = true;
				var img = this.querySelector(':scope > img');
				if (img) {
					var minSize = 80;
					var maxSize = 230;
					this.measureCollapsibleHeightCustom = () => maxSize - minSize;
					img.setAttribute('slot', 'left');
					img.style.transformOrigin = 'left top';
					this.on('collapse', ([percentage, scrolled, capped]) => {
						var imgSize = flexus.clamp(maxSize - capped, minSize, maxSize);
						var imgScale = imgSize / maxSize;
						img.style.transform = `translate3d(0px, ${ capped }px, 0) scale(${ imgScale })`;
					});
				}
			}
			if (animateTitle) {
				console.warn('todo: collapsible title');
				var title = this.querySelector('[title], h1, h2, h3');
				var computed = getComputedStyle(title);
				title.style.transformOrigin = 'left top';
				var startSize = parseInt(computed.fontSize);
				var endSize = 27;
				var temp1 = endSize / startSize;
				var temp2 = 1 - temp1;
				//console.log(startSize, endSize, temp1, temp2)
				this.on('collapse', ([percentage, scrolled, capped]) => {
					//var titleScale = (percentage * temp2) + temp1
					var titleScale = 1 - percentage * temp2;
					title.style.transform = `scale(${ titleScale })`;
				});
			}
		}
	}

	setupClone() {
		//console.log('setupClone')
		this.expander = document.createElement('div');
		this.scrollTarget.prepend(this.expander);
		var img = this.querySelector('img');
		if (img) {
			var applyBackground = () => {
				this.clone.style.backgroundImage = `url(${ img.src })`;
			};
			this.clone = document.createElement('div');
			this.clone.style.backgroundImage = `url(${ img.src })`;
			this.clone.setAttribute('absolute-top', '');
			this.clone.classList.add('fx-toolbar-expander');
			this.clone.classList.add('img');
			this.scrollTarget.prepend(this.clone);
			img.onload = applyBackground;
			applyBackground();
			this.on('collapse', ([percentage, scrolled, capped]) => {
				this.clone.style.transform = `translate3d(0px, ${ -capped }px, 0)`;
			});
		}
		this.measureHeight();

		// slow down resize callback by using requestAnimationFrame
		this.onResize = flexus.rafThrottle(() => {
			this.measureHeight();
			//console.log('resize')
		});
		// note: resize events cannot be listened to passively
		this.on(window, 'resize', this.onResize);
	}

	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// SOMETHING //////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////


	getTransition(section, showDefault = this.bgTransition, hideDefault = showDefault) {
		var sectionTransition = this.getAttribute('transition') || section.getAttribute('transition');
		var showTransition = this.getAttribute('transition-show') || section.getAttribute('transition-show') || sectionTransition || showDefault;
		var hideTransition = this.getAttribute('transition-hide') || section.getAttribute('transition-hide') || sectionTransition || hideDefault;
		// Change transition to 'fade' if the the toolbar-default or custom section transition
		// is circular (position, origin, center, edge) but on section
		// that shares the same background as the toolbar (which wouldn't work because
		// of transparent background)
		if (!isSectionDistinct(section)) {
			if (showTransition !== 'none' && showTransition !== 'slide') showTransition = 'fade';
			if (hideTransition !== 'none' && hideTransition !== 'slide') hideTransition = 'fade';
		}
		return [showTransition, hideTransition];
	}

	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// SELECTION //////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////


	setupSelection() {
		var selectionSection = this.selectionSection;

		if (flexus.platform.material) {
			var [selectionShowTransition, selectionHideTransition] = this.getTransition(selectionSection, 'position', 'fade');
		} else {
			var [selectionShowTransition, selectionHideTransition] = this.getTransition(selectionSection, 'fade');
		}
		this.selectionShowTransition = selectionShowTransition;
		this.selectionHideTransition = selectionHideTransition;

		selectionSection.setAttribute('absolute-top', '');
		selectionSection.style.visibility = 'hidden';
		this.selectionOpen = false;

		// the very first child (button) of the search section will be closing it
		this.selectionCloseButton = selectionSection.children[0];
		this.selectionCloseButton.addEventListener('click', e => {
			e.preventDefault();
			ganymede.emit(this.parentView, 'selection-hide');
		});
	}

	tempSelectionShow() {
		//console.log('tempSelectionShow')
		var selectionSection = this.selectionSection;
		this.originalMainAttributes = [];

		selectionSection.style.backgroundColor = 'transparent';
		//console.log('selectionSection.style', selectionSection.style)

		if (this.hasAttribute('tinted')) this.originalMainAttributes.push(['tinted']);
		if (this.hasAttribute('light')) this.originalMainAttributes.push(['light']);
		if (this.hasAttribute('dark')) this.originalMainAttributes.push(['dark']);
		if (this.hasAttribute('primary')) this.originalMainAttributes.push(['primary', this.getAttribute('primary')]);
		if (this.hasAttribute('accent')) this.originalMainAttributes.push(['accent', this.getAttribute('accent')]);

		if (selectionSection.hasAttribute('tinted')) {
			var primary = selectionSection.getAttribute('primary');
			if (primary) this.setAttribute('primary', primary);
		} else {
			this.removeAttribute('tinted');
		}
		if (selectionSection.hasAttribute('light')) this.setAttribute('light', '');
		if (selectionSection.hasAttribute('dark')) this.setAttribute('dark', '');
	}
	tempBigassSelectionHide() {
		this.removeAttribute('tinted');
		this.removeAttribute('light');
		this.removeAttribute('dark');
		this.removeAttribute('primary');
		this.removeAttribute('accent');
		this.originalMainAttributes.forEach(attr => {
			this.setAttribute(attr[0], attr[1] || '');
		});
	}

	showSelection(animationOrigin, e) {
		// TODO: show toolbar if its hidden (due to scrolling)
		if (!this.selection) return;
		if (this.searchOpen) this.hideSearch();
		if (this.selectionOpen) return;
		this.selectionOpen = true;

		//console.log(this.selectionSection.hasAttribute('light'))

		this.tempSelectionShow();

		switch (this.selectionShowTransition) {
			case 'edge':
				flexus.animation.circle.show(this.selectionSection, 'bottom');
				break;
			case 'center':
				//console.log('show center')
				flexus.animation.circle.show(this.selectionSection, 'center');
				break;
			case 'origin':
			case 'position':
				flexus.animation.circle.show(this.selectionSection, animationOrigin);
				break;
			case 'slide':
				flexus.animation.slideOut.left(this.mainSection);
				flexus.animation.slideIn.left(this.selectionSection);
				break;
			case 'none':
				this.mainSection.style.visibility = 'hidden';
				this.selectionSection.style.visibility = '';
			default:
				this.mainSection.setAttribute('hiding', '');
				this.selectionSection.setAttribute('showing', '');
				var fadeDuration = flexus.platform.material ? 200 : 80;
				flexus.animation.fade.out(this.mainSection, fadeDuration);
				flexus.animation.fade.in(this.selectionSection, fadeDuration).then(() => {
					this.mainSection.removeAttribute('hiding');
					this.selectionSection.removeAttribute('showing');
				});
				break;
		}
	}

	hideSelection(e) {
		if (!this.selection) return;
		if (!this.selectionOpen) return;
		this.selectionOpen = false;

		this.tempBigassSelectionHide();

		switch (this.selectionHideTransition) {
			case 'edge':
				flexus.animation.circle.hide(this.selectionSection, 'bottom');
				this.mainSection.style.visibility = '';
				break;
			case 'center':
				flexus.animation.circle.hide(this.selectionSection, 'center');
				this.mainSection.style.visibility = '';
				break;
			case 'origin':
			case 'position':
				flexus.animation.circle.hide(this.selectionSection, e);
				this.mainSection.style.visibility = '';
				break;
			case 'slide':
				flexus.animation.slideOut.right(this.selectionSection);
				flexus.animation.slideIn.right(this.mainSection);
				break;
			case 'none':
				this.selectionSection.style.visibility = 'hidden';
				this.mainSection.style.visibility = '';
			default:
				this.selectionSection.setAttribute('hiding', '');
				this.mainSection.setAttribute('showing', '');
				var fadeDuration = flexus.platform.material ? 200 : 80;
				flexus.animation.fade.out(this.selectionSection, fadeDuration);
				flexus.animation.fade.in(this.mainSection, fadeDuration).then(() => {
					this.selectionSection.removeAttribute('hiding');
					this.mainSection.removeAttribute('showing');
				});
				break;
		}
	}

	//@on('click')
	//onclick1(data, e) {
	//	if (this.search
	//	&& e.target.getAttribute
	//	&& e.target.getAttribute('icon') === 'search')
	//		emit(this.parentView, 'search-show')
	//}

	onclick2(data, e) {
		var { target } = e;
		// TODO [selectable]
		if (target.getAttribute && target.getAttribute('type') === 'checkbox') {
			var checkboxes = this.parentView.querySelectorAll('input[type="checkbox"]');
			checkboxes = Array.from(checkboxes);
			var anyChecked = checkboxes.some(checkbox => checkbox.checked);
			if (anyChecked) ganymede.emit(this.parentView, 'selection-show', e);else ganymede.emit(this.parentView, 'selection-hide', e);
		}
	}

	setupSearch() {
		// TODO - android only. winjs does not have cards and card search will be rendered as usual input
		// idea: - normal (invisible) search input remains invisible (in both android and winjs)
		//       - card search input will look as card in android, and as bordered input in winjs (like in many win10 apps there is visible textbox in the toolbar)
		var searchSection = this.searchSection;

		if (flexus.platform.material && searchSection.hasAttribute('card')) {
			// card takes 64px height space (48 + margin) even on phone
			// and main section has to have the same height to prevent janky transition
			this.setAttribute('hascard', '');
			//this.mainSection.style.height = '64px';
			var defaultTransition = 'position';
		} else {
			var defaultTransition = 'fade';
		}

		var [searchShowTransition, searchHideTransition] = this.getTransition(searchSection, defaultTransition);
		this.searchShowTransition = searchShowTransition;
		this.searchHideTransition = searchHideTransition;

		// search section has to overlay the main section to blend them in animation
		searchSection.setAttribute('absolute-top', '');
		// hide the section for now. only the main section is visible
		searchSection.style.visibility = 'hidden';
		this.searchOpen = false;

		// get search icon to show the section
		//this.searchButton = _.find(this.mainSection.children, child => child.getAttribute('icon') == 'search')
		this.searchButton = this.mainSection.querySelector('[icon="search"]');
		// the very first child (button) of he search section will be closing it
		this.searchCloseButton = searchSection.children[0];

		// todo - memory leak
		if (this.searchButton) this.searchButton.addEventListener('click', e => ganymede.emit(this.parentView, 'search-show'));
		if (this.searchCloseButton) this.searchCloseButton.addEventListener('click', e => ganymede.emit(this.parentView, 'search-hide'));
	}

	showSearch() {
		if (!this.search) return;
		if (this.searchOpen) return;
		this.searchOpen = true;
		var searchSection = this.searchSection;

		if (this.searchShowTransition == 'position') {
			var finished = flexus.animation.circle.show(searchSection, this.searchButton);
		} else if (this.searchShowTransition == 'fade') {
			var finished = flexus.animation.fade.in(searchSection);
		} else if (this.searchShowTransition == 'slide') {
			var finished = flexus.animation.slideIn.left(searchSection);
		} else {
			searchSection.style.visibility = '';
			var finished = Promise.resolve();
		}
		// focus the search input
		var searchInput = searchSection.querySelector('input:not([type="checkbox"])');
		finished.then(() => searchInput.focus());
	}

	hideSearch() {
		if (!this.search) return;
		if (!this.searchOpen) return;
		this.searchOpen = false;
		var searchSection = this.searchSection;

		if (this.searchHideTransition == 'position') {
			flexus.animation.circle.hide(searchSection, this.searchButton);
		} else if (this.searchHideTransition == 'fade') {
			flexus.animation.fade.out(searchSection);
		} else {
			searchSection.style.visibility = 'hidden';
			var finished = Promise.resolve();
		}
		this.searchOpen = false;
	}

	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// HIDE / SHOW //////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////


	show() {
		this.emit('show');
	}

	hide() {
		this.emit('hide');
	}

	onShow() {
		//console.log('onShow')
		//if (this.retractable)
		var y = this.thresholdRetractableHeight;
		this.style.transform = `translate3d(0px, ${ y }px, 0)`;
		//this.animate.transform = `translate3d(0px, ${-capped}px, 0)`
	}

	onHide() {
		//console.log('onHide')
		this.style.transform = `translate3d(0px, -100%, 0)`;
	}

	/////////////////////////////////////////////////////////////////////////////////
	//////////////////////// BACKGROUND TRANSITION //////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////


	// NOTE: not nice, but there's no other way to access outer css from shadow dom
	setupBgTransition() {
		this.oldBgElement = document.createElement('div');
		this.newBgElement = document.createElement('div');
		this.oldBgElement.style.display = 'none';
		this.newBgElement.style.display = 'none';
		this.oldBgElement.setAttribute('slot', 'custom-bg-old');
		this.newBgElement.setAttribute('slot', 'custom-bg-new');
		this.appendChild(this.oldBgElement);
		this.appendChild(this.newBgElement);
		this.oldBgWrapper = this.$['custom-bg-old'];
		this.newBgWrapper = this.$['custom-bg-new'];
	}

	// [primary] color changed
	primaryChanged(newValue, oldValue) {
		if (this.bgTransition !== 'none' && this.bgTransition !== 'fade') {
			oldValue = oldValue || flexus.traverseValue(this.parentElement, node => node.getAttribute('primary'));
			this.transitionBackground(oldValue, newValue);
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

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'primary', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return String;
	}
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'multisection', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'retractable', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'waterfall', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'elevation', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return 2;
	}
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'mirrorHeight', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return true;
	}
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'bgTransition', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return flexus.platform.material ? 'position' : 'fade';
	}
}), _applyDecoratedDescriptor(_class2.prototype, 'setupFadeNodes', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'setupFadeNodes'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setupParallaxNodes', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'setupParallaxNodes'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'dragRender', [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, 'dragRender'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'renderCollapse', [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, 'renderCollapse'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'showSelection', [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, 'showSelection'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'hideSelection', [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, 'hideSelection'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onclick2', [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, 'onclick2'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'showSearch', [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, 'showSearch'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'hideSearch', [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, 'hideSearch'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onShow', [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, 'onShow'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onHide', [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, 'onHide'), _class2.prototype)), _class2)) || _class) || _class) || _class);


window.FlexusToolbar;

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5qcyIsInNvdXJjZXMiOlsic3JjL2VsZW1lbnRzL3Rvb2xiYXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtvbiwgYXV0b2JpbmQsIHRlbXBsYXRlLCBjc3MsIHJlZmxlY3QsIGN1c3RvbUVsZW1lbnQsIGdhbnltZWRlRWxlbWVudCwgZW1pdCwgb2JzZXJ2ZX0gZnJvbSAnZ2FueW1lZGUnXHJcbmltcG9ydCB7cGxhdGZvcm0sIGFuaW1hdGlvbiwgdHJhdmVyc2VWYWx1ZSwgUmV0cmFjdGFibGUsIFNjcm9sbGFibGUsIGNsYW1wfSBmcm9tICdmbGV4dXMnXHJcbmltcG9ydCB7Z2V0UGFyYWxsYXhBcHBsaWNhdG9yLCBtYXRjaEZvcm1GYWN0b3JEZWYsIGFkZFJlYWR5QW5pbWF0aW9uLCByYWZUaHJvdHRsZX0gZnJvbSAnZmxleHVzJ1xyXG5cclxuXHJcbmZ1bmN0aW9uIGhhc0F0dHJpYnV0ZShhdHRyTmFtZSkge1xyXG5cdHJldHVybiBub2RlID0+IG5vZGUuaGFzQXR0cmlidXRlKGF0dHJOYW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1NlY3Rpb25EaXN0aW5jdCh0YXJnZXQpIHtcclxuXHRyZXR1cm4gdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgndGludGVkJylcclxuXHRcdHx8IHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2xpZ2h0JylcclxuXHRcdHx8IHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhcmsnKVxyXG5cdFx0fHwgdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnY2FyZCcpXHJcblx0XHR8fCB0YXJnZXQuaGFzQXR0cmlidXRlKCdsaWdodGVyJylcclxuXHRcdHx8IHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhcmtlcicpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN1bShhcnJheSwgZXh0cmFjdG9yKSB7XHJcblx0dmFyIHJlc3VsdCA9IDBcclxuXHRpZiAoZXh0cmFjdG9yKSB7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRyZXN1bHQgKz0gZXh0cmFjdG9yKGFycmF5W2ldKVxyXG5cdH0gZWxzZSB7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRyZXN1bHQgKz0gYXJyYXlbaV1cclxuXHR9XHJcblx0cmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5hZGRSZWFkeUFuaW1hdGlvbignZmxleHVzLXRvb2xiYXInKVxyXG5cclxuLypcclxuQGNzcyhgXHJcblx0LmN1c3RvbS1iZyB7XHJcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XHJcblx0XHR0b3A6IDA7XHJcblx0XHRyaWdodDogMDtcclxuXHRcdGJvdHRvbTogMDtcclxuXHRcdGxlZnQ6IDA7XHJcblx0XHR6LWluZGV4OiAtMTtcclxuXHR9XHJcblx0LmN1c3RvbS1iZyA6OnNsb3R0ZWQoKikge1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlICFpbXBvcnRhbnQ7XHJcblx0XHR0b3A6IDAgIWltcG9ydGFudDtcclxuXHRcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcblx0XHRoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRoZW1lLXByaW1hcnkpICFpbXBvcnRhbnQ7XHJcblx0XHR0cmFuc2l0aW9uOiBub25lO1xyXG5cdH1cclxuXHQuZmxleGlibGUge1xyXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdH1cclxuXHQuYmVmb3JlLW92ZXJsYXksXHJcblx0LmFmdGVyLW92ZXJsYXkge1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0bGVmdDogMDtcclxuXHRcdHJpZ2h0OiAwO1xyXG5cdFx0ei1pbmRleDogMTtcclxuXHR9XHJcblx0LmJlZm9yZS1vdmVybGF5IHtcclxuXHRcdHRvcDogMDtcclxuXHR9XHJcblx0LmFmdGVyLW92ZXJsYXkge1xyXG5cdFx0Ym90dG9tOiAwO1xyXG5cdH1cclxuXHQubWFpbnNsb3Qge1xyXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdH1cclxuYClcclxuQHRlbXBsYXRlKGBcclxuXHQ8ZGl2IGlkPVwic2xvdC1tYWluXCI+XHJcblx0XHQ8c2xvdCBuYW1lPVwibWFpblwiPjwvc2xvdD5cclxuXHQ8L2Rpdj5cclxuXHJcblxyXG5cdDxkaXYgY2xhc3M9XCJtYWluc2xvdFwiPjxzbG90Pjwvc2xvdD48L2Rpdj5cclxuXHJcblx0PGRpdj48c2xvdCBuYW1lPVwiYmVmb3JlXCI+PC9zbG90PjwvZGl2PlxyXG5cdDxkaXYgY2xhc3M9XCJmbGV4aWJsZVwiPlxyXG5cdFx0PGRpdiBjbGFzcz1cImJlZm9yZS1vdmVybGF5XCI+PHNsb3QgbmFtZT1cImJlZm9yZS1vdmVybGF5XCI+PC9zbG90PjwvZGl2PlxyXG5cdFx0PHNsb3QgbmFtZT1cImZsZXhpYmxlXCI+PC9zbG90PlxyXG5cdFx0PGRpdiBjbGFzcz1cImFmdGVyLW92ZXJsYXlcIj48c2xvdCBuYW1lPVwiYWZ0ZXItb3ZlcmxheVwiPjwvc2xvdD48L2Rpdj5cclxuXHQ8L2Rpdj5cclxuXHQ8ZGl2PjxzbG90IG5hbWU9XCJhZnRlclwiPjwvc2xvdD48L2Rpdj5cclxuXHJcblx0PGRpdiBjbGFzcz1cImN1c3RvbS1iZ1wiIGlkPVwiY3VzdG9tLWJnLW9sZFwiPlxyXG5cdFx0PHNsb3QgbmFtZT1cImN1c3RvbS1iZy1vbGRcIj48L3Nsb3Q+XHJcblx0PC9kaXY+XHJcblx0PGRpdiBjbGFzcz1cImN1c3RvbS1iZ1wiIGlkPVwiY3VzdG9tLWJnLW5ld1wiPlxyXG5cdFx0PHNsb3QgbmFtZT1cImN1c3RvbS1iZy1uZXdcIj48L3Nsb3Q+XHJcblx0PC9kaXY+XHJcbmApXHJcbiovXHJcbkBjdXN0b21FbGVtZW50XHJcbkBjc3MoYFxyXG5cdDpob3N0IHtcclxuXHRcdGNvbnRhaW46IGNvbnRlbnQ7XHJcblx0fVxyXG5cclxuXHQuY3VzdG9tLWJnIHtcclxuXHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHRcdHRvcDogMDtcclxuXHRcdHJpZ2h0OiAwO1xyXG5cdFx0Ym90dG9tOiAwO1xyXG5cdFx0bGVmdDogMDtcclxuXHRcdHotaW5kZXg6IC0xO1xyXG5cdH1cclxuXHQuY3VzdG9tLWJnIDo6c2xvdHRlZCgqKSB7XHJcblx0XHRwb3NpdGlvbjogYWJzb2x1dGUgIWltcG9ydGFudDtcclxuXHRcdHRvcDogMCAhaW1wb3J0YW50O1xyXG5cdFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuXHRcdGhlaWdodDogMTAwJSAhaW1wb3J0YW50O1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGhlbWUtcHJpbWFyeSkgIWltcG9ydGFudDtcclxuXHRcdHRyYW5zaXRpb246IG5vbmU7XHJcblx0fVxyXG5cclxuXHQjd3JhcHBlciB7XHJcblx0XHRkaXNwbGF5OmZsZXg7XHJcblx0XHRmbGV4LWRpcmVjdGlvbjogcm93O1xyXG5cdH1cclxuXHRcdCNjZW50ZXIge1xyXG5cdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0XHRcdGZsZXg6IDE7XHJcblx0XHRcdGRpc3BsYXk6IGZsZXg7XHJcblx0XHRcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcblx0XHRcdG1heC13aWR0aDogMTAwJTtcclxuXHRcdH1cclxuXHRcdFx0I2JlZm9yZSxcclxuXHRcdFx0I2FmdGVyIHtcclxuXHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0XHRcdFx0ei1pbmRleDogMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcdC5vdmVybGF5IHtcclxuXHRcdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHRcdFx0XHRcdGxlZnQ6IDA7XHJcblx0XHRcdFx0XHRyaWdodDogMDtcclxuXHRcdFx0XHRcdHotaW5kZXg6IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCNiZWZvcmUgLm92ZXJsYXkge1xyXG5cdFx0XHRcdFx0dG9wOiAxMDAlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQjYWZ0ZXIgLm92ZXJsYXkge1xyXG5cdFx0XHRcdFx0Ym90dG9tOiAxMDAlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0I2NvbGxhcHNpYmxlIHtcclxuXHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0XHRcdFx0ZGlzcGxheTogZmxleDtcclxuXHRcdFx0XHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG5cdFx0XHRcdGZsZXg6IDE7XHJcblx0XHRcdFx0b3ZlcmZsb3c6IGhpZGRlbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcdCNwYXJhbGxheHdyYXAge1xyXG5cdFx0XHRcdFx0b3ZlcmZsb3c6IGhpZGRlbjtcclxuXHRcdFx0XHR9XHJcbmApXHJcbkB0ZW1wbGF0ZShgXHJcblx0PHNsb3Q+PC9zbG90PlxyXG5cdDxkaXYgaWQ9XCJ3cmFwcGVyXCIgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246cm93O2FsaWduLWl0ZW1zOnN0cmV0Y2g7XCI+XHJcblx0XHQ8ZGl2IGlkPVwibGVmdFwiPjxzbG90IG5hbWU9XCJsZWZ0XCI+PC9zbG90PjwvZGl2PlxyXG5cdFx0PGRpdiBpZD1cImNlbnRlclwiIHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlO2ZsZXg6IDE7ZGlzcGxheTogZmxleDtmbGV4LWRpcmVjdGlvbjogY29sdW1uO21heC13aWR0aDogMTAwJTtcIj5cclxuXHRcdFx0PGRpdiBpZD1cImJlZm9yZVwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDoxMDtcIj5cclxuXHRcdFx0XHQ8c2xvdCBuYW1lPVwiYmVmb3JlXCI+PC9zbG90PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7bGVmdDowO3JpZ2h0OjA7ei1pbmRleDoxO3RvcDoxMDAlO1wiPlxyXG5cdFx0XHRcdFx0PHNsb3QgbmFtZT1cImJlZm9yZS1vdmVybGF5XCI+PC9zbG90PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD1cImNvbGxhcHNpYmxlXCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7ZGlzcGxheTogZmxleDtmbGV4LWRpcmVjdGlvbjogY29sdW1uO2ZsZXg6IDE7b3ZlcmZsb3c6IGhpZGRlbjtcIj5cclxuXHRcdFx0XHQ8ZGl2IGlkPVwicGFyYWxsYXh3cmFwXCIgc3R5bGU9XCJvdmVyZmxvdzogaGlkZGVuO1wiPlxyXG5cdFx0XHRcdFx0PHNsb3QgbmFtZT1cImNvbGxhcHNpYmxlXCI+PC9zbG90PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGRpdiBpZD1cImFmdGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjE7XCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTtsZWZ0OjA7cmlnaHQ6MDt6LWluZGV4OjE7Ym90dG9tOjEwMCU7XCI+XHJcblx0XHRcdFx0XHQ8c2xvdCBuYW1lPVwiYWZ0ZXItb3ZlcmxheVwiPjwvc2xvdD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8c2xvdCBuYW1lPVwiYWZ0ZXJcIj48L3Nsb3Q+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQ8ZGl2IGlkPVwicmlnaHRcIj48c2xvdCBuYW1lPVwicmlnaHRcIj48L3Nsb3Q+PC9kaXY+XHJcblx0PC9kaXY+XHJcbmApXHJcbmNsYXNzIEZsZXh1c1Rvb2xiYXIgZXh0ZW5kcyBnYW55bWVkZUVsZW1lbnQoUmV0cmFjdGFibGUsIFNjcm9sbGFibGUpIHtcclxuXHJcblx0QHJlZmxlY3QgcHJpbWFyeSA9IFN0cmluZ1xyXG5cdEByZWZsZWN0IG11bHRpc2VjdGlvbiA9IGZhbHNlXHJcblx0QHJlZmxlY3QgcmV0cmFjdGFibGUgPSBmYWxzZVxyXG5cclxuXHRAcmVmbGVjdCB3YXRlcmZhbGwgPSBmYWxzZVxyXG5cdEByZWZsZWN0IGVsZXZhdGlvbiA9IDJcclxuXHJcblx0aXNBYm92ZUNvbnRlbnQgPSBmYWxzZVxyXG5cdC8vIFRPRE8gaW1wbGVtZW50XHJcblx0Ly8gc3dpdGNoIGZvciBlbmFibGluZy9kaXNhYmxpbmcgY3JlYXRpbmcgYWRkaXRpb25hbCBzcGFjZSBpbiB0aGUgY29udGVudCBhZnRlciB0b29sYmFyXHJcblx0Ly8gaW4gc2l0dWF0aW4gd2hlbiB0b29sYmFyIGhhcyBwb3NpdGlvbjphYnNvbHV0ZS4gTGlrZSB3aXRoIFt0cmFuc3BhcmVudF0gb3IgW3RyYW5zbHVjZW50XVxyXG5cdC8vIHNvbWV0aW1lcyB0aGUgY29udGVudCBzaG91bGQgZmlsbCBtb3N0IG9mIHRoZSBzcGFjZSBiZW5lYXRoIHRoZSB0b29sYmFyIChwaWN0dXJlIGdhbGxlcnkpXHJcblx0Ly8gYW5kIHNvbWV0aW1lcyBpdCBzaG91bGQgaGF2ZSBzcGFjZSBhbmQgb25seSBnbyB1bmRlciB0aGUgdG9vbGJhciB3aGVuIHNjcm9sbGluZ1xyXG5cdEByZWZsZWN0IG1pcnJvckhlaWdodCA9IHRydWVcclxuXHJcblx0Ly8gdmFsdWVzOiBwb3NpdGlvbiwgb3JpZ2luLCBlZGdlLCBjZW50ZXIsIGZhZGUsIG5vbmVcclxuXHQvLyBzbGlkZTogc2xpZGVzIHNlY3Rpb24gZnJvbSBsZWZ0IHRvIHJpZ2h0IGFuZCBmYWxscyBiYWNrIHRvIGZhZGUgd2hlbiBiYWNrZ3JvdW5kIGlzIGNoYW5nZWQgYnkgdGFic1xyXG5cdC8vQHJlZmxlY3QgYmdUcmFuc2l0aW9uID0gcGxhdGZvcm0ubWF0ZXJpYWwgPyAncG9zaXRpb24nIDogJ3NsaWRlJ1xyXG5cdEByZWZsZWN0IGJnVHJhbnNpdGlvbiA9IHBsYXRmb3JtLm1hdGVyaWFsID8gJ3Bvc2l0aW9uJyA6ICdmYWRlJ1xyXG5cdC8vIGRlZmF1bHQgdHJhbnNpdGlvbiBmb3Igc2VjdGlvbiBzaG93aW5nL2hpZGluZ1xyXG5cdC8vIHZhbHVlczogZmFkZSwgc2xpZGUsIChwb3NpdGlvbi9vcmlnaW4vY2lyY2xlPz8/KVxyXG5cdC8vQHJlZmxlY3QgdHJhbnNpdGlvbiA9IFN0cmluZ1xyXG5cclxuXHQvL2NvbnN0cnVjdG9yKCkge1xyXG5cdC8vXHRzdXBlcigpXHJcblx0Ly9cdC8vY29uc29sZS5sb2coJ3Rvb2xiYXIgY29uc3RydWN0b3InKVxyXG5cdC8vY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcblx0Ly9cdHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKClcclxuXHRyZWFkeSgpIHtcclxuXHJcblx0XHR3aW5kb3cudG9vbGJhciA9IHRoaXNcclxuXHJcblx0XHR0aGlzLnBhcmVudFZpZXcgPSB0aGlzLnBhcmVudEVsZW1lbnRcclxuXHRcdHZhciBjaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5jaGlsZHJlbilcclxuXHJcblx0XHQvLyBub3RlOiB0aGlzIG1pZ2h0IGJlIGJldHRlciB0byBtb3ZlIHRvIHZpZXdcclxuXHRcdHZhciBzY3JvbGxUYXJnZXRDYW5kaWRhdGUgPSB0aGlzLnBhcmVudFZpZXcuc2Nyb2xsVGFyZ2V0IHx8IHRoaXMubmV4dEVsZW1lbnRTaWJsaW5nXHJcblx0XHR2YXIgY2FuU2Nyb2xsID0gdGhpcy5zZXR1cFNjcm9sbGFibGUoc2Nyb2xsVGFyZ2V0Q2FuZGlkYXRlKVxyXG5cclxuXHRcdGlmICghdGhpcy5tdWx0aXNlY3Rpb24pXHJcblx0XHRcdHRoaXMubXVsdGlzZWN0aW9uID0gY2hpbGRyZW4uc29tZShub2RlID0+IHtcclxuXHRcdFx0XHR2YXIgbmFtZSA9IG5vZGUubG9jYWxOYW1lXHJcblx0XHRcdFx0cmV0dXJuIG5hbWUgPT09ICdzZWN0aW9uJyB8fCBuYW1lID09PSAnZmxleHVzLXRhYnMnIHx8IG5hbWUgPT09ICdpbWcnXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0aWYgKHRoaXMubXVsdGlzZWN0aW9uKSB7XHJcblx0XHRcdHRoaXMuc2V0dXBNdWx0aXNlY3Rpb24oKVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vdGhpcy5yZXRyYWN0YWJsZSA9IHRydWVcclxuXHRcdGlmICh0aGlzLnJldHJhY3RhYmxlKSB7XHJcblx0XHRcdC8vIHRvZG8gcmV0cmFjdGFibGVcclxuXHRcdFx0dGhpcy5tZWFzdXJlSGVpZ2h0KClcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNldHVwQ3VzdG9tTGF5b3V0KClcclxuXHJcblx0XHRpZiAodGhpcy5jb2xsYXBzaWJsZSB8fCB0aGlzLnJldHJhY3RhYmxlKSB7XHJcblx0XHRcdC8vIGNvbGxhcHNpYmxlIHRvb2xiYXJzIGFyZSBhbHdheSBwb3NpdGlvbmVkIGFic29sdXRlbHkgYW5kIGFib3ZlIGNvbnRlbnRcclxuXHRcdFx0dGhpcy5pc0Fib3ZlQ29udGVudCA9IHRydWVcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ3RpbnRlZCcpKVxyXG5cdFx0XHRpZiAodGhpcy5iZ1RyYW5zaXRpb24gIT09ICdub25lJyAmJiB0aGlzLmJnVHJhbnNpdGlvbiAhPT0gJ2ZhZGUnKVxyXG5cdFx0XHRcdHRoaXMuc2V0dXBCZ1RyYW5zaXRpb24oKVxyXG4vKlxyXG5cdFx0aWYgKHRoaXMuaGFzQXR0cmlidXRlKCd0cmFuc2x1Y2VudCcpIHx8IHRoaXMuaGFzQXR0cmlidXRlKCd0cmFuc3BhcmVudCcpKSB7XHJcblx0XHRcdC8vIE5PVEU6IHNvbWV0aW1lcyBpdHMgZGVzaXJhYmxlIChwaWN0dXJlIGdhbGxlcnkpIGJ1dCBzb21ldGltZXMgbm90XHJcblx0XHRcdC8vdGhpcy5zZXRBdHRyaWJ1dGUoJ2Fic29sdXRlLXRvcCcsICcnKVxyXG5cdFx0XHR0aGlzLmlzQWJvdmVDb250ZW50ID0gdHJ1ZVxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdUT0RPOiB0b29sYmFyIGlzIHRyYW5zbHVjZW50IGFuZCBoYXMgYmVuIHNldCBhYnNvbHV0ZS10b3AuIE5lZWRzIHRvIGJlIHBhZGRlZCBmcm9tIGJvdHRvbSBhcyB3ZWxsJylcclxuXHRcdH1cclxuKi9cclxuXHRcdGlmICh0aGlzLmlzQWJvdmVDb250ZW50KSB7XHJcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCdhYnNvbHV0ZS10b3AnLCAnJylcclxuXHRcdFx0Ly8gaGVpZ2h0IG9mIHRoZSB0b29sYmFyIGhhcyB0byBiZSBtaXJyb3JlZCB1bmRlcm5lYXRoIHRvb2xiYXIgdG8gY29ycmVjdGx5XHJcblx0XHRcdC8vIG9mZnNldCBjb250ZW50IHVuZGVyIHRvb2xiYXJcclxuXHRcdFx0aWYgKHRoaXMubWlycm9ySGVpZ2h0KVxyXG5cdFx0XHRcdHRoaXMuc2V0dXBDbG9uZSgpXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc2Nyb2xsIGVmZmVjdHNcclxuXHJcblx0XHQvL2NvbnNvbGUubG9nKCd0aGlzLndhdGVyZmFsbCcsIHRoaXMud2F0ZXJmYWxsKVxyXG5cdFx0aWYgKHRoaXMud2F0ZXJmYWxsKSB7XHJcblx0XHRcdC8vIGlkZWE6IHRoaXMgY291bGQgYmUgYm91bmQgdG8gc29tZSBhZGRpdGlvbmFsIGV2ZW50IHNpZ25hbGluZyAnZmxleGhlaWdodC1kZXBsZXRlZCdcclxuXHRcdFx0Ly8gb3IgJ2NvbGxhcHNlLXN0YXJ0JyAvICdjb2xsYXBzZS1lbmQnXHJcblx0XHRcdHRoaXMuZWxldmF0aW9uID0gMFxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCd0aGlzLmVsZXZhdGlvbicsIHRoaXMuZWxldmF0aW9uKVxyXG5cdFx0XHRsZXQgbGlzdGVuZXIgPSBzY3JvbGxlZCA9PiB7XHJcblx0XHRcdFx0dGhpcy5lbGV2YXRpb24gPSBzY3JvbGxlZCA+IHRoaXMuY29sbGFwc2lsZUhlaWdodCA/IDIgOiAwXHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnc2Nyb2xsZWQnLCBzY3JvbGxlZCwgJ3wnLCB0aGlzLmVsZXZhdGlvbilcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmFkZFNjcm9sbExpc3RlbmVycyhsaXN0ZW5lcilcclxuXHRcdFx0dGhpcy5yZWdpc3RlcktpbGxiYWNrKCgpID0+IHRoaXMucmVtb3ZlU2Nyb2xsTGlzdGVuZXJzKGxpc3RlbmVyKSlcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5vdmVybGFwICYmIHRoaXMuJC5vdmVybGFwKSB7XHJcblx0XHRcdHZhciBvdmVybGFwQ2xhc3NMaXN0ID0gdGhpcy4kLm92ZXJsYXAuY2xhc3NMaXN0XHJcblx0XHRcdHZhciBpc0hpZGRlbiA9IGZhbHNlXHJcblx0XHRcdHRoaXMuc2Nyb2xsTGlzdGVuZXJzLnB1c2goc2Nyb2xsZWQgPT4ge1xyXG5cdFx0XHRcdGlmIChzY3JvbGxlZCA+IDApIHtcclxuXHRcdFx0XHRcdGlmICghaXNIaWRkZW4pIHtcclxuXHRcdFx0XHRcdFx0b3ZlcmxhcENsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG5cdFx0XHRcdFx0XHRpc0hpZGRlbiA9IHRydWVcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGlzSGlkZGVuKSB7XHJcblx0XHRcdFx0XHRcdG92ZXJsYXBDbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuXHRcdFx0XHRcdFx0aXNIaWRkZW4gPSBmYWxzZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHQvL2lmICh0aGlzLm1haW5TZWN0aW9uKSB7XHJcblx0XHQvL1x0dmFyIHRpdGxlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbdGl0bGVdLCBoMSwgaDIsIGgzJylcclxuXHRcdC8vfVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBTRUNUSU9OUyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRzZXR1cE11bHRpc2VjdGlvbigpIHtcclxuXHRcdHZhciBzZWN0aW9ucyA9IEFycmF5LmZyb20odGhpcy5jaGlsZHJlbilcclxuXHJcblx0XHR0aGlzLm1haW5TZWN0aW9uID0gc2VjdGlvbnMuZmluZChub2RlID0+IG5vZGUuaGFzQXR0cmlidXRlKCdtYWluJykpIHx8IHNlY3Rpb25zWzBdXHJcblxyXG5cdFx0dGhpcy5zZWxlY3Rpb25TZWN0aW9uID0gc2VjdGlvbnMuZmluZChub2RlID0+IG5vZGUuaGFzQXR0cmlidXRlKCdzZWxlY3Rpb24nKSlcclxuXHJcblx0XHR0aGlzLnNlYXJjaFNlY3Rpb24gPSBzZWN0aW9ucy5maW5kKG5vZGUgPT4gbm9kZS5oYXNBdHRyaWJ1dGUoJ3NlYXJjaCcpKVxyXG5cclxuXHRcdHZhciBjb2xsYXBzaWJsZVNlbGVjdG9yID0gJzpzY29wZSA+IGltZywgOnNjb3BlID4gW2NvbGxhcHNlXSwgOnNjb3BlID4gW2ZsZXhpYmxlXSdcclxuXHJcblx0XHR2YXIgY29sbGFwc2libGVTZWN0aW9uc1xyXG5cdFx0dmFyIHN0aWNreVNlY3Rpb25zID0gQXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoJzpzY29wZSA+IFtzdGlja3ldJykpXHJcblx0XHQvL2NvbnNvbGUubG9nKCdzdGlja3lTZWN0aW9ucycsIHN0aWNreVNlY3Rpb25zKVxyXG5cdFx0aWYgKHN0aWNreVNlY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRjb2xsYXBzaWJsZVNlY3Rpb25zID0gQXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoY29sbGFwc2libGVTZWxlY3RvcikpXHJcblx0XHRcdC8vY29uc29sZS5sb2coJy1jb2xsYXBzaWJsZVNlY3Rpb25zJywgY29sbGFwc2libGVTZWN0aW9ucylcclxuXHRcdFx0c3RpY2t5U2VjdGlvbnMgPSBzZWN0aW9ucy5maWx0ZXIoc2VjdGlvbiA9PiAhY29sbGFwc2libGVTZWN0aW9ucy5pbmNsdWRlcyhzZWN0aW9uKSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vY29sbGFwc2libGVTZWN0aW9ucyA9IHNlY3Rpb25zLmZpbHRlcihzZWN0aW9uID0+ICFzdGlja3lTZWN0aW9ucy5pbmNsdWRlcyhzZWN0aW9uKSlcclxuXHRcdFx0Y29sbGFwc2libGVTZWN0aW9ucyA9IHNlY3Rpb25zLmZpbHRlcihzZWN0aW9uID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gIXN0aWNreVNlY3Rpb25zLmluY2x1ZGVzKHNlY3Rpb24pICYmICFzZWN0aW9uLmhhc0F0dHJpYnV0ZSgnb3ZlcmxheScpXHJcblx0XHRcdH0pXHJcblx0XHRcdC8vY29uc29sZS5sb2coJytjb2xsYXBzaWJsZVNlY3Rpb25zJywgY29sbGFwc2libGVTZWN0aW9ucylcclxuXHRcdH1cclxuXHRcdHRoaXMuY29sbGFwc2libGVTZWN0aW9ucyA9IGNvbGxhcHNpYmxlU2VjdGlvbnNcclxuXHRcdHRoaXMuc3RpY2t5U2VjdGlvbnMgPSBzdGlja3lTZWN0aW9uc1xyXG5cclxuXHRcdC8vIHRvZG8sIHNpbXBsaWZ5IGZsZXhpYmxlL2NvbGxhcHNpYmxlXHJcblx0XHR0aGlzLmZsZXhTZWN0aW9uID0gdGhpcy5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiBpbWcsIDpzY29wZSA+IFtmbGV4aWJsZV0nKVxyXG5cclxuXHRcdGlmICh0aGlzLnNlbGVjdGlvblNlY3Rpb24pIHtcclxuXHRcdFx0dGhpcy5zZWxlY3Rpb24gPSB0cnVlXHJcblx0XHRcdHRoaXMuc2V0dXBTZWxlY3Rpb24oKVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuc2VhcmNoU2VjdGlvbikge1xyXG5cdFx0XHR0aGlzLnNlYXJjaCA9IHRydWVcclxuXHRcdFx0dGhpcy5zZXR1cFNlYXJjaCgpXHJcblx0XHR9XHJcblx0XHQvL2NvbnNvbGUubG9nKCd0aGlzLmNvbGxhcHNpYmxlU2VjdGlvbnMnLCB0aGlzLmNvbGxhcHNpYmxlU2VjdGlvbnMpXHJcblx0XHRpZiAoY29sbGFwc2libGVTZWN0aW9ucy5sZW5ndGgpIHtcclxuXHRcdFx0dGhpcy5jb2xsYXBzaWJsZSA9IHRydWVcclxuXHRcdFx0dGhpcy5zZXR1cENvbGxhcHNpYmxlKClcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIENPTExBUFNJQkxFIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblx0c2V0dXBDb2xsYXBzaWJsZSgpIHtcclxuXHRcdHZhciBzZWN0aW9ucyA9IEFycmF5LmZyb20odGhpcy5jaGlsZHJlbilcclxuXHJcblx0XHQvLyBzcGxpdCByZW1haW5pbmcgc2VjdGlvbiBiZWZvcmUgYW5kIGFmdGVyIHRoZSBjb2xsYXBzaWJsZVxyXG5cdFx0dmFyIGZpcnN0Q29sbGFwc2libGUgPSB0aGlzLmNvbGxhcHNpYmxlU2VjdGlvbnNbMF1cclxuXHRcdHZhciBsYXN0Q29sbGFwc2libGUgPSB0aGlzLmNvbGxhcHNpYmxlU2VjdGlvbnNbdGhpcy5jb2xsYXBzaWJsZVNlY3Rpb25zLmxlbmd0aCAtIDFdXHJcblxyXG5cdFx0Ly9jb25zb2xlLmxvZygndGhpcy5jb2xsYXBzaWJsZVNlY3Rpb25zJywgdGhpcy5jb2xsYXBzaWJsZVNlY3Rpb25zKVxyXG5cdFx0Ly9jb25zb2xlLmxvZygnZmlyc3RDb2xsYXBzaWJsZScsIGZpcnN0Q29sbGFwc2libGUpXHJcblx0XHQvL2NvbnNvbGUubG9nKCdsYXN0Q29sbGFwc2libGUnLCBsYXN0Q29sbGFwc2libGUpXHJcblxyXG5cdFx0dmFyIGJlZm9yZSA9IHNlY3Rpb25zLnNsaWNlKDAsIHNlY3Rpb25zLmluZGV4T2YoZmlyc3RDb2xsYXBzaWJsZSkpXHJcblx0XHR2YXIgYWZ0ZXIgPSBzZWN0aW9ucy5zbGljZShzZWN0aW9ucy5pbmRleE9mKGxhc3RDb2xsYXBzaWJsZSkgKyAxLCBzZWN0aW9ucy5sZW5ndGgpXHJcblx0XHQvL2NvbnNvbGUubG9nKCdiZWZvcmUnLCBiZWZvcmUpXHJcblx0XHQvL2NvbnNvbGUubG9nKCdhZnRlcicsIGFmdGVyKVxyXG5cclxuXHRcdC8vIHJlZGlzdHJpYnV0ZSBub24gc3RpY2t5IHNlY3Rpb25zIGludG8gc2hhZG93IGRvbSBhcyBjb2xsYXBzaWJsZVxyXG5cdFx0dGhpcy5jb2xsYXBzaWJsZVNlY3Rpb25zLmZvckVhY2goc2VjdGlvbiA9PiB7XHJcblx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCdjb2xsYXBzZScsICcnKVxyXG5cdFx0XHRzZWN0aW9uLnNldEF0dHJpYnV0ZSgnc2xvdCcsICdjb2xsYXBzaWJsZScpXHJcblx0XHR9KVxyXG5cdFx0dGhpcy5zdGlja3lTZWN0aW9ucy5mb3JFYWNoKHNlY3Rpb24gPT4ge1xyXG5cdFx0XHRzZWN0aW9uLnNldEF0dHJpYnV0ZSgnc3RpY2t5JywgJycpXHJcblx0XHR9KVxyXG5cclxuXHRcdC8vIHJlZGlzdHJpYnV0ZSBvdGhlciBzZWN0aW9ucyBhcHByb3ByaWF0ZSBzbG90IGJlZm9yZS9hZnRlciBhbmQgcG9zc2libHkgb3ZlcmxheVxyXG5cdFx0YmVmb3JlLmZvckVhY2gocyA9PiBzLnNldEF0dHJpYnV0ZSgnc2xvdCcsIHMuaGFzQXR0cmlidXRlKCdvdmVybGF5JykgPyAnYmVmb3JlLW92ZXJsYXknIDogJ2JlZm9yZScpKVxyXG5cdFx0YWZ0ZXIuZm9yRWFjaChzID0+IHMuc2V0QXR0cmlidXRlKCdzbG90Jywgcy5oYXNBdHRyaWJ1dGUoJ292ZXJsYXknKSA/ICdhZnRlci1vdmVybGF5JyA6ICdhZnRlcicpKVxyXG5cdFx0Ly8gbGlzdCBhbGwgc3RpY2t5IHNlY3Rpb25zIHRoYXQgc2hvdWxkIG5vdCBjb3VudCB0b3dhcmRzIGNvbGxhcHNpYmxlIGRpc3RhbmNlXHJcblx0XHR0aGlzLnN0aWNreU92ZXJsYXlTZWN0aW9ucyA9IEFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKCdbc3RpY2t5XVtvdmVybGF5XScpKVxyXG5cclxuXHRcdC8vdGhpcy5vbignY29sbGFwc2UnLCB0aGlzLmRyYWdSZW5kZXIpXHJcblx0XHQvL3RoaXMub24oJ3JldHJhY3QnLCB0aGlzLmRyYWdSZW5kZXIpXHJcblxyXG5cdFx0Lyp0aGlzLmZsZXhpYmxlSW1nID0gdGhpcy5mbGV4U2VjdGlvbi5sb2NhbE5hbWUgPT09ICdpbWcnXHJcblx0XHRpZiAodGhpcy5mbGV4aWJsZUltZykge1xyXG5cdFx0XHRpZiAodGhpcy5mbGV4U2VjdGlvbi5nZXRBdHRyaWJ1dGUoJ3BhcmFsbGF4JykgPT09ICcnKVxyXG5cdFx0XHRcdHRoaXMuZmxleFNlY3Rpb24uc2V0QXR0cmlidXRlKCdwYXJhbGxheCcsICcwLjUnKVxyXG5cdFx0XHRpZiAodGhpcy5mbGV4U2VjdGlvbi5nZXRBdHRyaWJ1dGUoJ2ZhZGUnKSA9PT0gbnVsbClcclxuXHRcdFx0XHR0aGlzLmZsZXhTZWN0aW9uLnNldEF0dHJpYnV0ZSgnZmFkZScsICcnKVxyXG5cdFx0fSovXHJcblxyXG5cdFx0Ly8gc2V0IGRlZmF1bHRzXHJcblx0XHRpZiAodGhpcy5mbGV4U2VjdGlvbikge1xyXG5cdFx0XHR2YXIgcGFyYWxsYXhWYWx1ZSA9IHRoaXMuZmxleFNlY3Rpb24uZ2V0QXR0cmlidXRlKCdwYXJhbGxheCcpXHJcblx0XHRcdGlmIChwYXJhbGxheFZhbHVlID09PSAnJyB8fCBwYXJhbGxheFZhbHVlID09PSBudWxsKVxyXG5cdFx0XHRcdHRoaXMuZmxleFNlY3Rpb24uc2V0QXR0cmlidXRlKCdwYXJhbGxheCcsICcwLjUnKVxyXG5cdFx0XHRpZiAodGhpcy5mbGV4U2VjdGlvbi5nZXRBdHRyaWJ1dGUoJ2ZhZGUnKSA9PT0gbnVsbClcclxuXHRcdFx0XHR0aGlzLmZsZXhTZWN0aW9uLnNldEF0dHJpYnV0ZSgnZmFkZScsICcnKVxyXG5cdFx0Ly99XHJcblx0XHQvL2lmICh0aGlzLmZsZXhpYmxlSW1nKSB7XHJcblx0XHRcdHZhciBwYXJhbGxheFdyYXBTdHlsZSA9IHRoaXMuJC5wYXJhbGxheHdyYXAuc3R5bGVcclxuXHRcdFx0dGhpcy5vbignY29sbGFwc2UnLCAoW3AsIHMsIGNhcHBlZF0pID0+IHtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdjb2xsYXBzZScsIHAsIHMsIGNhcHBlZClcclxuXHRcdFx0XHRwYXJhbGxheFdyYXBTdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMHB4LCAke2NhcHBlZH1weCwgMClgXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5zZXR1cEZhZGVOb2RlcygpXHJcblx0XHR0aGlzLnNldHVwUGFyYWxsYXhOb2RlcygpXHJcblxyXG5cdFx0Ly8gd2FpdCBmb3Igbm9kZXMgdG8gcmVyZW5kZXIgYWZ0ZXIgdGhlaXIgcmVkaXN0cmlidXRpb25cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXR1cENvbGxhcHNpYmxlU2Nyb2xsKCkpXHJcblx0fVxyXG5cclxuXHJcblx0ZmluZEF0dHJOb2RlcyhuYW1lKSB7XHJcblx0XHR2YXIgbm9kZXMgPSBBcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChgWyR7bmFtZX1dYCkpXHJcblx0XHR2YXIgYWN0aXZlID0gW11cclxuXHRcdHZhciBpbmFjdGl2ZSA9IFtdXHJcblx0XHRub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xyXG5cdFx0XHR2YXIgcmVzID0gbWF0Y2hGb3JtRmFjdG9yRGVmKG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpKVxyXG5cdFx0XHR2YXIgc3RhY2sgPSByZXMgPyBhY3RpdmUgOiBpbmFjdGl2ZVxyXG5cdFx0XHRzdGFjay5wdXNoKG5vZGUpXHJcblx0XHR9KVxyXG5cdFx0cmV0dXJuIFthY3RpdmUsIGluYWN0aXZlXVxyXG5cdH1cclxuXHJcblx0QG9uKGRvY3VtZW50LCAnZm9ybWZhY3Rvci11cGRhdGUnKVxyXG5cdHNldHVwRmFkZU5vZGVzKCkge1xyXG5cdFx0dmFyIFthY3RpdmVOb2RlcywgaW5hY3RpdmVOb2Rlc10gPSB0aGlzLmZpbmRBdHRyTm9kZXMoJ2ZhZGUnKVxyXG5cdFx0dGhpcy5mYWRlTm9kZXMgPSBhY3RpdmVOb2Rlc1xyXG5cdFx0aWYgKGFjdGl2ZU5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHR0aGlzLnJlbmRlckZhZGUgPSAoW3BlcmNlbnRhZ2UsIHNjcm9sbGVkLCBjYXBwZWRdKSA9PiB7XHJcblx0XHRcdFx0dmFyIG9wYWNpdHkgPSAxIC0gcGVyY2VudGFnZVxyXG5cdFx0XHRcdHRoaXMuZmFkZU5vZGVzLmZvckVhY2gobm9kZSA9PiBub2RlLnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5KVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMub24oJ2NvbGxhcHNlJywgdGhpcy5yZW5kZXJGYWRlKVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnJlbmRlckZhZGUpIHtcclxuXHRcdFx0dGhpcy5vZmYoJ2NvbGxhcHNlJywgdGhpcy5yZW5kZXJGYWRlKVxyXG5cdFx0XHR0aGlzLnJlbmRlckZhZGUgPSB1bmRlZmluZWRcclxuXHRcdH1cclxuXHRcdGlmIChpbmFjdGl2ZU5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRpbmFjdGl2ZU5vZGVzLmZvckVhY2gobm9kZSA9PiBub2RlLnN0eWxlLm9wYWNpdHkgPSAxKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0QG9uKGRvY3VtZW50LCAnZm9ybWZhY3Rvci11cGRhdGUnKVxyXG5cdHNldHVwUGFyYWxsYXhOb2RlcygpIHtcclxuXHRcdC8vY29uc29sZS5sb2coJ3NldHVwUGFyYWxsYXhOb2RlcycsIHRoaXMuZmxleGlibGVJbWcsIHRoaXMuZmxleFNlY3Rpb24uZ2V0QXR0cmlidXRlKCdwYXJhbGxheCcpKVxyXG5cdFx0dmFyIFthY3RpdmVOb2RlcywgaW5hY3RpdmVOb2Rlc10gPSB0aGlzLmZpbmRBdHRyTm9kZXMoJ3BhcmFsbGF4JylcclxuXHRcdC8vY29uc29sZS5sb2coJ3BhcmFsbGF4JywgYWN0aXZlTm9kZXMsIGluYWN0aXZlTm9kZXMpXHJcblx0XHR0aGlzLnBhcmFsbGF4Tm9kZXMgPSBhY3RpdmVOb2Rlc1xyXG5cdFx0aWYgKGFjdGl2ZU5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHR0aGlzLnJlbmRlclBhcmFsbGF4ID0gKFtwZXJjZW50YWdlLCBzY3JvbGxlZCwgY2FwcGVkXSkgPT4ge1xyXG5cdFx0XHRcdHZhciByYXRpbyA9IDAuNVxyXG5cdFx0XHRcdHZhciB0cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMHB4LCAkey1jYXBwZWQgKiByYXRpb31weCwgMClgXHJcblx0XHRcdFx0dGhpcy5wYXJhbGxheE5vZGVzLmZvckVhY2gobm9kZSA9PiBub2RlLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybSlcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLm9uKCdjb2xsYXBzZScsIHRoaXMucmVuZGVyUGFyYWxsYXgpXHJcblx0XHR9IGVsc2UgaWYgKHRoaXMucmVuZGVyUGFyYWxsYXgpIHtcclxuXHRcdFx0dGhpcy5vZmYoJ2NvbGxhcHNlJywgdGhpcy5yZW5kZXJQYXJhbGxheClcclxuXHRcdFx0dGhpcy5yZW5kZXJQYXJhbGxheCA9IHVuZGVmaW5lZFxyXG5cdFx0fVxyXG5cdFx0aWYgKGluYWN0aXZlTm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdGluYWN0aXZlTm9kZXMuZm9yRWFjaChub2RlID0+IG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDBweCwgMHB4LCAwKWApXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRAb24oJ2NvbGxhcHNlJylcclxuXHRAb24oJ3JldHJhY3QnKVxyXG5cdGRyYWdSZW5kZXIoW3BlcmNlbnRhZ2UsIHNjcm9sbGVkLCBjYXBwZWRdKSB7XHJcblx0XHR0aGlzLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgwcHgsICR7LWNhcHBlZH1weCwgMClgXHJcblx0fVxyXG5cclxuXHRAb24oJ2NvbGxhcHNlJylcclxuXHRyZW5kZXJDb2xsYXBzZShbcGVyY2VudGFnZSwgc2Nyb2xsZWQsIGNhcHBlZF0pIHtcclxuXHRcdHRoaXMuJC5iZWZvcmUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDBweCwgJHtjYXBwZWR9cHgsIDApYFxyXG5cdH1cclxuXHJcblx0Ly8gbWluaW1hbCBoZWlnaHQgdG9vbGJhciBjYW4gaGF2ZSBiZWZvcmUgaXQgc3RhcnQncyB0byBjb2xsYXBzZVxyXG5cdGNvbGxhcHNlZEhlaWdodCA9IDBcclxuXHQvLyBhbW1vdW50IG9mIHB4LCB0aGF0IGNhbiBiZSBzY3JvbGxlZCB0byBjb2xsYXBzZSBhbmQgc3F1ZWV6ZSB0aGUgY29sbGFwc2libGUgc3BhY2VcclxuXHRjb2xsYXBzaWxlSGVpZ2h0ID0gMFxyXG5cclxuXHQvLyBjYWxjdWxhdGVzIGRpc3RhbmNlIHRoYXQgY2FuIGJlIHNxdWVlemVkIGJ5IHNjcm9sbGluZ1xyXG5cdG1lYXN1cmVIZWlnaHQoKSB7XHJcblx0XHRpZiAodGhpcy5jb2xsYXBzaWJsZSkge1xyXG5cdFx0XHRpZiAodGhpcy5jdXN0b21MYXlvdXQgJiYgdGhpcy5tZWFzdXJlQ29sbGFwc2libGVIZWlnaHRDdXN0b20pIHtcclxuXHRcdFx0XHR0aGlzLmNvbGxhcHNpbGVIZWlnaHQgPSB0aGlzLm1lYXN1cmVDb2xsYXBzaWJsZUhlaWdodEN1c3RvbSgpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZnVuY3Rpb24gc2VjdGlvbkhlaWdodChzZWN0aW9uKSB7XHJcblx0XHRcdFx0XHRpZiAoc2VjdGlvbi5oYXNBdHRyaWJ1dGUoJ2NhcmQnKSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHNlY3Rpb24pXHJcblx0XHRcdFx0XHRcdHJldHVybiBzZWN0aW9uLm9mZnNldEhlaWdodCArIHBhcnNlSW50KHN0eWxlLm1hcmdpblRvcCkgKyBwYXJzZUludChzdHlsZS5tYXJnaW5Cb3R0b20pXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VjdGlvbi5vZmZzZXRIZWlnaHRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5jb2xsYXBzaWxlSGVpZ2h0ID0gc3VtKHRoaXMuY29sbGFwc2libGVTZWN0aW9ucywgc2VjdGlvbkhlaWdodClcclxuXHRcdFx0XHR0aGlzLmNvbGxhcHNpbGVIZWlnaHQgLT0gc3VtKHRoaXMuc3RpY2t5T3ZlcmxheVNlY3Rpb25zLCBzZWN0aW9uSGVpZ2h0KVxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmNvbGxhcHNpbGVIZWlnaHQgPSAwXHJcblx0XHR9XHJcblx0XHR0aGlzLmhlaWdodCA9IHRoaXMub2Zmc2V0SGVpZ2h0XHJcblx0XHR0aGlzLmNvbGxhcHNlZEhlaWdodCA9IHRoaXMuaGVpZ2h0IC0gdGhpcy5jb2xsYXBzaWxlSGVpZ2h0XHJcblx0XHRpZiAodGhpcy5leHBhbmRlcilcclxuXHRcdFx0dGhpcy5leHBhbmRlci5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLmhlaWdodH1weGBcclxuXHRcdGlmICh0aGlzLmNsb25lKVxyXG5cdFx0XHR0aGlzLmNsb25lLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuaGVpZ2h0fXB4YFxyXG5cdH1cclxuXHJcblx0cmVzZXRTY3JvbGwoKSB7XHJcblx0XHQvL2lmICghdGhpcy5jb2xsYXBzaWJsZSkgcmV0dXJuXHJcblx0XHR0aGlzLm1lYXN1cmVIZWlnaHQoKVxyXG5cdFx0dGhpcy5zY3JvbGxUYXJnZXQuc2Nyb2xsVG9wID0gMFxyXG5cdFx0aWYgKHRoaXMub25TY3JvbGxUcmFuc2Zvcm1lcilcclxuXHRcdFx0dGhpcy5vblNjcm9sbFRyYW5zZm9ybWVyKDApXHJcblx0fVxyXG5cdHJlZnJlc2hTY3JvbGwoKSB7XHJcblx0XHR0aGlzLm1lYXN1cmVIZWlnaHQoKVxyXG5cdFx0aWYgKHRoaXMub25TY3JvbGxUcmFuc2Zvcm1lcilcclxuXHRcdFx0dGhpcy5vblNjcm9sbFRyYW5zZm9ybWVyKHRoaXMuc2Nyb2xsVGFyZ2V0LnNjcm9sbFRvcClcclxuXHR9XHJcblxyXG5cdHNldHVwQ29sbGFwc2libGVTY3JvbGwoKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCctIHNldHVwQ29sbGFwc2libGVTY3JvbGwnKVxyXG5cdFx0dGhpcy5tZWFzdXJlSGVpZ2h0KClcclxuXHRcdC8vY29uc29sZS5sb2coJ3RoaXMuY29sbGFwc2lsZUhlaWdodCcsIHRoaXMuY29sbGFwc2lsZUhlaWdodClcclxuXHRcdC8vIGRpc2FibGVkOiBoaWRkZW4gcGFnZXMgaW4gbWFzdGVyLWRldGFpbCBhcmUgaGlkZGVuIGFuZCB0aHVzIHRoZWlyIGNvbGxhcHNlSGVpZ2h0XHJcblx0XHQvLyAgICAgICAgICAgY2Fubm90IGJlIGNhbGN1bGF0ZWQgYXQgdGhlIG1vbWVudC4gYnV0IHRoZXkgYXJlIGNvbGxhcHNpYmxlXHJcblx0XHQvL2lmICh0aGlzLmNvbGxhcHNpbGVIZWlnaHQgPT09IDApIHJldHVyblxyXG5cclxuXHRcdHZhciBsYXN0Q29sbGFwc2UgPSAwXHJcblx0XHR2YXIgbGFzdFJldHJhY3QgPSAwXHJcblx0XHQvLyByZXNwb25kIHRvICdzY3JvbGwnIGV2ZW50IG9uIHNjcm9sbFRhcmdldCBieSBmaXJpbmcgY3VzdG9tICd0cmFuc2Zvcm0nXHJcblx0XHQvLyBldmVudCBmb3IgdG9vbGJhciB0byBiZSBhYmxlIHRvIHVkcGF0ZSBzdHlsZXMgaWYgbmVlZGVkXHJcblx0XHR2YXIgb25TY3JvbGxUcmFuc2Zvcm1lciA9IHRoaXMub25TY3JvbGxUcmFuc2Zvcm1lciA9IHNjcm9sbGVkID0+IHtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZygnb25TY3JvbGxUcmFuc2Zvcm1lcicsIHNjcm9sbGVkLCB0aGlzLmNvbGxhcHNpYmxlLCB0aGlzLmNvbGxhcHNpbGVIZWlnaHQpXHJcblx0XHRcdGlmICh0aGlzLmNvbGxhcHNpYmxlKSB7XHJcblx0XHRcdFx0dmFyIGNhcHBlZCA9IGNsYW1wKHNjcm9sbGVkLCAwLCB0aGlzLmNvbGxhcHNpbGVIZWlnaHQpXHJcblx0XHRcdFx0aWYgKGxhc3RDb2xsYXBzZSA9PT0gY2FwcGVkKSByZXR1cm5cclxuXHRcdFx0XHRsYXN0Q29sbGFwc2UgPSBjYXBwZWRcclxuXHRcdFx0XHR2YXIgcGVyY2VudGFnZSA9IGNhcHBlZCAvIHRoaXMuY29sbGFwc2lsZUhlaWdodFxyXG5cdFx0XHRcdHRoaXMuZW1pdCgnY29sbGFwc2UnLCBbcGVyY2VudGFnZSwgc2Nyb2xsZWQsIGNhcHBlZF0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMucmV0cmFjdGFibGUpIHtcclxuXHRcdFx0XHR2YXIgY2FwcGVkID0gY2xhbXAoc2Nyb2xsZWQsIDAsIHRoaXMuaGVpZ2h0KVxyXG5cdFx0XHRcdGlmIChsYXN0UmV0cmFjdCA9PT0gY2FwcGVkKSByZXR1cm5cclxuXHRcdFx0XHRsYXN0UmV0cmFjdCA9IGNhcHBlZFxyXG5cdFx0XHRcdHZhciBwZXJjZW50YWdlID0gY2FwcGVkIC8gdGhpcy5jb2xsYXBzZWRIZWlnaHRcclxuXHRcdFx0XHR0aGlzLmVtaXQoJ3JldHJhY3QnLCBbcGVyY2VudGFnZSwgc2Nyb2xsZWQsIGNhcHBlZF0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmFkZFNjcm9sbExpc3RlbmVycyhvblNjcm9sbFRyYW5zZm9ybWVyKVxyXG5cdFx0dGhpcy5yZWdpc3RlcktpbGxiYWNrKCgpID0+IHRoaXMucmVtb3ZlU2Nyb2xsTGlzdGVuZXJzKG9uU2Nyb2xsVHJhbnNmb3JtZXIpKVxyXG5cclxuXHRcdHRoaXMub24oZG9jdW1lbnQsICdmb3JtZmFjdG9yLXVwZGF0ZScsICgpID0+IHtcclxuXHRcdFx0Ly9zZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRsYXN0Q29sbGFwc2UgPSAwXHJcblx0XHRcdFx0bGFzdFJldHJhY3QgPSAwXHJcblx0XHRcdFx0b25TY3JvbGxUcmFuc2Zvcm1lcih0aGlzLnNjcm9sbGVkKVxyXG5cdFx0XHQvL30pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0c2V0dXBDdXN0b21MYXlvdXQoKSB7XHJcblx0XHR2YXIgYW5pbWF0ZVRpdGxlID0gdHJ1ZVxyXG5cdFx0dmFyIGFuaW1hdGVJbWcgPSB0cnVlXHJcblx0XHQvL3ZhciBncm9vdmUgPSBwbGF0Zm9ybS5uZW9uICYmIHRoaXMucXVlcnlTZWxlY3RvcignaW1nLCBbY29sbGFwc2VdLCBbY29sbGFwc2libGVdLCBbZmxleGlibGVdJylcclxuXHRcdHZhciBncm9vdmUgPSB0aGlzLmhhc0F0dHJpYnV0ZSgnZ3JvdmUnKVxyXG5cclxuXHRcdGlmIChncm9vdmUpIHtcclxuXHRcdFx0dGhpcy5vbignY29sbGFwc2UnLCAoW3BlcmNlbnRhZ2UsIHNjcm9sbGVkLCBjYXBwZWRdKSA9PiB7XHJcblx0XHRcdFx0dGhpcy4kLmNlbnRlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHstY2FwcGVkfXB4LCAwcHgsIDApYFxyXG5cdFx0XHR9KVxyXG5cdFx0XHRpZiAoYW5pbWF0ZUltZykge1xyXG5cdFx0XHRcdHRoaXMuY3VzdG9tTGF5b3V0ID0gdHJ1ZVxyXG5cdFx0XHRcdHZhciBpbWcgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJzpzY29wZSA+IGltZycpXHJcblx0XHRcdFx0aWYgKGltZykge1xyXG5cdFx0XHRcdFx0dmFyIG1pblNpemUgPSA4MFxyXG5cdFx0XHRcdFx0dmFyIG1heFNpemUgPSAyMzBcclxuXHRcdFx0XHRcdHRoaXMubWVhc3VyZUNvbGxhcHNpYmxlSGVpZ2h0Q3VzdG9tID0gKCkgPT4gbWF4U2l6ZSAtIG1pblNpemVcclxuXHRcdFx0XHRcdGltZy5zZXRBdHRyaWJ1dGUoJ3Nsb3QnLCAnbGVmdCcpXHJcblx0XHRcdFx0XHRpbWcuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gJ2xlZnQgdG9wJ1xyXG5cdFx0XHRcdFx0dGhpcy5vbignY29sbGFwc2UnLCAoW3BlcmNlbnRhZ2UsIHNjcm9sbGVkLCBjYXBwZWRdKSA9PiB7XHJcblx0XHRcdFx0XHRcdHZhciBpbWdTaXplID0gY2xhbXAobWF4U2l6ZSAtIGNhcHBlZCwgbWluU2l6ZSwgbWF4U2l6ZSlcclxuXHRcdFx0XHRcdFx0dmFyIGltZ1NjYWxlID0gaW1nU2l6ZSAvIG1heFNpemVcclxuXHRcdFx0XHRcdFx0aW1nLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgwcHgsICR7Y2FwcGVkfXB4LCAwKSBzY2FsZSgke2ltZ1NjYWxlfSlgXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoYW5pbWF0ZVRpdGxlKSB7XHJcblx0XHRcdFx0Y29uc29sZS53YXJuKCd0b2RvOiBjb2xsYXBzaWJsZSB0aXRsZScpXHJcblx0XHRcdFx0dmFyIHRpdGxlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbdGl0bGVdLCBoMSwgaDIsIGgzJylcclxuXHRcdFx0XHR2YXIgY29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlKHRpdGxlKVxyXG5cdFx0XHRcdHRpdGxlLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdsZWZ0IHRvcCdcclxuXHRcdFx0XHR2YXIgc3RhcnRTaXplID0gcGFyc2VJbnQoY29tcHV0ZWQuZm9udFNpemUpXHJcblx0XHRcdFx0dmFyIGVuZFNpemUgPSAyN1xyXG5cdFx0XHRcdHZhciB0ZW1wMSA9IGVuZFNpemUgLyBzdGFydFNpemVcclxuXHRcdFx0XHR2YXIgdGVtcDIgPSAxIC0gdGVtcDFcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKHN0YXJ0U2l6ZSwgZW5kU2l6ZSwgdGVtcDEsIHRlbXAyKVxyXG5cdFx0XHRcdHRoaXMub24oJ2NvbGxhcHNlJywgKFtwZXJjZW50YWdlLCBzY3JvbGxlZCwgY2FwcGVkXSkgPT4ge1xyXG5cdFx0XHRcdFx0Ly92YXIgdGl0bGVTY2FsZSA9IChwZXJjZW50YWdlICogdGVtcDIpICsgdGVtcDFcclxuXHRcdFx0XHRcdHZhciB0aXRsZVNjYWxlID0gMSAtIChwZXJjZW50YWdlICogdGVtcDIpXHJcblx0XHRcdFx0XHR0aXRsZS5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHt0aXRsZVNjYWxlfSlgXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0dXBDbG9uZSgpIHtcclxuXHRcdC8vY29uc29sZS5sb2coJ3NldHVwQ2xvbmUnKVxyXG5cdFx0dGhpcy5leHBhbmRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcblx0XHR0aGlzLnNjcm9sbFRhcmdldC5wcmVwZW5kKHRoaXMuZXhwYW5kZXIpXHJcblx0XHR2YXIgaW1nID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpbWcnKVxyXG5cdFx0aWYgKGltZykge1xyXG5cdFx0XHR2YXIgYXBwbHlCYWNrZ3JvdW5kID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuY2xvbmUuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke2ltZy5zcmN9KWBcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmNsb25lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuXHRcdFx0dGhpcy5jbG9uZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7aW1nLnNyY30pYFxyXG5cdFx0XHR0aGlzLmNsb25lLnNldEF0dHJpYnV0ZSgnYWJzb2x1dGUtdG9wJywgJycpXHJcblx0XHRcdHRoaXMuY2xvbmUuY2xhc3NMaXN0LmFkZCgnZngtdG9vbGJhci1leHBhbmRlcicpXHJcblx0XHRcdHRoaXMuY2xvbmUuY2xhc3NMaXN0LmFkZCgnaW1nJylcclxuXHRcdFx0dGhpcy5zY3JvbGxUYXJnZXQucHJlcGVuZCh0aGlzLmNsb25lKVxyXG5cdFx0XHRpbWcub25sb2FkID0gYXBwbHlCYWNrZ3JvdW5kXHJcblx0XHRcdGFwcGx5QmFja2dyb3VuZCgpXHJcblx0XHRcdHRoaXMub24oJ2NvbGxhcHNlJywgKFtwZXJjZW50YWdlLCBzY3JvbGxlZCwgY2FwcGVkXSkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuY2xvbmUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDBweCwgJHstY2FwcGVkfXB4LCAwKWBcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHRcdHRoaXMubWVhc3VyZUhlaWdodCgpXHJcblxyXG5cdFx0Ly8gc2xvdyBkb3duIHJlc2l6ZSBjYWxsYmFjayBieSB1c2luZyByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHRoaXMub25SZXNpemUgPSByYWZUaHJvdHRsZSgoKSA9PiB7XHJcblx0XHRcdHRoaXMubWVhc3VyZUhlaWdodCgpXHJcblx0XHRcdC8vY29uc29sZS5sb2coJ3Jlc2l6ZScpXHJcblx0XHR9KVxyXG5cdFx0Ly8gbm90ZTogcmVzaXplIGV2ZW50cyBjYW5ub3QgYmUgbGlzdGVuZWQgdG8gcGFzc2l2ZWx5XHJcblx0XHR0aGlzLm9uKHdpbmRvdywgJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpXHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBTT01FVEhJTkcgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5cdGdldFRyYW5zaXRpb24oc2VjdGlvbiwgc2hvd0RlZmF1bHQgPSB0aGlzLmJnVHJhbnNpdGlvbiwgaGlkZURlZmF1bHQgPSBzaG93RGVmYXVsdCkge1xyXG5cdFx0dmFyIHNlY3Rpb25UcmFuc2l0aW9uID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3RyYW5zaXRpb24nKSB8fCBzZWN0aW9uLmdldEF0dHJpYnV0ZSgndHJhbnNpdGlvbicpXHJcblx0XHR2YXIgc2hvd1RyYW5zaXRpb24gPSB0aGlzLmdldEF0dHJpYnV0ZSgndHJhbnNpdGlvbi1zaG93JykgfHwgc2VjdGlvbi5nZXRBdHRyaWJ1dGUoJ3RyYW5zaXRpb24tc2hvdycpIHx8IHNlY3Rpb25UcmFuc2l0aW9uIHx8IHNob3dEZWZhdWx0XHJcblx0XHR2YXIgaGlkZVRyYW5zaXRpb24gPSB0aGlzLmdldEF0dHJpYnV0ZSgndHJhbnNpdGlvbi1oaWRlJykgfHwgc2VjdGlvbi5nZXRBdHRyaWJ1dGUoJ3RyYW5zaXRpb24taGlkZScpIHx8IHNlY3Rpb25UcmFuc2l0aW9uIHx8IGhpZGVEZWZhdWx0XHJcblx0XHQvLyBDaGFuZ2UgdHJhbnNpdGlvbiB0byAnZmFkZScgaWYgdGhlIHRoZSB0b29sYmFyLWRlZmF1bHQgb3IgY3VzdG9tIHNlY3Rpb24gdHJhbnNpdGlvblxyXG5cdFx0Ly8gaXMgY2lyY3VsYXIgKHBvc2l0aW9uLCBvcmlnaW4sIGNlbnRlciwgZWRnZSkgYnV0IG9uIHNlY3Rpb25cclxuXHRcdC8vIHRoYXQgc2hhcmVzIHRoZSBzYW1lIGJhY2tncm91bmQgYXMgdGhlIHRvb2xiYXIgKHdoaWNoIHdvdWxkbid0IHdvcmsgYmVjYXVzZVxyXG5cdFx0Ly8gb2YgdHJhbnNwYXJlbnQgYmFja2dyb3VuZClcclxuXHRcdGlmICghaXNTZWN0aW9uRGlzdGluY3Qoc2VjdGlvbikpIHtcclxuXHRcdFx0aWYgKHNob3dUcmFuc2l0aW9uICE9PSAnbm9uZScgJiYgc2hvd1RyYW5zaXRpb24gIT09ICdzbGlkZScpXHJcblx0XHRcdFx0c2hvd1RyYW5zaXRpb24gPSAnZmFkZSdcclxuXHRcdFx0aWYgKGhpZGVUcmFuc2l0aW9uICE9PSAnbm9uZScgJiYgaGlkZVRyYW5zaXRpb24gIT09ICdzbGlkZScpXHJcblx0XHRcdFx0aGlkZVRyYW5zaXRpb24gPSAnZmFkZSdcclxuXHRcdH1cclxuXHRcdHJldHVybiBbc2hvd1RyYW5zaXRpb24sIGhpZGVUcmFuc2l0aW9uXVxyXG5cdH1cclxuXHJcblxyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBTRUxFQ1RJT04gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblx0c2V0dXBTZWxlY3Rpb24oKSB7XHJcblx0XHR2YXIgc2VsZWN0aW9uU2VjdGlvbiA9IHRoaXMuc2VsZWN0aW9uU2VjdGlvblxyXG5cclxuXHRcdGlmIChwbGF0Zm9ybS5tYXRlcmlhbCkge1xyXG5cdFx0XHR2YXIgW3NlbGVjdGlvblNob3dUcmFuc2l0aW9uLCBzZWxlY3Rpb25IaWRlVHJhbnNpdGlvbl1cclxuXHRcdFx0XHQ9IHRoaXMuZ2V0VHJhbnNpdGlvbihzZWxlY3Rpb25TZWN0aW9uLCAncG9zaXRpb24nLCAnZmFkZScpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgW3NlbGVjdGlvblNob3dUcmFuc2l0aW9uLCBzZWxlY3Rpb25IaWRlVHJhbnNpdGlvbl1cclxuXHRcdFx0XHQ9IHRoaXMuZ2V0VHJhbnNpdGlvbihzZWxlY3Rpb25TZWN0aW9uLCAnZmFkZScpXHJcblx0XHR9XHJcblx0XHR0aGlzLnNlbGVjdGlvblNob3dUcmFuc2l0aW9uID0gc2VsZWN0aW9uU2hvd1RyYW5zaXRpb25cclxuXHRcdHRoaXMuc2VsZWN0aW9uSGlkZVRyYW5zaXRpb24gPSBzZWxlY3Rpb25IaWRlVHJhbnNpdGlvblxyXG5cclxuXHJcblx0XHRzZWxlY3Rpb25TZWN0aW9uLnNldEF0dHJpYnV0ZSgnYWJzb2x1dGUtdG9wJywgJycpXHJcblx0XHRzZWxlY3Rpb25TZWN0aW9uLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJ1xyXG5cdFx0dGhpcy5zZWxlY3Rpb25PcGVuID0gZmFsc2VcclxuXHJcblx0XHQvLyB0aGUgdmVyeSBmaXJzdCBjaGlsZCAoYnV0dG9uKSBvZiB0aGUgc2VhcmNoIHNlY3Rpb24gd2lsbCBiZSBjbG9zaW5nIGl0XHJcblx0XHR0aGlzLnNlbGVjdGlvbkNsb3NlQnV0dG9uID0gc2VsZWN0aW9uU2VjdGlvbi5jaGlsZHJlblswXVxyXG5cdFx0dGhpcy5zZWxlY3Rpb25DbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0ZW1pdCh0aGlzLnBhcmVudFZpZXcsICdzZWxlY3Rpb24taGlkZScpXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0dGVtcFNlbGVjdGlvblNob3coKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCd0ZW1wU2VsZWN0aW9uU2hvdycpXHJcblx0XHR2YXIgc2VsZWN0aW9uU2VjdGlvbiA9IHRoaXMuc2VsZWN0aW9uU2VjdGlvblxyXG5cdFx0dGhpcy5vcmlnaW5hbE1haW5BdHRyaWJ1dGVzID0gW11cclxuXHJcblx0XHRzZWxlY3Rpb25TZWN0aW9uLnN0eWxlLmJhY2tncm91bmRDb2xvciAgPSAndHJhbnNwYXJlbnQnXHJcblx0XHQvL2NvbnNvbGUubG9nKCdzZWxlY3Rpb25TZWN0aW9uLnN0eWxlJywgc2VsZWN0aW9uU2VjdGlvbi5zdHlsZSlcclxuXHJcblx0XHRpZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ3RpbnRlZCcpKVxyXG5cdFx0XHR0aGlzLm9yaWdpbmFsTWFpbkF0dHJpYnV0ZXMucHVzaChbJ3RpbnRlZCddKVxyXG5cdFx0aWYgKHRoaXMuaGFzQXR0cmlidXRlKCdsaWdodCcpKVxyXG5cdFx0XHR0aGlzLm9yaWdpbmFsTWFpbkF0dHJpYnV0ZXMucHVzaChbJ2xpZ2h0J10pXHJcblx0XHRpZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ2RhcmsnKSlcclxuXHRcdFx0dGhpcy5vcmlnaW5hbE1haW5BdHRyaWJ1dGVzLnB1c2goWydkYXJrJ10pXHJcblx0XHRpZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ3ByaW1hcnknKSlcclxuXHRcdFx0dGhpcy5vcmlnaW5hbE1haW5BdHRyaWJ1dGVzLnB1c2goWydwcmltYXJ5JywgdGhpcy5nZXRBdHRyaWJ1dGUoJ3ByaW1hcnknKV0pXHJcblx0XHRpZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ2FjY2VudCcpKVxyXG5cdFx0XHR0aGlzLm9yaWdpbmFsTWFpbkF0dHJpYnV0ZXMucHVzaChbJ2FjY2VudCcsIHRoaXMuZ2V0QXR0cmlidXRlKCdhY2NlbnQnKV0pXHJcblxyXG5cdFx0aWYgKHNlbGVjdGlvblNlY3Rpb24uaGFzQXR0cmlidXRlKCd0aW50ZWQnKSkge1xyXG5cdFx0XHR2YXIgcHJpbWFyeSA9IHNlbGVjdGlvblNlY3Rpb24uZ2V0QXR0cmlidXRlKCdwcmltYXJ5JylcclxuXHRcdFx0aWYgKHByaW1hcnkpXHJcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ3ByaW1hcnknLCBwcmltYXJ5KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3RpbnRlZCcpXHJcblx0XHR9XHJcblx0XHRpZiAoc2VsZWN0aW9uU2VjdGlvbi5oYXNBdHRyaWJ1dGUoJ2xpZ2h0JykpXHJcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCdsaWdodCcsICcnKVxyXG5cdFx0aWYgKHNlbGVjdGlvblNlY3Rpb24uaGFzQXR0cmlidXRlKCdkYXJrJykpXHJcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCdkYXJrJywgJycpXHJcblx0fVxyXG5cdHRlbXBCaWdhc3NTZWxlY3Rpb25IaWRlKCkge1xyXG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZSgndGludGVkJylcclxuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2xpZ2h0JylcclxuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2RhcmsnKVxyXG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZSgncHJpbWFyeScpXHJcblx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKCdhY2NlbnQnKVxyXG5cdFx0XHR0aGlzLm9yaWdpbmFsTWFpbkF0dHJpYnV0ZXMuZm9yRWFjaChhdHRyID0+IHtcclxuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShhdHRyWzBdLCBhdHRyWzFdIHx8ICcnKVxyXG5cdFx0XHR9KVxyXG5cdH1cclxuXHJcblx0QG9uKCdwYXJlbnRWaWV3JywgJ3NlbGVjdGlvbi1zaG93Jywgc2VsZiA9PiBzZWxmLnNlbGVjdGlvbilcclxuXHRzaG93U2VsZWN0aW9uKGFuaW1hdGlvbk9yaWdpbiwgZSkge1xyXG5cdFx0Ly8gVE9ETzogc2hvdyB0b29sYmFyIGlmIGl0cyBoaWRkZW4gKGR1ZSB0byBzY3JvbGxpbmcpXHJcblx0XHRpZiAoIXRoaXMuc2VsZWN0aW9uKSByZXR1cm5cclxuXHRcdGlmICh0aGlzLnNlYXJjaE9wZW4pIHRoaXMuaGlkZVNlYXJjaCgpXHJcblx0XHRpZiAodGhpcy5zZWxlY3Rpb25PcGVuKSByZXR1cm5cclxuXHRcdHRoaXMuc2VsZWN0aW9uT3BlbiA9IHRydWVcclxuXHJcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMuc2VsZWN0aW9uU2VjdGlvbi5oYXNBdHRyaWJ1dGUoJ2xpZ2h0JykpXHJcblxyXG5cdFx0dGhpcy50ZW1wU2VsZWN0aW9uU2hvdygpXHJcblxyXG5cdFx0c3dpdGNoICh0aGlzLnNlbGVjdGlvblNob3dUcmFuc2l0aW9uKSB7XHJcblx0XHRcdGNhc2UgJ2VkZ2UnOlxyXG5cdFx0XHRcdGFuaW1hdGlvbi5jaXJjbGUuc2hvdyh0aGlzLnNlbGVjdGlvblNlY3Rpb24sICdib3R0b20nKVxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGNhc2UgJ2NlbnRlcic6XHJcblx0XHRcdC8vY29uc29sZS5sb2coJ3Nob3cgY2VudGVyJylcclxuXHRcdFx0XHRhbmltYXRpb24uY2lyY2xlLnNob3codGhpcy5zZWxlY3Rpb25TZWN0aW9uLCAnY2VudGVyJylcclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHRjYXNlICdvcmlnaW4nOlxyXG5cdFx0XHRjYXNlICdwb3NpdGlvbic6XHJcblx0XHRcdFx0YW5pbWF0aW9uLmNpcmNsZS5zaG93KHRoaXMuc2VsZWN0aW9uU2VjdGlvbiwgYW5pbWF0aW9uT3JpZ2luKVxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGNhc2UgJ3NsaWRlJzpcclxuXHRcdFx0XHRhbmltYXRpb24uc2xpZGVPdXQubGVmdCh0aGlzLm1haW5TZWN0aW9uKVxyXG5cdFx0XHRcdGFuaW1hdGlvbi5zbGlkZUluLmxlZnQodGhpcy5zZWxlY3Rpb25TZWN0aW9uKVxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGNhc2UgJ25vbmUnOlxyXG5cdFx0XHRcdHRoaXMubWFpblNlY3Rpb24uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nXHJcblx0XHRcdFx0dGhpcy5zZWxlY3Rpb25TZWN0aW9uLnN0eWxlLnZpc2liaWxpdHkgPSAnJ1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRoaXMubWFpblNlY3Rpb24uc2V0QXR0cmlidXRlKCdoaWRpbmcnLCAnJylcclxuXHRcdFx0XHR0aGlzLnNlbGVjdGlvblNlY3Rpb24uc2V0QXR0cmlidXRlKCdzaG93aW5nJywgJycpXHJcblx0XHRcdFx0dmFyIGZhZGVEdXJhdGlvbiA9IHBsYXRmb3JtLm1hdGVyaWFsID8gMjAwIDogODBcclxuXHRcdFx0XHRhbmltYXRpb24uZmFkZS5vdXQodGhpcy5tYWluU2VjdGlvbiwgZmFkZUR1cmF0aW9uKVxyXG5cdFx0XHRcdGFuaW1hdGlvbi5mYWRlLmluKHRoaXMuc2VsZWN0aW9uU2VjdGlvbiwgZmFkZUR1cmF0aW9uKVxyXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHR0aGlzLm1haW5TZWN0aW9uLnJlbW92ZUF0dHJpYnV0ZSgnaGlkaW5nJylcclxuXHRcdFx0XHRcdFx0dGhpcy5zZWxlY3Rpb25TZWN0aW9uLnJlbW92ZUF0dHJpYnV0ZSgnc2hvd2luZycpXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRAb24oJ3BhcmVudFZpZXcnLCAnc2VsZWN0aW9uLWhpZGUnLCBzZWxmID0+IHNlbGYuc2VsZWN0aW9uKVxyXG5cdGhpZGVTZWxlY3Rpb24oZSkge1xyXG5cdFx0aWYgKCF0aGlzLnNlbGVjdGlvbikgcmV0dXJuXHJcblx0XHRpZiAoIXRoaXMuc2VsZWN0aW9uT3BlbikgcmV0dXJuXHJcblx0XHR0aGlzLnNlbGVjdGlvbk9wZW4gPSBmYWxzZVxyXG5cclxuXHRcdHRoaXMudGVtcEJpZ2Fzc1NlbGVjdGlvbkhpZGUoKVxyXG5cclxuXHRcdHN3aXRjaCAodGhpcy5zZWxlY3Rpb25IaWRlVHJhbnNpdGlvbikge1xyXG5cdFx0XHRjYXNlICdlZGdlJzpcclxuXHRcdFx0XHRhbmltYXRpb24uY2lyY2xlLmhpZGUodGhpcy5zZWxlY3Rpb25TZWN0aW9uLCAnYm90dG9tJylcclxuXHRcdFx0XHR0aGlzLm1haW5TZWN0aW9uLnN0eWxlLnZpc2liaWxpdHkgPSAnJ1xyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGNhc2UgJ2NlbnRlcic6XHJcblx0XHRcdFx0YW5pbWF0aW9uLmNpcmNsZS5oaWRlKHRoaXMuc2VsZWN0aW9uU2VjdGlvbiwgJ2NlbnRlcicpXHJcblx0XHRcdFx0dGhpcy5tYWluU2VjdGlvbi5zdHlsZS52aXNpYmlsaXR5ID0gJydcclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHRjYXNlICdvcmlnaW4nOlxyXG5cdFx0XHRjYXNlICdwb3NpdGlvbic6XHJcblx0XHRcdFx0YW5pbWF0aW9uLmNpcmNsZS5oaWRlKHRoaXMuc2VsZWN0aW9uU2VjdGlvbiwgZSlcclxuXHRcdFx0XHR0aGlzLm1haW5TZWN0aW9uLnN0eWxlLnZpc2liaWxpdHkgPSAnJ1xyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGNhc2UgJ3NsaWRlJzpcclxuXHRcdFx0XHRhbmltYXRpb24uc2xpZGVPdXQucmlnaHQodGhpcy5zZWxlY3Rpb25TZWN0aW9uKVxyXG5cdFx0XHRcdGFuaW1hdGlvbi5zbGlkZUluLnJpZ2h0KHRoaXMubWFpblNlY3Rpb24pXHJcblx0XHRcdFx0YnJlYWtcclxuXHRcdFx0Y2FzZSAnbm9uZSc6XHJcblx0XHRcdFx0dGhpcy5zZWxlY3Rpb25TZWN0aW9uLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJ1xyXG5cdFx0XHRcdHRoaXMubWFpblNlY3Rpb24uc3R5bGUudmlzaWJpbGl0eSA9ICcnXHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhpcy5zZWxlY3Rpb25TZWN0aW9uLnNldEF0dHJpYnV0ZSgnaGlkaW5nJywgJycpXHJcblx0XHRcdFx0dGhpcy5tYWluU2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ3Nob3dpbmcnLCAnJylcclxuXHRcdFx0XHR2YXIgZmFkZUR1cmF0aW9uID0gcGxhdGZvcm0ubWF0ZXJpYWwgPyAyMDAgOiA4MFxyXG5cdFx0XHRcdGFuaW1hdGlvbi5mYWRlLm91dCh0aGlzLnNlbGVjdGlvblNlY3Rpb24sIGZhZGVEdXJhdGlvbilcclxuXHRcdFx0XHRhbmltYXRpb24uZmFkZS5pbih0aGlzLm1haW5TZWN0aW9uLCBmYWRlRHVyYXRpb24pXHJcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XHJcblx0XHRcdFx0XHRcdHRoaXMuc2VsZWN0aW9uU2VjdGlvbi5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGluZycpXHJcblx0XHRcdFx0XHRcdHRoaXMubWFpblNlY3Rpb24ucmVtb3ZlQXR0cmlidXRlKCdzaG93aW5nJylcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0YnJlYWtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblx0Ly9Ab24oJ2NsaWNrJylcclxuXHQvL29uY2xpY2sxKGRhdGEsIGUpIHtcclxuXHQvL1x0aWYgKHRoaXMuc2VhcmNoXHJcblx0Ly9cdCYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZVxyXG5cdC8vXHQmJiBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2ljb24nKSA9PT0gJ3NlYXJjaCcpXHJcblx0Ly9cdFx0ZW1pdCh0aGlzLnBhcmVudFZpZXcsICdzZWFyY2gtc2hvdycpXHJcblx0Ly99XHJcblx0QG9uKCdwYXJlbnRWaWV3JywgJ2NsaWNrJywgc2VsZiA9PiBzZWxmLnNlbGVjdGlvbilcclxuXHRvbmNsaWNrMihkYXRhLCBlKSB7XHJcblx0XHR2YXIge3RhcmdldH0gPSBlXHJcblx0XHQvLyBUT0RPIFtzZWxlY3RhYmxlXVxyXG5cdFx0aWYgKHRhcmdldC5nZXRBdHRyaWJ1dGVcclxuXHRcdCYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG5cdFx0XHR2YXIgY2hlY2tib3hlcyA9IHRoaXMucGFyZW50Vmlldy5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKVxyXG5cdFx0XHRjaGVja2JveGVzID0gQXJyYXkuZnJvbShjaGVja2JveGVzKVxyXG5cdFx0XHR2YXIgYW55Q2hlY2tlZCA9IGNoZWNrYm94ZXMuc29tZShjaGVja2JveCA9PiBjaGVja2JveC5jaGVja2VkKVxyXG5cdFx0XHRpZiAoYW55Q2hlY2tlZClcclxuXHRcdFx0XHRlbWl0KHRoaXMucGFyZW50VmlldywgJ3NlbGVjdGlvbi1zaG93JywgZSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGVtaXQodGhpcy5wYXJlbnRWaWV3LCAnc2VsZWN0aW9uLWhpZGUnLCBlKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHRzZXR1cFNlYXJjaCgpIHtcclxuXHRcdC8vIFRPRE8gLSBhbmRyb2lkIG9ubHkuIHdpbmpzIGRvZXMgbm90IGhhdmUgY2FyZHMgYW5kIGNhcmQgc2VhcmNoIHdpbGwgYmUgcmVuZGVyZWQgYXMgdXN1YWwgaW5wdXRcclxuXHRcdC8vIGlkZWE6IC0gbm9ybWFsIChpbnZpc2libGUpIHNlYXJjaCBpbnB1dCByZW1haW5zIGludmlzaWJsZSAoaW4gYm90aCBhbmRyb2lkIGFuZCB3aW5qcylcclxuXHRcdC8vICAgICAgIC0gY2FyZCBzZWFyY2ggaW5wdXQgd2lsbCBsb29rIGFzIGNhcmQgaW4gYW5kcm9pZCwgYW5kIGFzIGJvcmRlcmVkIGlucHV0IGluIHdpbmpzIChsaWtlIGluIG1hbnkgd2luMTAgYXBwcyB0aGVyZSBpcyB2aXNpYmxlIHRleHRib3ggaW4gdGhlIHRvb2xiYXIpXHJcblx0XHR2YXIgc2VhcmNoU2VjdGlvbiA9IHRoaXMuc2VhcmNoU2VjdGlvblxyXG5cclxuXHRcdGlmIChwbGF0Zm9ybS5tYXRlcmlhbCAmJiBzZWFyY2hTZWN0aW9uLmhhc0F0dHJpYnV0ZSgnY2FyZCcpKSB7XHJcblx0XHRcdC8vIGNhcmQgdGFrZXMgNjRweCBoZWlnaHQgc3BhY2UgKDQ4ICsgbWFyZ2luKSBldmVuIG9uIHBob25lXHJcblx0XHRcdC8vIGFuZCBtYWluIHNlY3Rpb24gaGFzIHRvIGhhdmUgdGhlIHNhbWUgaGVpZ2h0IHRvIHByZXZlbnQgamFua3kgdHJhbnNpdGlvblxyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnaGFzY2FyZCcsICcnKVxyXG5cdFx0XHQvL3RoaXMubWFpblNlY3Rpb24uc3R5bGUuaGVpZ2h0ID0gJzY0cHgnO1xyXG5cdFx0XHR2YXIgZGVmYXVsdFRyYW5zaXRpb24gPSAncG9zaXRpb24nXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgZGVmYXVsdFRyYW5zaXRpb24gPSAnZmFkZSdcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIFtzZWFyY2hTaG93VHJhbnNpdGlvbiwgc2VhcmNoSGlkZVRyYW5zaXRpb25dXHJcblx0XHRcdD0gdGhpcy5nZXRUcmFuc2l0aW9uKHNlYXJjaFNlY3Rpb24sIGRlZmF1bHRUcmFuc2l0aW9uKVxyXG5cdFx0dGhpcy5zZWFyY2hTaG93VHJhbnNpdGlvbiA9IHNlYXJjaFNob3dUcmFuc2l0aW9uXHJcblx0XHR0aGlzLnNlYXJjaEhpZGVUcmFuc2l0aW9uID0gc2VhcmNoSGlkZVRyYW5zaXRpb25cclxuXHJcblx0XHQvLyBzZWFyY2ggc2VjdGlvbiBoYXMgdG8gb3ZlcmxheSB0aGUgbWFpbiBzZWN0aW9uIHRvIGJsZW5kIHRoZW0gaW4gYW5pbWF0aW9uXHJcblx0XHRzZWFyY2hTZWN0aW9uLnNldEF0dHJpYnV0ZSgnYWJzb2x1dGUtdG9wJywgJycpXHJcblx0XHQvLyBoaWRlIHRoZSBzZWN0aW9uIGZvciBub3cuIG9ubHkgdGhlIG1haW4gc2VjdGlvbiBpcyB2aXNpYmxlXHJcblx0XHRzZWFyY2hTZWN0aW9uLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJ1xyXG5cdFx0dGhpcy5zZWFyY2hPcGVuID0gZmFsc2VcclxuXHJcblx0XHQvLyBnZXQgc2VhcmNoIGljb24gdG8gc2hvdyB0aGUgc2VjdGlvblxyXG5cdFx0Ly90aGlzLnNlYXJjaEJ1dHRvbiA9IF8uZmluZCh0aGlzLm1haW5TZWN0aW9uLmNoaWxkcmVuLCBjaGlsZCA9PiBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2ljb24nKSA9PSAnc2VhcmNoJylcclxuXHRcdHRoaXMuc2VhcmNoQnV0dG9uID0gdGhpcy5tYWluU2VjdGlvbi5xdWVyeVNlbGVjdG9yKCdbaWNvbj1cInNlYXJjaFwiXScpXHJcblx0XHQvLyB0aGUgdmVyeSBmaXJzdCBjaGlsZCAoYnV0dG9uKSBvZiBoZSBzZWFyY2ggc2VjdGlvbiB3aWxsIGJlIGNsb3NpbmcgaXRcclxuXHRcdHRoaXMuc2VhcmNoQ2xvc2VCdXR0b24gPSBzZWFyY2hTZWN0aW9uLmNoaWxkcmVuWzBdXHJcblxyXG5cdFx0Ly8gdG9kbyAtIG1lbW9yeSBsZWFrXHJcblx0XHRpZiAodGhpcy5zZWFyY2hCdXR0b24pXHJcblx0XHRcdHRoaXMuc2VhcmNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiBlbWl0KHRoaXMucGFyZW50VmlldywgJ3NlYXJjaC1zaG93JykpXHJcblx0XHRpZiAodGhpcy5zZWFyY2hDbG9zZUJ1dHRvbilcclxuXHRcdFx0dGhpcy5zZWFyY2hDbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4gZW1pdCh0aGlzLnBhcmVudFZpZXcsICdzZWFyY2gtaGlkZScpKVxyXG5cdH1cclxuXHJcblx0QG9uKCdwYXJlbnRWaWV3JywgJ3NlYXJjaC1zaG93Jywgc2VsZiA9PiBzZWxmLnNlYXJjaClcclxuXHRzaG93U2VhcmNoKCkge1xyXG5cdFx0aWYgKCF0aGlzLnNlYXJjaCkgcmV0dXJuXHJcblx0XHRpZiAodGhpcy5zZWFyY2hPcGVuKSByZXR1cm5cclxuXHRcdHRoaXMuc2VhcmNoT3BlbiA9IHRydWVcclxuXHRcdHZhciBzZWFyY2hTZWN0aW9uID0gdGhpcy5zZWFyY2hTZWN0aW9uXHJcblxyXG5cdFx0aWYgKHRoaXMuc2VhcmNoU2hvd1RyYW5zaXRpb24gPT0gJ3Bvc2l0aW9uJykge1xyXG5cdFx0XHR2YXIgZmluaXNoZWQgPSBhbmltYXRpb24uY2lyY2xlLnNob3coc2VhcmNoU2VjdGlvbiwgdGhpcy5zZWFyY2hCdXR0b24pXHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuc2VhcmNoU2hvd1RyYW5zaXRpb24gPT0gJ2ZhZGUnKSB7XHJcblx0XHRcdHZhciBmaW5pc2hlZCA9IGFuaW1hdGlvbi5mYWRlLmluKHNlYXJjaFNlY3Rpb24pXHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuc2VhcmNoU2hvd1RyYW5zaXRpb24gPT0gJ3NsaWRlJykge1xyXG5cdFx0XHR2YXIgZmluaXNoZWQgPSBhbmltYXRpb24uc2xpZGVJbi5sZWZ0KHNlYXJjaFNlY3Rpb24pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWFyY2hTZWN0aW9uLnN0eWxlLnZpc2liaWxpdHkgPSAnJ1xyXG5cdFx0XHR2YXIgZmluaXNoZWQgPSBQcm9taXNlLnJlc29sdmUoKVxyXG5cdFx0fVxyXG5cdFx0Ly8gZm9jdXMgdGhlIHNlYXJjaCBpbnB1dFxyXG5cdFx0dmFyIHNlYXJjaElucHV0ID0gc2VhcmNoU2VjdGlvbi5xdWVyeVNlbGVjdG9yKCdpbnB1dDpub3QoW3R5cGU9XCJjaGVja2JveFwiXSknKVxyXG5cdFx0ZmluaXNoZWQudGhlbigoKSA9PiBzZWFyY2hJbnB1dC5mb2N1cygpKVxyXG5cdH1cclxuXHJcblx0QG9uKCdwYXJlbnRWaWV3JywgJ3NlYXJjaC1oaWRlJywgc2VsZiA9PiBzZWxmLnNlYXJjaClcclxuXHRoaWRlU2VhcmNoKCkge1xyXG5cdFx0aWYgKCF0aGlzLnNlYXJjaCkgcmV0dXJuXHJcblx0XHRpZiAoIXRoaXMuc2VhcmNoT3BlbikgcmV0dXJuXHJcblx0XHR0aGlzLnNlYXJjaE9wZW4gPSBmYWxzZVxyXG5cdFx0dmFyIHNlYXJjaFNlY3Rpb24gPSB0aGlzLnNlYXJjaFNlY3Rpb25cclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuc2VhcmNoSGlkZVRyYW5zaXRpb24gPT0gJ3Bvc2l0aW9uJykge1xyXG5cdFx0XHRhbmltYXRpb24uY2lyY2xlLmhpZGUoc2VhcmNoU2VjdGlvbiwgdGhpcy5zZWFyY2hCdXR0b24pXHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuc2VhcmNoSGlkZVRyYW5zaXRpb24gPT0gJ2ZhZGUnKSB7XHJcblx0XHRcdGFuaW1hdGlvbi5mYWRlLm91dChzZWFyY2hTZWN0aW9uKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2VhcmNoU2VjdGlvbi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcclxuXHRcdFx0dmFyIGZpbmlzaGVkID0gUHJvbWlzZS5yZXNvbHZlKClcclxuXHRcdH1cclxuXHRcdHRoaXMuc2VhcmNoT3BlbiA9IGZhbHNlXHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gSElERSAvIFNIT1cgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5cdHNob3coKSB7XHJcblx0XHR0aGlzLmVtaXQoJ3Nob3cnKVxyXG5cdH1cclxuXHJcblx0aGlkZSgpIHtcclxuXHRcdHRoaXMuZW1pdCgnaGlkZScpXHJcblx0fVxyXG5cclxuXHR0aHJlc2hvbGRSZXRyYWN0YWJsZUhlaWdodCA9IDBcclxuXHJcblx0QG9uKCdzaG93JylcclxuXHRvblNob3coKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdvblNob3cnKVxyXG5cdFx0Ly9pZiAodGhpcy5yZXRyYWN0YWJsZSlcclxuXHRcdHZhciB5ID0gdGhpcy50aHJlc2hvbGRSZXRyYWN0YWJsZUhlaWdodFxyXG5cdFx0dGhpcy5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoMHB4LCAke3l9cHgsIDApYFxyXG5cdFx0Ly90aGlzLmFuaW1hdGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDBweCwgJHstY2FwcGVkfXB4LCAwKWBcclxuXHR9XHJcblxyXG5cdEBvbignaGlkZScpXHJcblx0b25IaWRlKCkge1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnb25IaWRlJylcclxuXHRcdHRoaXMuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDBweCwgLTEwMCUsIDApYFxyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gQkFDS0dST1VORCBUUkFOU0lUSU9OIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuXHJcblx0Ly8gTk9URTogbm90IG5pY2UsIGJ1dCB0aGVyZSdzIG5vIG90aGVyIHdheSB0byBhY2Nlc3Mgb3V0ZXIgY3NzIGZyb20gc2hhZG93IGRvbVxyXG5cdHNldHVwQmdUcmFuc2l0aW9uKCkge1xyXG5cdFx0dGhpcy5vbGRCZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG5cdFx0dGhpcy5uZXdCZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG5cdFx0dGhpcy5vbGRCZ0VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG5cdFx0dGhpcy5uZXdCZ0VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG5cdFx0dGhpcy5vbGRCZ0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzbG90JywgJ2N1c3RvbS1iZy1vbGQnKVxyXG5cdFx0dGhpcy5uZXdCZ0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzbG90JywgJ2N1c3RvbS1iZy1uZXcnKVxyXG5cdFx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLm9sZEJnRWxlbWVudClcclxuXHRcdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5uZXdCZ0VsZW1lbnQpXHJcblx0XHR0aGlzLm9sZEJnV3JhcHBlciA9IHRoaXMuJFsnY3VzdG9tLWJnLW9sZCddXHJcblx0XHR0aGlzLm5ld0JnV3JhcHBlciA9IHRoaXMuJFsnY3VzdG9tLWJnLW5ldyddXHJcblx0fVxyXG5cclxuXHQvLyBbcHJpbWFyeV0gY29sb3IgY2hhbmdlZFxyXG5cdHByaW1hcnlDaGFuZ2VkKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xyXG5cdFx0aWYgKHRoaXMuYmdUcmFuc2l0aW9uICE9PSAnbm9uZScgJiYgdGhpcy5iZ1RyYW5zaXRpb24gIT09ICdmYWRlJykge1xyXG5cdFx0XHRvbGRWYWx1ZSA9IG9sZFZhbHVlIHx8IHRyYXZlcnNlVmFsdWUodGhpcy5wYXJlbnRFbGVtZW50LCBub2RlID0+IG5vZGUuZ2V0QXR0cmlidXRlKCdwcmltYXJ5JykpXHJcblx0XHRcdHRoaXMudHJhbnNpdGlvbkJhY2tncm91bmQob2xkVmFsdWUsIG5ld1ZhbHVlKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gYW5pbWF0ZSB0cmFuc2l0aW9uIGZyb20gb2xkIGJhY2tncm91bmQgdG8gbmV3IG9uZVxyXG5cdHRyYW5zaXRpb25CYWNrZ3JvdW5kKG9sZFByaW1hcnksIG5ld1ByaW1hcnkpIHtcclxuXHRcdC8qdGhpcy5vbGRCZ0VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuXHRcdHRoaXMubmV3QmdFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcblx0XHR0aGlzLm9sZEJnRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ByaW1hcnknLCBvbGRQcmltYXJ5KVxyXG5cdFx0dGhpcy5uZXdCZ0VsZW1lbnQuc2V0QXR0cmlidXRlKCdwcmltYXJ5JywgbmV3UHJpbWFyeSlcclxuXHJcblx0XHR2YXIgZnJvbSA9IHRoaXMuYmdUcmFuc2l0aW9uID09PSAnY2VudGVyJyA/ICdjZW50ZXInIDogdGhpcy5iZ1RyYW5zaXRpb25Tb3VyY2VcclxuXHRcdGFuaW1hdGlvbi5jaXJjbGUuc2hvdyh0aGlzLm5ld0JnV3JhcHBlciwgZnJvbSlcclxuXHRcdFx0LnRoZW4oKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMub2xkQmdFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuXHRcdFx0XHR0aGlzLm5ld0JnRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0dGhpcy5iZ1RyYW5zaXRpb25Tb3VyY2UgPSB1bmRlZmluZWQqL1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbn1cclxuXHJcbndpbmRvdy5GbGV4dXNUb29sYmFyXHJcbiJdLCJuYW1lcyI6WyJoYXNBdHRyaWJ1dGUiLCJhdHRyTmFtZSIsIm5vZGUiLCJpc1NlY3Rpb25EaXN0aW5jdCIsInRhcmdldCIsInN1bSIsImFycmF5IiwiZXh0cmFjdG9yIiwicmVzdWx0IiwiaSIsImxlbmd0aCIsImFkZFJlYWR5QW5pbWF0aW9uIiwiRmxleHVzVG9vbGJhciIsImNzcyIsInRlbXBsYXRlIiwib24iLCJkb2N1bWVudCIsInNlbGYiLCJzZWxlY3Rpb24iLCJzZWFyY2giLCJjdXN0b21FbGVtZW50IiwiZ2FueW1lZGVFbGVtZW50IiwiUmV0cmFjdGFibGUiLCJTY3JvbGxhYmxlIiwiaXNBYm92ZUNvbnRlbnQiLCJjb2xsYXBzZWRIZWlnaHQiLCJjb2xsYXBzaWxlSGVpZ2h0IiwidGhyZXNob2xkUmV0cmFjdGFibGVIZWlnaHQiLCJ0b29sYmFyIiwicGFyZW50VmlldyIsInBhcmVudEVsZW1lbnQiLCJjaGlsZHJlbiIsIkFycmF5IiwiZnJvbSIsInNjcm9sbFRhcmdldENhbmRpZGF0ZSIsInNjcm9sbFRhcmdldCIsIm5leHRFbGVtZW50U2libGluZyIsImNhblNjcm9sbCIsInNldHVwU2Nyb2xsYWJsZSIsIm11bHRpc2VjdGlvbiIsInNvbWUiLCJuYW1lIiwibG9jYWxOYW1lIiwic2V0dXBNdWx0aXNlY3Rpb24iLCJyZXRyYWN0YWJsZSIsIm1lYXN1cmVIZWlnaHQiLCJzZXR1cEN1c3RvbUxheW91dCIsImNvbGxhcHNpYmxlIiwiYmdUcmFuc2l0aW9uIiwic2V0dXBCZ1RyYW5zaXRpb24iLCJzZXRBdHRyaWJ1dGUiLCJtaXJyb3JIZWlnaHQiLCJzZXR1cENsb25lIiwid2F0ZXJmYWxsIiwiZWxldmF0aW9uIiwibGlzdGVuZXIiLCJzY3JvbGxlZCIsImFkZFNjcm9sbExpc3RlbmVycyIsInJlZ2lzdGVyS2lsbGJhY2siLCJyZW1vdmVTY3JvbGxMaXN0ZW5lcnMiLCJvdmVybGFwIiwiJCIsIm92ZXJsYXBDbGFzc0xpc3QiLCJjbGFzc0xpc3QiLCJpc0hpZGRlbiIsInNjcm9sbExpc3RlbmVycyIsInB1c2giLCJhZGQiLCJyZW1vdmUiLCJzZWN0aW9ucyIsIm1haW5TZWN0aW9uIiwiZmluZCIsInNlbGVjdGlvblNlY3Rpb24iLCJzZWFyY2hTZWN0aW9uIiwiY29sbGFwc2libGVTZWxlY3RvciIsImNvbGxhcHNpYmxlU2VjdGlvbnMiLCJzdGlja3lTZWN0aW9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmaWx0ZXIiLCJzZWN0aW9uIiwiaW5jbHVkZXMiLCJmbGV4U2VjdGlvbiIsInF1ZXJ5U2VsZWN0b3IiLCJzZXR1cFNlbGVjdGlvbiIsInNldHVwU2VhcmNoIiwic2V0dXBDb2xsYXBzaWJsZSIsImZpcnN0Q29sbGFwc2libGUiLCJsYXN0Q29sbGFwc2libGUiLCJiZWZvcmUiLCJzbGljZSIsImluZGV4T2YiLCJhZnRlciIsImZvckVhY2giLCJzIiwic3RpY2t5T3ZlcmxheVNlY3Rpb25zIiwicGFyYWxsYXhWYWx1ZSIsImdldEF0dHJpYnV0ZSIsInBhcmFsbGF4V3JhcFN0eWxlIiwicGFyYWxsYXh3cmFwIiwic3R5bGUiLCJwIiwiY2FwcGVkIiwidHJhbnNmb3JtIiwic2V0dXBGYWRlTm9kZXMiLCJzZXR1cFBhcmFsbGF4Tm9kZXMiLCJzZXR1cENvbGxhcHNpYmxlU2Nyb2xsIiwibm9kZXMiLCJhY3RpdmUiLCJpbmFjdGl2ZSIsInJlcyIsIm1hdGNoRm9ybUZhY3RvckRlZiIsInN0YWNrIiwiYWN0aXZlTm9kZXMiLCJpbmFjdGl2ZU5vZGVzIiwiZmluZEF0dHJOb2RlcyIsImZhZGVOb2RlcyIsInJlbmRlckZhZGUiLCJwZXJjZW50YWdlIiwib3BhY2l0eSIsIm9mZiIsInVuZGVmaW5lZCIsInBhcmFsbGF4Tm9kZXMiLCJyZW5kZXJQYXJhbGxheCIsInJhdGlvIiwiY3VzdG9tTGF5b3V0IiwibWVhc3VyZUNvbGxhcHNpYmxlSGVpZ2h0Q3VzdG9tIiwic2VjdGlvbkhlaWdodCIsImdldENvbXB1dGVkU3R5bGUiLCJvZmZzZXRIZWlnaHQiLCJwYXJzZUludCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImhlaWdodCIsImV4cGFuZGVyIiwiY2xvbmUiLCJzY3JvbGxUb3AiLCJvblNjcm9sbFRyYW5zZm9ybWVyIiwibGFzdENvbGxhcHNlIiwibGFzdFJldHJhY3QiLCJjbGFtcCIsImVtaXQiLCJhbmltYXRlVGl0bGUiLCJhbmltYXRlSW1nIiwiZ3Jvb3ZlIiwiY2VudGVyIiwiaW1nIiwibWluU2l6ZSIsIm1heFNpemUiLCJ0cmFuc2Zvcm1PcmlnaW4iLCJpbWdTaXplIiwiaW1nU2NhbGUiLCJ3YXJuIiwidGl0bGUiLCJjb21wdXRlZCIsInN0YXJ0U2l6ZSIsImZvbnRTaXplIiwiZW5kU2l6ZSIsInRlbXAxIiwidGVtcDIiLCJ0aXRsZVNjYWxlIiwiY3JlYXRlRWxlbWVudCIsInByZXBlbmQiLCJhcHBseUJhY2tncm91bmQiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJzcmMiLCJvbmxvYWQiLCJvblJlc2l6ZSIsInJhZlRocm90dGxlIiwid2luZG93Iiwic2hvd0RlZmF1bHQiLCJoaWRlRGVmYXVsdCIsInNlY3Rpb25UcmFuc2l0aW9uIiwic2hvd1RyYW5zaXRpb24iLCJoaWRlVHJhbnNpdGlvbiIsInBsYXRmb3JtIiwibWF0ZXJpYWwiLCJzZWxlY3Rpb25TaG93VHJhbnNpdGlvbiIsInNlbGVjdGlvbkhpZGVUcmFuc2l0aW9uIiwiZ2V0VHJhbnNpdGlvbiIsInZpc2liaWxpdHkiLCJzZWxlY3Rpb25PcGVuIiwic2VsZWN0aW9uQ2xvc2VCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInByZXZlbnREZWZhdWx0Iiwib3JpZ2luYWxNYWluQXR0cmlidXRlcyIsImJhY2tncm91bmRDb2xvciIsInByaW1hcnkiLCJyZW1vdmVBdHRyaWJ1dGUiLCJhdHRyIiwiYW5pbWF0aW9uT3JpZ2luIiwic2VhcmNoT3BlbiIsImhpZGVTZWFyY2giLCJ0ZW1wU2VsZWN0aW9uU2hvdyIsImNpcmNsZSIsInNob3ciLCJzbGlkZU91dCIsImxlZnQiLCJzbGlkZUluIiwiZmFkZUR1cmF0aW9uIiwiZmFkZSIsIm91dCIsImluIiwidGhlbiIsInRlbXBCaWdhc3NTZWxlY3Rpb25IaWRlIiwiaGlkZSIsInJpZ2h0IiwiZGF0YSIsImNoZWNrYm94ZXMiLCJhbnlDaGVja2VkIiwiY2hlY2tib3giLCJjaGVja2VkIiwiZGVmYXVsdFRyYW5zaXRpb24iLCJzZWFyY2hTaG93VHJhbnNpdGlvbiIsInNlYXJjaEhpZGVUcmFuc2l0aW9uIiwic2VhcmNoQnV0dG9uIiwic2VhcmNoQ2xvc2VCdXR0b24iLCJmaW5pc2hlZCIsImFuaW1hdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwic2VhcmNoSW5wdXQiLCJmb2N1cyIsInkiLCJvbGRCZ0VsZW1lbnQiLCJuZXdCZ0VsZW1lbnQiLCJkaXNwbGF5IiwiYXBwZW5kQ2hpbGQiLCJvbGRCZ1dyYXBwZXIiLCJuZXdCZ1dyYXBwZXIiLCJuZXdWYWx1ZSIsIm9sZFZhbHVlIiwidHJhdmVyc2VWYWx1ZSIsInRyYW5zaXRpb25CYWNrZ3JvdW5kIiwib2xkUHJpbWFyeSIsIm5ld1ByaW1hcnkiLCJyZWZsZWN0IiwiU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxBQUNBLEFBQ0EsQUFHQSxTQUFTQSxZQUFULENBQXNCQyxRQUF0QixFQUFnQztRQUN4QkMsUUFBUUEsS0FBS0YsWUFBTCxDQUFrQkMsUUFBbEIsQ0FBZjs7O0FBR0QsU0FBU0UsaUJBQVQsQ0FBMkJDLE1BQTNCLEVBQW1DO1FBQzNCQSxPQUFPSixZQUFQLENBQW9CLFFBQXBCLEtBQ0hJLE9BQU9KLFlBQVAsQ0FBb0IsT0FBcEIsQ0FERyxJQUVISSxPQUFPSixZQUFQLENBQW9CLE1BQXBCLENBRkcsSUFHSEksT0FBT0osWUFBUCxDQUFvQixNQUFwQixDQUhHLElBSUhJLE9BQU9KLFlBQVAsQ0FBb0IsU0FBcEIsQ0FKRyxJQUtISSxPQUFPSixZQUFQLENBQW9CLFFBQXBCLENBTEo7OztBQVFELFNBQVNLLEdBQVQsQ0FBYUMsS0FBYixFQUFvQkMsU0FBcEIsRUFBK0I7S0FDMUJDLFNBQVMsQ0FB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
