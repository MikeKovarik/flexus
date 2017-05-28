export var app
export var appElementReady = new Promise(resolve => {
	app = document.querySelector('[fx-app]')
	if (app) {
		return resolve(app)
	}
	function listener(e) {
		app = document.querySelector('[fx-app]')
		if (app) {
			resolve(app)
		} else {
			app = document.body
			app.setAttribute('fx-app', '')
			resolve(app)
		}
		document.removeEventListener('DOMContentLoaded', listener)
	}
	document.addEventListener('DOMContentLoaded', listener)
})
