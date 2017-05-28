(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede'), require('flexus')) :
	typeof define === 'function' && define.amd ? define('drawer', ['ganymede', 'flexus'], factory) :
	(factory(global.ganymede,global.flexus));
}(this, (function (ganymede$1,flexus) { 'use strict';

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

flexus.app.addEventListener('click', ({ target }) => {
	if (target.matches('flexus-toolbar [icon="menu"]')) ganymede.emit(flexus.app, 'drawer-toggle');
	if (target.matches('flexus-drawer [icon="menu"]')) ganymede.emit(flexus.app, 'drawer-toggle');
});

var overlayMaxOpacity = 0.7;

/*
POSSIBILITIES

3 states (music)
	- phone, not pinned, expandable, overlay
	- pinned, expandable, overlay
	- pinned expanded sqeeze

1 state (weather)
	- pinned, expandable, overlay

2 states ()
	- phone, not pinned, expandable, overlay
	- pinned, expandable, overlay

2 states (mycar)
	- phone, not pinned, expandable, overlay
	- pinned expanded sqeeze

2 states (recipe keeper)
	- pinned, expandable, overlay
	- pinned expanded sqeeze

*/

flexus.addReadyAnimation('flexus-drawer');

//class FlexusDrawer extends Element {
let FlexusDrawer = (_dec = ganymede$1.css(`
	.overflow {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
	}
	.scrollable {
		flex:1;
		overflow-x: hidden;
		overflow-y: auto;
		touch-action: pan-y;
	}
`), _dec2 = ganymede$1.template(`
	<div class="overflow">
		<slot name="top"></slot>
		<div class="scrollable">
			<slot></slot>
		</div>
		<slot name="bottom"></slot>
	</div>
	<slot name="edge"></slot>
`), _dec3 = ganymede$1.on('click'), _dec4 = ganymede$1.on(document, 'screensize-update'), _dec5 = ganymede$1.on('toggle'), ganymede$1.customElement(_class = _dec(_class = _dec2(_class = (_class2 = class FlexusDrawer extends ganymede$1.ganymedeElement(flexus.Visibility, flexus.Draggable, flexus.Panel, flexus.Breakpointable) {
	/*@reflect*/

	//@reflect dragOrientation = 'horizontal'
	constructor() {
		super();
		this.dragPercentage = 0;

		_initDefineProp(this, 'collapsed', _descriptor, this);

		this.collapsible = false;

		_initDefineProp(this, 'expandable', _descriptor2, this);

		this.left = true;
		this.pinnable = true;
		this.autoHide = true;
		//this.pinned = platform.neon
		//this.hidden = true
		window.drawer = this;
		this.collapsible = flexus.platform.neon;

		// if [collapsed] is specifier, it should never automatically expand
		if (this.hasAttribute('collapsed')) this.expandable = false;
	}
	// TODO: reflect once

	// BASED ON MATERIAL DESIGN
	// below toolbar
	//@reflect clipped = false
	// above toolbar /next to toolbar
	//@reflect fullHeight = true
	// todo: card
	//@reflect floating = false

	// Panel class overrides
	//@reflect pinned = platform.neon
	//@reflect left = true

	ready() {
		//console.log('------------------------------------ drawer ready')
		//console.log('this.collapsed', this.collapsed)
		//console.log('this.pinned', this.pinned)
		//if (this.clipped) this.fullHeight = false
		//if (this.fullHeight) this.clipped = false
		this.overrideVisibilityEvents();
		this.redistributeShadowNodes();
		this.setupHamburger();
		this.breakpointStateChanged();
		this.applyVisibilityState();
		//this.autoAssignPosition()
	}

	// automatically hides

	onClickCloseHandler(value, { target }) {
		if (target === this.hamburger) return;
		if (target === this) return;
		//console.log('click', target)
		var preventHiding = target.hasAttribute('no-auto-hide') || target.getAttribute('auto-hide') !== 'false';
		//console.log('preventHiding', preventHiding)
		if (!preventHiding) this.softHide();
	}

	// automatically hides hamburger button from all toolbars and only keeeps the one
	// in drawer. Hamburgers are of course shown when drawer is not pinned
	setupHamburger() {
		if (!flexus.platform.neon) return;
		var hamburger = this.querySelector('[icon="menu"]');
		if (!hamburger) {
			hamburger = document.createElement('div');
			hamburger.setAttribute('fx-item', '');
			hamburger.setAttribute('icon', 'menu');
			this.prepend(hamburger);
		}
		this.hamburger = hamburger;
		this.setAttribute('has-hamburger', '');
	}

	breakpointStateChanged() {
		//console.log('breakpointStateChanged', platform.screensize)
		switch (flexus.platform.screensize) {
			case flexus.SCREENSIZE.SMALL:
				this.dragPercentage = 0;
				this.hidden = true;
				this.pinned = false;
				this.draggable = true;
				this.collapsed = false;
				flexus.app.removeAttribute('drawer-pinned');
				if (flexus.platform.neon) {
					// TODO: Neon's inline overlay state in medium screensize
					//this.overlayBg = this.__overlayBgDefault
				}
				break;
			case flexus.SCREENSIZE.MEDIUM:
				if (flexus.platform.neon) {
					this.dragPercentage = 1;
					this.hidden = false;
					this.pinned = true;
					this.draggable = false;
					this.collapsed = true;
					flexus.app.setAttribute('drawer-pinned', '');
					// TODO: Neon's inline overlay state in medium screensize
					//this.overlayBg = this.__overlayBgDefault
				}
				if (flexus.platform.material) {
					this.dragPercentage = 0;
					this.hidden = true;
					this.pinned = false;
					this.draggable = true;
					this.collapsed = false;
				}
				break;
			case flexus.SCREENSIZE.LARGE:
				if (flexus.platform.neon) {
					this.dragPercentage = 1;
					this.hidden = false;
					this.pinned = true;
					this.draggable = false;
					if (this.expandable) {
						this.collapsed = false;
					} else {
						this.collapsed = true;
					}
					//this.collapsed = false
					flexus.app.removeAttribute('drawer-pinned');
					// TODO: Neon's inline overlay state in medium screensize
					//this.overlayBg = false
				}
				if (flexus.platform.material) {
					this.dragPercentage = 0;
					this.hidden = true;
					this.pinned = false;
					this.draggable = true;
					this.collapsed = false;
					//this.collapsed = false
				}
				break;
		}
	}

	redistributeShadowNodes() {
		var children = Array.from(this.children);
		children.filter(node => node.hasAttribute('bottom')).forEach(node => {
			node.setAttribute('slot', 'bottom');
			node.removeAttribute('bottom');
		});
		children.filter(node => node.hasAttribute('top')).forEach(node => {
			node.setAttribute('slot', 'top');
			node.removeAttribute('top');
		});
		var toolbar = this.querySelector('flexus-toolbar');
		if (toolbar) toolbar.setAttribute('slot', 'top');
	}

	overrideVisibilityEvents() {
		//console.log('this.overlayFade drawer', this.overlayFade, this._overlayFadeDefault)
		// add event listener to app (and register killack through elements lifecycle) 
		this.on(flexus.app, 'drawer-show', e => this.emit('show'));
		this.on(flexus.app, 'drawer-hide', e => this.emit('hide'));
		this.on(flexus.app, 'drawer-toggle', e => this.emit('toggle'));
	}

	// overwrite Panel's show & hide methods by emitting
	// events to app as well since drawer is only one and it's
	// desired to be accessible through public events 
	show() {
		ganymede$1.emit(flexus.app, 'drawer-show');
	}
	hide() {
		ganymede$1.emit(flexus.app, 'drawer-hide');
	}
	toggle() {
		ganymede$1.emit(flexus.app, 'drawer-toggle');
	}

	/*
 	@on('toggle')
 	onToggle() {
 		if (this.dragPercentage === 0)
 			this.show()
 		else
 			this.hide()
 	}
 */

	onToggle() {
		if (flexus.platform.screensize !== flexus.SCREENSIZE.SMALL && flexus.platform.neon && this.visible && this.collapsible) {
			this.toggleCollapse();
		} else {
			this.toggleVisibility();
		}
	}

	toggleCollapse() {
		this.collapsed = !this.collapsed;
	}

	softHide() {
		//console.log('softHide')
		if (this.collapsible) {
			if (flexus.platform.screensize === flexus.SCREENSIZE.MEDIUM && !this.collapsed) {
				this.collapse();
			} else if (flexus.platform.screensize !== flexus.SCREENSIZE.LARGE) {
				this.hide();
			}
		} else {
			this.hide();
		}
	}
	/*
 	// TODO implement overlay in Neon medium screensize
 	onOverlayClick() {
 		//console.log('onOverlayClick')
 		if (platform.screensize === SCREENSIZE.MEDIUM
 		&& platform.neon
 		//&& this.visible
 		&& this.collapsible) {
 			this.collapse()
 		} else {
 			//console.log('hide')
 		}
 	}
 
 	toggleCollapse() {
 		//console.log('toggleCollapse()')
 		this.collapsed = !this.collapsed
 		//if (this.collapsed)
 		//	this.expand()
 		//else
 		//	this.collapse()
 	}
 */
	collapse() {
		//console.log('collapse()')
		this.collapsed = true;
		if (this.overlayElement) this.overlayElement.hide();
	}
	expand() {
		//console.log('expand()')
		this.collapsed = false;
		if (this.overlayElement && this.overlayBg) this.overlayElement.show();
	}

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'collapsed', [ganymede$1.reflect], {
	enumerable: true,
	initializer: function () {
		return Boolean;
	}
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'expandable', [ganymede$1.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _applyDecoratedDescriptor(_class2.prototype, 'onClickCloseHandler', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'onClickCloseHandler'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'breakpointStateChanged', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'breakpointStateChanged'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onToggle', [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, 'onToggle'), _class2.prototype)), _class2)) || _class) || _class) || _class);

/*
@customElement
@css(`
	:host {
		display: flex;
		width: 300px;
		background-color: gray;
		position: absolute;
		right: 0px;
		top: 0;
		bottom: 0;
		height: 100%;
		z-index: 99;
	}
	:host([hidden]) {
		visibility: visible !important;
	}
	#edge {
		position: absolute;
		right: 100%;
		width: 20px;
		top: 0;
		bottom: 0;
		background-color: green;
		opacity: 0.4;
	}
`)
@template(`
	<slot></slot>
	<div id="edge"></div>
`)
class FlexusPanel extends mixin(Panel, Draggable) {

	draggable = 'horizontal'
	//dragPercentage = 0

	overlay = false

	@reflect hidden = false
	hiddenChanged() {
		// TODO - integrate with show/hide events
	}

}
*/

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlcyI6WyJzcmMvZWxlbWVudHMvZHJhd2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Xywgb24sIHRlbXBsYXRlLCBjc3MsIHJlZmxlY3QsIGN1c3RvbUVsZW1lbnQsIGdhbnltZWRlRWxlbWVudCwgZW1pdH0gZnJvbSAnZ2FueW1lZGUnXHJcbmltcG9ydCB7YXBwLCBhcHBFbGVtZW50UmVhZHksIHBsYXRmb3JtLCBWaXNpYmlsaXR5LCBEcmFnZ2FibGUsIFBhbmVsLCBCcmVha3BvaW50YWJsZX0gZnJvbSAnZmxleHVzJ1xyXG5pbXBvcnQge2FkZFJlYWR5QW5pbWF0aW9uLCBTQ1JFRU5TSVpFfSBmcm9tICdmbGV4dXMnXHJcblxyXG5cclxuXHJcbmFwcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICh7dGFyZ2V0fSkgPT4ge1xyXG5cdGlmICh0YXJnZXQubWF0Y2hlcygnZmxleHVzLXRvb2xiYXIgW2ljb249XCJtZW51XCJdJykpXHJcblx0XHRnYW55bWVkZS5lbWl0KGFwcCwgJ2RyYXdlci10b2dnbGUnKVxyXG5cdGlmICh0YXJnZXQubWF0Y2hlcygnZmxleHVzLWRyYXdlciBbaWNvbj1cIm1lbnVcIl0nKSlcclxuXHRcdGdhbnltZWRlLmVtaXQoYXBwLCAnZHJhd2VyLXRvZ2dsZScpXHJcbn0pXHJcblxyXG52YXIgb3ZlcmxheU1heE9wYWNpdHkgPSAwLjdcclxuXHJcbi8qXHJcblBPU1NJQklMSVRJRVNcclxuXHJcbjMgc3RhdGVzIChtdXNpYylcclxuXHQtIHBob25lLCBub3QgcGlubmVkLCBleHBhbmRhYmxlLCBvdmVybGF5XHJcblx0LSBwaW5uZWQsIGV4cGFuZGFibGUsIG92ZXJsYXlcclxuXHQtIHBpbm5lZCBleHBhbmRlZCBzcWVlemVcclxuXHJcbjEgc3RhdGUgKHdlYXRoZXIpXHJcblx0LSBwaW5uZWQsIGV4cGFuZGFibGUsIG92ZXJsYXlcclxuXHJcbjIgc3RhdGVzICgpXHJcblx0LSBwaG9uZSwgbm90IHBpbm5lZCwgZXhwYW5kYWJsZSwgb3ZlcmxheVxyXG5cdC0gcGlubmVkLCBleHBhbmRhYmxlLCBvdmVybGF5XHJcblxyXG4yIHN0YXRlcyAobXljYXIpXHJcblx0LSBwaG9uZSwgbm90IHBpbm5lZCwgZXhwYW5kYWJsZSwgb3ZlcmxheVxyXG5cdC0gcGlubmVkIGV4cGFuZGVkIHNxZWV6ZVxyXG5cclxuMiBzdGF0ZXMgKHJlY2lwZSBrZWVwZXIpXHJcblx0LSBwaW5uZWQsIGV4cGFuZGFibGUsIG92ZXJsYXlcclxuXHQtIHBpbm5lZCBleHBhbmRlZCBzcWVlemVcclxuXHJcbiovXHJcblxyXG5hZGRSZWFkeUFuaW1hdGlvbignZmxleHVzLWRyYXdlcicpXHJcblxyXG5AY3VzdG9tRWxlbWVudFxyXG5AY3NzKGBcclxuXHQub3ZlcmZsb3cge1xyXG5cdFx0b3ZlcmZsb3c6IGhpZGRlbjtcclxuXHRcdGRpc3BsYXk6IGZsZXg7XHJcblx0XHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG5cdFx0ZmxleDogMTtcclxuXHRcdGhlaWdodDogMTAwJTtcclxuXHR9XHJcblx0LnNjcm9sbGFibGUge1xyXG5cdFx0ZmxleDoxO1xyXG5cdFx0b3ZlcmZsb3cteDogaGlkZGVuO1xyXG5cdFx0b3ZlcmZsb3cteTogYXV0bztcclxuXHRcdHRvdWNoLWFjdGlvbjogcGFuLXk7XHJcblx0fVxyXG5gKVxyXG5AdGVtcGxhdGUoYFxyXG5cdDxkaXYgY2xhc3M9XCJvdmVyZmxvd1wiPlxyXG5cdFx0PHNsb3QgbmFtZT1cInRvcFwiPjwvc2xvdD5cclxuXHRcdDxkaXYgY2xhc3M9XCJzY3JvbGxhYmxlXCI+XHJcblx0XHRcdDxzbG90Pjwvc2xvdD5cclxuXHRcdDwvZGl2PlxyXG5cdFx0PHNsb3QgbmFtZT1cImJvdHRvbVwiPjwvc2xvdD5cclxuXHQ8L2Rpdj5cclxuXHQ8c2xvdCBuYW1lPVwiZWRnZVwiPjwvc2xvdD5cclxuYClcclxuLy9jbGFzcyBGbGV4dXNEcmF3ZXIgZXh0ZW5kcyBFbGVtZW50IHtcclxuY2xhc3MgRmxleHVzRHJhd2VyIGV4dGVuZHMgZ2FueW1lZGVFbGVtZW50KFZpc2liaWxpdHksIERyYWdnYWJsZSwgUGFuZWwsIEJyZWFrcG9pbnRhYmxlKSB7XHJcblxyXG5cdC8vQHJlZmxlY3QgZHJhZ09yaWVudGF0aW9uID0gJ2hvcml6b250YWwnXHJcblx0ZHJhZ1BlcmNlbnRhZ2UgPSAwXHJcblx0Ly8gVE9ETzogcmVmbGVjdCBvbmNlXHJcblxyXG5cdC8vIEJBU0VEIE9OIE1BVEVSSUFMIERFU0lHTlxyXG5cdC8vIGJlbG93IHRvb2xiYXJcclxuXHQvL0ByZWZsZWN0IGNsaXBwZWQgPSBmYWxzZVxyXG5cdC8vIGFib3ZlIHRvb2xiYXIgL25leHQgdG8gdG9vbGJhclxyXG5cdC8vQHJlZmxlY3QgZnVsbEhlaWdodCA9IHRydWVcclxuXHQvLyB0b2RvOiBjYXJkXHJcblx0Ly9AcmVmbGVjdCBmbG9hdGluZyA9IGZhbHNlXHJcblxyXG5cdC8vIFBhbmVsIGNsYXNzIG92ZXJyaWRlc1xyXG5cdC8vQHJlZmxlY3QgcGlubmVkID0gcGxhdGZvcm0ubmVvblxyXG5cdC8vQHJlZmxlY3QgbGVmdCA9IHRydWVcclxuXHJcblx0QHJlZmxlY3QgY29sbGFwc2VkID0gQm9vbGVhblxyXG5cdC8qQHJlZmxlY3QqLyBjb2xsYXBzaWJsZSA9IGZhbHNlXHJcblx0QHJlZmxlY3QgZXhwYW5kYWJsZSA9IGZhbHNlXHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKVxyXG5cdFx0dGhpcy5sZWZ0ID0gdHJ1ZVxyXG5cdFx0dGhpcy5waW5uYWJsZSA9IHRydWVcclxuXHRcdHRoaXMuYXV0b0hpZGUgPSB0cnVlXHJcblx0XHQvL3RoaXMucGlubmVkID0gcGxhdGZvcm0ubmVvblxyXG5cdFx0Ly90aGlzLmhpZGRlbiA9IHRydWVcclxuXHRcdHdpbmRvdy5kcmF3ZXIgPSB0aGlzXHJcblx0XHR0aGlzLmNvbGxhcHNpYmxlID0gcGxhdGZvcm0ubmVvblxyXG5cclxuXHRcdC8vIGlmIFtjb2xsYXBzZWRdIGlzIHNwZWNpZmllciwgaXQgc2hvdWxkIG5ldmVyIGF1dG9tYXRpY2FsbHkgZXhwYW5kXHJcblx0XHRpZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ2NvbGxhcHNlZCcpKVxyXG5cdFx0XHR0aGlzLmV4cGFuZGFibGUgPSBmYWxzZVxyXG5cdH1cclxuXHJcblx0cmVhZHkoKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZHJhd2VyIHJlYWR5JylcclxuXHRcdC8vY29uc29sZS5sb2coJ3RoaXMuY29sbGFwc2VkJywgdGhpcy5jb2xsYXBzZWQpXHJcblx0XHQvL2NvbnNvbGUubG9nKCd0aGlzLnBpbm5lZCcsIHRoaXMucGlubmVkKVxyXG5cdFx0Ly9pZiAodGhpcy5jbGlwcGVkKSB0aGlzLmZ1bGxIZWlnaHQgPSBmYWxzZVxyXG5cdFx0Ly9pZiAodGhpcy5mdWxsSGVpZ2h0KSB0aGlzLmNsaXBwZWQgPSBmYWxzZVxyXG5cdFx0dGhpcy5vdmVycmlkZVZpc2liaWxpdHlFdmVudHMoKVxyXG5cdFx0dGhpcy5yZWRpc3RyaWJ1dGVTaGFkb3dOb2RlcygpXHJcblx0XHR0aGlzLnNldHVwSGFtYnVyZ2VyKClcclxuXHRcdHRoaXMuYnJlYWtwb2ludFN0YXRlQ2hhbmdlZCgpXHJcblx0XHR0aGlzLmFwcGx5VmlzaWJpbGl0eVN0YXRlKClcclxuXHRcdC8vdGhpcy5hdXRvQXNzaWduUG9zaXRpb24oKVxyXG5cdH1cclxuXHJcblx0Ly8gYXV0b21hdGljYWxseSBoaWRlc1xyXG5cdEBvbignY2xpY2snKSBcclxuXHRvbkNsaWNrQ2xvc2VIYW5kbGVyKHZhbHVlLCB7dGFyZ2V0fSkge1xyXG5cdFx0aWYgKHRhcmdldCA9PT0gdGhpcy5oYW1idXJnZXIpIHJldHVyblxyXG5cdFx0aWYgKHRhcmdldCA9PT0gdGhpcykgcmV0dXJuXHJcblx0XHQvL2NvbnNvbGUubG9nKCdjbGljaycsIHRhcmdldClcclxuXHRcdHZhciBwcmV2ZW50SGlkaW5nID0gdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnbm8tYXV0by1oaWRlJykgfHwgIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2F1dG8taGlkZScpICE9PSAnZmFsc2UnXHJcblx0XHQvL2NvbnNvbGUubG9nKCdwcmV2ZW50SGlkaW5nJywgcHJldmVudEhpZGluZylcclxuXHRcdGlmICghcHJldmVudEhpZGluZylcclxuXHRcdFx0dGhpcy5zb2Z0SGlkZSgpXHJcblx0fVxyXG5cclxuXHQvLyBhdXRvbWF0aWNhbGx5IGhpZGVzIGhhbWJ1cmdlciBidXR0b24gZnJvbSBhbGwgdG9vbGJhcnMgYW5kIG9ubHkga2VlZXBzIHRoZSBvbmVcclxuXHQvLyBpbiBkcmF3ZXIuIEhhbWJ1cmdlcnMgYXJlIG9mIGNvdXJzZSBzaG93biB3aGVuIGRyYXdlciBpcyBub3QgcGlubmVkXHJcblx0c2V0dXBIYW1idXJnZXIoKSB7XHJcblx0XHRpZiAoIXBsYXRmb3JtLm5lb24pIHJldHVyblxyXG5cdFx0dmFyIGhhbWJ1cmdlciA9IHRoaXMucXVlcnlTZWxlY3RvcignW2ljb249XCJtZW51XCJdJylcclxuXHRcdGlmICghaGFtYnVyZ2VyKSB7XHJcblx0XHRcdGhhbWJ1cmdlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcblx0XHRcdGhhbWJ1cmdlci5zZXRBdHRyaWJ1dGUoJ2Z4LWl0ZW0nLCAnJylcclxuXHRcdFx0aGFtYnVyZ2VyLnNldEF0dHJpYnV0ZSgnaWNvbicsICdtZW51JylcclxuXHRcdFx0dGhpcy5wcmVwZW5kKGhhbWJ1cmdlcilcclxuXHRcdH1cclxuXHRcdHRoaXMuaGFtYnVyZ2VyID0gaGFtYnVyZ2VyXHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnaGFzLWhhbWJ1cmdlcicsICcnKVxyXG5cdH1cclxuXHJcblx0QG9uKGRvY3VtZW50LCAnc2NyZWVuc2l6ZS11cGRhdGUnKVxyXG5cdGJyZWFrcG9pbnRTdGF0ZUNoYW5nZWQoKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdicmVha3BvaW50U3RhdGVDaGFuZ2VkJywgcGxhdGZvcm0uc2NyZWVuc2l6ZSlcclxuXHRcdHN3aXRjaCAocGxhdGZvcm0uc2NyZWVuc2l6ZSkge1xyXG5cdFx0XHRjYXNlIFNDUkVFTlNJWkUuU01BTEw6XHJcblx0XHRcdFx0dGhpcy5kcmFnUGVyY2VudGFnZSA9IDBcclxuXHRcdFx0XHR0aGlzLmhpZGRlbiA9IHRydWVcclxuXHRcdFx0XHR0aGlzLnBpbm5lZCA9IGZhbHNlXHJcblx0XHRcdFx0dGhpcy5kcmFnZ2FibGUgPSB0cnVlXHJcblx0XHRcdFx0dGhpcy5jb2xsYXBzZWQgPSBmYWxzZVxyXG5cdFx0XHRcdGFwcC5yZW1vdmVBdHRyaWJ1dGUoJ2RyYXdlci1waW5uZWQnKVxyXG5cdFx0XHRcdGlmIChwbGF0Zm9ybS5uZW9uKSB7XHJcblx0XHRcdFx0XHQvLyBUT0RPOiBOZW9uJ3MgaW5saW5lIG92ZXJsYXkgc3RhdGUgaW4gbWVkaXVtIHNjcmVlbnNpemVcclxuXHRcdFx0XHRcdC8vdGhpcy5vdmVybGF5QmcgPSB0aGlzLl9fb3ZlcmxheUJnRGVmYXVsdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHRjYXNlIFNDUkVFTlNJWkUuTUVESVVNOlxyXG5cdFx0XHRcdGlmIChwbGF0Zm9ybS5uZW9uKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRyYWdQZXJjZW50YWdlID0gMVxyXG5cdFx0XHRcdFx0dGhpcy5oaWRkZW4gPSBmYWxzZVxyXG5cdFx0XHRcdFx0dGhpcy5waW5uZWQgPSB0cnVlXHJcblx0XHRcdFx0XHR0aGlzLmRyYWdnYWJsZSA9IGZhbHNlXHJcblx0XHRcdFx0XHR0aGlzLmNvbGxhcHNlZCA9IHRydWVcclxuXHRcdFx0XHRcdGFwcC5zZXRBdHRyaWJ1dGUoJ2RyYXdlci1waW5uZWQnLCAnJylcclxuXHRcdFx0XHRcdC8vIFRPRE86IE5lb24ncyBpbmxpbmUgb3ZlcmxheSBzdGF0ZSBpbiBtZWRpdW0gc2NyZWVuc2l6ZVxyXG5cdFx0XHRcdFx0Ly90aGlzLm92ZXJsYXlCZyA9IHRoaXMuX19vdmVybGF5QmdEZWZhdWx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChwbGF0Zm9ybS5tYXRlcmlhbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5kcmFnUGVyY2VudGFnZSA9IDBcclxuXHRcdFx0XHRcdHRoaXMuaGlkZGVuID0gdHJ1ZVxyXG5cdFx0XHRcdFx0dGhpcy5waW5uZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0dGhpcy5kcmFnZ2FibGUgPSB0cnVlXHJcblx0XHRcdFx0XHR0aGlzLmNvbGxhcHNlZCA9IGZhbHNlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGNhc2UgU0NSRUVOU0laRS5MQVJHRTpcclxuXHRcdFx0XHRpZiAocGxhdGZvcm0ubmVvbikge1xyXG5cdFx0XHRcdFx0dGhpcy5kcmFnUGVyY2VudGFnZSA9IDFcclxuXHRcdFx0XHRcdHRoaXMuaGlkZGVuID0gZmFsc2VcclxuXHRcdFx0XHRcdHRoaXMucGlubmVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0dGhpcy5kcmFnZ2FibGUgPSBmYWxzZVxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNvbGxhcHNlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNvbGxhcHNlZCA9IHRydWVcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vdGhpcy5jb2xsYXBzZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0YXBwLnJlbW92ZUF0dHJpYnV0ZSgnZHJhd2VyLXBpbm5lZCcpXHJcblx0XHRcdFx0XHQvLyBUT0RPOiBOZW9uJ3MgaW5saW5lIG92ZXJsYXkgc3RhdGUgaW4gbWVkaXVtIHNjcmVlbnNpemVcclxuXHRcdFx0XHRcdC8vdGhpcy5vdmVybGF5QmcgPSBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocGxhdGZvcm0ubWF0ZXJpYWwpIHtcclxuXHRcdFx0XHRcdHRoaXMuZHJhZ1BlcmNlbnRhZ2UgPSAwXHJcblx0XHRcdFx0XHR0aGlzLmhpZGRlbiA9IHRydWVcclxuXHRcdFx0XHRcdHRoaXMucGlubmVkID0gZmFsc2VcclxuXHRcdFx0XHRcdHRoaXMuZHJhZ2dhYmxlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0dGhpcy5jb2xsYXBzZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0Ly90aGlzLmNvbGxhcHNlZCA9IGZhbHNlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZWRpc3RyaWJ1dGVTaGFkb3dOb2RlcygpIHtcclxuXHRcdHZhciBjaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5jaGlsZHJlbilcclxuXHRcdGNoaWxkcmVuXHJcblx0XHRcdC5maWx0ZXIobm9kZSA9PiBub2RlLmhhc0F0dHJpYnV0ZSgnYm90dG9tJykpXHJcblx0XHRcdC5mb3JFYWNoKG5vZGUgPT4ge1xyXG5cdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdzbG90JywgJ2JvdHRvbScpXHJcblx0XHRcdFx0bm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2JvdHRvbScpXHJcblx0XHRcdH0pXHJcblx0XHRjaGlsZHJlblxyXG5cdFx0XHQuZmlsdGVyKG5vZGUgPT4gbm9kZS5oYXNBdHRyaWJ1dGUoJ3RvcCcpKVxyXG5cdFx0XHQuZm9yRWFjaChub2RlID0+IHtcclxuXHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc2xvdCcsICd0b3AnKVxyXG5cdFx0XHRcdG5vZGUucmVtb3ZlQXR0cmlidXRlKCd0b3AnKVxyXG5cdFx0XHR9KVxyXG5cdFx0dmFyIHRvb2xiYXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2ZsZXh1cy10b29sYmFyJylcclxuXHRcdGlmICh0b29sYmFyKVxyXG5cdFx0XHR0b29sYmFyLnNldEF0dHJpYnV0ZSgnc2xvdCcsICd0b3AnKVxyXG5cdH1cclxuXHJcblx0b3ZlcnJpZGVWaXNpYmlsaXR5RXZlbnRzKCkge1xyXG5cdFx0Ly9jb25zb2xlLmxvZygndGhpcy5vdmVybGF5RmFkZSBkcmF3ZXInLCB0aGlzLm92ZXJsYXlGYWRlLCB0aGlzLl9vdmVybGF5RmFkZURlZmF1bHQpXHJcblx0XHQvLyBhZGQgZXZlbnQgbGlzdGVuZXIgdG8gYXBwIChhbmQgcmVnaXN0ZXIga2lsbGFjayB0aHJvdWdoIGVsZW1lbnRzIGxpZmVjeWNsZSkgXHJcblx0XHR0aGlzLm9uKGFwcCwgJ2RyYXdlci1zaG93JywgZSA9PiB0aGlzLmVtaXQoJ3Nob3cnKSlcclxuXHRcdHRoaXMub24oYXBwLCAnZHJhd2VyLWhpZGUnLCBlID0+IHRoaXMuZW1pdCgnaGlkZScpKVxyXG5cdFx0dGhpcy5vbihhcHAsICdkcmF3ZXItdG9nZ2xlJywgZSA9PiB0aGlzLmVtaXQoJ3RvZ2dsZScpKVxyXG5cdH1cclxuXHJcblx0Ly8gb3ZlcndyaXRlIFBhbmVsJ3Mgc2hvdyAmIGhpZGUgbWV0aG9kcyBieSBlbWl0dGluZ1xyXG5cdC8vIGV2ZW50cyB0byBhcHAgYXMgd2VsbCBzaW5jZSBkcmF3ZXIgaXMgb25seSBvbmUgYW5kIGl0J3NcclxuXHQvLyBkZXNpcmVkIHRvIGJlIGFjY2Vzc2libGUgdGhyb3VnaCBwdWJsaWMgZXZlbnRzIFxyXG5cdHNob3coKSB7XHJcblx0XHRlbWl0KGFwcCwgJ2RyYXdlci1zaG93JylcclxuXHR9XHJcblx0aGlkZSgpIHtcclxuXHRcdGVtaXQoYXBwLCAnZHJhd2VyLWhpZGUnKVxyXG5cdH1cclxuXHR0b2dnbGUoKSB7XHJcblx0XHRlbWl0KGFwcCwgJ2RyYXdlci10b2dnbGUnKVxyXG5cdH1cclxuXHJcbi8qXHJcblx0QG9uKCd0b2dnbGUnKVxyXG5cdG9uVG9nZ2xlKCkge1xyXG5cdFx0aWYgKHRoaXMuZHJhZ1BlcmNlbnRhZ2UgPT09IDApXHJcblx0XHRcdHRoaXMuc2hvdygpXHJcblx0XHRlbHNlXHJcblx0XHRcdHRoaXMuaGlkZSgpXHJcblx0fVxyXG4qL1xyXG5cdEBvbigndG9nZ2xlJylcclxuXHRvblRvZ2dsZSgpIHtcclxuXHRcdGlmIChwbGF0Zm9ybS5zY3JlZW5zaXplICE9PSBTQ1JFRU5TSVpFLlNNQUxMXHJcblx0XHQmJiBwbGF0Zm9ybS5uZW9uXHJcblx0XHQmJiB0aGlzLnZpc2libGVcclxuXHRcdCYmIHRoaXMuY29sbGFwc2libGUpIHtcclxuXHRcdFx0dGhpcy50b2dnbGVDb2xsYXBzZSgpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnRvZ2dsZVZpc2liaWxpdHkoKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dG9nZ2xlQ29sbGFwc2UoKSB7XHJcblx0XHR0aGlzLmNvbGxhcHNlZCA9ICF0aGlzLmNvbGxhcHNlZFxyXG5cdH1cclxuXHJcblx0c29mdEhpZGUoKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdzb2Z0SGlkZScpXHJcblx0XHRpZiAodGhpcy5jb2xsYXBzaWJsZSkge1xyXG5cdFx0XHRpZiAocGxhdGZvcm0uc2NyZWVuc2l6ZSA9PT0gU0NSRUVOU0laRS5NRURJVU0gJiYgIXRoaXMuY29sbGFwc2VkKSB7XHJcblx0XHRcdFx0dGhpcy5jb2xsYXBzZSgpXHJcblx0XHRcdH0gZWxzZSBpZiAocGxhdGZvcm0uc2NyZWVuc2l6ZSAhPT0gU0NSRUVOU0laRS5MQVJHRSkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZSgpXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuaGlkZSgpXHJcblx0XHR9XHJcblx0fVxyXG4vKlxyXG5cdC8vIFRPRE8gaW1wbGVtZW50IG92ZXJsYXkgaW4gTmVvbiBtZWRpdW0gc2NyZWVuc2l6ZVxyXG5cdG9uT3ZlcmxheUNsaWNrKCkge1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnb25PdmVybGF5Q2xpY2snKVxyXG5cdFx0aWYgKHBsYXRmb3JtLnNjcmVlbnNpemUgPT09IFNDUkVFTlNJWkUuTUVESVVNXHJcblx0XHQmJiBwbGF0Zm9ybS5uZW9uXHJcblx0XHQvLyYmIHRoaXMudmlzaWJsZVxyXG5cdFx0JiYgdGhpcy5jb2xsYXBzaWJsZSkge1xyXG5cdFx0XHR0aGlzLmNvbGxhcHNlKClcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2hpZGUnKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dG9nZ2xlQ29sbGFwc2UoKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCd0b2dnbGVDb2xsYXBzZSgpJylcclxuXHRcdHRoaXMuY29sbGFwc2VkID0gIXRoaXMuY29sbGFwc2VkXHJcblx0XHQvL2lmICh0aGlzLmNvbGxhcHNlZClcclxuXHRcdC8vXHR0aGlzLmV4cGFuZCgpXHJcblx0XHQvL2Vsc2VcclxuXHRcdC8vXHR0aGlzLmNvbGxhcHNlKClcclxuXHR9XHJcbiovXHJcblx0Y29sbGFwc2UoKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCdjb2xsYXBzZSgpJylcclxuXHRcdHRoaXMuY29sbGFwc2VkID0gdHJ1ZVxyXG5cdFx0aWYgKHRoaXMub3ZlcmxheUVsZW1lbnQpXHJcblx0XHRcdHRoaXMub3ZlcmxheUVsZW1lbnQuaGlkZSgpXHJcblx0fVxyXG5cdGV4cGFuZCgpIHtcclxuXHRcdC8vY29uc29sZS5sb2coJ2V4cGFuZCgpJylcclxuXHRcdHRoaXMuY29sbGFwc2VkID0gZmFsc2VcclxuXHRcdGlmICh0aGlzLm92ZXJsYXlFbGVtZW50ICYmIHRoaXMub3ZlcmxheUJnKVxyXG5cdFx0XHR0aGlzLm92ZXJsYXlFbGVtZW50LnNob3coKVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbi8qXHJcbkBjdXN0b21FbGVtZW50XHJcbkBjc3MoYFxyXG5cdDpob3N0IHtcclxuXHRcdGRpc3BsYXk6IGZsZXg7XHJcblx0XHR3aWR0aDogMzAwcHg7XHJcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiBncmF5O1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0cmlnaHQ6IDBweDtcclxuXHRcdHRvcDogMDtcclxuXHRcdGJvdHRvbTogMDtcclxuXHRcdGhlaWdodDogMTAwJTtcclxuXHRcdHotaW5kZXg6IDk5O1xyXG5cdH1cclxuXHQ6aG9zdChbaGlkZGVuXSkge1xyXG5cdFx0dmlzaWJpbGl0eTogdmlzaWJsZSAhaW1wb3J0YW50O1xyXG5cdH1cclxuXHQjZWRnZSB7XHJcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XHJcblx0XHRyaWdodDogMTAwJTtcclxuXHRcdHdpZHRoOiAyMHB4O1xyXG5cdFx0dG9wOiAwO1xyXG5cdFx0Ym90dG9tOiAwO1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XHJcblx0XHRvcGFjaXR5OiAwLjQ7XHJcblx0fVxyXG5gKVxyXG5AdGVtcGxhdGUoYFxyXG5cdDxzbG90Pjwvc2xvdD5cclxuXHQ8ZGl2IGlkPVwiZWRnZVwiPjwvZGl2PlxyXG5gKVxyXG5jbGFzcyBGbGV4dXNQYW5lbCBleHRlbmRzIG1peGluKFBhbmVsLCBEcmFnZ2FibGUpIHtcclxuXHJcblx0ZHJhZ2dhYmxlID0gJ2hvcml6b250YWwnXHJcblx0Ly9kcmFnUGVyY2VudGFnZSA9IDBcclxuXHJcblx0b3ZlcmxheSA9IGZhbHNlXHJcblxyXG5cdEByZWZsZWN0IGhpZGRlbiA9IGZhbHNlXHJcblx0aGlkZGVuQ2hhbmdlZCgpIHtcclxuXHRcdC8vIFRPRE8gLSBpbnRlZ3JhdGUgd2l0aCBzaG93L2hpZGUgZXZlbnRzXHJcblx0fVxyXG5cclxufVxyXG4qL1xyXG4iXSwibmFtZXMiOlsiYXBwIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRhcmdldCIsIm1hdGNoZXMiLCJnYW55bWVkZSIsImVtaXQiLCJvdmVybGF5TWF4T3BhY2l0eSIsImFkZFJlYWR5QW5pbWF0aW9uIiwiRmxleHVzRHJhd2VyIiwiY3NzIiwidGVtcGxhdGUiLCJvbiIsImRvY3VtZW50IiwiY3VzdG9tRWxlbWVudCIsImdhbnltZWRlRWxlbWVudCIsIlZpc2liaWxpdHkiLCJEcmFnZ2FibGUiLCJQYW5lbCIsIkJyZWFrcG9pbnRhYmxlIiwiZHJhZ1BlcmNlbnRhZ2UiLCJjb2xsYXBzaWJsZSIsImxlZnQiLCJwaW5uYWJsZSIsImF1dG9IaWRlIiwiZHJhd2VyIiwicGxhdGZvcm0iLCJuZW9uIiwiaGFzQXR0cmlidXRlIiwiZXhwYW5kYWJsZSIsIm92ZXJyaWRlVmlzaWJpbGl0eUV2ZW50cyIsInJlZGlzdHJpYnV0ZVNoYWRvd05vZGVzIiwic2V0dXBIYW1idXJnZXIiLCJicmVha3BvaW50U3RhdGVDaGFuZ2VkIiwiYXBwbHlWaXNpYmlsaXR5U3RhdGUiLCJ2YWx1ZSIsImhhbWJ1cmdlciIsInByZXZlbnRIaWRpbmciLCJnZXRBdHRyaWJ1dGUiLCJzb2Z0SGlkZSIsInF1ZXJ5U2VsZWN0b3IiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwicHJlcGVuZCIsInNjcmVlbnNpemUiLCJTQ1JFRU5TSVpFIiwiU01BTEwiLCJoaWRkZW4iLCJwaW5uZWQiLCJkcmFnZ2FibGUiLCJjb2xsYXBzZWQiLCJyZW1vdmVBdHRyaWJ1dGUiLCJNRURJVU0iLCJtYXRlcmlhbCIsIkxBUkdFIiwiY2hpbGRyZW4iLCJBcnJheSIsImZyb20iLCJmaWx0ZXIiLCJub2RlIiwiZm9yRWFjaCIsInRvb2xiYXIiLCJlIiwidmlzaWJsZSIsInRvZ2dsZUNvbGxhcHNlIiwidG9nZ2xlVmlzaWJpbGl0eSIsImNvbGxhcHNlIiwiaGlkZSIsIm92ZXJsYXlFbGVtZW50Iiwib3ZlcmxheUJnIiwic2hvdyIsInJlZmxlY3QiLCJCb29sZWFuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFDQSxBQUNBLEFBSUFBLFdBQUlDLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLENBQUMsRUFBQ0MsTUFBRCxFQUFELEtBQWM7S0FDdkNBLE9BQU9DLE9BQVAsQ0FBZSw4QkFBZixDQUFKLEVBQ0NDLFNBQVNDLElBQVQsQ0FBY0wsVUFBZCxFQUFtQixlQUFuQjtLQUNHRSxPQUFPQyxPQUFQLENBQWUsNkJBQWYsQ0FBSixFQUNDQyxTQUFTQyxJQUFULENBQWNMLFVBQWQsRUFBbUIsZUFBbkI7Q0FKRjs7QUFPQSxJQUFJTSxvQkFBb0IsR0FBeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQUMs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
