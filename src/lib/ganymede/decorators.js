import {getMetadata} from './metadata'
import {scheduleEvent} from './events'


export function nonenumerable(target, name, descriptor) {
	descriptor.enumerable = false
	return descriptor
}

// method decorator
// example: @observe('firstName', 'lastName') printName() {...}
export function observe(...observedProperties) {
	return function(ClassProto, callbackName) {
		var meta = getMetadata(ClassProto.constructor)
		observedProperties.forEach(propName => {
			meta.get(propName).observers.push(callbackName)
		})
	}
}

// method decorator
// hooks into existing getter/setter (like @reflect) and accepts function that is called
// on value change, but before Ganymede gets to it so the value can be validated, limited, clipped, etc...
// TODO: make this work with simple properties (and turn them into getter/setter)
export function validate(validator) {
	return (ClassProto, propName, descriptor) => {
		var originalSet = descriptor.set
		function set(newValue) {
			var validated = validator.call(this, newValue, this)
			originalSet.call(this, validated)
		}
		descriptor.set = set
		return descriptor
	}
}


export function autobind(ClassProto, methodName, descriptor) {
	var fn = descriptor.value
	return {
		configurable: true,
		get() {
			var bound = fn.bind(this)
			Object.defineProperty(this, methodName, {
				value: bound,
				configurable: true,
				writable: true
			})
			return bound
		}
	}
}
