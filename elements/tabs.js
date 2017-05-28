(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede'), require('flexus')) :
	typeof define === 'function' && define.amd ? define('tabs', ['ganymede', 'flexus'], factory) :
	(factory(global.ganymede,global.flexus));
}(this, (function (ganymede,flexus) { 'use strict';

var ganymede__default = 'default' in ganymede ? ganymede['default'] : ganymede;

var _dec;
var _dec2;
var _dec3;
var _dec4;
var _dec5;
var _dec6;
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
var _descriptor8;
var _descriptor9;
var _descriptor10;
var _descriptor11;

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
	return undefined;
}

function whenReady(element, callback) {
	function listener() {
		element.removeEventListener('ready', listener);
		callback();
	}
	element.addEventListener('ready', listener);
}

function getDirection(newIndex, oldIndex) {
	return oldIndex > newIndex ? 'left' : oldIndex < newIndex ? 'right' : 'none';
}

function selectedValidator(newIndex, self) {
	var children = this.children;
	if (newIndex < 0) newIndex = 0;
	if (newIndex > children.length - 1) newIndex = children.length - 1;
	var target = children[newIndex];
	if (flexus.isNodeAvailable(target)) {
		return newIndex;
	} else {
		return self.selected;
	}
}

function pickClosest(children, target, newIndex, oldIndex) {
	var direction = getDirection(newIndex, oldIndex);
	if (direction === 'right') {
		while (target) {
			target = target.nextElementSibling;
			if (target && flexus.isNodeAvailable(target)) break;
		}
	}
	if (direction === 'left') {
		while (target) {
			target = target.previousElementSibling;
			if (target && flexus.isNodeAvailable(target)) break;
		}
	}
	if (target) return [...children].indexOf(target);else return oldIndex;
}

let FlexusTabs = (_dec = ganymede.template(`
	<div id="tabs">
	<!--div id="tabsinner"-->
		<slot></slot>
		<div id="bar" class="transition"></div>
	<!--/div-->
	</div>
`), _dec2 = ganymede.css(`
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

`), _dec3 = ganymede.on('beforeready'), _dec4 = ganymede.on('keyup'), _dec5 = ganymede.on('click'), _dec6 = ganymede.on(document, 'formfactor-update'), ganymede.customElement(_class = _dec(_class = _dec2(_class = (_class2 = class FlexusTabs extends ganymede.ganymedeElement(flexus.LinearSelectable) {
	constructor(...args) {
		var _temp;

		return _temp = super(...args), this.preseted = false, _initDefineProp(this, 'center', _descriptor, this), _initDefineProp(this, 'fixed', _descriptor2, this), _initDefineProp(this, 'subtle', _descriptor3, this), _initDefineProp(this, 'centered', _descriptor4, this), _initDefineProp(this, 'noBar', _descriptor5, this), _initDefineProp(this, 'noSlide', _descriptor6, this), _initDefineProp(this, 'noInk', _descriptor7, this), _initDefineProp(this, 'fitContainer', _descriptor8, this), _initDefineProp(this, 'alignBottom', _descriptor9, this), _initDefineProp(this, 'autoselect', _descriptor10, this), _initDefineProp(this, 'autoConnect', _descriptor11, this), this.autoselectDelay = 0, this.lastTransitionSource = undefined, _temp;
	}
	//@reflect indent = Boolean

	// TODO: make new decorator to be only one-way.
	// I don't expect [centered] to be changed from inside.
	// Only listen for changes on the attribute


	// inspired by paper-tabs

	//@reflect scrollable = false
	// Causes scrollable tabs to stretch to fit their container if the tabs don't need to scroll
	// IDEA: rename to stretchContainer (and [fixed] to [stretch/ed])

	// Use when tabs are positioned below the content they control.
	// The selection bar will be shown at the top of the tabs

	// Selects the tab right away, rather than focusing it and waiting for confirmation (enter key)

	/**
  * The delay (in milliseconds) between when the user stops interacting
  * with the tabs through the keyboard and when the focused item is
  * automatically selected (if `autoselect` is true).
  */


	// Temp storage of click events or elements (of the tabs)
	// uppon selection. It is then passed to toolbar as
	// an origin of background transition animations


	ready() {
		//console.log('tabs ready')

		// set element as focusable (to be able to catch key events)
		this.setAttribute('tabindex', 0);

		this.setupResizeDetector();

		//if (this.centered)
		//if (this.hasAttribute('centered'))
		//	this.setupCentered()

		//this.parentView = document.querySelector('flexus-view')
		this.setupToolbar();
		this.updateToolbar();

		if (this.autoConnect) this.setupPages();

		var parentName = this.parentElement.localName;
		if (parentName !== 'flexus-toolbar' && parentName !== 'flexus-view') this.subtle = true;

		this.selectedChanged(this.selected);

		// slow down resize callback by using requestAnimationFrame
		this.onResize = flexus.rafThrottle(this.render);
		// note: resize events cannot be listened to passively
		this.on(window, 'resize', this.onResize);
		// fix misligned tab bar due to ongoing rendering
		setTimeout(this.render, 100);
	}

	applyPresentIfApplicable() {
		if (this.fixed === undefined && this.scrollable === undefined && this.center === undefined && this.centered === undefined) this.preset();
	}

	setupResizeDetector() {
		// TODO
		var width = this.offsetWidth;
		if (width != window.innerWidth) {
			// element resize detector z toolbaru			
		} else {}
			// naslouchat na window resize

			// ALSO: pokud se zmeni formfactor zpusobem ze puvodni podminka vyplni
			// (kvuli dvoum view vele sebe), potom prestat naslouchat na window
			// resize a aplikovat vlastni resize detector
	}

	preset() {
		//console.log('preset')
		this.preseted = true;
		var width = this.offsetWidth;
		//console.log(this.$.tabs.offsetWidth, width)
		//if (this.$.tabs.offsetWidth > width)
		//	console.log('TODO scroling')
		var parentName = this.parentElement.localName;
		var autofixing = flexus.platform.phone && (parentName === 'flexus-toolbar' || parentName === 'flexus-view');
		if (this.indent) {
			width -= 56;
			//width -= Number(window.getComputedStyle(this).paddingLeft)
		}
		var children = Array.from(this.children);
		var textContent = this.textContent.trim();
		if (textContent.length === 0) {
			// only icon tabs
			//if (children.length <= 6) {
			if (width / children.length >= 48) {
				var computed = window.getComputedStyle(children[0]);
				this.fixed = true;
				this.scrollable = false;
			} else {
				this.fixed = false;
				this.scrollable = true;
			}
		} else {
			// further process the textContent
			textContent = textContent.replace(/\s+/g, ' ');
			//if (textContent.length <= 40 || children.length <= 4) {
			if (textContent.length <= width / 10) {
				// NOTE: this works well with pohones, try to make
				// this for phablets as well
				this.fixed = true;
				this.scrollable = false;
			} else {
				this.fixed = false;
				this.scrollable = true;
			}
		}
		//console.log(textContent.length, textContent)
	}

	assurePagesElement(target) {
		if (target.localName !== 'flexus-pages') return hybridCustomComponent(target, ganymede__default.constructors.FlexusPages);
		return target;
	}
	setupPages() {
		var pages;
		//pages = this.parentView.children[1]
		if (this.nextElementSibling && this.nextElementSibling.localName === 'flexus-pages') pages = this.nextElementSibling;
		if (!pages && this.toolbar) pages = this.assurePagesElement(this.toolbar.nextElementSibling);
		if (!pages && this.hasAttribute('for')) {
			var id = this.getAttribute('for');
			var target = document.querySelector(`#${ id }`);
			if (target) pages = this.assurePagesElement(target);
		}
		if (!pages) return;
		whenReady(pages, e => {
			//console.log('tabs ready')
			pages.linkToOtherSelectable(this);
			//pages.linkToTabs(this)
		});
	}

	setupCentered() {
		var width = this.firstElementChild.offsetWidth;
		this.$.tabs.style.paddingLeft = `calc(50% - ${ width / 2 }px)`;
		this.on('selected', () => {
			var offset = this.activeTab.offsetLeft - this.firstElementChild.offsetLeft;
			//console.log(offset)
			this.$.tabs.style.transition = `transform 0.2s`;
			this.$.tabs.style.transform = `translate(-${ offset }px)`;
		});
	}

	setupToolbar() {
		if (this.parentElement.localName === 'flexus-toolbar') this.toolbar = this.parentElement;else if (this.parentElement.parentElement.localName === 'flexus-toolbar') this.toolbar = this.parentElement.parentElement;

		if (this.toolbar) {
			var toolbarTitle = this.toolbar.querySelector('h1,h2,h3');
			if (toolbarTitle && !toolbarTitle.textContent.trim()) {
				this.toolbarTitle = toolbarTitle;
				this.canUpdateTitle = true;
			}
			if (this.toolbar.hasAttribute('tinted')) {
				this.canUpdateBackground = true;
			}
		}
	}

	updateToolbar(direction) {
		console.log('updateToolbar');

		var tab = this.children[this.selected];
		// tell toolbar where to start the animation from
		// - either the click event and its position, or the target tab element
		var toolbar = this.toolbar;

		if (this.canUpdateTitle) {
			var title = tab.title || tab.textContent;
			if (direction === undefined) {
				this.toolbarTitle.textContent = title;
			} else {
				var distance = direction === 'left' ? -16 : 16;
				flexus.animation.swapContent(this.toolbarTitle, distance).then(() => this.toolbarTitle.textContent = title);
			}
		}

		if (this.canUpdateBackground) {
			switch (toolbar.bgTransition) {
				case 'origin':
					toolbar.bgTransitionSource = tab;
					break;
				case 'edge':
					toolbar.bgTransitionSource = direction;
					break;
				//case 'position':
				default:
					toolbar.bgTransitionSource = this.lastTransitionSource;
					break;
			}
			this.lastTransitionSource = undefined;
			var tabPrimary = tab.getAttribute('primary');
			var tabAccent = tab.getAttribute('accent');

			if (tabPrimary) toolbar.setAttribute('primary', tabPrimary);else toolbar.removeAttribute('primary');
			if (tabAccent) toolbar.setAttribute('accent', tabAccent);else toolbar.removeAttribute('accent');
		}
	}

	selectedChanged(newIndex, oldIndex) {
		// TODO? add [hidden] to all non selected pages
		this.render();
		var direction = oldIndex > newIndex ? 'left' : 'right';
		this.updateToolbar(direction);
	}

	onKeyup(data, e) {
		//console.log('keyup tabs', e)
		var newIndex;
		if (e.keyCode === 37) {
			// left arrow
			e.preventDefault();
			//console.log('left', this.selected, '->', this.selected - 1)
			newIndex = this.selected - 1;
		} else if (e.keyCode === 39) {
			// right arrow
			e.preventDefault();
			newIndex = this.selected + 1;
			//console.log('right', this.selected, '->', this.selected + 1)
		}
		if (newIndex !== undefined) {
			var children = this.children;
			var target = children[newIndex];
			if (target && !flexus.isNodeAvailable(target)) newIndex = pickClosest(children, target, newIndex, this.selected);
			// save tab element as an animation origin for toolbar background transition
			this.lastTransitionSource = this.children[newIndex];
			//console.log('onKeyup set', newIndex)
			this.selected = newIndex;
		}
		/*
  if (this.autoselect) {
    this._scheduleActivation(this.focusedItem, this.autoselectDelay);
  }
  */
	}

	onClick(data, e) {
		e.preventDefault();
		// save event as an animation origin for toolbar background transition
		this.lastTransitionSource = e;
		var index = Array.from(this.children).indexOf(e.target);
		//console.log('onClick', index)
		if (index === -1) return;
		//console.log('setting selected to', index)
		this.selected = index;
	}

	render() {
		if (this.activeTab === undefined) return;

		if (this.centered) {
			var offset = this.activeTab.offsetLeft - this.firstElementChild.offsetLeft;
			//console.log(offset)
			offset += this.activeTab.offsetWidth / 2;
			offset = Math.round(offset);
			this.$.tabs.style.transform = `translate(-${ offset }px)`;
		}

		var scaleX = this.activeTab.offsetWidth / this.$.tabs.offsetWidth;
		var translateX = this.activeTab.offsetLeft;
		this.$.bar.style.transform = `translate3d(${ translateX }px, 0, 0) scaleX(${ scaleX })`;
	}

	formfactorUpdate() {
		this.$.tabs.style.transition = 'none';
		this.render();
		this.$.tabs.offsetLeft;
		this.$.tabs.style.transition = '';
	}

	focusTabs(index) {}

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'center', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return Boolean;
	}
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'fixed', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return Boolean;
	}
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'subtle', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return Boolean;
	}
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'centered', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return Boolean;
	}
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'noBar', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'noSlide', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'noInk', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'fitContainer', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'alignBottom', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'autoselect', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'autoConnect', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return true;
	}
}), _applyDecoratedDescriptor(_class2.prototype, 'applyPresentIfApplicable', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'applyPresentIfApplicable'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onKeyup', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'onKeyup'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onClick', [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, 'onClick'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'render', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class2.prototype, 'render'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'formfactorUpdate', [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, 'formfactorUpdate'), _class2.prototype)), _class2)) || _class) || _class) || _class);

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5qcyIsInNvdXJjZXMiOlsic3JjL2VsZW1lbnRzL3RhYnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdhbnltZWRlIGZyb20gJ2dhbnltZWRlJ1xyXG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICdnYW55bWVkZSdcclxuaW1wb3J0IHtfLCBvbiwgdmFsaWRhdGUsIHRlbXBsYXRlLCBjc3MsIHJlZmxlY3QsIG9ic2VydmUsIGN1c3RvbUVsZW1lbnQsIGdhbnltZWRlRWxlbWVudCwgZHJhZ2dhYmxlfSBmcm9tICdnYW55bWVkZSdcclxuaW1wb3J0IHtjbGFtcCwgYW5pbWF0aW9uLCBwbGF0Zm9ybX0gZnJvbSAnZmxleHVzJ1xyXG5pbXBvcnQge0xpbmVhclNlbGVjdGFibGUsIGlzTm9kZUF2YWlsYWJsZSwgcmFmVGhyb3R0bGV9IGZyb20gJ2ZsZXh1cydcclxuXHJcblxyXG4vKlxyXG5mdW5jdGlvbiBjcmVhdGVSZXNpemVEZXRlY3RvcihlbGVtZW50LCBjYWxsYmFjaykge1xyXG5cdGlmIChlbGVtZW50LnJlc2l6ZURldGVjdG9yKVxyXG5cdFx0cmV0dXJuXHJcblx0dmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXHJcblx0dmFyIHJlc2l6ZVJBRlxyXG5cdGZ1bmN0aW9uIGxpc3RlbmVyKGUpIHtcclxuXHRcdGlmIChyZXNpemVSQUYpIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlc2l6ZVJBRilcclxuXHRcdHJlc2l6ZVJBRiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjaylcclxuXHR9XHJcblx0ZWxlbWVudC5yZXNpemVEZXRlY3RvciA9IHtcclxuXHRcdGxpc3RlbmVyLFxyXG5cdFx0aWZyYW1lXHJcblx0fVxyXG5cdChlbGVtZW50LnNoYWRvd1Jvb3QgfHwgZWxlbWVudCkuYXBwZW5kQ2hpbGQoaWZyYW1lKVxyXG5cdGlmcmFtZS5jb250ZW50V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxpc3RlbmVyKVxyXG59XHJcbiovXHJcbmZ1bmN0aW9uIGh5YnJpZEN1c3RvbUNvbXBvbmVudChlbGVtZW50LCBDbGFzcykge1xyXG5cdHJldHVybiB1bmRlZmluZWRcclxufVxyXG5cclxuZnVuY3Rpb24gd2hlblJlYWR5KGVsZW1lbnQsIGNhbGxiYWNrKSB7XHJcblx0ZnVuY3Rpb24gbGlzdGVuZXIoKSB7XHJcblx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3JlYWR5JywgbGlzdGVuZXIpXHJcblx0XHRjYWxsYmFjaygpXHJcblx0fVxyXG5cdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHknLCBsaXN0ZW5lcilcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGlyZWN0aW9uKG5ld0luZGV4LCBvbGRJbmRleCkge1xyXG5cdHJldHVybiBvbGRJbmRleCA+IG5ld0luZGV4ID8gJ2xlZnQnIDogb2xkSW5kZXggPCBuZXdJbmRleCA/ICdyaWdodCcgOiAnbm9uZSdcclxufVxyXG5cclxuZnVuY3Rpb24gc2VsZWN0ZWRWYWxpZGF0b3IobmV3SW5kZXgsIHNlbGYpIHtcclxuXHR2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuXHJcblx0aWYgKG5ld0luZGV4IDwgMCkgbmV3SW5kZXggPSAwXHJcblx0aWYgKG5ld0luZGV4ID4gY2hpbGRyZW4ubGVuZ3RoIC0xKSBuZXdJbmRleCA9IGNoaWxkcmVuLmxlbmd0aCAtMVxyXG5cdHZhciB0YXJnZXQgPSBjaGlsZHJlbltuZXdJbmRleF1cclxuXHRpZiAoaXNOb2RlQXZhaWxhYmxlKHRhcmdldCkpIHtcclxuXHRcdHJldHVybiBuZXdJbmRleFxyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gc2VsZi5zZWxlY3RlZFxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGlja0Nsb3Nlc3QoY2hpbGRyZW4sIHRhcmdldCwgbmV3SW5kZXgsIG9sZEluZGV4KSB7XHJcblx0dmFyIGRpcmVjdGlvbiA9IGdldERpcmVjdGlvbihuZXdJbmRleCwgb2xkSW5kZXgpXHJcblx0aWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0d2hpbGUgKHRhcmdldCkge1xyXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nXHJcblx0XHRcdGlmICh0YXJnZXQgJiYgaXNOb2RlQXZhaWxhYmxlKHRhcmdldCkpIGJyZWFrXHJcblx0XHR9XHJcblx0fVxyXG5cdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG5cdFx0d2hpbGUgKHRhcmdldCkge1xyXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZ1xyXG5cdFx0XHRpZiAodGFyZ2V0ICYmIGlzTm9kZUF2YWlsYWJsZSh0YXJnZXQpKSBicmVha1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAodGFyZ2V0KVxyXG5cdFx0cmV0dXJuIFsuLi5jaGlsZHJlbl0uaW5kZXhPZih0YXJnZXQpXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIG9sZEluZGV4XHJcbn1cclxuXHJcbkBjdXN0b21FbGVtZW50XHJcbkB0ZW1wbGF0ZShgXHJcblx0PGRpdiBpZD1cInRhYnNcIj5cclxuXHQ8IS0tZGl2IGlkPVwidGFic2lubmVyXCItLT5cclxuXHRcdDxzbG90Pjwvc2xvdD5cclxuXHRcdDxkaXYgaWQ9XCJiYXJcIiBjbGFzcz1cInRyYW5zaXRpb25cIj48L2Rpdj5cclxuXHQ8IS0tL2Rpdi0tPlxyXG5cdDwvZGl2PlxyXG5gKVxyXG5AY3NzKGBcclxuXHQvKjpob3N0IHtcclxuXHRcdGNvbG9yOiB2YXIoLS10YWJzLWZvcmVncm91bmQsIHZhcigtLXRoZW1lLXByaW1hcnkpKTtcclxuXHR9XHJcblx0Omhvc3QtY29udGV4dChbdGludGVkXSkge1xyXG5cdFx0Y29sb3I6IHZhcigtLXRhYnMtZm9yZWdyb3VuZCwgY3VycmVudENvbG9yKTtcclxuXHR9Ki9cclxuXHJcblx0I3RhYnMge1xyXG5cdFx0ZGlzcGxheTogZmxleDtcclxuXHRcdHdpZHRoOiAxMDAlO1xyXG5cdFx0dHJhbnNpdGlvbjogdHJhbnNmb3JtIDE1MG1zO1xyXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdH1cclxuXHQ6aG9zdChbY2VudGVyXSkgI3RhYnMge1xyXG5cdFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcblx0fVxyXG5cdDpob3N0KFtjZW50ZXJlZF0pICN0YWJzIHtcclxuXHRcdHBhZGRpbmctbGVmdDogNTAlO1xyXG5cdFx0d2lkdGg6IGluaXRpYWw7XHJcblx0fVxyXG5cdCN0YWJzaW5uZXIge1xyXG5cdFx0ZGlzcGxheTogZmxleDtcclxuXHR9XHJcblxyXG5cdCNiYXIge1xyXG5cdFx0aGVpZ2h0OiAycHg7XHJcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XHJcblx0XHRsZWZ0OiAwO1xyXG5cdFx0cmlnaHQ6IDA7XHJcblx0XHRib3R0b206IDA7XHJcblx0XHR0cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0IGNlbnRlcjtcclxuXHRcdHRyYW5zaXRpb246IHRyYW5zZm9ybTtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRhYnMtYmFyLCB2YXIoLS1wcmltYXJ5LCBjdXJyZW50Q29sb3IpKTtcclxuXHR9XHJcblx0Lyogbm90ZSB0aGlzIG5haXZlIHNlbGVjdG9yIHdvbnQgd29yayBpZiBbcHJpbWFyeV0gd2lsbCBiZSBwbGF0Zm9ybSBiYXNlZFxyXG5cdC4uLiBsaWtlIHByaW1hcnk9XCJ0YWJsZXRcIiAuIG1vcmUgY29tcGxleCBzZWxlY3RvciB3b3VsZCBiZSBuZWVkZWQgaW4gdGhhdCBjYXNlKi9cclxuXHQjYmFyIHtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRhYnMtYmFyLCB2YXIoLS10aW50KSk7XHJcblx0fVxyXG5cdDpob3N0LWNvbnRleHQoW3RpbnRlZF0pICNiYXIge1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGFicy1iYXIsIHZhcigtLWFjY2VudCwgdmFyKC0tZm9yZWdyb3VuZCkpKTtcclxuXHR9XHJcblx0Lyo6aG9zdChbY29sb3JsZXNzLWJhcl0pICNiYXIge1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGFicy1iYXIsIGN1cnJlbnRDb2xvcik7XHJcblx0fSovXHJcblx0Omhvc3QoW25vLWJhcl0pICNiYXIge1xyXG5cdFx0ZGlzcGxheTogbm9uZTtcclxuXHR9XHJcblx0I2Jhci50cmFuc2l0aW9uIHtcclxuXHRcdHRyYW5zaXRpb24tZHVyYXRpb246IDE1MG1zO1xyXG5cdFx0Lyp0cmFuc2l0aW9uLWR1cmF0aW9uOiAxNTBtcztcclxuXHRcdHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDEsIDEpOyovXHJcblx0XHQvKnRyYW5zaXRpb24tZHVyYXRpb246IDAuMThzO1xyXG5cdFx0dHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjAsIDAuMCwgMC4yLCAxKTsqL1xyXG5cdH1cclxuXHJcbmApXHJcbmNsYXNzIEZsZXh1c1RhYnMgZXh0ZW5kcyBnYW55bWVkZUVsZW1lbnQoTGluZWFyU2VsZWN0YWJsZSkge1xyXG5cclxuXHRwcmVzZXRlZCA9IGZhbHNlXHJcblx0QHJlZmxlY3QgY2VudGVyID0gQm9vbGVhblxyXG5cdEByZWZsZWN0IGZpeGVkID0gQm9vbGVhblxyXG5cdC8vQHJlZmxlY3QgaW5kZW50ID0gQm9vbGVhblxyXG5cdEByZWZsZWN0IHN1YnRsZSA9IEJvb2xlYW5cclxuXHQvLyBUT0RPOiBtYWtlIG5ldyBkZWNvcmF0b3IgdG8gYmUgb25seSBvbmUtd2F5LlxyXG5cdC8vIEkgZG9uJ3QgZXhwZWN0IFtjZW50ZXJlZF0gdG8gYmUgY2hhbmdlZCBmcm9tIGluc2lkZS5cclxuXHQvLyBPbmx5IGxpc3RlbiBmb3IgY2hhbmdlcyBvbiB0aGUgYXR0cmlidXRlXHJcblx0QHJlZmxlY3QgY2VudGVyZWQgPSBCb29sZWFuXHJcblxyXG5cdC8vIGluc3BpcmVkIGJ5IHBhcGVyLXRhYnNcclxuXHRAcmVmbGVjdCBub0JhciA9IGZhbHNlXHJcblx0QHJlZmxlY3Qgbm9TbGlkZSA9IGZhbHNlXHJcblx0QHJlZmxlY3Qgbm9JbmsgPSBmYWxzZVxyXG5cdC8vQHJlZmxlY3Qgc2Nyb2xsYWJsZSA9IGZhbHNlXHJcblx0Ly8gQ2F1c2VzIHNjcm9sbGFibGUgdGFicyB0byBzdHJldGNoIHRvIGZpdCB0aGVpciBjb250YWluZXIgaWYgdGhlIHRhYnMgZG9uJ3QgbmVlZCB0byBzY3JvbGxcclxuXHQvLyBJREVBOiByZW5hbWUgdG8gc3RyZXRjaENvbnRhaW5lciAoYW5kIFtmaXhlZF0gdG8gW3N0cmV0Y2gvZWRdKVxyXG5cdEByZWZsZWN0IGZpdENvbnRhaW5lciA9IGZhbHNlXHJcblx0Ly8gVXNlIHdoZW4gdGFicyBhcmUgcG9zaXRpb25lZCBiZWxvdyB0aGUgY29udGVudCB0aGV5IGNvbnRyb2wuXHJcblx0Ly8gVGhlIHNlbGVjdGlvbiBiYXIgd2lsbCBiZSBzaG93biBhdCB0aGUgdG9wIG9mIHRoZSB0YWJzXHJcblx0QHJlZmxlY3QgYWxpZ25Cb3R0b20gPSBmYWxzZVxyXG5cdC8vIFNlbGVjdHMgdGhlIHRhYiByaWdodCBhd2F5LCByYXRoZXIgdGhhbiBmb2N1c2luZyBpdCBhbmQgd2FpdGluZyBmb3IgY29uZmlybWF0aW9uIChlbnRlciBrZXkpXHJcblx0QHJlZmxlY3QgYXV0b3NlbGVjdCA9IGZhbHNlXHJcblx0QHJlZmxlY3QgYXV0b0Nvbm5lY3QgPSB0cnVlXHJcblx0LyoqXHJcblx0ICogVGhlIGRlbGF5IChpbiBtaWxsaXNlY29uZHMpIGJldHdlZW4gd2hlbiB0aGUgdXNlciBzdG9wcyBpbnRlcmFjdGluZ1xyXG5cdCAqIHdpdGggdGhlIHRhYnMgdGhyb3VnaCB0aGUga2V5Ym9hcmQgYW5kIHdoZW4gdGhlIGZvY3VzZWQgaXRlbSBpc1xyXG5cdCAqIGF1dG9tYXRpY2FsbHkgc2VsZWN0ZWQgKGlmIGBhdXRvc2VsZWN0YCBpcyB0cnVlKS5cclxuXHQgKi9cclxuXHRhdXRvc2VsZWN0RGVsYXkgPSAwXHJcblxyXG5cdC8vIFRlbXAgc3RvcmFnZSBvZiBjbGljayBldmVudHMgb3IgZWxlbWVudHMgKG9mIHRoZSB0YWJzKVxyXG5cdC8vIHVwcG9uIHNlbGVjdGlvbi4gSXQgaXMgdGhlbiBwYXNzZWQgdG8gdG9vbGJhciBhc1xyXG5cdC8vIGFuIG9yaWdpbiBvZiBiYWNrZ3JvdW5kIHRyYW5zaXRpb24gYW5pbWF0aW9uc1xyXG5cdGxhc3RUcmFuc2l0aW9uU291cmNlID0gdW5kZWZpbmVkXHJcblxyXG5cdHJlYWR5KCkge1xyXG5cdFx0Ly9jb25zb2xlLmxvZygndGFicyByZWFkeScpXHJcblxyXG5cdFx0Ly8gc2V0IGVsZW1lbnQgYXMgZm9jdXNhYmxlICh0byBiZSBhYmxlIHRvIGNhdGNoIGtleSBldmVudHMpXHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKVxyXG5cclxuXHRcdHRoaXMuc2V0dXBSZXNpemVEZXRlY3RvcigpXHJcblxyXG5cdFx0Ly9pZiAodGhpcy5jZW50ZXJlZClcclxuXHRcdC8vaWYgKHRoaXMuaGFzQXR0cmlidXRlKCdjZW50ZXJlZCcpKVxyXG5cdFx0Ly9cdHRoaXMuc2V0dXBDZW50ZXJlZCgpXHJcblxyXG5cdFx0Ly90aGlzLnBhcmVudFZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmbGV4dXMtdmlldycpXHJcblx0XHR0aGlzLnNldHVwVG9vbGJhcigpXHJcblx0XHR0aGlzLnVwZGF0ZVRvb2xiYXIoKVxyXG5cclxuXHRcdGlmICh0aGlzLmF1dG9Db25uZWN0KVxyXG5cdFx0XHR0aGlzLnNldHVwUGFnZXMoKVxyXG5cclxuXHRcdHZhciBwYXJlbnROYW1lID0gdGhpcy5wYXJlbnRFbGVtZW50LmxvY2FsTmFtZVxyXG5cdFx0aWYgKHBhcmVudE5hbWUgIT09ICdmbGV4dXMtdG9vbGJhcicgJiYgcGFyZW50TmFtZSAhPT0gJ2ZsZXh1cy12aWV3JylcclxuXHRcdFx0dGhpcy5zdWJ0bGUgPSB0cnVlXHJcblxyXG5cdFx0dGhpcy5zZWxlY3RlZENoYW5nZWQodGhpcy5zZWxlY3RlZClcclxuXHJcblx0XHQvLyBzbG93IGRvd24gcmVzaXplIGNhbGxiYWNrIGJ5IHVzaW5nIHJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0dGhpcy5vblJlc2l6ZSA9IHJhZlRocm90dGxlKHRoaXMucmVuZGVyKVxyXG5cdFx0Ly8gbm90ZTogcmVzaXplIGV2ZW50cyBjYW5ub3QgYmUgbGlzdGVuZWQgdG8gcGFzc2l2ZWx5XHJcblx0XHR0aGlzLm9uKHdpbmRvdywgJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpXHJcblx0XHQvLyBmaXggbWlzbGlnbmVkIHRhYiBiYXIgZHVlIHRvIG9uZ29pbmcgcmVuZGVyaW5nXHJcblx0XHRzZXRUaW1lb3V0KHRoaXMucmVuZGVyLCAxMDApXHJcblx0fVxyXG5cclxuXHRAb24oJ2JlZm9yZXJlYWR5JylcclxuXHRhcHBseVByZXNlbnRJZkFwcGxpY2FibGUoKSB7XHJcblx0XHRpZiAodGhpcy5maXhlZCA9PT0gdW5kZWZpbmVkXHJcblx0XHQgJiYgdGhpcy5zY3JvbGxhYmxlID09PSB1bmRlZmluZWRcclxuXHRcdCAmJiB0aGlzLmNlbnRlciA9PT0gdW5kZWZpbmVkXHJcblx0XHQgJiYgdGhpcy5jZW50ZXJlZCA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHR0aGlzLnByZXNldCgpXHJcblx0fVxyXG5cclxuXHRzZXR1cFJlc2l6ZURldGVjdG9yKCkge1xyXG5cdFx0Ly8gVE9ET1xyXG5cdFx0dmFyIHdpZHRoID0gdGhpcy5vZmZzZXRXaWR0aFxyXG5cdFx0aWYgKHdpZHRoICE9IHdpbmRvdy5pbm5lcldpZHRoKSB7XHJcblx0XHRcdC8vIGVsZW1lbnQgcmVzaXplIGRldGVjdG9yIHogdG9vbGJhcnVcdFx0XHRcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIG5hc2xvdWNoYXQgbmEgd2luZG93IHJlc2l6ZVxyXG5cdFx0fVxyXG5cdFx0Ly8gQUxTTzogcG9rdWQgc2Ugem1lbmkgZm9ybWZhY3RvciB6cHVzb2JlbSB6ZSBwdXZvZG5pIHBvZG1pbmthIHZ5cGxuaVxyXG5cdFx0Ly8gKGt2dWxpIGR2b3VtIHZpZXcgdmVsZSBzZWJlKSwgcG90b20gcHJlc3RhdCBuYXNsb3VjaGF0IG5hIHdpbmRvd1xyXG5cdFx0Ly8gcmVzaXplIGEgYXBsaWtvdmF0IHZsYXN0bmkgcmVzaXplIGRldGVjdG9yXHJcblx0fVxyXG5cclxuXHRwcmVzZXQoKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdwcmVzZXQnKVxyXG5cdFx0dGhpcy5wcmVzZXRlZCA9IHRydWVcclxuXHRcdHZhciB3aWR0aCA9IHRoaXMub2Zmc2V0V2lkdGhcclxuXHRcdC8vY29uc29sZS5sb2codGhpcy4kLnRhYnMub2Zmc2V0V2lkdGgsIHdpZHRoKVxyXG5cdFx0Ly9pZiAodGhpcy4kLnRhYnMub2Zmc2V0V2lkdGggPiB3aWR0aClcclxuXHRcdC8vXHRjb25zb2xlLmxvZygnVE9ETyBzY3JvbGluZycpXHJcblx0XHR2YXIgcGFyZW50TmFtZSA9IHRoaXMucGFyZW50RWxlbWVudC5sb2NhbE5hbWVcclxuXHRcdHZhciBhdXRvZml4aW5nID0gcGxhdGZvcm0ucGhvbmUgJiYgKHBhcmVudE5hbWUgPT09ICdmbGV4dXMtdG9vbGJhcicgfHwgcGFyZW50TmFtZSA9PT0gJ2ZsZXh1cy12aWV3JylcclxuXHRcdGlmICh0aGlzLmluZGVudCkge1xyXG5cdFx0XHR3aWR0aCAtPSA1NlxyXG5cdFx0XHQvL3dpZHRoIC09IE51bWJlcih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKS5wYWRkaW5nTGVmdClcclxuXHRcdH1cclxuXHRcdHZhciBjaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5jaGlsZHJlbilcclxuXHRcdHZhciB0ZXh0Q29udGVudCA9IHRoaXMudGV4dENvbnRlbnQudHJpbSgpXHJcblx0XHRpZiAodGV4dENvbnRlbnQubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdC8vIG9ubHkgaWNvbiB0YWJzXHJcblx0XHRcdC8vaWYgKGNoaWxkcmVuLmxlbmd0aCA8PSA2KSB7XHJcblx0XHRcdGlmICh3aWR0aCAvIGNoaWxkcmVuLmxlbmd0aCA+PSA0OCkge1xyXG5cdFx0XHRcdHZhciBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNoaWxkcmVuWzBdKVxyXG5cdFx0XHRcdHRoaXMuZml4ZWQgPSB0cnVlXHJcblx0XHRcdFx0dGhpcy5zY3JvbGxhYmxlID0gZmFsc2VcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZpeGVkID0gZmFsc2VcclxuXHRcdFx0XHR0aGlzLnNjcm9sbGFibGUgPSB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIGZ1cnRoZXIgcHJvY2VzcyB0aGUgdGV4dENvbnRlbnRcclxuXHRcdFx0dGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudC5yZXBsYWNlKC9cXHMrL2csICcgJylcclxuXHRcdFx0Ly9pZiAodGV4dENvbnRlbnQubGVuZ3RoIDw9IDQwIHx8IGNoaWxkcmVuLmxlbmd0aCA8PSA0KSB7XHJcblx0XHRcdGlmICh0ZXh0Q29udGVudC5sZW5ndGggPD0gd2lkdGggLyAxMCkge1xyXG5cdFx0XHRcdC8vIE5PVEU6IHRoaXMgd29ya3Mgd2VsbCB3aXRoIHBvaG9uZXMsIHRyeSB0byBtYWtlXHJcblx0XHRcdFx0Ly8gdGhpcyBmb3IgcGhhYmxldHMgYXMgd2VsbFxyXG5cdFx0XHRcdHRoaXMuZml4ZWQgPSB0cnVlXHJcblx0XHRcdFx0dGhpcy5zY3JvbGxhYmxlID0gZmFsc2VcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZpeGVkID0gZmFsc2VcclxuXHRcdFx0XHR0aGlzLnNjcm9sbGFibGUgPSB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vY29uc29sZS5sb2codGV4dENvbnRlbnQubGVuZ3RoLCB0ZXh0Q29udGVudClcclxuXHR9XHJcblxyXG5cdGFzc3VyZVBhZ2VzRWxlbWVudCh0YXJnZXQpIHtcclxuXHRcdGlmICh0YXJnZXQubG9jYWxOYW1lICE9PSAnZmxleHVzLXBhZ2VzJylcclxuXHRcdFx0cmV0dXJuIGh5YnJpZEN1c3RvbUNvbXBvbmVudCh0YXJnZXQsIGdhbnltZWRlLmNvbnN0cnVjdG9ycy5GbGV4dXNQYWdlcylcclxuXHRcdHJldHVybiB0YXJnZXRcclxuXHR9XHJcblx0c2V0dXBQYWdlcygpIHtcclxuXHRcdHZhciBwYWdlc1xyXG5cdFx0Ly9wYWdlcyA9IHRoaXMucGFyZW50Vmlldy5jaGlsZHJlblsxXVxyXG5cdFx0aWYgKHRoaXMubmV4dEVsZW1lbnRTaWJsaW5nICYmIHRoaXMubmV4dEVsZW1lbnRTaWJsaW5nLmxvY2FsTmFtZSA9PT0gJ2ZsZXh1cy1wYWdlcycpXHJcblx0XHRcdHBhZ2VzID0gdGhpcy5uZXh0RWxlbWVudFNpYmxpbmdcclxuXHRcdGlmICghcGFnZXMgJiYgdGhpcy50b29sYmFyKVxyXG5cdFx0XHRwYWdlcyA9IHRoaXMuYXNzdXJlUGFnZXNFbGVtZW50KHRoaXMudG9vbGJhci5uZXh0RWxlbWVudFNpYmxpbmcpXHJcblx0XHRpZiAoIXBhZ2VzICYmIHRoaXMuaGFzQXR0cmlidXRlKCdmb3InKSkge1xyXG5cdFx0XHR2YXIgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZm9yJylcclxuXHRcdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2lkfWApXHJcblx0XHRcdGlmICh0YXJnZXQpXHJcblx0XHRcdFx0cGFnZXMgPSB0aGlzLmFzc3VyZVBhZ2VzRWxlbWVudCh0YXJnZXQpXHJcblx0XHR9XHJcblx0XHRpZiAoIXBhZ2VzKSByZXR1cm5cclxuXHRcdHdoZW5SZWFkeShwYWdlcywgZSA9PiB7XHJcblx0XHRcdC8vY29uc29sZS5sb2coJ3RhYnMgcmVhZHknKVxyXG5cdFx0XHRwYWdlcy5saW5rVG9PdGhlclNlbGVjdGFibGUodGhpcylcclxuXHRcdFx0Ly9wYWdlcy5saW5rVG9UYWJzKHRoaXMpXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0c2V0dXBDZW50ZXJlZCgpIHtcclxuXHRcdHZhciB3aWR0aCA9IHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQub2Zmc2V0V2lkdGhcclxuXHRcdHRoaXMuJC50YWJzLnN0eWxlLnBhZGRpbmdMZWZ0ID0gYGNhbGMoNTAlIC0gJHt3aWR0aC8yfXB4KWBcclxuXHRcdHRoaXMub24oJ3NlbGVjdGVkJywgKCkgPT4ge1xyXG5cdFx0XHR2YXIgb2Zmc2V0ID0gdGhpcy5hY3RpdmVUYWIub2Zmc2V0TGVmdCAtIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQub2Zmc2V0TGVmdFxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKG9mZnNldClcclxuXHRcdFx0dGhpcy4kLnRhYnMuc3R5bGUudHJhbnNpdGlvbiA9IGB0cmFuc2Zvcm0gMC4yc2BcclxuXHRcdFx0dGhpcy4kLnRhYnMuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgtJHtvZmZzZXR9cHgpYFxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHNldHVwVG9vbGJhcigpIHtcclxuXHRcdGlmICh0aGlzLnBhcmVudEVsZW1lbnQubG9jYWxOYW1lID09PSAnZmxleHVzLXRvb2xiYXInKVxyXG5cdFx0XHR0aGlzLnRvb2xiYXIgPSB0aGlzLnBhcmVudEVsZW1lbnRcclxuXHRcdGVsc2UgaWYgKHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmxvY2FsTmFtZSA9PT0gJ2ZsZXh1cy10b29sYmFyJylcclxuXHRcdFx0dGhpcy50b29sYmFyID0gdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnRcclxuXHJcblx0XHRpZiAodGhpcy50b29sYmFyKSB7XHJcblx0XHRcdHZhciB0b29sYmFyVGl0bGUgPSB0aGlzLnRvb2xiYXIucXVlcnlTZWxlY3RvcignaDEsaDIsaDMnKVxyXG5cdFx0XHRpZiAodG9vbGJhclRpdGxlICYmICF0b29sYmFyVGl0bGUudGV4dENvbnRlbnQudHJpbSgpKSB7XHJcblx0XHRcdFx0dGhpcy50b29sYmFyVGl0bGUgPSB0b29sYmFyVGl0bGVcclxuXHRcdFx0XHR0aGlzLmNhblVwZGF0ZVRpdGxlID0gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLnRvb2xiYXIuaGFzQXR0cmlidXRlKCd0aW50ZWQnKSkge1xyXG5cdFx0XHRcdHRoaXMuY2FuVXBkYXRlQmFja2dyb3VuZCA9IHRydWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dXBkYXRlVG9vbGJhcihkaXJlY3Rpb24pIHtcclxuXHRcdGNvbnNvbGUubG9nKCd1cGRhdGVUb29sYmFyJylcclxuXHJcblx0XHR2YXIgdGFiID0gdGhpcy5jaGlsZHJlblt0aGlzLnNlbGVjdGVkXVxyXG5cdFx0Ly8gdGVsbCB0b29sYmFyIHdoZXJlIHRvIHN0YXJ0IHRoZSBhbmltYXRpb24gZnJvbVxyXG5cdFx0Ly8gLSBlaXRoZXIgdGhlIGNsaWNrIGV2ZW50IGFuZCBpdHMgcG9zaXRpb24sIG9yIHRoZSB0YXJnZXQgdGFiIGVsZW1lbnRcclxuXHRcdHZhciB0b29sYmFyID0gdGhpcy50b29sYmFyXHJcblx0XHRcclxuXHRcdGlmICh0aGlzLmNhblVwZGF0ZVRpdGxlKSB7XHJcblx0XHRcdHZhciB0aXRsZSA9IHRhYi50aXRsZSB8fCB0YWIudGV4dENvbnRlbnRcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhpcy50b29sYmFyVGl0bGUudGV4dENvbnRlbnQgPSB0aXRsZVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciBkaXN0YW5jZSA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gLTE2IDogMTZcclxuXHRcdFx0XHRhbmltYXRpb25cclxuXHRcdFx0XHRcdC5zd2FwQ29udGVudCh0aGlzLnRvb2xiYXJUaXRsZSwgZGlzdGFuY2UpXHJcblx0XHRcdFx0XHQudGhlbigoKSA9PiB0aGlzLnRvb2xiYXJUaXRsZS50ZXh0Q29udGVudCA9IHRpdGxlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuY2FuVXBkYXRlQmFja2dyb3VuZCkge1xyXG5cdFx0XHRzd2l0Y2ggKHRvb2xiYXIuYmdUcmFuc2l0aW9uKSB7XHJcblx0XHRcdFx0Y2FzZSAnb3JpZ2luJzpcclxuXHRcdFx0XHRcdHRvb2xiYXIuYmdUcmFuc2l0aW9uU291cmNlID0gdGFiXHJcblx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdGNhc2UgJ2VkZ2UnOlxyXG5cdFx0XHRcdFx0dG9vbGJhci5iZ1RyYW5zaXRpb25Tb3VyY2UgPSBkaXJlY3Rpb25cclxuXHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0Ly9jYXNlICdwb3NpdGlvbic6XHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHRvb2xiYXIuYmdUcmFuc2l0aW9uU291cmNlID0gdGhpcy5sYXN0VHJhbnNpdGlvblNvdXJjZVxyXG5cdFx0XHRcdFx0YnJlYWtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmxhc3RUcmFuc2l0aW9uU291cmNlID0gdW5kZWZpbmVkXHJcblx0XHRcdHZhciB0YWJQcmltYXJ5ID0gdGFiLmdldEF0dHJpYnV0ZSgncHJpbWFyeScpXHJcblx0XHRcdHZhciB0YWJBY2NlbnQgPSB0YWIuZ2V0QXR0cmlidXRlKCdhY2NlbnQnKVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRhYlByaW1hcnkpXHJcblx0XHRcdFx0dG9vbGJhci5zZXRBdHRyaWJ1dGUoJ3ByaW1hcnknLCB0YWJQcmltYXJ5KVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dG9vbGJhci5yZW1vdmVBdHRyaWJ1dGUoJ3ByaW1hcnknKVxyXG5cdFx0XHRpZiAodGFiQWNjZW50KVxyXG5cdFx0XHRcdHRvb2xiYXIuc2V0QXR0cmlidXRlKCdhY2NlbnQnLCB0YWJBY2NlbnQpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0b29sYmFyLnJlbW92ZUF0dHJpYnV0ZSgnYWNjZW50JylcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNlbGVjdGVkQ2hhbmdlZChuZXdJbmRleCwgb2xkSW5kZXgpIHtcclxuXHRcdC8vIFRPRE8/IGFkZCBbaGlkZGVuXSB0byBhbGwgbm9uIHNlbGVjdGVkIHBhZ2VzXHJcblx0XHR0aGlzLnJlbmRlcigpXHJcblx0XHR2YXIgZGlyZWN0aW9uID0gb2xkSW5kZXggPiBuZXdJbmRleCA/ICdsZWZ0JyA6ICdyaWdodCdcclxuXHRcdHRoaXMudXBkYXRlVG9vbGJhcihkaXJlY3Rpb24pXHJcblx0fVxyXG5cclxuXHRAb24oJ2tleXVwJylcclxuXHRvbktleXVwKGRhdGEsIGUpIHtcclxuXHRcdC8vY29uc29sZS5sb2coJ2tleXVwIHRhYnMnLCBlKVxyXG5cdFx0dmFyIG5ld0luZGV4XHJcblx0XHRpZiAoZS5rZXlDb2RlID09PSAzNykge1xyXG5cdFx0XHQvLyBsZWZ0IGFycm93XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKVxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdsZWZ0JywgdGhpcy5zZWxlY3RlZCwgJy0+JywgdGhpcy5zZWxlY3RlZCAtIDEpXHJcblx0XHRcdG5ld0luZGV4ID0gdGhpcy5zZWxlY3RlZCAtIDFcclxuXHRcdH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAzOSkge1xyXG5cdFx0XHQvLyByaWdodCBhcnJvd1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0bmV3SW5kZXggPSB0aGlzLnNlbGVjdGVkICsgMVxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdyaWdodCcsIHRoaXMuc2VsZWN0ZWQsICctPicsIHRoaXMuc2VsZWN0ZWQgKyAxKVxyXG5cdFx0fVxyXG5cdFx0aWYgKG5ld0luZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlblxyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gY2hpbGRyZW5bbmV3SW5kZXhdXHJcblx0XHRcdGlmICh0YXJnZXQgJiYgIWlzTm9kZUF2YWlsYWJsZSh0YXJnZXQpKVxyXG5cdFx0XHRcdG5ld0luZGV4ID0gcGlja0Nsb3Nlc3QoY2hpbGRyZW4sIHRhcmdldCwgbmV3SW5kZXgsIHRoaXMuc2VsZWN0ZWQpXHJcblx0XHRcdC8vIHNhdmUgdGFiIGVsZW1lbnQgYXMgYW4gYW5pbWF0aW9uIG9yaWdpbiBmb3IgdG9vbGJhciBiYWNrZ3JvdW5kIHRyYW5zaXRpb25cclxuXHRcdFx0dGhpcy5sYXN0VHJhbnNpdGlvblNvdXJjZSA9IHRoaXMuY2hpbGRyZW5bbmV3SW5kZXhdXHJcblx0XHRcdC8vY29uc29sZS5sb2coJ29uS2V5dXAgc2V0JywgbmV3SW5kZXgpXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWQgPSBuZXdJbmRleFxyXG5cdFx0fVxyXG5cdFx0LypcclxuXHRcdGlmICh0aGlzLmF1dG9zZWxlY3QpIHtcclxuXHRcdCAgdGhpcy5fc2NoZWR1bGVBY3RpdmF0aW9uKHRoaXMuZm9jdXNlZEl0ZW0sIHRoaXMuYXV0b3NlbGVjdERlbGF5KTtcclxuXHRcdH1cclxuXHRcdCovXHJcblx0fVxyXG5cclxuXHRAb24oJ2NsaWNrJylcclxuXHRvbkNsaWNrKGRhdGEsIGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKVxyXG5cdFx0Ly8gc2F2ZSBldmVudCBhcyBhbiBhbmltYXRpb24gb3JpZ2luIGZvciB0b29sYmFyIGJhY2tncm91bmQgdHJhbnNpdGlvblxyXG5cdFx0dGhpcy5sYXN0VHJhbnNpdGlvblNvdXJjZSA9IGVcclxuXHRcdHZhciBpbmRleCA9IEFycmF5LmZyb20odGhpcy5jaGlsZHJlbikuaW5kZXhPZihlLnRhcmdldClcclxuXHRcdC8vY29uc29sZS5sb2coJ29uQ2xpY2snLCBpbmRleClcclxuXHRcdGlmIChpbmRleCA9PT0gLTEpIHJldHVyblxyXG5cdFx0Ly9jb25zb2xlLmxvZygnc2V0dGluZyBzZWxlY3RlZCB0bycsIGluZGV4KVxyXG5cdFx0dGhpcy5zZWxlY3RlZCA9IGluZGV4XHJcblx0fVxyXG5cclxuXHRAYXV0b2JpbmQgcmVuZGVyKCkge1xyXG5cdFx0aWYgKHRoaXMuYWN0aXZlVGFiID09PSB1bmRlZmluZWQpIHJldHVyblxyXG5cclxuXHRcdGlmICh0aGlzLmNlbnRlcmVkKSB7XHJcblx0XHRcdHZhciBvZmZzZXQgPSB0aGlzLmFjdGl2ZVRhYi5vZmZzZXRMZWZ0IC0gdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5vZmZzZXRMZWZ0XHJcblx0XHRcdC8vY29uc29sZS5sb2cob2Zmc2V0KVxyXG5cdFx0XHRvZmZzZXQgKz0gdGhpcy5hY3RpdmVUYWIub2Zmc2V0V2lkdGggLyAyXHJcblx0XHRcdG9mZnNldCA9IE1hdGgucm91bmQob2Zmc2V0KVxyXG5cdFx0XHR0aGlzLiQudGFicy5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKC0ke29mZnNldH1weClgXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHZhciBzY2FsZVggPSB0aGlzLmFjdGl2ZVRhYi5vZmZzZXRXaWR0aCAvIHRoaXMuJC50YWJzLm9mZnNldFdpZHRoXHJcblx0XHR2YXIgdHJhbnNsYXRlWCA9IHRoaXMuYWN0aXZlVGFiLm9mZnNldExlZnRcclxuXHRcdHRoaXMuJC5iYXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7dHJhbnNsYXRlWH1weCwgMCwgMCkgc2NhbGVYKCR7c2NhbGVYfSlgXHJcblx0fVxyXG5cclxuXHRAb24oZG9jdW1lbnQsICdmb3JtZmFjdG9yLXVwZGF0ZScpXHJcblx0Zm9ybWZhY3RvclVwZGF0ZSgpIHtcclxuXHRcdHRoaXMuJC50YWJzLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSdcclxuXHRcdHRoaXMucmVuZGVyKClcclxuXHRcdHRoaXMuJC50YWJzLm9mZnNldExlZnRcclxuXHRcdHRoaXMuJC50YWJzLnN0eWxlLnRyYW5zaXRpb24gPSAnJ1xyXG5cdH1cclxuXHJcblx0Zm9jdXNUYWJzKGluZGV4KSB7XHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4iXSwibmFtZXMiOlsiaHlicmlkQ3VzdG9tQ29tcG9uZW50IiwiZWxlbWVudCIsIkNsYXNzIiwidW5kZWZpbmVkIiwid2hlblJlYWR5IiwiY2FsbGJhY2siLCJsaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0RGlyZWN0aW9uIiwibmV3SW5kZXgiLCJvbGRJbmRleCIsInNlbGVjdGVkVmFsaWRhdG9yIiwic2VsZiIsImNoaWxkcmVuIiwibGVuZ3RoIiwidGFyZ2V0IiwiaXNOb2RlQXZhaWxhYmxlIiwic2VsZWN0ZWQiLCJwaWNrQ2xvc2VzdCIsImRpcmVjdGlvbiIsIm5leHRFbGVtZW50U2libGluZyIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJpbmRleE9mIiwiRmxleHVzVGFicyIsInRlbXBsYXRlIiwiY3NzIiwib24iLCJkb2N1bWVudCIsImN1c3RvbUVsZW1lbnQiLCJnYW55bWVkZUVsZW1lbnQiLCJMaW5lYXJTZWxlY3RhYmxlIiwicHJlc2V0ZWQiLCJhdXRvc2VsZWN0RGVsYXkiLCJsYXN0VHJhbnNpdGlvblNvdXJjZSIsInNldEF0dHJpYnV0ZSIsInNldHVwUmVzaXplRGV0ZWN0b3IiLCJzZXR1cFRvb2xiYXIiLCJ1cGRhdGVUb29sYmFyIiwiYXV0b0Nvbm5lY3QiLCJzZXR1cFBhZ2VzIiwicGFyZW50TmFtZSIsInBhcmVudEVsZW1lbnQiLCJsb2NhbE5hbWUiLCJzdWJ0bGUiLCJzZWxlY3RlZENoYW5nZWQiLCJvblJlc2l6ZSIsInJhZlRocm90dGxlIiwicmVuZGVyIiwid2luZG93IiwiZml4ZWQiLCJzY3JvbGxhYmxlIiwiY2VudGVyIiwiY2VudGVyZWQiLCJwcmVzZXQiLCJ3aWR0aCIsIm9mZnNldFdpZHRoIiwiaW5uZXJXaWR0aCIsImF1dG9maXhpbmciLCJwbGF0Zm9ybSIsInBob25lIiwiaW5kZW50IiwiQXJyYXkiLCJmcm9tIiwidGV4dENvbnRlbnQiLCJ0cmltIiwiY29tcHV0ZWQiLCJnZXRDb21wdXRlZFN0eWxlIiwicmVwbGFjZSIsImdhbnltZWRlIiwiY29uc3RydWN0b3JzIiwiRmxleHVzUGFnZXMiLCJwYWdlcyIsInRvb2xiYXIiLCJhc3N1cmVQYWdlc0VsZW1lbnQiLCJoYXNBdHRyaWJ1dGUiLCJpZCIsImdldEF0dHJpYnV0ZSIsInF1ZXJ5U2VsZWN0b3IiLCJlIiwibGlua1RvT3RoZXJTZWxlY3RhYmxlIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCIkIiwidGFicyIsInN0eWxlIiwicGFkZGluZ0xlZnQiLCJvZmZzZXQiLCJhY3RpdmVUYWIiLCJvZmZzZXRMZWZ0IiwidHJhbnNpdGlvbiIsInRyYW5zZm9ybSIsInRvb2xiYXJUaXRsZSIsImNhblVwZGF0ZVRpdGxlIiwiY2FuVXBkYXRlQmFja2dyb3VuZCIsImxvZyIsInRhYiIsInRpdGxlIiwiZGlzdGFuY2UiLCJzd2FwQ29udGVudCIsInRoZW4iLCJiZ1RyYW5zaXRpb24iLCJiZ1RyYW5zaXRpb25Tb3VyY2UiLCJ0YWJQcmltYXJ5IiwidGFiQWNjZW50IiwicmVtb3ZlQXR0cmlidXRlIiwiZGF0YSIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsImluZGV4IiwiTWF0aCIsInJvdW5kIiwic2NhbGVYIiwidHJhbnNsYXRlWCIsImJhciIsInJlZmxlY3QiLCJCb29sZWFuIiwiYXV0b2JpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxTQUFTQSxxQkFBVCxDQUErQkMsT0FBL0IsRUFBd0NDLEtBQXhDLEVBQStDO1FBQ3ZDQyxTQUFQOzs7QUFHRCxTQUFTQyxTQUFULENBQW1CSCxPQUFuQixFQUE0QkksUUFBNUIsRUFBc0M7VUFDNUJDLFFBQVQsR0FBb0I7VUFDWEMsbUJBQVIsQ0FBNEIsT0FBNUIsRUFBcUNELFFBQXJDOzs7U0FHT0UsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0NGLFFBQWxDOzs7QUFHRCxTQUFTRyxZQUFULENBQXNCQyxRQUF0QixFQUFnQ0MsUUFBaEMsRUFBMEM7UUFDbENBLFdBQVdELFFBQVgsR0FBc0IsTUFBdEIsR0FBK0JDLFdBQVdELFFBQVgsR0FBc0IsT0FBdEIs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
