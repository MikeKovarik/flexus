(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede'), require('flexus')) :
	typeof define === 'function' && define.amd ? define('fabdial', ['ganymede', 'flexus'], factory) :
	(factory(global.ganymede,global.flexus));
}(this, (function (ganymede,flexus) { 'use strict';

var _dec;
var _dec2;
var _dec3;
var _dec4;
var _class;
var _desc;
var _value;
var _class2;
var _descriptor;

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

let FlexusFabdial = (_dec = ganymede.css(`
	:host-context([top]),
	:host-context([right]),
	:host-context([bottom]),
	:host-context([top]) {
		position: absolute;
	}
	:host-context([top]) {
		top: 0;
	}
	:host-context([right]) {
		right: 0;
	}
	:host-context([bottom]) {
		bottom: 0;
	}
	:host-context([left]) {
		left: 0;
	}
	:host {
		display: inline-block;
	}
	#fab ::slotted(button) {
		font-size: 0 !important;
	}
	#rest {
		display: flex;
		flex-direction: column;
		position: absolute;
		right: calc(1rem + 8px);
	}
	:host-context([bottom]) #rest {
		flex-direction: column-reverse;
		bottom: calc(1rem + 56px + 16px);
	}
	:host-context([top]) #rest {
		top: calc(1rem + 56px);
	}
	#rest ::slotted(button) {
		min-width: initial !important;
		width: 40px !important;
		height: 40px !important;
		border-radius: 50% !important;
		box-shadow: 0px 3px 12px rgba(0,0,0,0.5);
		margin-top: 16px;
	}
	#rest ::slotted(button:not(:empty)) {
		font-size: 0 !important;
		padding: 0 0 0 8px !important;
	}

	/* reveal animation with code outside the shadow root */
	#rest ::slotted(button) {
		display: none !important;
	}
	:host([expanded]) #rest ::slotted(button) {
		display: flex !important;
	}
`), _dec2 = ganymede.template(`
	<div id="fab">
		<slot name="fab"></slot>
	</div>
	<div id="rest">
		<slot></slot>
	</div>
`), _dec3 = ganymede.on('$.fab', 'click'), _dec4 = ganymede.on('$.rest', 'click'), ganymede.customElement(_class = _dec(_class = _dec2(_class = (_class2 = class FlexusFabdial extends ganymede.ganymedeElement() {
	constructor(...args) {
		var _temp;

		return _temp = super(...args), _initDefineProp(this, 'expanded', _descriptor, this), _temp;
	}

	ready() {
		var fab = this.querySelector('[fab]');
		fab.setAttribute('slot', 'fab');
		this.fab = fab;
	}

	onFabClick() {
		if (this.expanded) this.collapse();else this.expand();
	}

	onRestClick() {
		console.log('onRestClick');
		this.collapse();
	}

	expand() {
		this.expanded = true;
	}

	collapse() {
		this.$.rest.animate([{ opacity: 1 }, { opacity: 0 }], 70).onfinish = () => {
			this.expanded = false;
		};
	}

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'expanded', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _applyDecoratedDescriptor(_class2.prototype, 'onFabClick', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'onFabClick'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onRestClick', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'onRestClick'), _class2.prototype)), _class2)) || _class) || _class) || _class);

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFiZGlhbC5qcyIsInNvdXJjZXMiOlsic3JjL2VsZW1lbnRzL2ZhYmRpYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtnYW55bWVkZUVsZW1lbnQsIGN1c3RvbUVsZW1lbnQsIG9uLCB0ZW1wbGF0ZSwgY3NzLCByZWZsZWN0LCBlbWl0fSBmcm9tICdnYW55bWVkZSdcclxuaW1wb3J0IHtwbGF0Zm9ybX0gZnJvbSAnZmxleHVzJ1xyXG5cclxuXHJcbkBjdXN0b21FbGVtZW50XHJcbkBjc3MoYFxyXG5cdDpob3N0LWNvbnRleHQoW3RvcF0pLFxyXG5cdDpob3N0LWNvbnRleHQoW3JpZ2h0XSksXHJcblx0Omhvc3QtY29udGV4dChbYm90dG9tXSksXHJcblx0Omhvc3QtY29udGV4dChbdG9wXSkge1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdH1cclxuXHQ6aG9zdC1jb250ZXh0KFt0b3BdKSB7XHJcblx0XHR0b3A6IDA7XHJcblx0fVxyXG5cdDpob3N0LWNvbnRleHQoW3JpZ2h0XSkge1xyXG5cdFx0cmlnaHQ6IDA7XHJcblx0fVxyXG5cdDpob3N0LWNvbnRleHQoW2JvdHRvbV0pIHtcclxuXHRcdGJvdHRvbTogMDtcclxuXHR9XHJcblx0Omhvc3QtY29udGV4dChbbGVmdF0pIHtcclxuXHRcdGxlZnQ6IDA7XHJcblx0fVxyXG5cdDpob3N0IHtcclxuXHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuXHR9XHJcblx0I2ZhYiA6OnNsb3R0ZWQoYnV0dG9uKSB7XHJcblx0XHRmb250LXNpemU6IDAgIWltcG9ydGFudDtcclxuXHR9XHJcblx0I3Jlc3Qge1xyXG5cdFx0ZGlzcGxheTogZmxleDtcclxuXHRcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XHJcblx0XHRyaWdodDogY2FsYygxcmVtICsgOHB4KTtcclxuXHR9XHJcblx0Omhvc3QtY29udGV4dChbYm90dG9tXSkgI3Jlc3Qge1xyXG5cdFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbi1yZXZlcnNlO1xyXG5cdFx0Ym90dG9tOiBjYWxjKDFyZW0gKyA1NnB4ICsgMTZweCk7XHJcblx0fVxyXG5cdDpob3N0LWNvbnRleHQoW3RvcF0pICNyZXN0IHtcclxuXHRcdHRvcDogY2FsYygxcmVtICsgNTZweCk7XHJcblx0fVxyXG5cdCNyZXN0IDo6c2xvdHRlZChidXR0b24pIHtcclxuXHRcdG1pbi13aWR0aDogaW5pdGlhbCAhaW1wb3J0YW50O1xyXG5cdFx0d2lkdGg6IDQwcHggIWltcG9ydGFudDtcclxuXHRcdGhlaWdodDogNDBweCAhaW1wb3J0YW50O1xyXG5cdFx0Ym9yZGVyLXJhZGl1czogNTAlICFpbXBvcnRhbnQ7XHJcblx0XHRib3gtc2hhZG93OiAwcHggM3B4IDEycHggcmdiYSgwLDAsMCwwLjUpO1xyXG5cdFx0bWFyZ2luLXRvcDogMTZweDtcclxuXHR9XHJcblx0I3Jlc3QgOjpzbG90dGVkKGJ1dHRvbjpub3QoOmVtcHR5KSkge1xyXG5cdFx0Zm9udC1zaXplOiAwICFpbXBvcnRhbnQ7XHJcblx0XHRwYWRkaW5nOiAwIDAgMCA4cHggIWltcG9ydGFudDtcclxuXHR9XHJcblxyXG5cdC8qIHJldmVhbCBhbmltYXRpb24gd2l0aCBjb2RlIG91dHNpZGUgdGhlIHNoYWRvdyByb290ICovXHJcblx0I3Jlc3QgOjpzbG90dGVkKGJ1dHRvbikge1xyXG5cdFx0ZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xyXG5cdH1cclxuXHQ6aG9zdChbZXhwYW5kZWRdKSAjcmVzdCA6OnNsb3R0ZWQoYnV0dG9uKSB7XHJcblx0XHRkaXNwbGF5OiBmbGV4ICFpbXBvcnRhbnQ7XHJcblx0fVxyXG5gKVxyXG5AdGVtcGxhdGUoYFxyXG5cdDxkaXYgaWQ9XCJmYWJcIj5cclxuXHRcdDxzbG90IG5hbWU9XCJmYWJcIj48L3Nsb3Q+XHJcblx0PC9kaXY+XHJcblx0PGRpdiBpZD1cInJlc3RcIj5cclxuXHRcdDxzbG90Pjwvc2xvdD5cclxuXHQ8L2Rpdj5cclxuYClcclxuY2xhc3MgRmxleHVzRmFiZGlhbCBleHRlbmRzIGdhbnltZWRlRWxlbWVudCgpIHtcclxuXHJcblx0QHJlZmxlY3QgZXhwYW5kZWQgPSBmYWxzZVxyXG5cclxuXHRyZWFkeSgpIHtcclxuXHRcdHZhciBmYWIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tmYWJdJylcclxuXHRcdGZhYi5zZXRBdHRyaWJ1dGUoJ3Nsb3QnLCAnZmFiJylcclxuXHRcdHRoaXMuZmFiID0gZmFiXHJcblx0fVxyXG5cclxuXHRAb24oJyQuZmFiJywgJ2NsaWNrJylcclxuXHRvbkZhYkNsaWNrKCkge1xyXG5cdFx0aWYgKHRoaXMuZXhwYW5kZWQpXHJcblx0XHRcdHRoaXMuY29sbGFwc2UoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLmV4cGFuZCgpXHJcblx0fVxyXG5cclxuXHRAb24oJyQucmVzdCcsICdjbGljaycpXHJcblx0b25SZXN0Q2xpY2soKSB7XHJcblx0XHRjb25zb2xlLmxvZygnb25SZXN0Q2xpY2snKVxyXG5cdFx0dGhpcy5jb2xsYXBzZSgpXHJcblx0fVxyXG5cclxuXHRleHBhbmQoKSB7XHJcblx0XHR0aGlzLmV4cGFuZGVkID0gdHJ1ZVxyXG5cdH1cclxuXHJcblx0Y29sbGFwc2UoKSB7XHJcblx0XHR0aGlzLiQucmVzdC5hbmltYXRlKFtcclxuXHRcdFx0e29wYWNpdHk6IDF9LFxyXG5cdFx0XHR7b3BhY2l0eTogMH1cclxuXHRcdF0sIDcwKS5vbmZpbmlzaCA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5leHBhbmRlZCA9IGZhbHNlXHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG4iXSwibmFtZXMiOlsiRmxleHVzRmFiZGlhbCIsImNzcyIsInRlbXBsYXRlIiwib24iLCJjdXN0b21FbGVtZW50IiwiZ2FueW1lZGVFbGVtZW50IiwiZmFiIiwicXVlcnlTZWxlY3RvciIsInNldEF0dHJpYnV0ZSIsImV4cGFuZGVkIiwiY29sbGFwc2UiLCJleHBhbmQiLCJsb2ciLCIkIiwicmVzdCIsImFuaW1hdGUiLCJvcGFjaXR5Iiwib25maW5pc2giLCJyZWZsZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQ0EsSUF1RU1BLHdCQW5FTEMsYUFBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQUFMLFdBMkRBQyxrQkFBVTs7Ozs7OztDQUFWLFdBa0JDQyxZQUFHLE9BQUgsRUFBWSxPQUFaLFdBUUFBLFlBQUcsUUFBSCxFQUFhLE9BQWIsR0F0RkRDLHdFQW9FRCxNQUFNSixhQUFOLFNBQTRCSywwQkFBNUIsQ0FBOEM7Ozs7Ozs7U0FJckM7TUFDSEMsTUFBTSxLQUFLQyxhQUFMLENBQW1CLE9BQW5CLENBQVY7TUFDSUMsWUFBSixDQUFpQixNQUFqQixFQUF5QixLQUF6QjtPQUNLRixHQUFMLEdBQVdBLEdBQVg7OztjQUlZO01BQ1IsS0FBS0csUUFBVCxFQUNDLEtBQUtDLFFBQUwsR0FERCxLQUdDLEtBQUtDLE1BQUw7OztlQUlZO1VBQ0xDLEdBQVIsQ0FBWSxhQUFaO09BQ0tGLFFBQUw7OztVQUdRO09BQ0hELFFBQUwsR0FBZ0IsSUFBaEI7OztZQUdVO09BQ0xJLENBQUwsQ0FBT0MsSUFBUCxDQUFZQyxPQUFaLENBQW9CLENBQ25CLEVBQUNDLFNBQVMsQ0FBVixFQURtQixFQUVuQixFQUFDQSxTQUFTLENBQVYsRUFGbUIsQ0FBcEIsRUFHRyxFQUhILEVBR09DLFFBSFAsR0FHa0IsTUFBTTtRQUNsQlIsUUFBTCxHQUFnQixLQUFoQjtHQUpEOzs7NEVBM0JBUzs7O1NBQW1COzs7OyJ9
