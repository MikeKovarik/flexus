// TODO deprecate

// LODASH SHIM

var _

if (typeof window._ == 'undefined') {

	_ = {

		chain() {
			// todo
		},

		forEach(array, callback) {
			for (var i = 0; i < array.length; i++) {
				callback(array[i])
			}
		},

		find(collection, arg2, arg3) {
			if (typeof arg2 == 'function') {
				// arg2 is callback
				for (var i = 0; i < collection.length; i++) {
					if (arg2(collection[i])) return collection[i]
				}
			} else if (arguments.length == 3) {
				// arg2 is key, arg3 is value
				for (var i = 0; i < collection.length; i++) {
					if (collection[i][arg2] == arg3) return collection[i]
				}
			} else {
				// only arg2 is key. arg3 is undefined. this only looks for presence of key in object of collection
			}
		},

		some(collection, arg2, arg3) {
			if (typeof arg2 == 'function') {
				// arg2 is callback
				for (var i = 0; i < collection.length; i++) {
					if (arg2(collection[i])) return true
				}
			} else if (arguments.length == 3) {
				// arg2 is key, arg3 is value
				for (var i = 0; i < collection.length; i++) {
					if (collection[i][arg2] == arg3) return true
				}
			} else {
				// only arg2 is key. arg3 is undefined. this only looks for presence of key in object of collection
			}
			return false
		},

		map: (arr, cmp) => arr.map(cmp),

		filter: (arr, cmp) => arr.filter(cmp),

		xor: (arr1, arr2) => arr1.filter(i => arr2.indexOf(i) < 0)

	}

}

export {_}