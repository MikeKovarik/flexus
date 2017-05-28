import {scheduleEvent} from 'ganymede'





if (window.ResizeObserver) {
	var ro = new ResizeObserver(entries => {
		for (let entry of entries) {
			if (entry.target.onresize)
				entry.target.onresize(entry)
			if (entry.target.onResize)
				entry.target.onResize(entry)
		}
	})
}

function setupWatchElement(element) {
	var obj = document.createElement('object')
	obj.type = 'text/html'
	obj.data = 'about:blank'
	obj.style.display = 'block'
	obj.style.position = 'absolute'
	obj.style.top = 0
	obj.style.right = 0
	obj.style.bottom = 0
	obj.style.left = 0
	obj.style.height = '100%'
	obj.style.width = '100%'
	obj.style.overflow = 'hidden'
	obj.style.pointerEvents = 'none'
	obj.style.zIndex = -1
	element.style.position = 'relative'
	element.appendChild(obj)
	return obj
}

function watchElement(obj, listener) {
	obj.onload = e => {
		obj.contentDocument.defaultView.addEventListener('resize', listener)
		//obj.contentDocument.defaultView.addEventListener('resize', e => {
		//	if (resizeRAF) cancelAnimationFrame(resizeRAF)
		//	resizeRAF = requestAnimationFrame(listener)
		//})
	}
	return () => obj.contentDocument.defaultView.removeEventListener('resize', listener)
}

var resizeRAF
function diyDetector(target, listener) {
	var object
	var watchesGlobalResize
	var listenTarget
	function resizeCallback() {
		console.log('resize')
		if (resizeRAF) cancelAnimationFrame(resizeRAF)
		resizeRAF = requestAnimationFrame(listener)
	}
	function listenObjectView() {
		listenTarget = object.contentDocument.defaultView
		listenTarget.addEventListener('resize', resizeCallback)
	}
	function start() {
		if (target.offsetWidth === window.innerWidth) {
			watchesGlobalResize = true
			listenTarget = window
			listenTarget.addEventListener('resize', resizeCallback)
		} else if (watchesGlobalResize === undefined) {
			// Target element is not the exact width of window and custom inset object is used (for the first time).
			watchesGlobalResize = false
			object = setupWatchElement(target)
			object.onload = listenObjectView
		} else if (watchesGlobalResize === false) {
			// Target element is not the exact width of window and custom inset object is used (repeatedly).
			watchesGlobalResize = false
			listenObjectView()
		}
	}

	start()
	document.addEventListener('formfactor-update', e => {
		console.log('formfactor-update')
		listenTarget.removeEventListener('resize', resizeCallback)
		start()
	})
}

function setupDetector(target) {
	if (window.ResizeObserver) {
		ro.observe(target)
		//ro.unobserve(target)
	} else {
		diyDetector(target, () => {
			//console.log('resize')
		})
	}
}

export function resizeDetector(ClassOrCondition) {
	var condition
	function init(Class) {
		scheduleEvent(Class, 'created', function() {
			if (condition && !condition(this)) return
			setupDetector(this)
		})
	}
	if (ClassOrCondition.name) {
		init(ClassOrCondition)
	} else {
		condition = ClassOrCondition
		return init
	}
}