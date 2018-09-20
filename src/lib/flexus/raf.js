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