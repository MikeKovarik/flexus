export var root
export var appElementReady = new Promise(resolve => {
	root = document.querySelector('[fx-app]')
	if (root) {
		return resolve(root)
	}
	function listener(e) {
		root = document.querySelector('[fx-app]')
		if (root) {
			resolve(root)
		} else {
			root = document.body
			root.setAttribute('fx-app', '')
			resolve(root)
		}
		document.removeEventListener('DOMContentLoaded', listener)
	}
	document.addEventListener('DOMContentLoaded', listener)
})
