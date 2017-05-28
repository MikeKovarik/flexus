(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede')) :
	typeof define === 'function' && define.amd ? define('dialog', ['ganymede'], factory) :
	(factory(global.ganymede));
}(this, (function (ganymede) { 'use strict';

var _dec;
var _dec2;
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

//import {platform} from 'flexus'

// TODO - MDN <dialog>

let FlexusDialog = (_dec = ganymede.template(`
	<slot></slot>
	<div id="actions">
		<slot name="actions"></slot>
	</div>
`), _dec2 = ganymede.css(`
	#actions {
		margin: 24px -2px -2px -2px;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	#actions ::slotted(*) {
		flex: 1;
	}
	:host([actions="1"]) #actions ::slotted(*) {
		flex: 0.5;
	}
	/*@media (max-width: 300px) {
		#actions {
			flex-direction: column;
		}
	}*/
`), ganymede.customElement(_class = _dec(_class = _dec2(_class = (_class2 = class FlexusDialog extends ganymede.Element {
	constructor(...args) {
		var _temp;

		return _temp = super(...args), _initDefineProp(this, 'visible', _descriptor, this), _initDefineProp(this, 'actions', _descriptor2, this), _temp;
	}

	ready() {
		var buttons = Array.from(this.querySelectorAll('button'));
		buttons.forEach(button => button.setAttribute('slot', 'actions'));
		this.actions = buttons.length;
	}

	show() {
		this.visible = true;
	}

	hide() {
		this.visible = false;
	}

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'visible', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return false;
	}
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'actions', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return 0;
	}
})), _class2)) || _class) || _class) || _class);

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlcyI6WyJzcmMvZWxlbWVudHMvZGlhbG9nLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dGVtcGxhdGUsIGNzcywgcmVmbGVjdCwgY3VzdG9tRWxlbWVudCwgRWxlbWVudH0gZnJvbSAnZ2FueW1lZGUnXHJcbi8vaW1wb3J0IHtwbGF0Zm9ybX0gZnJvbSAnZmxleHVzJ1xyXG5cclxuLy8gVE9ETyAtIE1ETiA8ZGlhbG9nPlxyXG5cclxuQGN1c3RvbUVsZW1lbnRcclxuQHRlbXBsYXRlKGBcclxuXHQ8c2xvdD48L3Nsb3Q+XHJcblx0PGRpdiBpZD1cImFjdGlvbnNcIj5cclxuXHRcdDxzbG90IG5hbWU9XCJhY3Rpb25zXCI+PC9zbG90PlxyXG5cdDwvZGl2PlxyXG5gKVxyXG5AY3NzKGBcclxuXHQjYWN0aW9ucyB7XHJcblx0XHRtYXJnaW46IDI0cHggLTJweCAtMnB4IC0ycHg7XHJcblx0XHRkaXNwbGF5OiBmbGV4O1xyXG5cdFx0ZmxleC13cmFwOiB3cmFwO1xyXG5cdFx0anVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcclxuXHR9XHJcblx0I2FjdGlvbnMgOjpzbG90dGVkKCopIHtcclxuXHRcdGZsZXg6IDE7XHJcblx0fVxyXG5cdDpob3N0KFthY3Rpb25zPVwiMVwiXSkgI2FjdGlvbnMgOjpzbG90dGVkKCopIHtcclxuXHRcdGZsZXg6IDAuNTtcclxuXHR9XHJcblx0LypAbWVkaWEgKG1heC13aWR0aDogMzAwcHgpIHtcclxuXHRcdCNhY3Rpb25zIHtcclxuXHRcdFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuXHRcdH1cclxuXHR9Ki9cclxuYClcclxuY2xhc3MgRmxleHVzRGlhbG9nIGV4dGVuZHMgRWxlbWVudCB7XHJcblxyXG5cdEByZWZsZWN0IHZpc2libGUgPSBmYWxzZVxyXG5cdEByZWZsZWN0IGFjdGlvbnMgPSAwXHJcblxyXG5cdHJlYWR5KCkge1xyXG5cdFx0dmFyIGJ1dHRvbnMgPSBBcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJykpXHJcblx0XHRidXR0b25zLmZvckVhY2goYnV0dG9uID0+IGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3Nsb3QnLCAnYWN0aW9ucycpKVxyXG5cdFx0dGhpcy5hY3Rpb25zID0gYnV0dG9ucy5sZW5ndGhcclxuXHR9XHJcblxyXG5cdHNob3coKSB7XHJcblx0XHR0aGlzLnZpc2libGUgPSB0cnVlXHJcblx0fVxyXG5cclxuXHRoaWRlKCkge1xyXG5cdFx0dGhpcy52aXNpYmxlID0gZmFsc2VcclxuXHR9XHJcblxyXG59XHJcbiJdLCJuYW1lcyI6WyJGbGV4dXNEaWFsb2ciLCJ0ZW1wbGF0ZSIsImNzcyIsImN1c3RvbUVsZW1lbnQiLCJFbGVtZW50IiwiYnV0dG9ucyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiYnV0dG9uIiwic2V0QXR0cmlidXRlIiwiYWN0aW9ucyIsImxlbmd0aCIsInZpc2libGUiLCJyZWZsZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFDQTs7OztJQThCTUEsdUJBekJMQyxrQkFBVTs7Ozs7Q0FBVixXQU1BQyxhQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FBTCxHQVBBQyx3RUEwQkQsTUFBTUgsWUFBTixTQUEyQkksZ0JBQTNCLENBQW1DOzs7Ozs7O1NBSzFCO01BQ0hDLFVBQVVDLE1BQU1DLElBQU4sQ0FBVyxLQUFLQyxnQkFBTCxDQUFzQixRQUF0QixDQUFYLENBQWQ7VUFDUUMsT0FBUixDQUFnQkMsVUFBVUEsT0FBT0MsWUFBUCxDQUFvQixNQUFwQixFQUE0QixTQUE1QixDQUExQjtPQUNLQyxPQUFMLEdBQWVQLFFBQVFRLE1BQXZCOzs7UUFHTTtPQUNEQyxPQUFMLEdBQWUsSUFBZjs7O1FBR007T0FDREEsT0FBTCxHQUFlLEtBQWY7OzsyRUFkQUM7OztTQUFrQjs7NEVBQ2xCQTs7O1NBQWtCOzs7OyJ9
