(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede'), require('flexus')) :
	typeof define === 'function' && define.amd ? define('view', ['ganymede', 'flexus'], factory) :
	(factory(global.ganymede,global.flexus));
}(this, (function (ganymede,flexus) { 'use strict';

var _dec;
var _dec2;
var _dec3;
var _dec4;
var _dec5;
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

/*

// NOTE: this is not meant to be any significant element.
// Everything should be handled through <flexus-scene>.
// This element is here only to sugar handling the element
// with methods hide() and show()
@customElement
class FlexusView extends Element {

	show() {
		this.removeAttribute('hidden')
	}

	hide() {
		this.setAttribute('hidden', '')
	}

}
*/

flexus.addReadyAnimation('flexus-view');

let FlexusView = (_dec = ganymede.defaultValue(true), _dec2 = ganymede.defaultValue(false), _dec3 = ganymede.on('show'), _dec4 = ganymede.on('hide'), _dec5 = ganymede.on('drag'), ganymede.customElement(_class = (_class2 = class FlexusView extends ganymede.ganymedeElement(flexus.Visibility, flexus.Draggable, flexus.Panel, flexus.Scrollable) {
	constructor(...args) {
		var _temp;

		return _temp = super(...args), _initDefineProp(this, 'draggable', _descriptor, this), _initDefineProp(this, 'panel', _descriptor2, this), _initDefineProp(this, 'dragClose', _descriptor3, this), _initDefineProp(this, 'canDragDown', _descriptor4, this), _initDefineProp(this, 'canDragUp', _descriptor5, this), _initDefineProp(this, 'panel', _descriptor6, this), _temp;
	}

	// side panels should be allowed to have sneakpeek in some cases
	// and we partially visible (like pinned drawer)
	// but not by default
	// and three state breakpoint

	// simple dragup have no states - they're alaways pinned to bottom
	// unless they are rearanged to be side by side

	// some sidepanes remai side panes no matter what (image/song details)
	// some sidepanes stick

	//constructor() {
	//	super()
	ready() {
		//console.log('------ View ready Visibility ------')
		//console.log(this)
		//console.log('this.hidden', this.hidden)
		//console.log('this.visible', this.visible)
		// pannels are hidden by default, all other views must be visible
		if (!this.panel && this.hidden !== true) this.hidden = false;

		window.view = this;
		this.setupCloseButtons();
		this.configureLayout();

		this.main = this.querySelector('main');
		if (this.main) {
			this.scrollReflectsTouchAction = true;
			this.setupScrollable(this.main);
			var parallaxNodes = Array.from(this.main.querySelectorAll('[parallax]'));
			var parallaxApplicators = parallaxNodes.map(flexus.getParallaxApplicator);
			if (parallaxApplicators.length) {
				this.addScrollListeners(scrolled => {
					parallaxApplicators.forEach(cb => cb(scrolled));
				});
			}
		}

		// inherited from Panel
		this.applyVisibilityState();
	}

	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	// TODO

	// draggable view can be dragged down to close by default
	// (unless draggable is temporarily disabled)

	// draggable view can be dragged down to close by default
	// (unless draggable is temporarily disabled)


	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// LAYOUT /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	// NOTE: View inherits from Panel, but not all Views are automatically Panel


	configureLayout() {

		// disabled due to MS Edge
		//this.sneakpeek = this.querySelector(':scope > [sneakpeek]')
		this.sneakpeek = Array.from(this.children).find(node => node.hasAttribute('sneakpeek'));

		//if (this.sneakpeek)
		//	this.on(this.sneakpeek, 'click', e => this.emit('show'))

		//if (this.hasAttribute('panel') || this.hasAttribute('side') || this.hasAttribute('sidepane')) {
		if (this.panel) {
			this.autoAssignPosition();
		} else {
			this.overlayBg = false;
			this.showOverlayBg = false;
		}
	}

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////// HIDE / SHOW ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	setupCloseButtons() {
		// lets wait for a good measure
		setTimeout(() => this._setupCloseButtons());
	}
	_setupCloseButtons() {
		var iconNames = ['arrow-back', 'arrow-left', 'close', 'x'];
		// TODO: use :scope when Edge supports it
		// NOTE: Edge doesn't support :scope yet so this selector is a lot more open than I'd like to
		var selectors = iconNames.map(icon => `flexus-toolbar [icon="${ icon }"]`);
		//var selectors = iconNames.map(icon => `:scope > flexus-toolbar [icon="${icon}"]`)
		selectors.push('[close]');
		var selector = selectors.join(', ');
		Array.from(this.querySelectorAll(selector)).filter(node => !node.hasAttribute('prevent-close')).forEach(node => this.on(node, 'click', this.onCloseButtonClick));
	}

	onCloseButtonClick(val, { target }) {
		var isSearchOrSelection = target.parentElement.hasAttribute('search') || target.parentElement.hasAttribute('selection');
		if (isSearchOrSelection) return;
		//if (!this.dismissable) return
		this.hide();
	}

	onShow() {
		//if (this.sneakpeek)
		//	this.sneakpeek.style.opacity = ''
		this.removeAttribute('offscreen');
	}

	onHide() {
		//if (this.sneakpeek)
		//	this.sneakpeek.style.opacity = ''
		this.setAttribute('offscreen', '');
	}

	onDragSneakPeekRender(percentage) {
		if (this.sneakpeek) this.sneakpeek.style.opacity = 1 - percentage;
	}

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'draggable', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'panel', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'dragClose', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'canDragDown', [_dec], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'canDragUp', [_dec2], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'panel', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _applyDecoratedDescriptor(_class2.prototype, 'onCloseButtonClick', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class2.prototype, 'onCloseButtonClick'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onShow', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'onShow'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onHide', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'onHide'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onDragSneakPeekRender', [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, 'onDragSneakPeekRender'), _class2.prototype)), _class2)) || _class);

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZXMiOlsic3JjL2VsZW1lbnRzL3ZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt0ZW1wbGF0ZSwgY3NzLCByZWZsZWN0LCBvbiwgY3VzdG9tRWxlbWVudCwgZ2FueW1lZGVFbGVtZW50LCBhdXRvYmluZCwgZGVmYXVsdFZhbHVlfSBmcm9tICdnYW55bWVkZSdcclxuaW1wb3J0IHtwbGF0Zm9ybSwgVmlzaWJpbGl0eSwgQnJlYWtwb2ludGFibGUsIERyYWdnYWJsZSwgUGFuZWwsIFNjcm9sbGFibGV9IGZyb20gJ2ZsZXh1cydcclxuaW1wb3J0IHtnZXRQYXJhbGxheEFwcGxpY2F0b3IsIGFkZFJlYWR5QW5pbWF0aW9ufSBmcm9tICdmbGV4dXMnXHJcblxyXG4vKlxyXG5cclxuLy8gTk9URTogdGhpcyBpcyBub3QgbWVhbnQgdG8gYmUgYW55IHNpZ25pZmljYW50IGVsZW1lbnQuXHJcbi8vIEV2ZXJ5dGhpbmcgc2hvdWxkIGJlIGhhbmRsZWQgdGhyb3VnaCA8ZmxleHVzLXNjZW5lPi5cclxuLy8gVGhpcyBlbGVtZW50IGlzIGhlcmUgb25seSB0byBzdWdhciBoYW5kbGluZyB0aGUgZWxlbWVudFxyXG4vLyB3aXRoIG1ldGhvZHMgaGlkZSgpIGFuZCBzaG93KClcclxuQGN1c3RvbUVsZW1lbnRcclxuY2xhc3MgRmxleHVzVmlldyBleHRlbmRzIEVsZW1lbnQge1xyXG5cclxuXHRzaG93KCkge1xyXG5cdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKVxyXG5cdH1cclxuXHJcbn1cclxuKi9cclxuXHJcbmFkZFJlYWR5QW5pbWF0aW9uKCdmbGV4dXMtdmlldycpXHJcblxyXG5AY3VzdG9tRWxlbWVudFxyXG5jbGFzcyBGbGV4dXNWaWV3IGV4dGVuZHMgZ2FueW1lZGVFbGVtZW50KFZpc2liaWxpdHksIERyYWdnYWJsZSwgUGFuZWwsIFNjcm9sbGFibGUpIHtcclxuLy9jbGFzcyBGbGV4dXNQYW5lbCBleHRlbmRzIG1peGluKFBhbmVsLCBEcmFnZ2FibGUpIHtcclxuXHJcblx0QHJlZmxlY3QgZHJhZ2dhYmxlID0gZmFsc2VcclxuXHJcblx0QHJlZmxlY3QgcGFuZWwgPSBmYWxzZVxyXG5cclxuXHQvLyBzaWRlIHBhbmVscyBzaG91bGQgYmUgYWxsb3dlZCB0byBoYXZlIHNuZWFrcGVlayBpbiBzb21lIGNhc2VzXHJcblx0Ly8gYW5kIHdlIHBhcnRpYWxseSB2aXNpYmxlIChsaWtlIHBpbm5lZCBkcmF3ZXIpXHJcblx0Ly8gYnV0IG5vdCBieSBkZWZhdWx0XHJcblx0Ly8gYW5kIHRocmVlIHN0YXRlIGJyZWFrcG9pbnRcclxuXHJcblx0Ly8gc2ltcGxlIGRyYWd1cCBoYXZlIG5vIHN0YXRlcyAtIHRoZXkncmUgYWxhd2F5cyBwaW5uZWQgdG8gYm90dG9tXHJcblx0Ly8gdW5sZXNzIHRoZXkgYXJlIHJlYXJhbmdlZCB0byBiZSBzaWRlIGJ5IHNpZGVcclxuXHJcblx0Ly8gc29tZSBzaWRlcGFuZXMgcmVtYWkgc2lkZSBwYW5lcyBubyBtYXR0ZXIgd2hhdCAoaW1hZ2Uvc29uZyBkZXRhaWxzKVxyXG5cdC8vIHNvbWUgc2lkZXBhbmVzIHN0aWNrXHJcblxyXG5cdC8vY29uc3RydWN0b3IoKSB7XHJcblx0Ly9cdHN1cGVyKClcclxuXHRyZWFkeSgpIHtcclxuXHRcdC8vY29uc29sZS5sb2coJy0tLS0tLSBWaWV3IHJlYWR5IFZpc2liaWxpdHkgLS0tLS0tJylcclxuXHRcdC8vY29uc29sZS5sb2codGhpcylcclxuXHRcdC8vY29uc29sZS5sb2coJ3RoaXMuaGlkZGVuJywgdGhpcy5oaWRkZW4pXHJcblx0XHQvL2NvbnNvbGUubG9nKCd0aGlzLnZpc2libGUnLCB0aGlzLnZpc2libGUpXHJcblx0XHQvLyBwYW5uZWxzIGFyZSBoaWRkZW4gYnkgZGVmYXVsdCwgYWxsIG90aGVyIHZpZXdzIG11c3QgYmUgdmlzaWJsZVxyXG5cdFx0aWYgKCF0aGlzLnBhbmVsICYmIHRoaXMuaGlkZGVuICE9PSB0cnVlKVxyXG5cdFx0XHR0aGlzLmhpZGRlbiA9IGZhbHNlXHJcblxyXG5cdFx0d2luZG93LnZpZXcgPSB0aGlzXHJcblx0XHR0aGlzLnNldHVwQ2xvc2VCdXR0b25zKClcclxuXHRcdHRoaXMuY29uZmlndXJlTGF5b3V0KClcclxuXHJcblx0XHR0aGlzLm1haW4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ21haW4nKVxyXG5cdFx0aWYgKHRoaXMubWFpbikge1xyXG5cdFx0XHR0aGlzLnNjcm9sbFJlZmxlY3RzVG91Y2hBY3Rpb24gPSB0cnVlXHJcblx0XHRcdHRoaXMuc2V0dXBTY3JvbGxhYmxlKHRoaXMubWFpbilcclxuXHRcdFx0dmFyIHBhcmFsbGF4Tm9kZXMgPSBBcnJheS5mcm9tKHRoaXMubWFpbi5xdWVyeVNlbGVjdG9yQWxsKCdbcGFyYWxsYXhdJykpXHJcblx0XHRcdHZhciBwYXJhbGxheEFwcGxpY2F0b3JzID0gcGFyYWxsYXhOb2Rlcy5tYXAoZ2V0UGFyYWxsYXhBcHBsaWNhdG9yKVxyXG5cdFx0XHRpZiAocGFyYWxsYXhBcHBsaWNhdG9ycy5sZW5ndGgpIHtcclxuXHRcdFx0XHR0aGlzLmFkZFNjcm9sbExpc3RlbmVycyhzY3JvbGxlZCA9PiB7XHJcblx0XHRcdFx0XHRwYXJhbGxheEFwcGxpY2F0b3JzLmZvckVhY2goY2IgPT4gY2Ioc2Nyb2xsZWQpKVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBpbmhlcml0ZWQgZnJvbSBQYW5lbFxyXG5cdFx0dGhpcy5hcHBseVZpc2liaWxpdHlTdGF0ZSgpXHJcblx0fVxyXG5cclxuXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHQvLyBUT0RPXHJcblx0QHJlZmxlY3QgZHJhZ0Nsb3NlID0gZmFsc2VcclxuXHQvLyBkcmFnZ2FibGUgdmlldyBjYW4gYmUgZHJhZ2dlZCBkb3duIHRvIGNsb3NlIGJ5IGRlZmF1bHRcclxuXHQvLyAodW5sZXNzIGRyYWdnYWJsZSBpcyB0ZW1wb3JhcmlseSBkaXNhYmxlZClcclxuXHRAZGVmYXVsdFZhbHVlKHRydWUpXHJcblx0Y2FuRHJhZ0Rvd24gPSBmYWxzZVxyXG5cdC8vIGRyYWdnYWJsZSB2aWV3IGNhbiBiZSBkcmFnZ2VkIGRvd24gdG8gY2xvc2UgYnkgZGVmYXVsdFxyXG5cdC8vICh1bmxlc3MgZHJhZ2dhYmxlIGlzIHRlbXBvcmFyaWx5IGRpc2FibGVkKVxyXG5cdEBkZWZhdWx0VmFsdWUoZmFsc2UpXHJcblx0Y2FuRHJhZ1VwID0gZmFsc2VcclxuXHJcblxyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gTEFZT1VUIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHQvLyBOT1RFOiBWaWV3IGluaGVyaXRzIGZyb20gUGFuZWwsIGJ1dCBub3QgYWxsIFZpZXdzIGFyZSBhdXRvbWF0aWNhbGx5IFBhbmVsXHJcblx0QHJlZmxlY3QgcGFuZWwgPSBmYWxzZVxyXG5cclxuXHRjb25maWd1cmVMYXlvdXQoKSB7XHJcblxyXG5cdFx0Ly8gZGlzYWJsZWQgZHVlIHRvIE1TIEVkZ2VcclxuXHRcdC8vdGhpcy5zbmVha3BlZWsgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJzpzY29wZSA+IFtzbmVha3BlZWtdJylcclxuXHRcdHRoaXMuc25lYWtwZWVrID0gQXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKS5maW5kKG5vZGUgPT4gbm9kZS5oYXNBdHRyaWJ1dGUoJ3NuZWFrcGVlaycpKVxyXG5cclxuXHRcdC8vaWYgKHRoaXMuc25lYWtwZWVrKVxyXG5cdFx0Ly9cdHRoaXMub24odGhpcy5zbmVha3BlZWssICdjbGljaycsIGUgPT4gdGhpcy5lbWl0KCdzaG93JykpXHJcblxyXG5cdFx0Ly9pZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ3BhbmVsJykgfHwgdGhpcy5oYXNBdHRyaWJ1dGUoJ3NpZGUnKSB8fCB0aGlzLmhhc0F0dHJpYnV0ZSgnc2lkZXBhbmUnKSkge1xyXG5cdFx0aWYgKHRoaXMucGFuZWwpIHtcclxuXHRcdFx0dGhpcy5hdXRvQXNzaWduUG9zaXRpb24oKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5vdmVybGF5QmcgPSBmYWxzZVxyXG5cdFx0XHR0aGlzLnNob3dPdmVybGF5QmcgPSBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBISURFIC8gU0hPVyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHRzZXR1cENsb3NlQnV0dG9ucygpIHtcclxuXHRcdC8vIGxldHMgd2FpdCBmb3IgYSBnb29kIG1lYXN1cmVcclxuXHRcdHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fc2V0dXBDbG9zZUJ1dHRvbnMoKSlcclxuXHR9XHJcblx0X3NldHVwQ2xvc2VCdXR0b25zKCkge1xyXG5cdFx0dmFyIGljb25OYW1lcyA9IFsnYXJyb3ctYmFjaycsICdhcnJvdy1sZWZ0JywgJ2Nsb3NlJywgJ3gnXVxyXG5cdFx0Ly8gVE9ETzogdXNlIDpzY29wZSB3aGVuIEVkZ2Ugc3VwcG9ydHMgaXRcclxuXHRcdC8vIE5PVEU6IEVkZ2UgZG9lc24ndCBzdXBwb3J0IDpzY29wZSB5ZXQgc28gdGhpcyBzZWxlY3RvciBpcyBhIGxvdCBtb3JlIG9wZW4gdGhhbiBJJ2QgbGlrZSB0b1xyXG5cdFx0dmFyIHNlbGVjdG9ycyA9IGljb25OYW1lcy5tYXAoaWNvbiA9PiBgZmxleHVzLXRvb2xiYXIgW2ljb249XCIke2ljb259XCJdYClcclxuXHRcdC8vdmFyIHNlbGVjdG9ycyA9IGljb25OYW1lcy5tYXAoaWNvbiA9PiBgOnNjb3BlID4gZmxleHVzLXRvb2xiYXIgW2ljb249XCIke2ljb259XCJdYClcclxuXHRcdHNlbGVjdG9ycy5wdXNoKCdbY2xvc2VdJylcclxuXHRcdHZhciBzZWxlY3RvciA9IHNlbGVjdG9ycy5qb2luKCcsICcpXHJcblx0XHRBcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpXHJcblx0XHRcdC5maWx0ZXIobm9kZSA9PiAhbm9kZS5oYXNBdHRyaWJ1dGUoJ3ByZXZlbnQtY2xvc2UnKSlcclxuXHRcdFx0LmZvckVhY2gobm9kZSA9PiB0aGlzLm9uKG5vZGUsICdjbGljaycsIHRoaXMub25DbG9zZUJ1dHRvbkNsaWNrKSlcclxuXHR9XHJcblxyXG5cdEBhdXRvYmluZCBvbkNsb3NlQnV0dG9uQ2xpY2sodmFsLCB7dGFyZ2V0fSkge1xyXG5cdFx0dmFyIGlzU2VhcmNoT3JTZWxlY3Rpb24gPSB0YXJnZXQucGFyZW50RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3NlYXJjaCcpIHx8IHRhcmdldC5wYXJlbnRFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnc2VsZWN0aW9uJylcclxuXHRcdGlmIChpc1NlYXJjaE9yU2VsZWN0aW9uKSByZXR1cm5cclxuXHRcdC8vaWYgKCF0aGlzLmRpc21pc3NhYmxlKSByZXR1cm5cclxuXHRcdHRoaXMuaGlkZSgpXHJcblx0fVxyXG5cclxuXHRAb24oJ3Nob3cnKVxyXG5cdG9uU2hvdygpIHtcclxuXHRcdC8vaWYgKHRoaXMuc25lYWtwZWVrKVxyXG5cdFx0Ly9cdHRoaXMuc25lYWtwZWVrLnN0eWxlLm9wYWNpdHkgPSAnJ1xyXG5cdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ29mZnNjcmVlbicpXHJcblx0fVxyXG5cclxuXHRAb24oJ2hpZGUnKVxyXG5cdG9uSGlkZSgpIHtcclxuXHRcdC8vaWYgKHRoaXMuc25lYWtwZWVrKVxyXG5cdFx0Ly9cdHRoaXMuc25lYWtwZWVrLnN0eWxlLm9wYWNpdHkgPSAnJ1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ29mZnNjcmVlbicsICcnKVxyXG5cdH1cclxuXHJcblx0QG9uKCdkcmFnJylcclxuXHRvbkRyYWdTbmVha1BlZWtSZW5kZXIocGVyY2VudGFnZSkge1xyXG5cdFx0aWYgKHRoaXMuc25lYWtwZWVrKVxyXG5cdFx0XHR0aGlzLnNuZWFrcGVlay5zdHlsZS5vcGFjaXR5ID0gMSAtIHBlcmNlbnRhZ2VcclxuXHR9XHJcblxyXG59XHJcbiJdLCJuYW1lcyI6WyJhZGRSZWFkeUFuaW1hdGlvbiIsIkZsZXh1c1ZpZXciLCJkZWZhdWx0VmFsdWUiLCJvbiIsImN1c3RvbUVsZW1lbnQiLCJnYW55bWVkZUVsZW1lbnQiLCJWaXNpYmlsaXR5IiwiRHJhZ2dhYmxlIiwiUGFuZWwiLCJTY3JvbGxhYmxlIiwicGFuZWwiLCJoaWRkZW4iLCJ2aWV3Iiwic2V0dXBDbG9zZUJ1dHRvbnMiLCJjb25maWd1cmVMYXlvdXQiLCJtYWluIiwicXVlcnlTZWxlY3RvciIsInNjcm9sbFJlZmxlY3RzVG91Y2hBY3Rpb24iLCJzZXR1cFNjcm9sbGFibGUiLCJwYXJhbGxheE5vZGVzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsInBhcmFsbGF4QXBwbGljYXRvcnMiLCJtYXAiLCJnZXRQYXJhbGxheEFwcGxpY2F0b3IiLCJsZW5ndGgiLCJhZGRTY3JvbGxMaXN0ZW5lcnMiLCJzY3JvbGxlZCIsImZvckVhY2giLCJjYiIsImFwcGx5VmlzaWJpbGl0eVN0YXRlIiwic25lYWtwZWVrIiwiY2hpbGRyZW4iLCJmaW5kIiwibm9kZSIsImhhc0F0dHJpYnV0ZSIsImF1dG9Bc3NpZ25Qb3NpdGlvbiIsIm92ZXJsYXlCZyIsInNob3dPdmVybGF5QmciLCJfc2V0dXBDbG9zZUJ1dHRvbnMiLCJpY29uTmFtZXMiLCJzZWxlY3RvcnMiLCJpY29uIiwicHVzaCIsInNlbGVjdG9yIiwiam9pbiIsImZpbHRlciIsIm9uQ2xvc2VCdXR0b25DbGljayIsInZhbCIsInRhcmdldCIsImlzU2VhcmNoT3JTZWxlY3Rpb24iLCJwYXJlbnRFbGVtZW50IiwiaGlkZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInBlcmNlbnRhZ2UiLCJzdHlsZSIsIm9wYWNpdHkiLCJyZWZsZWN0IiwiYXV0b2JpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFDQSxBQUNBLEFBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBQSx5QkFBa0IsYUFBbEI7O0lBR01DLHFCQTRESkMsc0JBQWEsSUFBYixXQUlBQSxzQkFBYSxLQUFiLFdBMERBQyxZQUFHLE1BQUgsV0FPQUEsWUFBRyxNQUFILFdBT0FBLFlBQUcsTUFBSCxHQXpJREMsMkNBQ0QsTUFBTUgsVUFBTixTQUF5QkkseUJBQWdCQyxpQkFBaEIsRUFBNEJDLGdCQUE1QixFQUF1Q0MsWUFBdkMsRUFBOENDLGlCQUE5QyxDQUF6QixDQUFtRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FvQjFFOzs7Ozs7TUFNSCxDQUFDLEtBQUtDLEtBQU4sSUFBZSxLQUFLQyxNQUFMLEtB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
