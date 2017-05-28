(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede'), require('flexus')) :
	typeof define === 'function' && define.amd ? define('toast', ['ganymede', 'flexus'], factory) :
	(factory(global.ganymede,global.flexus));
}(this, (function (ganymede,flexus) { 'use strict';

var flexus__default = 'default' in flexus ? flexus['default'] : flexus;

var _dec;
var _class;
var _desc;
var _value;
var _class2;

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

let FlexusToast = (_dec = ganymede.on('click'), ganymede.customElement(_class = (_class2 = class FlexusToast extends ganymede.ganymedeElement() {
	//class FlexusToast extends ganymedeElement(Visibility) {

	constructor(text, duration) {
		super();
		if (this.children.length === 0 && text) {
			this.textContent = text;
			this.duration = duration;
			this.show();
		}
	}

	show(duration = this.duration) {
		this.style.display = 'flex';
		setTimeout(() => this.hide(), duration);
	}

	hide() {
		this.remove();
	}

	onClick(data, { target }) {
		if (target.localName === 'button') this.hide();
	}

}, (_applyDecoratedDescriptor(_class2.prototype, 'onClick', [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, 'onClick'), _class2.prototype)), _class2)) || _class);


flexus__default.toast = function (text, duration = 4000) {
	var toast = new FlexusToast(text, duration);
	flexus__default.app.appendChild(toast);
};

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuanMiLCJzb3VyY2VzIjpbInNyYy9lbGVtZW50cy90b2FzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3RlbXBsYXRlLCBjc3MsIHJlZmxlY3QsIG9uLCBjdXN0b21FbGVtZW50LCBnYW55bWVkZUVsZW1lbnR9IGZyb20gJ2dhbnltZWRlJ1xyXG5pbXBvcnQge3BsYXRmb3JtLCBWaXNpYmlsaXR5fSBmcm9tICdmbGV4dXMnXHJcbmltcG9ydCBmbGV4dXMgZnJvbSAnZmxleHVzJ1xyXG5cclxuXHJcbkBjdXN0b21FbGVtZW50XHJcbmNsYXNzIEZsZXh1c1RvYXN0IGV4dGVuZHMgZ2FueW1lZGVFbGVtZW50KCkge1xyXG4vL2NsYXNzIEZsZXh1c1RvYXN0IGV4dGVuZHMgZ2FueW1lZGVFbGVtZW50KFZpc2liaWxpdHkpIHtcclxuXHJcblx0Y29uc3RydWN0b3IodGV4dCwgZHVyYXRpb24pIHtcclxuXHRcdHN1cGVyKClcclxuXHRcdGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCAmJiB0ZXh0KSB7XHJcblx0XHRcdHRoaXMudGV4dENvbnRlbnQgPSB0ZXh0XHJcblx0XHRcdHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvblxyXG5cdFx0XHR0aGlzLnNob3coKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2hvdyhkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb24pIHtcclxuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9ICdmbGV4J1xyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZGUoKSwgZHVyYXRpb24pXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0dGhpcy5yZW1vdmUoKVxyXG5cdH1cclxuXHJcblx0QG9uKCdjbGljaycpXHJcblx0b25DbGljayhkYXRhLCB7dGFyZ2V0fSkge1xyXG5cdFx0aWYgKHRhcmdldC5sb2NhbE5hbWUgPT09ICdidXR0b24nKVxyXG5cdFx0XHR0aGlzLmhpZGUoKVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbmZsZXh1cy50b2FzdCA9IGZ1bmN0aW9uKHRleHQsIGR1cmF0aW9uID0gNDAwMCkge1xyXG5cdHZhciB0b2FzdCA9IG5ldyBGbGV4dXNUb2FzdCh0ZXh0LCBkdXJhdGlvbilcclxuXHRmbGV4dXMuYXBwLmFwcGVuZENoaWxkKHRvYXN0KVxyXG59Il0sIm5hbWVzIjpbIkZsZXh1c1RvYXN0Iiwib24iLCJjdXN0b21FbGVtZW50IiwiZ2FueW1lZGVFbGVtZW50IiwidGV4dCIsImR1cmF0aW9uIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJ0ZXh0Q29udGVudCIsInNob3ciLCJzdHlsZSIsImRpc3BsYXkiLCJoaWRlIiwicmVtb3ZlIiwiZGF0YSIsInRhcmdldCIsImxvY2FsTmFtZSIsImZsZXh1cyIsInRvYXN0IiwiYXBwIiwiYXBwZW5kQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxBQUNBLEFBQ0EsSUFJTUEsc0JBcUJKQyxZQUFHLE9BQUgsR0F0QkRDLDJDQUNELE1BQU1GLFdBQU4sU0FBMEJHLDBCQUExQixDQUE0Qzs7O2FBRy9CQyxJQUFaLEVBQWtCQyxRQUFsQixFQUE0Qjs7TUFFdkIsS0FBS0MsUUFBTCxDQUFjQyxNQUFkLEtBQXlCLENBQXpCLElBQThCSCxJQUFsQyxFQUF3QztRQUNsQ0ksV0FBTCxHQUFtQkosSUFBbkI7UUFDS0MsUUFBTCxHQUFnQkEsUUFBaEI7UUFDS0ksSUFBTDs7OztNQUlHSixXQUFXLEtBQUtBLFFBQXJCLEVBQStCO09BQ3pCSyxLQUFMLENBQVdDLE9BQVgsR0FBcUIsTUFBckI7YUFDVyxNQUFNLEtBQUtDLElBQUwsRUFBakIsRUFBOEJQLFFBQTlCOzs7UUFHTTtPQUNEUSxNQUFMOzs7U0FJT0MsSUFBUixFQUFjLEVBQUNDLE1BQUQsRUFBZCxFQUF3QjtNQUNuQkEsT0FBT0MsU0FBUCxLQUFxQixRQUF6QixFQUNDLEtBQUtKLElBQUw7Ozs7OztBQUtISyxnQkFBT0MsS0FBUCxHQUFlLFVBQVNkLElBQVQsRUFBZUMsV0FBVyxJQUExQixFQUFnQztLQUMxQ2EsUUFBUSxJQUFJbEIsV0FBSixDQUFnQkksSUFBaEIsRUFBc0JDLFFBQXRCLENBQVo7aUJBQ09jLEdBQVAsQ0FBV0MsV0FBWCxDQUF1QkYsS0FBdkI7Q0FGRDs7In0=
