(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede'), require('flexus')) :
	typeof define === 'function' && define.amd ? define('pages', ['ganymede', 'flexus'], factory) :
	(factory(global.ganymede,global.flexus));
}(this, (function (ganymede,flexus) { 'use strict';

var _dec;
var _dec2;
var _dec3;
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

function selectedValidator(newValue, self) {
	if (self.children.length === 0) return 0;else return flexus.clamp(newValue, 0, self.children.length - 1);
}

let FlexusPages = (_dec = ganymede.template(`
	<div id="track">
		<slot></slot>
	</div>
`), _dec2 = ganymede.css(`
	:host {
		overflow: hidden;
		display: block;
		position: relative;
	}
	#track {
		padding: inherit;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		will-change: transform;
	}
	#track ::slotted(*) {
		padding: inherit;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		will-change: left;
	}
	:host,
	#track,
	#track ::slotted(*) {
		/* enable browser to handle vertical scrolling and js to handle horizontal dragging through pointer events */
		touch-action: pan-y;
	}
`), _dec3 = ganymede.on('keyup'), ganymede.customElement(_class = _dec(_class = _dec2(_class = (_class2 = class FlexusPages extends ganymede.ganymedeElement(flexus.LinearSelectable) {
	constructor(...args) {
		var _temp;

		return _temp = super(...args), _initDefineProp(this, 'threshold', _descriptor, this), _initDefineProp(this, 'noSkipping', _descriptor2, this), _initDefineProp(this, 'cycle', _descriptor3, this), _initDefineProp(this, 'swipeable', _descriptor4, this), _initDefineProp(this, 'noSideScroll', _descriptor5, this), _initDefineProp(this, 'transition', _descriptor6, this), this.autoAdjustHeight = false, this.maxTransitionDuration = 800, this.dragDistance = 0, _temp;
	} // options: slide, fade

	// todo this does not need to be reflected back to attr
	/*@reflect*/

	ready() {
		//console.log('ready')
		//console.log('this.selected', this.selected)
		this.setupPages();
		if (this.swipeable) flexus.draggable(this);

		// set element as focusable (to be able to catch key events)
		this.setAttribute('tabindex', 0);

		// try to guess if height is not set and adjust flexus-page height according
		// to each inner page on navigation
		/*var bbox = this.getBoundingClientRect()
  if (this.style.height === '' && bbox.height < 60) {
  	this.style.willChange = 'height'
  	this.autoAdjustHeight = true
  	this.style.transition = `200ms height`
  }*/
		if (this.autoAdjustHeight) this.adjustHeight();
	}

	onKeyup(data, e) {
		//console.log('keyup pages', e)
	}

	calcDuration(distance) {
		//return 800
		var distance = Math.abs(distance);
		if (flexus.platform.material) return Math.min(flexus.animation.durationByDistance(distance), this.maxTransitionDuration);else return 150;
	}

	setupPages() {
		//console.log('setupPages')
		this.pages = Array.from(this.children);
		//console.log('this.pages', this.pages)
		//console.log('this.selected', this.selected)
		this.selectedPage = this.pages[this.selected];
		//console.log('this.selectedPage', this.selectedPage)
		this.resetPages();
		// assign tabinex for each page so it can catch key events
		this.pages.forEach(page => {
			page.setAttribute('tabindex', 0);
		});
	}

	hidePage(page) {
		//console.log('hidePage', page)
		page.style.display = 'none';
		page.style.left = '0px';
		this.hidePageAttributes(page);
	}
	hidePageAttributes(page) {
		//console.log('hidePageAttributes', page)
		page.removeAttribute('selected');
		page.setAttribute('offscreen', '');
	}
	showPage(page, reposition = false) {
		//console.log('showPage', page)
		page.style.display = '';
		if (reposition) page.style.left = '0px';
		this.showPageAttributes(page);
	}
	showPageAttributes(page) {
		//console.log('showPageAttributes', page)
		page.setAttribute('selected', '');
		page.removeAttribute('offscreen');
	}

	//@on('$.track', 'transitionend')
	resetPages() {
		//this.$.track.style.transform = `translate3d(0px, 0px, 0)`
		this.pages.forEach(page => {
			if (page !== this.selectedPage) this.hidePage(page);
		});
		//console.log('this.selectedPage', this.selectedPage)
		this.showPage(this.selectedPage, true);
	}

	adjustHeight() {
		console.log('adjustHeight');
		var setHeight = () => {
			var selectedPageBbox = this.selectedPage.getBoundingClientRect();
			var newPageHeight = selectedPageBbox.height;
			//console.log('this.selectedPage', this.selectedPage.style.display)
			//console.log('newPageHeight', newPageHeight)
			this.style.height = `${ newPageHeight }px`;
			/*this.style.overflowY = 'hidden'
   animation.transition(this, {
   	height: [`${oldPageHeight}px`, `${newPageHeight}px`]
   }, true).then(() => {
   	this.style.overflowY = ''
   })*/
			console.log('this.selectedPage', this.selectedPage);
			console.log(selectedPageBbox);
		};
		// set height now
		setHeight();
		// set height again in it was not ready before
		setTimeout(setHeight, 50);
	}

	selectedChanged(newIndex, oldIndex) {
		//console.log('PAGES selectedChanged', oldIndex, '->', newIndex)
		this.width = this.offsetWidth;
		var pageDiff = oldIndex - newIndex;
		var direction = pageDiff < 0 ? -1 : 1;

		if (this.autoAdjustHeight) var oldPageHeight = this.selectedPage.getBoundingClientRect().height;

		if (flexus.platform.material) this.selectedChangedMaterial(newIndex, pageDiff, direction);else this.selectedChangedNeon(newIndex, pageDiff, direction);

		this.emit('selected', newIndex);

		if (this.autoAdjustHeight) this.adjustHeight();
	}
	selectedChangedMaterial(newIndex, pageDiff, direction) {
		this.hidePageAttributes(this.selectedPage);
		this.selectedPage = this.pages[newIndex];
		this.showPageAttributes(this.selectedPage);

		var oldPage = this.selectedPage;
		var newPage = this.pages[newIndex];
		if (this.currentAnimation) {
			this.currentAnimation.cancel();
			oldPage.style.display = 'none';
		} else {
			if (this.noSkipping) var distance = pageDiff * this.width;else var distance = direction * this.width;
			this.selectedPage.style.left = `${ -distance }px`;
			this.showPage(this.selectedPage);
			// animate
			var duration = this.calcDuration(distance);

			this.currentAnimation = this.$.track.animate([
			//{transform: `translate3d(0px, 0px, 0)`},
			{ transform: `translate3d(${ this.dragDistance }px, 0px, 0)` }, { transform: `translate3d(${ distance }px, 0px, 0)` }], {
				duration,
				easing: 'ease-in-out'
			});
			this.currentAnimation.oncancel = this.currentAnimation.onfinish = e => {
				this.dragDistance = 0;
				this.currentAnimation = undefined;
				this.resetPages();
				//oldPage.style.display = 'none'
			};
		}
	}
	selectedChangedNeon(newIndex, pageDiff, direction) {
		var distance = 12 * direction;
		var oldPage = this.selectedPage;
		var newPage = this.pages[newIndex];

		var fadeInNewPage = () => {
			newPage.style.display = '';
			this.showPageAttributes(newPage);
			var player = newPage.animate([{ opacity: 0, transform: `translate3d(${ -distance }px, 0px, 0)` }, { opacity: 1, transform: `translate3d(0px, 0px, 0)` }], {
				easing: 'cubic-bezier(.17,.67,.24,.94)',
				duration: 320
			});
			player.pause();
			//player.play()
			setTimeout(() => player.play(), 40);
			player.oncancel = player.onfinish = e => {
				this.currentAnimation = undefined;
			};
			this.currentAnimation = player;
		};
		var fadeOutOldPage = () => {
			this.currentAnimation = oldPage.animate([{ opacity: 1, transform: `translate3d(0px, 0px, 0)` }, { opacity: 0, transform: `translate3d(${ distance }px, 0px, 0)` }], {
				easing: 'ease-in',
				duration: 90
			});
			var oncancel = this.currentAnimation.oncancel = e => {
				oldPage.style.display = 'none';
				this.currentAnimation = undefined;
			};
			this.currentAnimation.onfinish = e => {
				oncancel();
				fadeInNewPage();
			};
		};

		this.hidePageAttributes(oldPage);
		this.selectedPage = newPage;
		if (this.currentAnimation) {
			this.currentAnimation.cancel();
			oldPage.style.display = 'none';
			fadeInNewPage();
		} else {
			fadeOutOldPage();
		}
	}

	showSiblingPages() {
		//console.log('showSiblingPages')
		this.prevPage = this.selectedPage.previousElementSibling;
		this.nextPage = this.selectedPage.nextElementSibling;
		//console.log('this.selectedPage', this.selectedPage)
		//console.log('this.prevPage', this.prevPage)
		//console.log('this.nextPage', this.nextPage)

		if (!this.prevPage && this.cycle) this.prevPage = this.lastElementChild;
		if (!this.nextPage && this.cycle) this.nextPage = this.firstElementChild;

		if (this.prevPage) {
			this.prevPage.style.left = `-${ this.width }px`;
			this.showPage(this.prevPage);
		}
		if (this.nextPage) {
			this.nextPage.style.left = `${ this.width }px`;
			this.showPage(this.nextPage);
		}
	}

	showMorePages() {
		// TODO
		// Show more then prev/next pages.
		// Useful for small tabs on big screen where finger can keep scrolling to further pages
		this.showSiblingPages(); // for now
	}

	onDragStart(e) {
		//if (e.pointerType === 'mouse') return
		//console.log('onDragStart', e)
		if (this.transitioning) {
			// TODO if feasible: Do some quick snap (10-20ms?) from currently transitioned
			// position before resetting (basically, force transition to finish quicker)
			//this.$.track.style.transition = `transform 40ms`
			this.resetPages();
		}
		this.initX = e.clientX;
		this.width = this.offsetWidth;

		//if (window.innerWidht === this.width)
		this.showSiblingPages();
		//else
		//	this.showMorePages()

		if (!this.cycle) {
			this.leftClampDistance = this.selected * this.width;
			this.rightClampDistance = (this.pages.length - 1 - this.selected) * -this.width;
		}
	}

	onDragMove(e) {
		//if (e.pointerType === 'mouse') return
		//console.log('onDragMove')
		this.dragDistance = e.clientX - this.initX;
		if (!this.cycle) this.dragDistance = flexus.clamp(this.dragDistance, this.rightClampDistance, this.leftClampDistance);
		this._trackRender(this.dragDistance);
	}

	onDragEnd(e) {
		//if (e.pointerType === 'mouse') return
		//console.log('onDragEnd')
		this.transitioning = true;
		var overThreshold = this.width * this.threshold < Math.abs(this.dragDistance);
		if (overThreshold) {
			var duration = this.calcDuration(this.width - Math.abs(this.dragDistance));
			//this.$.track.style.transition = `transform ${duration}ms`
			if (this.dragDistance > 0) {
				this._trackRender(0);
				this.selected -= 1;
			} else {
				this._trackRender(0);
				this.selected += 1;
			}
		} else {
			var duration = this.calcDuration(this.dragDistance);
			this._trackRender(0);
			//this.resetPages()
		}
	}

	_trackRender(distance) {
		//console.log('_trackRender', this.$.track.style.transition)
		this.$.track.style.transform = `translate3d(${ distance }px, 0px, 0)`;
	}

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'threshold', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return 0.3;
	}
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'noSkipping', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'cycle', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'swipeable', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return flexus.platform.touch && flexus.platform.material;
	}
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'noSideScroll', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'transition', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return 'slide';
	}
}), _applyDecoratedDescriptor(_class2.prototype, 'onKeyup', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'onKeyup'), _class2.prototype)), _class2)) || _class) || _class) || _class);

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXMuanMiLCJzb3VyY2VzIjpbInNyYy9lbGVtZW50cy9wYWdlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge29uLCB2YWxpZGF0ZSwgdGVtcGxhdGUsIGNzcywgcmVmbGVjdCwgb2JzZXJ2ZSwgY3VzdG9tRWxlbWVudCwgZ2FueW1lZGVFbGVtZW50fSBmcm9tICdnYW55bWVkZSdcclxuaW1wb3J0IHtjbGFtcCwgYW5pbWF0aW9uLCBwbGF0Zm9ybSwgZHJhZ2dhYmxlfSBmcm9tICdmbGV4dXMnXHJcbmltcG9ydCB7TGluZWFyU2VsZWN0YWJsZSwgaXNOb2RlQXZhaWxhYmxlfSBmcm9tICdmbGV4dXMnXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNlbGVjdGVkVmFsaWRhdG9yKG5ld1ZhbHVlLCBzZWxmKSB7XHJcblx0aWYgKHNlbGYuY2hpbGRyZW4ubGVuZ3RoID09PSAwKVxyXG5cdFx0cmV0dXJuIDBcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gY2xhbXAobmV3VmFsdWUsIDAsIHNlbGYuY2hpbGRyZW4ubGVuZ3RoIC0gMSlcclxufVxyXG5cclxuXHJcblxyXG5cclxuQGN1c3RvbUVsZW1lbnRcclxuLy9AZHJhZ2dhYmxlXHJcbkB0ZW1wbGF0ZShgXHJcblx0PGRpdiBpZD1cInRyYWNrXCI+XHJcblx0XHQ8c2xvdD48L3Nsb3Q+XHJcblx0PC9kaXY+XHJcbmApXHJcbkBjc3MoYFxyXG5cdDpob3N0IHtcclxuXHRcdG92ZXJmbG93OiBoaWRkZW47XHJcblx0XHRkaXNwbGF5OiBibG9jaztcclxuXHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHR9XHJcblx0I3RyYWNrIHtcclxuXHRcdHBhZGRpbmc6IGluaGVyaXQ7XHJcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XHJcblx0XHR0b3A6IDA7XHJcblx0XHRsZWZ0OiAwO1xyXG5cdFx0cmlnaHQ6IDA7XHJcblx0XHRib3R0b206IDA7XHJcblx0XHR3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xyXG5cdH1cclxuXHQjdHJhY2sgOjpzbG90dGVkKCopIHtcclxuXHRcdHBhZGRpbmc6IGluaGVyaXQ7XHJcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XHJcblx0XHR0b3A6IDA7XHJcblx0XHRsZWZ0OiAwO1xyXG5cdFx0d2lkdGg6IDEwMCU7XHJcblx0XHRoZWlnaHQ6IDEwMCU7XHJcblx0XHRvdmVyZmxvdy15OiBhdXRvO1xyXG5cdFx0d2lsbC1jaGFuZ2U6IGxlZnQ7XHJcblx0fVxyXG5cdDpob3N0LFxyXG5cdCN0cmFjayxcclxuXHQjdHJhY2sgOjpzbG90dGVkKCopIHtcclxuXHRcdC8qIGVuYWJsZSBicm93c2VyIHRvIGhhbmRsZSB2ZXJ0aWNhbCBzY3JvbGxpbmcgYW5kIGpzIHRvIGhhbmRsZSBob3Jpem9udGFsIGRyYWdnaW5nIHRocm91Z2ggcG9pbnRlciBldmVudHMgKi9cclxuXHRcdHRvdWNoLWFjdGlvbjogcGFuLXk7XHJcblx0fVxyXG5gKVxyXG5jbGFzcyBGbGV4dXNQYWdlcyBleHRlbmRzIGdhbnltZWRlRWxlbWVudChMaW5lYXJTZWxlY3RhYmxlKSB7XHJcblxyXG5cdEByZWZsZWN0IHRocmVzaG9sZCA9IDAuM1xyXG5cdEByZWZsZWN0IG5vU2tpcHBpbmcgPSBmYWxzZVxyXG5cdEByZWZsZWN0IGN5Y2xlID0gZmFsc2VcclxuXHJcblx0QHJlZmxlY3Qgc3dpcGVhYmxlID0gcGxhdGZvcm0udG91Y2ggJiYgcGxhdGZvcm0ubWF0ZXJpYWxcclxuXHRAcmVmbGVjdCBub1NpZGVTY3JvbGwgPSBmYWxzZVxyXG5cdEByZWZsZWN0IHRyYW5zaXRpb24gPSAnc2xpZGUnIC8vIG9wdGlvbnM6IHNsaWRlLCBmYWRlXHJcblxyXG5cdGF1dG9BZGp1c3RIZWlnaHQgPSBmYWxzZVxyXG5cclxuXHQvLyB0b2RvIHRoaXMgZG9lcyBub3QgbmVlZCB0byBiZSByZWZsZWN0ZWQgYmFjayB0byBhdHRyXHJcblx0LypAcmVmbGVjdCovIG1heFRyYW5zaXRpb25EdXJhdGlvbiA9IDgwMFxyXG5cclxuXHRyZWFkeSgpIHtcclxuXHRcdC8vY29uc29sZS5sb2coJ3JlYWR5JylcclxuXHRcdC8vY29uc29sZS5sb2coJ3RoaXMuc2VsZWN0ZWQnLCB0aGlzLnNlbGVjdGVkKVxyXG5cdFx0dGhpcy5zZXR1cFBhZ2VzKClcclxuXHRcdGlmICh0aGlzLnN3aXBlYWJsZSlcclxuXHRcdFx0ZHJhZ2dhYmxlKHRoaXMpXHJcblxyXG5cdFx0Ly8gc2V0IGVsZW1lbnQgYXMgZm9jdXNhYmxlICh0byBiZSBhYmxlIHRvIGNhdGNoIGtleSBldmVudHMpXHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKVxyXG5cclxuXHRcdC8vIHRyeSB0byBndWVzcyBpZiBoZWlnaHQgaXMgbm90IHNldCBhbmQgYWRqdXN0IGZsZXh1cy1wYWdlIGhlaWdodCBhY2NvcmRpbmdcclxuXHRcdC8vIHRvIGVhY2ggaW5uZXIgcGFnZSBvbiBuYXZpZ2F0aW9uXHJcblx0XHQvKnZhciBiYm94ID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cdFx0aWYgKHRoaXMuc3R5bGUuaGVpZ2h0ID09PSAnJyAmJiBiYm94LmhlaWdodCA8IDYwKSB7XHJcblx0XHRcdHRoaXMuc3R5bGUud2lsbENoYW5nZSA9ICdoZWlnaHQnXHJcblx0XHRcdHRoaXMuYXV0b0FkanVzdEhlaWdodCA9IHRydWVcclxuXHRcdFx0dGhpcy5zdHlsZS50cmFuc2l0aW9uID0gYDIwMG1zIGhlaWdodGBcclxuXHRcdH0qL1xyXG5cdFx0aWYgKHRoaXMuYXV0b0FkanVzdEhlaWdodClcclxuXHRcdFx0dGhpcy5hZGp1c3RIZWlnaHQoKVxyXG5cdH1cclxuXHJcblx0QG9uKCdrZXl1cCcpXHJcblx0b25LZXl1cChkYXRhLCBlKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdrZXl1cCBwYWdlcycsIGUpXHJcblx0fVxyXG5cclxuXHRjYWxjRHVyYXRpb24oZGlzdGFuY2UpIHtcclxuXHRcdC8vcmV0dXJuIDgwMFxyXG5cdFx0dmFyIGRpc3RhbmNlID0gTWF0aC5hYnMoZGlzdGFuY2UpXHJcblx0XHRpZiAocGxhdGZvcm0ubWF0ZXJpYWwpXHJcblx0XHRcdHJldHVybiBNYXRoLm1pbihhbmltYXRpb24uZHVyYXRpb25CeURpc3RhbmNlKGRpc3RhbmNlKSwgdGhpcy5tYXhUcmFuc2l0aW9uRHVyYXRpb24pXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiAxNTBcclxuXHR9XHJcblxyXG5cdHNldHVwUGFnZXMoKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdzZXR1cFBhZ2VzJylcclxuXHRcdHRoaXMucGFnZXMgPSBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pXHJcblx0XHQvL2NvbnNvbGUubG9nKCd0aGlzLnBhZ2VzJywgdGhpcy5wYWdlcylcclxuXHRcdC8vY29uc29sZS5sb2coJ3RoaXMuc2VsZWN0ZWQnLCB0aGlzLnNlbGVjdGVkKVxyXG5cdFx0dGhpcy5zZWxlY3RlZFBhZ2UgPSB0aGlzLnBhZ2VzW3RoaXMuc2VsZWN0ZWRdXHJcblx0XHQvL2NvbnNvbGUubG9nKCd0aGlzLnNlbGVjdGVkUGFnZScsIHRoaXMuc2VsZWN0ZWRQYWdlKVxyXG5cdFx0dGhpcy5yZXNldFBhZ2VzKClcclxuXHRcdC8vIGFzc2lnbiB0YWJpbmV4IGZvciBlYWNoIHBhZ2Ugc28gaXQgY2FuIGNhdGNoIGtleSBldmVudHNcclxuXHRcdHRoaXMucGFnZXMuZm9yRWFjaChwYWdlID0+IHtcclxuXHRcdFx0cGFnZS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMClcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRoaWRlUGFnZShwYWdlKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdoaWRlUGFnZScsIHBhZ2UpXHJcblx0XHRwYWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuXHRcdHBhZ2Uuc3R5bGUubGVmdCA9ICcwcHgnXHJcblx0XHR0aGlzLmhpZGVQYWdlQXR0cmlidXRlcyhwYWdlKVxyXG5cdH1cclxuXHRoaWRlUGFnZUF0dHJpYnV0ZXMocGFnZSkge1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnaGlkZVBhZ2VBdHRyaWJ1dGVzJywgcGFnZSlcclxuXHRcdHBhZ2UucmVtb3ZlQXR0cmlidXRlKCdzZWxlY3RlZCcpXHJcblx0XHRwYWdlLnNldEF0dHJpYnV0ZSgnb2Zmc2NyZWVuJywgJycpXHJcblx0fVxyXG5cdHNob3dQYWdlKHBhZ2UsIHJlcG9zaXRpb24gPSBmYWxzZSkge1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnc2hvd1BhZ2UnLCBwYWdlKVxyXG5cdFx0cGFnZS5zdHlsZS5kaXNwbGF5ID0gJydcclxuXHRcdGlmIChyZXBvc2l0aW9uKSBwYWdlLnN0eWxlLmxlZnQgPSAnMHB4J1xyXG5cdFx0dGhpcy5zaG93UGFnZUF0dHJpYnV0ZXMocGFnZSlcclxuXHR9XHJcblx0c2hvd1BhZ2VBdHRyaWJ1dGVzKHBhZ2UpIHtcclxuXHRcdC8vY29uc29sZS5sb2coJ3Nob3dQYWdlQXR0cmlidXRlcycsIHBhZ2UpXHJcblx0XHRwYWdlLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCAnJylcclxuXHRcdHBhZ2UucmVtb3ZlQXR0cmlidXRlKCdvZmZzY3JlZW4nKVxyXG5cdH1cclxuXHJcblx0Ly9Ab24oJyQudHJhY2snLCAndHJhbnNpdGlvbmVuZCcpXHJcblx0cmVzZXRQYWdlcygpIHtcclxuXHRcdC8vdGhpcy4kLnRyYWNrLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgwcHgsIDBweCwgMClgXHJcblx0XHR0aGlzLnBhZ2VzLmZvckVhY2gocGFnZSA9PiB7XHJcblx0XHRcdGlmIChwYWdlICE9PSB0aGlzLnNlbGVjdGVkUGFnZSlcclxuXHRcdFx0XHR0aGlzLmhpZGVQYWdlKHBhZ2UpXHJcblx0XHR9KVxyXG5cdFx0Ly9jb25zb2xlLmxvZygndGhpcy5zZWxlY3RlZFBhZ2UnLCB0aGlzLnNlbGVjdGVkUGFnZSlcclxuXHRcdHRoaXMuc2hvd1BhZ2UodGhpcy5zZWxlY3RlZFBhZ2UsIHRydWUpXHJcblx0fVxyXG5cclxuXHRhZGp1c3RIZWlnaHQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnYWRqdXN0SGVpZ2h0JylcclxuXHRcdHZhciBzZXRIZWlnaHQgPSAoKSA9PiB7XHJcblx0XHRcdHZhciBzZWxlY3RlZFBhZ2VCYm94ID0gdGhpcy5zZWxlY3RlZFBhZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHRcdFx0dmFyIG5ld1BhZ2VIZWlnaHQgPSBzZWxlY3RlZFBhZ2VCYm94LmhlaWdodFxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCd0aGlzLnNlbGVjdGVkUGFnZScsIHRoaXMuc2VsZWN0ZWRQYWdlLnN0eWxlLmRpc3BsYXkpXHJcblx0XHRcdC8vY29uc29sZS5sb2coJ25ld1BhZ2VIZWlnaHQnLCBuZXdQYWdlSGVpZ2h0KVxyXG5cdFx0XHR0aGlzLnN0eWxlLmhlaWdodCA9IGAke25ld1BhZ2VIZWlnaHR9cHhgXHJcblx0XHRcdC8qdGhpcy5zdHlsZS5vdmVyZmxvd1kgPSAnaGlkZGVuJ1xyXG5cdFx0XHRhbmltYXRpb24udHJhbnNpdGlvbih0aGlzLCB7XHJcblx0XHRcdFx0aGVpZ2h0OiBbYCR7b2xkUGFnZUhlaWdodH1weGAsIGAke25ld1BhZ2VIZWlnaHR9cHhgXVxyXG5cdFx0XHR9LCB0cnVlKS50aGVuKCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnN0eWxlLm92ZXJmbG93WSA9ICcnXHJcblx0XHRcdH0pKi9cclxuXHRcdFx0Y29uc29sZS5sb2coJ3RoaXMuc2VsZWN0ZWRQYWdlJywgdGhpcy5zZWxlY3RlZFBhZ2UpXHJcblx0XHRcdGNvbnNvbGUubG9nKHNlbGVjdGVkUGFnZUJib3gpXHJcblx0XHR9XHJcblx0XHQvLyBzZXQgaGVpZ2h0IG5vd1xyXG5cdFx0c2V0SGVpZ2h0KClcclxuXHRcdC8vIHNldCBoZWlnaHQgYWdhaW4gaW4gaXQgd2FzIG5vdCByZWFkeSBiZWZvcmVcclxuXHRcdHNldFRpbWVvdXQoc2V0SGVpZ2h0LCA1MClcclxuXHR9XHJcblxyXG5cdHNlbGVjdGVkQ2hhbmdlZChuZXdJbmRleCwgb2xkSW5kZXgpIHtcclxuXHRcdC8vY29uc29sZS5sb2coJ1BBR0VTIHNlbGVjdGVkQ2hhbmdlZCcsIG9sZEluZGV4LCAnLT4nLCBuZXdJbmRleClcclxuXHRcdHRoaXMud2lkdGggPSB0aGlzLm9mZnNldFdpZHRoXHJcblx0XHR2YXIgcGFnZURpZmYgPSBvbGRJbmRleCAtIG5ld0luZGV4XHJcblx0XHR2YXIgZGlyZWN0aW9uID0gcGFnZURpZmYgPCAwID8gLTEgOiAxXHJcblxyXG5cdFx0aWYgKHRoaXMuYXV0b0FkanVzdEhlaWdodClcclxuXHRcdFx0dmFyIG9sZFBhZ2VIZWlnaHQgPSB0aGlzLnNlbGVjdGVkUGFnZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcclxuXHJcblx0XHRpZiAocGxhdGZvcm0ubWF0ZXJpYWwpXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWRDaGFuZ2VkTWF0ZXJpYWwobmV3SW5kZXgsIHBhZ2VEaWZmLCBkaXJlY3Rpb24pXHJcblx0XHRlbHNlXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWRDaGFuZ2VkTmVvbihuZXdJbmRleCwgcGFnZURpZmYsIGRpcmVjdGlvbilcclxuXHJcblx0XHR0aGlzLmVtaXQoJ3NlbGVjdGVkJywgbmV3SW5kZXgpXHJcblxyXG5cdFx0aWYgKHRoaXMuYXV0b0FkanVzdEhlaWdodClcclxuXHRcdFx0dGhpcy5hZGp1c3RIZWlnaHQoKVxyXG5cdH1cclxuXHRzZWxlY3RlZENoYW5nZWRNYXRlcmlhbChuZXdJbmRleCwgcGFnZURpZmYsIGRpcmVjdGlvbikge1xyXG5cdFx0dGhpcy5oaWRlUGFnZUF0dHJpYnV0ZXModGhpcy5zZWxlY3RlZFBhZ2UpXHJcblx0XHR0aGlzLnNlbGVjdGVkUGFnZSA9IHRoaXMucGFnZXNbbmV3SW5kZXhdXHJcblx0XHR0aGlzLnNob3dQYWdlQXR0cmlidXRlcyh0aGlzLnNlbGVjdGVkUGFnZSlcclxuXHJcblx0XHR2YXIgb2xkUGFnZSA9IHRoaXMuc2VsZWN0ZWRQYWdlXHJcblx0XHR2YXIgbmV3UGFnZSA9IHRoaXMucGFnZXNbbmV3SW5kZXhdXHJcblx0XHRpZiAodGhpcy5jdXJyZW50QW5pbWF0aW9uKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudEFuaW1hdGlvbi5jYW5jZWwoKVxyXG5cdFx0XHRvbGRQYWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0aGlzLm5vU2tpcHBpbmcpXHJcblx0XHRcdFx0dmFyIGRpc3RhbmNlID0gcGFnZURpZmYgKiB0aGlzLndpZHRoXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR2YXIgZGlzdGFuY2UgPSBkaXJlY3Rpb24gKiB0aGlzLndpZHRoXHJcblx0XHRcdHRoaXMuc2VsZWN0ZWRQYWdlLnN0eWxlLmxlZnQgPSBgJHstZGlzdGFuY2V9cHhgXHJcblx0XHRcdHRoaXMuc2hvd1BhZ2UodGhpcy5zZWxlY3RlZFBhZ2UpXHJcblx0XHRcdC8vIGFuaW1hdGVcclxuXHRcdFx0dmFyIGR1cmF0aW9uID0gdGhpcy5jYWxjRHVyYXRpb24oZGlzdGFuY2UpXHJcblxyXG5cdFx0XHR0aGlzLmN1cnJlbnRBbmltYXRpb24gPSB0aGlzLiQudHJhY2suYW5pbWF0ZShbXHJcblx0XHRcdFx0Ly97dHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoMHB4LCAwcHgsIDApYH0sXHJcblx0XHRcdFx0e3RyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCR7dGhpcy5kcmFnRGlzdGFuY2V9cHgsIDBweCwgMClgfSxcclxuXHRcdFx0XHR7dHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoJHtkaXN0YW5jZX1weCwgMHB4LCAwKWB9LFxyXG5cdFx0XHRdLCB7XHJcblx0XHRcdFx0ZHVyYXRpb24sXHJcblx0XHRcdFx0ZWFzaW5nOiAnZWFzZS1pbi1vdXQnLFxyXG5cdFx0XHR9KVxyXG5cdFx0XHR0aGlzLmN1cnJlbnRBbmltYXRpb24ub25jYW5jZWwgPSB0aGlzLmN1cnJlbnRBbmltYXRpb24ub25maW5pc2ggPSBlID0+IHtcclxuXHRcdFx0XHR0aGlzLmRyYWdEaXN0YW5jZSA9IDBcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRBbmltYXRpb24gPSB1bmRlZmluZWRcclxuXHRcdFx0XHR0aGlzLnJlc2V0UGFnZXMoKVxyXG5cdFx0XHRcdC8vb2xkUGFnZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fVxyXG5cdHNlbGVjdGVkQ2hhbmdlZE5lb24obmV3SW5kZXgsIHBhZ2VEaWZmLCBkaXJlY3Rpb24pIHtcclxuXHRcdHZhciBkaXN0YW5jZSA9IDEyICogZGlyZWN0aW9uXHJcblx0XHR2YXIgb2xkUGFnZSA9IHRoaXMuc2VsZWN0ZWRQYWdlXHJcblx0XHR2YXIgbmV3UGFnZSA9IHRoaXMucGFnZXNbbmV3SW5kZXhdXHJcblxyXG5cdFx0dmFyIGZhZGVJbk5ld1BhZ2UgPSAoKSA9PiB7XHJcblx0XHRcdG5ld1BhZ2Uuc3R5bGUuZGlzcGxheSA9ICcnXHJcblx0XHRcdHRoaXMuc2hvd1BhZ2VBdHRyaWJ1dGVzKG5ld1BhZ2UpXHJcblx0XHRcdHZhciBwbGF5ZXIgPSBuZXdQYWdlLmFuaW1hdGUoW1xyXG5cdFx0XHRcdHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06IGB0cmFuc2xhdGUzZCgkey1kaXN0YW5jZX1weCwgMHB4LCAwKWB9LFxyXG5cdFx0XHRcdHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06IGB0cmFuc2xhdGUzZCgwcHgsIDBweCwgMClgfSxcclxuXHRcdFx0XSwge1xyXG5cdFx0XHRcdGVhc2luZzogJ2N1YmljLWJlemllciguMTcsLjY3LC4yNCwuOTQpJyxcclxuXHRcdFx0XHRkdXJhdGlvbjogMzIwXHJcblx0XHRcdH0pXHJcblx0XHRcdHBsYXllci5wYXVzZSgpXHJcblx0XHRcdC8vcGxheWVyLnBsYXkoKVxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHBsYXllci5wbGF5KCksIDQwKVxyXG5cdFx0XHRwbGF5ZXIub25jYW5jZWwgPSBwbGF5ZXIub25maW5pc2ggPSBlID0+IHtcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRBbmltYXRpb24gPSB1bmRlZmluZWRcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmN1cnJlbnRBbmltYXRpb24gPSBwbGF5ZXJcclxuXHRcdH1cclxuXHRcdHZhciBmYWRlT3V0T2xkUGFnZSA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5jdXJyZW50QW5pbWF0aW9uID0gb2xkUGFnZS5hbmltYXRlKFtcclxuXHRcdFx0XHR7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoMHB4LCAwcHgsIDApYH0sXHJcblx0XHRcdFx0e29wYWNpdHk6IDAsIHRyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCR7ZGlzdGFuY2V9cHgsIDBweCwgMClgfSxcclxuXHRcdFx0XSwge1xyXG5cdFx0XHRcdGVhc2luZzogJ2Vhc2UtaW4nLFxyXG5cdFx0XHRcdGR1cmF0aW9uOiA5MFxyXG5cdFx0XHR9KVxyXG5cdFx0XHR2YXIgb25jYW5jZWwgPSB0aGlzLmN1cnJlbnRBbmltYXRpb24ub25jYW5jZWwgPSBlID0+IHtcclxuXHRcdFx0XHRvbGRQYWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRBbmltYXRpb24gPSB1bmRlZmluZWRcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmN1cnJlbnRBbmltYXRpb24ub25maW5pc2ggPSBlID0+IHtcclxuXHRcdFx0XHRvbmNhbmNlbCgpXHJcblx0XHRcdFx0ZmFkZUluTmV3UGFnZSgpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmhpZGVQYWdlQXR0cmlidXRlcyhvbGRQYWdlKVxyXG5cdFx0dGhpcy5zZWxlY3RlZFBhZ2UgPSBuZXdQYWdlXHJcblx0XHRpZiAodGhpcy5jdXJyZW50QW5pbWF0aW9uKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudEFuaW1hdGlvbi5jYW5jZWwoKVxyXG5cdFx0XHRvbGRQYWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuXHRcdFx0ZmFkZUluTmV3UGFnZSgpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmYWRlT3V0T2xkUGFnZSgpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzaG93U2libGluZ1BhZ2VzKCkge1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnc2hvd1NpYmxpbmdQYWdlcycpXHJcblx0XHR0aGlzLnByZXZQYWdlID0gdGhpcy5zZWxlY3RlZFBhZ2UucHJldmlvdXNFbGVtZW50U2libGluZ1xyXG5cdFx0dGhpcy5uZXh0UGFnZSA9IHRoaXMuc2VsZWN0ZWRQYWdlLm5leHRFbGVtZW50U2libGluZ1xyXG5cdFx0Ly9jb25zb2xlLmxvZygndGhpcy5zZWxlY3RlZFBhZ2UnLCB0aGlzLnNlbGVjdGVkUGFnZSlcclxuXHRcdC8vY29uc29sZS5sb2coJ3RoaXMucHJldlBhZ2UnLCB0aGlzLnByZXZQYWdlKVxyXG5cdFx0Ly9jb25zb2xlLmxvZygndGhpcy5uZXh0UGFnZScsIHRoaXMubmV4dFBhZ2UpXHJcblxyXG5cdFx0aWYgKCF0aGlzLnByZXZQYWdlICYmIHRoaXMuY3ljbGUpIHRoaXMucHJldlBhZ2UgPSB0aGlzLmxhc3RFbGVtZW50Q2hpbGRcclxuXHRcdGlmICghdGhpcy5uZXh0UGFnZSAmJiB0aGlzLmN5Y2xlKSB0aGlzLm5leHRQYWdlID0gdGhpcy5maXJzdEVsZW1lbnRDaGlsZFxyXG5cclxuXHRcdGlmICh0aGlzLnByZXZQYWdlKSB7XHJcblx0XHRcdHRoaXMucHJldlBhZ2Uuc3R5bGUubGVmdCA9IGAtJHt0aGlzLndpZHRofXB4YFxyXG5cdFx0XHR0aGlzLnNob3dQYWdlKHRoaXMucHJldlBhZ2UpXHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5uZXh0UGFnZSkge1xyXG5cdFx0XHR0aGlzLm5leHRQYWdlLnN0eWxlLmxlZnQgPSBgJHt0aGlzLndpZHRofXB4YFxyXG5cdFx0XHR0aGlzLnNob3dQYWdlKHRoaXMubmV4dFBhZ2UpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzaG93TW9yZVBhZ2VzKCkge1xyXG5cdFx0Ly8gVE9ET1xyXG5cdFx0Ly8gU2hvdyBtb3JlIHRoZW4gcHJldi9uZXh0IHBhZ2VzLlxyXG5cdFx0Ly8gVXNlZnVsIGZvciBzbWFsbCB0YWJzIG9uIGJpZyBzY3JlZW4gd2hlcmUgZmluZ2VyIGNhbiBrZWVwIHNjcm9sbGluZyB0byBmdXJ0aGVyIHBhZ2VzXHJcblx0XHR0aGlzLnNob3dTaWJsaW5nUGFnZXMoKSAvLyBmb3Igbm93XHJcblx0fVxyXG5cclxuXHRkcmFnRGlzdGFuY2UgPSAwXHJcblxyXG5cdG9uRHJhZ1N0YXJ0KGUpIHtcclxuXHRcdC8vaWYgKGUucG9pbnRlclR5cGUgPT09ICdtb3VzZScpIHJldHVyblxyXG5cdFx0Ly9jb25zb2xlLmxvZygnb25EcmFnU3RhcnQnLCBlKVxyXG5cdFx0aWYgKHRoaXMudHJhbnNpdGlvbmluZykge1xyXG5cdFx0XHQvLyBUT0RPIGlmIGZlYXNpYmxlOiBEbyBzb21lIHF1aWNrIHNuYXAgKDEwLTIwbXM/KSBmcm9tIGN1cnJlbnRseSB0cmFuc2l0aW9uZWRcclxuXHRcdFx0Ly8gcG9zaXRpb24gYmVmb3JlIHJlc2V0dGluZyAoYmFzaWNhbGx5LCBmb3JjZSB0cmFuc2l0aW9uIHRvIGZpbmlzaCBxdWlja2VyKVxyXG5cdFx0XHQvL3RoaXMuJC50cmFjay5zdHlsZS50cmFuc2l0aW9uID0gYHRyYW5zZm9ybSA0MG1zYFxyXG5cdFx0XHR0aGlzLnJlc2V0UGFnZXMoKVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5pbml0WCA9IGUuY2xpZW50WFxyXG5cdFx0dGhpcy53aWR0aCA9IHRoaXMub2Zmc2V0V2lkdGhcclxuXHJcblx0XHQvL2lmICh3aW5kb3cuaW5uZXJXaWRodCA9PT0gdGhpcy53aWR0aClcclxuXHRcdFx0dGhpcy5zaG93U2libGluZ1BhZ2VzKClcclxuXHRcdC8vZWxzZVxyXG5cdFx0Ly9cdHRoaXMuc2hvd01vcmVQYWdlcygpXHJcblxyXG5cdFx0aWYgKCF0aGlzLmN5Y2xlKSB7XHJcblx0XHRcdHRoaXMubGVmdENsYW1wRGlzdGFuY2UgPSB0aGlzLnNlbGVjdGVkICogdGhpcy53aWR0aFxyXG5cdFx0XHR0aGlzLnJpZ2h0Q2xhbXBEaXN0YW5jZSA9ICgodGhpcy5wYWdlcy5sZW5ndGggLSAxKSAtIHRoaXMuc2VsZWN0ZWQpICogLXRoaXMud2lkdGhcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9uRHJhZ01vdmUoZSkge1xyXG5cdFx0Ly9pZiAoZS5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJykgcmV0dXJuXHJcblx0XHQvL2NvbnNvbGUubG9nKCdvbkRyYWdNb3ZlJylcclxuXHRcdHRoaXMuZHJhZ0Rpc3RhbmNlID0gZS5jbGllbnRYIC0gdGhpcy5pbml0WFxyXG5cdFx0aWYgKCF0aGlzLmN5Y2xlKVxyXG5cdFx0XHR0aGlzLmRyYWdEaXN0YW5jZSA9IGNsYW1wKHRoaXMuZHJhZ0Rpc3RhbmNlLCB0aGlzLnJpZ2h0Q2xhbXBEaXN0YW5jZSwgdGhpcy5sZWZ0Q2xhbXBEaXN0YW5jZSlcclxuXHRcdHRoaXMuX3RyYWNrUmVuZGVyKHRoaXMuZHJhZ0Rpc3RhbmNlKVxyXG5cdH1cclxuXHJcblx0b25EcmFnRW5kKGUpIHtcclxuXHRcdC8vaWYgKGUucG9pbnRlclR5cGUgPT09ICdtb3VzZScpIHJldHVyblxyXG5cdFx0Ly9jb25zb2xlLmxvZygnb25EcmFnRW5kJylcclxuXHRcdHRoaXMudHJhbnNpdGlvbmluZyA9IHRydWVcclxuXHRcdHZhciBvdmVyVGhyZXNob2xkID0gdGhpcy53aWR0aCAqIHRoaXMudGhyZXNob2xkIDwgTWF0aC5hYnModGhpcy5kcmFnRGlzdGFuY2UpXHJcblx0XHRpZiAob3ZlclRocmVzaG9sZCkge1xyXG5cdFx0XHR2YXIgZHVyYXRpb24gPSB0aGlzLmNhbGNEdXJhdGlvbih0aGlzLndpZHRoIC0gTWF0aC5hYnModGhpcy5kcmFnRGlzdGFuY2UpKVxyXG5cdFx0XHQvL3RoaXMuJC50cmFjay5zdHlsZS50cmFuc2l0aW9uID0gYHRyYW5zZm9ybSAke2R1cmF0aW9ufW1zYFxyXG5cdFx0XHRpZiAodGhpcy5kcmFnRGlzdGFuY2UgPiAwKSB7XHJcblx0XHRcdFx0dGhpcy5fdHJhY2tSZW5kZXIoMClcclxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkIC09IDFcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLl90cmFja1JlbmRlcigwKVxyXG5cdFx0XHRcdHRoaXMuc2VsZWN0ZWQgKz0gMVxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgZHVyYXRpb24gPSB0aGlzLmNhbGNEdXJhdGlvbih0aGlzLmRyYWdEaXN0YW5jZSlcclxuXHRcdFx0dGhpcy5fdHJhY2tSZW5kZXIoMClcclxuXHRcdFx0Ly90aGlzLnJlc2V0UGFnZXMoKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3RyYWNrUmVuZGVyKGRpc3RhbmNlKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdfdHJhY2tSZW5kZXInLCB0aGlzLiQudHJhY2suc3R5bGUudHJhbnNpdGlvbilcclxuXHRcdHRoaXMuJC50cmFjay5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtkaXN0YW5jZX1weCwgMHB4LCAwKWBcclxuXHR9XHJcblxyXG5cclxufVxyXG5cclxuIl0sIm5hbWVzIjpbInNlbGVjdGVkVmFsaWRhdG9yIiwibmV3VmFsdWUiLCJzZWxmIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJjbGFtcCIsIkZsZXh1c1BhZ2VzIiwidGVtcGxhdGUiLCJjc3MiLCJvbiIsImN1c3RvbUVsZW1lbnQiLCJnYW55bWVkZUVsZW1lbnQiLCJMaW5lYXJTZWxlY3RhYmxlIiwiYXV0b0FkanVzdEhlaWdodCIsIm1heFRyYW5zaXRpb25EdXJhdGlvbiIsImRyYWdEaXN0YW5jZSIsInNldHVwUGFnZXMiLCJzd2lwZWFibGUiLCJkcmFnZ2FibGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGp1c3RIZWlnaHQiLCJkYXRhIiwiZSIsImRpc3RhbmNlIiwiTWF0aCIsImFicyIsInBsYXRmb3JtIiwibWF0ZXJpYWwiLCJtaW4iLCJhbmltYXRpb24iLCJkdXJhdGlvbkJ5RGlzdGFuY2UiLCJwYWdlcyIsIkFycmF5IiwiZnJvbSIsInNlbGVjdGVkUGFnZSIsInNlbGVjdGVkIiwicmVzZXRQYWdlcyIsImZvckVhY2giLCJwYWdlIiwic3R5bGUiLCJkaXNwbGF5IiwibGVmdCIsImhpZGVQYWdlQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInJlcG9zaXRpb24iLCJzaG93UGFnZUF0dHJpYnV0ZXMiLCJoaWRlUGFnZSIsInNob3dQYWdlIiwibG9nIiwic2V0SGVpZ2h0Iiwic2VsZWN0ZWRQYWdlQmJveCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIm5ld1BhZ2VIZWlnaHQiLCJoZWlnaHQiLCJuZXdJbmRleCIsIm9sZEluZGV4Iiwid2lkdGgiLCJvZmZzZXRXaWR0aCIsInBhZ2VEaWZmIiwiZGlyZWN0aW9uIiwib2xkUGFnZUhlaWdodCIsInNlbGVjdGVkQ2hhbmdlZE1hdGVyaWFsIiwic2VsZWN0ZWRDaGFuZ2VkTmVvbiIsImVtaXQiLCJvbGRQYWdlIiwibmV3UGFnZSIsImN1cnJlbnRBbmltYXRpb24iLCJjYW5jZWwiLCJub1NraXBwaW5nIiwiZHVyYXRpb24iLCJjYWxjRHVyYXRpb24iLCIkIiwidHJhY2siLCJhbmltYXRlIiwidHJhbnNmb3JtIiwib25jYW5jZWwiLCJvbmZpbmlzaCIsInVuZGVmaW5lZCIsImZhZGVJbk5ld1BhZ2UiLCJwbGF5ZXIiLCJvcGFjaXR5IiwicGF1c2UiLCJwbGF5IiwiZmFkZU91dE9sZFBhZ2UiLCJwcmV2UGFnZSIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJuZXh0UGFnZSIsIm5leHRFbGVtZW50U2libGluZyIsImN5Y2xlIiwibGFzdEVsZW1lbnRDaGlsZCIsImZpcnN0RWxlbWVudENoaWxkIiwic2hvd1NpYmxpbmdQYWdlcyIsInRyYW5zaXRpb25pbmciLCJpbml0WCIsImNsaWVudFgiLCJsZWZ0Q2xhbXBEaXN0YW5jZSIsInJpZ2h0Q2xhbXBEaXN0YW5jZSIsIl90cmFja1JlbmRlciIsIm92ZXJUaHJlc2hvbGQiLCJ0aHJlc2hvbGQiLCJyZWZsZWN0IiwidG91Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQ0EsQUFDQSxBQUlBLFNBQVNBLGlCQUFULENBQTJCQyxRQUEzQixFQUFxQ0MsSUFBckMsRUFBMkM7S0FDdENBLEtBQUtDLFFBQUwsQ0FBY0MsTUFBZCxLQUF5QixDQUE3QixFQUNDLE9BQU8sQ0FBUCxDQURELEtBR0MsT0FBT0MsYUFBTUosUUFBTixFQUFnQixDQUFoQixFQUFtQkMsS0FBS0MsUUFBTCxDQUFjQyxNQUFkLEdBQXVCLENBQTFDLENBQVA7OztJQTZDSUUsc0JBckNMQyxrQkFBVTs7OztDQUFWLFdBS0FDLGFBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FBTCxXQXFFQ0MsWUFBRyxPQUFILEdBNUVEQyx3RUF1Q0QsTUFBTUosV0FBTixTQUEwQksseUJBQWdCQyx1QkFBaEIsQ0FBMUIsQ0FBNEQ7Ozs7c1hBVTNEQyxnQkFWMkQsR0FVeEMsS0FWd0MsT0FhOUNDLHFCQWI4QyxHQWF0QixHQWJzQixPQWtRM0RDLFlBbFEyRCxHQWtRNUMsQ0FsUTRDOzs7Ozs7U0FlbkQ7OztPQUdGQyxVQUFMO01BQ0ksS0FBS0MsU0FBVCxFQUNDQyxpQkFBVSxJQUFWOzs7T0FHSUMsWUFBTCxDQUFrQixVQUFsQixFQUE4QixDQUE5Qjs7Ozs7Ozs7OztNQVVJLEtBQUtOLGdCQUFULEVBQ0MsS0FBS08sWUFBTDs7O1NBSU1DLElBQVIsRUFBY0MsQ0FBZCxFQUFpQjs7OztjQUlKQyxRQUFiLEVBQXVCOztNQUVsQkEsV0FBV0MsS0FBS0MsR0FBTCxDQUFTRixRQUFULENBQWY7TUFDSUcsZ0JBQVNDLFFBQWIsRUFDQyxPQUFPSCxLQUFLSSxHQUFMLENBQVNDLGlCQUFVQyxrQkFBVixDQUE2QlAsUUFBN0IsQ0FBVCxFQUFpRCxLQUFLVCxxQkFBdEQsQ0FBUCxDQURELEtBR0MsT0FBTyxHQUFQOzs7Y0FHVzs7T0FFUGlCLEtBQUwsR0FBYUMsTUFBTUMsSUFBTixDQUFXLEtBQUs5QixRQUFoQixDQUFiOzs7T0FHSytCLFlBQUwsR0FBb0IsS0FBS0gsS0FBTCxDQUFXLEtBQUtJLFFBQWhCLENBQXBCOztPQUVLQyxVQUFMOztPQUVLTCxLQUFMLENBQVdNLE9BQVgsQ0FBbUJDLFFBQVE7UUFDckJuQixZQUFMLENBQWtCLFVBQWxCLEVBQThCLENBQTlCO0dBREQ7OztVQUtRbUIsSUFBVCxFQUFlOztPQUVUQyxLQUFMLENBQVdDLE9BQVgsR0FBcUIsTUFBckI7T0FDS0QsS0FBTCxDQUFXRSxJQUFYLEdBQWtCLEtBQWxCO09BQ0tDLGtCQUFMLENBQXdCSixJQUF4Qjs7b0JBRWtCQSxJQUFuQixFQUF5Qjs7T0FFbkJLLGVBQUwsQ0FBcUIsVUFBckI7T0FDS3hCLFlBQUwsQ0FBa0IsV0FBbEIsRUFBK0IsRUFBL0I7O1VBRVFtQixJQUFULEVBQWVNLGFBQWEsS0FBNUIsRUFBbUM7O09BRTdCTCxLQUFMLENBQVdDLE9BQVgsR0FBcUIsRUFBckI7TUFDSUksVUFBSixFQUFnQk4sS0FBS0MsS0FBTCxDQUFXRSxJQUFYLEdBQWtCLEtBQWxCO09BQ1hJLGtCQUFMLENBQXdCUCxJQUF4Qjs7b0JBRWtCQSxJQUFuQixFQUF5Qjs7T0FFbkJuQixZQUFMLENBQWtCLFVBQWxCLEVBQThCLEVBQTlCO09BQ0t3QixlQUFMLENBQXFCLFdBQXJCOzs7O2NBSVk7O09BRVBaLEtBQUwsQ0FBV00sT0FBWCxDQUFtQkMsUUFBUTtPQUN0QkEsU0FBUyxLQUFLSixZQUFsQixFQUNDLEtBQUtZLFFBQUwsQ0FBY1IsSUFBZDtHQUZGOztPQUtLUyxRQUFMLENBQWMsS0FBS2IsWUFBbkIsRUFBaUMsSUFBakM7OztnQkFHYztVQUNOYyxHQUFSLENBQVksY0FBWjtNQUNJQyxZQUFZLE1BQU07T0FDakJDLG1CQUFtQixLQUFLaEIsWUFBTCxDQUFrQmlCLHFCQUFsQixFQUF2QjtPQUNJQyxnQkFBZ0JGLGlCQUFpQkcsTUFBckM7OztRQUdLZCxLQUFMLENBQVdjLE1BQVgsR0FBcUIsSUFBRUQsYUFBYyxLQUFyQzs7Ozs7OztXQU9RSixHQUFSLENBQVksbUJBQVosRUFBaUMsS0FBS2QsWUFBdEM7V0FDUWMsR0FBUixDQUFZRSxnQkFBWjtHQWJEOzs7O2FBa0JXRCxTQUFYLEVBQXNCLEVBQXRCOzs7aUJBR2VLLFFBQWhCLEVBQTBCQyxRQUExQixFQUFvQzs7T0FFOUJDLEtBQUwsR0FBYSxLQUFLQyxXQUFsQjtNQUNJQyxXQUFXSCxXQUFXRCxRQUExQjtNQUNJSyxZQUFZRCxXQUFXLENBQVgsR0FBZSxDQUFDLENBQWhCLEdBQW9CLENBQXBDOztNQUVJLEtBQUs3QyxnQkFBVCxFQUNDLElBQUkrQyxnQkFBZ0IsS0FBSzFCLFlBQUwsQ0FBa0JpQixxQkFBbEIsR0FBMENFLE1BQTlEOztNQUVHM0IsZ0JBQVNDLFFBQWIsRUFDQyxLQUFLa0MsdUJBQUwsQ0FBNkJQLFFBQTdCLEVBQXVDSSxRQUF2QyxFQUFpREMsU0FBakQsRUFERCxLQUdDLEtBQUtHLG1CQUFMLENBQXlCUixRQUF6QixFQUFtQ0ksUUFBbkMsRUFBNkNDLFNBQTdDOztPQUVJSSxJQUFMLENBQVUsVUFBVixFQUFzQlQsUUFBdEI7O01BRUksS0FBS3pDLGdCQUFULEVBQ0MsS0FBS08sWUFBTDs7eUJBRXNCa0MsUUFBeEIsRUFBa0NJLFFBQWxDLEVBQTRDQyxTQUE1QyxFQUF1RDtPQUNqRGpCLGtCQUFMLENBQXdCLEtBQUtSLFlBQTdCO09BQ0tBLFlBQUwsR0FBb0IsS0FBS0gsS0FBTCxDQUFXdUIsUUFBWCxDQUFwQjtPQUNLVCxrQkFBTCxDQUF3QixLQUFLWCxZQUE3Qjs7TUFFSThCLFVBQVUsS0FBSzlCLFlBQW5CO01BQ0krQixVQUFVLEtBQUtsQyxLQUFMLENBQVd1QixRQUFYLENBQWQ7TUFDSSxLQUFLWSxnQkFBVCxFQUEyQjtRQUNyQkEsZ0JBQUwsQ0FBc0JDLE1BQXRCO1dBQ1E1QixLQUFSLENBQWNDLE9BQWQsR0FBd0IsTUFBeEI7R0FGRCxNQUdPO09BQ0YsS0FBSzRCLFVBQVQsRUFDQyxJQUFJN0MsV0FBV21DLFdBQVcsS0FBS0YsS0FBL0IsQ0FERCxLQUdDLElBQUlqQyxXQUFXb0MsWUFBWSxLQUFLSCxLQUFoQztRQUNJdEIsWUFBTCxDQUFrQkssS0FBbEIsQ0FBd0JFLElBQXhCLEdBQWdDLElBQUUsQ0FBQ2xCLFFBQVMsS0FBNUM7UUFDS3dCLFFBQUwsQ0FBYyxLQUFLYixZQUFuQjs7T0FFSW1DLFdBQVcsS0FBS0MsWUFBTCxDQUFrQi9DLFFBQWxCLENBQWY7O1FBRUsyQyxnQkFBTCxHQUF3QixLQUFLSyxDQUFMLENBQU9DLEtBQVAsQ0FBYUMsT0FBYixDQUFxQjs7S0FFM0NDLFdBQVksZ0JBQWMsS0FBSzNELFlBQWEsY0FBN0MsRUFGNEMsRUFHNUMsRUFBQzJELFdBQVksZ0JBQWNuRCxRQUFTLGNBQXBDLEVBSDRDLENBQXJCLEVBSXJCO1lBQUE7WUFFTTtJQU5lLENBQXhCO1FBUUsyQyxnQkFBTCxDQUFzQlMsUUFBdEIsR0FBaUMsS0FBS1QsZ0JBQUwsQ0FBc0JVLFFBQXRCLEdBQWlDdEQsS0FBSztTQUNqRVAsWUFBTCxHQUFvQixDQUFwQjtTQUNLbUQsZ0JBQUwsR0FBd0JXLFNBQXhCO1NBQ0t6QyxVQUFMOztJQUhEOzs7cUJBU2tCa0IsUUFBcEIsRUFBOEJJLFFBQTlCLEVBQXdDQyxTQUF4QyxFQUFtRDtNQUM5Q3BDLFdBQVcsS0FBS29DLFNBQXBCO01BQ0lLLFVBQVUsS0FBSzlCLFlBQW5CO01BQ0krQixVQUFVLEtBQUtsQyxLQUFMLENBQVd1QixRQUFYLENBQWQ7O01BRUl3QixnQkFBZ0IsTUFBTTtXQUNqQnZDLEtBQVIsQ0FBY0MsT0FBZCxHQUF3QixFQUF4QjtRQUNLSyxrQkFBTCxDQUF3Qm9CLE9BQXhCO09BQ0ljLFNBQVNkLFFBQVFRLE9BQVIsQ0FBZ0IsQ0FDNUIsRUFBQ08sU0FBUyxDQUFWLEVBQWFOLFdBQVksZ0JBQWMsQ0FBQ25ELFFBQVMsY0FBakQsRUFENEIsRUFFNUIsRUFBQ3lELFNBQVMsQ0FBVixFQUFhTixXQUFZLDBCQUF6QixFQUY0QixDQUFoQixFQUdWO1lBQ00sK0JBRE47Y0FFUTtJQUxFLENBQWI7VUFPT08sS0FBUDs7Y0FFVyxNQUFNRixPQUFPRyxJQUFQLEVBQWpCLEVBQWdDLEVBQWhDO1VBQ09QLFFBQVAsR0FBa0JJLE9BQU9ILFFBQVAsR0FBa0J0RCxLQUFLO1NBQ25DNEMsZ0JBQUwsR0FBd0JXLFNBQXhCO0lBREQ7UUFHS1gsZ0JBQUwsR0FBd0JhLE1BQXhCO0dBaEJEO01Ba0JJSSxpQkFBaUIsTUFBTTtRQUNyQmpCLGdCQUFMLEdBQXdCRixRQUFRUyxPQUFSLENBQWdCLENBQ3ZDLEVBQUNPLFNBQVMsQ0FBVixFQUFhTixXQUFZLDBCQUF6QixFQUR1QyxFQUV2QyxFQUFDTSxTQUFTLENBQVYsRUFBYU4sV0FBWSxnQkFBY25ELFFBQVMsY0FBaEQsRUFGdUMsQ0FBaEIsRUFHckI7WUFDTSxTQUROO2NBRVE7SUFMYSxDQUF4QjtPQU9Jb0QsV0FBVyxLQUFLVCxnQkFBTCxDQUFzQlMsUUFBdEIsR0FBaUNyRCxLQUFLO1lBQzVDaUIsS0FBUixDQUFjQyxPQUFkLEdBQXdCLE1BQXhCO1NBQ0swQixnQkFBTCxHQUF3QlcsU0FBeEI7SUFGRDtRQUlLWCxnQkFBTCxDQUFzQlUsUUFBdEIsR0FBaUN0RCxLQUFLOzs7SUFBdEM7R0FaRDs7T0FrQktvQixrQkFBTCxDQUF3QnNCLE9BQXhCO09BQ0s5QixZQUFMLEdBQW9CK0IsT0FBcEI7TUFDSSxLQUFLQyxnQkFBVCxFQUEyQjtRQUNyQkEsZ0JBQUwsQ0FBc0JDLE1BQXRCO1dBQ1E1QixLQUFSLENBQWNDLE9BQWQsR0FBd0IsTUFBeEI7O0dBRkQsTUFJTzs7Ozs7b0JBS1c7O09BRWI0QyxRQUFMLEdBQWdCLEtBQUtsRCxZQUFMLENBQWtCbUQsc0JBQWxDO09BQ0tDLFFBQUwsR0FBZ0IsS0FBS3BELFlBQUwsQ0FBa0JxRCxrQkFBbEM7Ozs7O01BS0ksQ0FBQyxLQUFLSCxRQUFOLElBQWtCLEtBQUtJLEtBQTNCLEVBQWtDLEtBQUtKLFFBQUwsR0FBZ0IsS0FBS0ssZ0JBQXJCO01BQzlCLENBQUMsS0FBS0gsUUFBTixJQUFrQixLQUFLRSxLQUEzQixFQUFrQyxLQUFLRixRQUFMLEdBQWdCLEtBQUtJLGlCQUFyQjs7TUFFOUIsS0FBS04sUUFBVCxFQUFtQjtRQUNiQSxRQUFMLENBQWM3QyxLQUFkLENBQW9CRSxJQUFwQixHQUE0QixLQUFHLEtBQUtlLEtBQU0sS0FBMUM7UUFDS1QsUUFBTCxDQUFjLEtBQUtxQyxRQUFuQjs7TUFFRyxLQUFLRSxRQUFULEVBQW1CO1FBQ2JBLFFBQUwsQ0FBYy9DLEtBQWQsQ0FBb0JFLElBQXBCLEdBQTRCLElBQUUsS0FBS2UsS0FBTSxLQUF6QztRQUNLVCxRQUFMLENBQWMsS0FBS3VDLFFBQW5COzs7O2lCQUljOzs7O09BSVZLLGdCQUFMLEdBSmU7OzthQVNKckUsQ0FBWixFQUFlOzs7TUFHVixLQUFLc0UsYUFBVCxFQUF3Qjs7OztRQUlsQnhELFVBQUw7O09BRUl5RCxLQUFMLEdBQWF2RSxFQUFFd0UsT0FBZjtPQUNLdEMsS0FBTCxHQUFhLEtBQUtDLFdBQWxCOzs7T0FHTWtDLGdCQUFMOzs7O01BSUcsQ0FBQyxLQUFLSCxLQUFWLEVBQWlCO1FBQ1hPLGlCQUFMLEdBQXlCLEtBQUs1RCxRQUFMLEdBQWdCLEtBQUtxQixLQUE5QztRQUNLd0Msa0JBQUwsR0FBMEIsQ0FBRSxLQUFLakUsS0FBTCxDQUFXM0IsTUFBWCxHQUFvQixDQUFyQixHQUEwQixLQUFLK0IsUUFBaEMsSUFBNEMsQ0FBQyxLQUFLcUIsS0FBNUU7Ozs7WUFJU2xDLENBQVgsRUFBYzs7O09BR1JQLFlBQUwsR0FBb0JPLEVBQUV3RSxPQUFGLEdBQVksS0FBS0QsS0FBckM7TUFDSSxDQUFDLEtBQUtMLEtBQVYsRUFDQyxLQUFLekUsWUFBTCxHQUFvQlYsYUFBTSxLQUFLVSxZQUFYLEVBQXlCLEtBQUtpRixrQkFBOUIsRUFBa0QsS0FBS0QsaUJBQXZELENBQXBCO09BQ0lFLFlBQUwsQ0FBa0IsS0FBS2xGLFlBQXZCOzs7V0FHU08sQ0FBVixFQUFhOzs7T0FHUHNFLGFBQUwsR0FBcUIsSUFBckI7TUFDSU0sZ0JBQWdCLEtBQUsxQyxLQUFMLEdBQWEsS0FBSzJDLFNBQWxCLEdBQThCM0UsS0FBS0MsR0FBTCxDQUFTLEtBQUtWLFlBQWQsQ0FBbEQ7TUFDSW1GLGFBQUosRUFBbUI7T0FDZDdCLFdBQVcsS0FBS0MsWUFBTCxDQUFrQixLQUFLZCxLQUFMLEdBQWFoQyxLQUFLQyxHQUFMLENBQVMsS0FBS1YsWUFBZCxDQUEvQixDQUFmOztPQUVJLEtBQUtBLFlBQUwsR0FBb0IsQ0FBeEIsRUFBMkI7U0FDckJrRixZQUFMLENBQWtCLENBQWxCO1NBQ0s5RCxRQUFMLElBQWlCLENBQWpCO0lBRkQsTUFHTztTQUNEOEQsWUFBTCxDQUFrQixDQUFsQjtTQUNLOUQsUUFBTCxJQUFpQixDQUFqQjs7R0FSRixNQVVPO09BQ0ZrQyxXQUFXLEtBQUtDLFlBQUwsQ0FBa0IsS0FBS3ZELFlBQXZCLENBQWY7UUFDS2tGLFlBQUwsQ0FBa0IsQ0FBbEI7Ozs7O2NBS1cxRSxRQUFiLEVBQXVCOztPQUVqQmdELENBQUwsQ0FBT0MsS0FBUCxDQUFhakMsS0FBYixDQUFtQm1DLFNBQW5CLEdBQWdDLGdCQUFjbkQsUUFBUyxjQUF2RDs7OzZFQTFUQTZFOzs7U0FBb0I7OytFQUNwQkE7OztTQUFxQjs7MEVBQ3JCQTs7O1NBQWdCOzs4RUFFaEJBOzs7U0FBb0IxRSxnQkFBUzJFLEtBQVQsSUFBa0IzRSxnQkFBU0M7O2lGQUMvQ3lFOzs7U0FBdUI7OytFQUN2QkE7OztTQUFxQjs7OzsifQ==
