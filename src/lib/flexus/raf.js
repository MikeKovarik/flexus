export function rafThrottle(callback) {
	var latestArg
	var running = false
	function run() {
		running = false
		callback(latestArg)
	}
	return arg => {
		if (running === true) return
		running = true
		latestArg = arg
		requestAnimationFrame(run)
	}
}

/*
export class RenderManager {

	temporary = []
	looping = []

	requests = new Map
	rafid = 0

	get running() {
		return this.rafid != 0
	}

	constructor() {
		this.frame = this.frame.bind(this)
	}

	// register repeated resusable renderer with a name and use it to start/stop
	register(name, renderer) {
		this.requests.set(name, renderer)
	}
	start(name) {
		console.log('start', name)
		var renderer = this.requests.get(name)
		var rendererIndex = this.looping.indexOf(renderer)
		// add request to the list of looping requests and start animation frame
		if (rendererIndex == -1) {
			this.looping.push(renderer)
			if (!this.rafid) {
				this.frame()
			}
		}
	}
	stop(name) {
		console.log('stop', name)
		// remove request from list of looping requests
		var renderer = this.requests.get(name)
		var rendererIndex = this.looping.indexOf(renderer)
		if (rendererIndex != -1) {
			this.looping.splice(rendererIndex, 1)
		}
		// if no other requests, stop
		if (this.looping.length == 0 && this.rafid) {
			this.cancel()
		}
	}

	once(fn) {
		//console.log('once !includes', !this.temporary.includes(fn), this.temporary)
		if (!this.temporary.includes(fn)) {
			this.temporary.push(fn)
			if (!this.running) {
				this.request()
			}
		}
		//this.start()
	}
	prevent(fn) {
		if (this.temporary.includes(fn)) {
			removeFromArray(this.temporary, fn)
		}
	}

	request() {
		this.rafid = requestAnimationFrame(this.frame)
	}

	cancel() {
		cancelAnimationFrame(this.rafid)
		this.rafid = 0
	}

	frame() {
		//console.log('frame this.looping', this.looping)
		if (this.looping.length) {
			// request another frame
			this.request()
		} else {
			this.rafid = 0
		}
		if (this.looping.length) {
			//this.rafid = requestAnimationFrame(this.frame)
			// if theres something to render, render it
			for (var i = 0; i < this.looping.length; i++) {
				console.log(this.looping[i])
				this.looping[i]()
			}
		}
		// render all one-off functions
		if (this.temporary.length) {
			while (this.temporary.length) {
				this.temporary.shift()()
			}
		}
	}

}
*/