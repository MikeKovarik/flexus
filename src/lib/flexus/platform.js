import {emit} from 'ganymede'
import {appElementReady} from './appElement'


// Windows.System.Profile.AnalyticsInfo.DeviceForm

var ua = navigator.userAgent

export var platform = {
	// orientation
	portrait: undefined,
	landscape: undefined,
	// design
	neon: undefined,
	material: undefined,
	// system
	windows:  ua.includes('Windows'),
	android:  ua.includes('Android'),
	chromeos: ua.includes('CrOS'),
	// browser
	edge:   ua.includes('Edge'),
	chrome: ua.includes('Chrome') && !ua.includes('Edge'), ///////////////////////////////
	// runtime
	uwp: typeof Windows !== 'undefined',
	cordova: undefined,
	chromeapp: undefined,
	// apis
	nativeCustomComponents: window.customElements && customElements.constructor.name === 'CustomElementRegistry',
	// TODO - deprecate
	phone: undefined,
	tablet: undefined,
}

platform.csp = platform.uwp || platform.chromeapp

if (navigator.maxTouchPoints > 0) {
	platform.touch = true
	platform.nontouch = false
	platform.inputType = 'touch'
} else {
	platform.touch = true
	platform.nontouch = false
	platform.inputType = 'nontouch'
}

window.platform = platform

// TODO deprecate
function determineFormfactor() {
	platform.phone = platform.phablet = platform.tablet = platform.laptop = platform.desktop = false
	//if (platform.touch) {
		switch (platform.screensize) {
			case 'small':
				platform.phone = true
				break
			case 'medium':
				platform.phablet = true
				platform.tablet = true
				break
			case 'large':
				platform.tablet = true
				break
		}
	//} else {
	//}
	applyFormfactorAttributes()
}

// todo deprecate
function applyFormfactorAttributes() {
	var htmlNode = document.body.parentElement
	//console.log('applyFormfactorAttributes')
	if (platform.phone)
		htmlNode.setAttribute('phone', '')
	else
		htmlNode.removeAttribute('phone')
	if (platform.phablet)
		htmlNode.setAttribute('phablet', '')
	else
		htmlNode.removeAttribute('phablet')
	if (platform.tablet)
		htmlNode.setAttribute('tablet', '')
	else
		htmlNode.removeAttribute('tablet')
}



// assign default color theme if none provided
appElementReady.then(appElement => {
	determineFormfactor()

	var targetNode = document.body.parentElement
	//var targetNode = appElement

	// assigning [touch] or [nontouch]
	if (targetNode.hasAttribute('touch') || targetNode.hasAttribute('nontouch')) {
		if (targetNode.hasAttribute('touch')) {
			platform.touch = true
			platform.nontouch = false
			platform.inputType = 'touch'
		} else {
			platform.touch = false
			platform.nontouch = true
			platform.inputType = 'nontouch'
		}
	} else {
		targetNode.setAttribute(platform.inputType, '')
	}
})

document.addEventListener('formfactor-update', determineFormfactor)




/*
export function PlatformBool(element, propName, attrValue) {
	if (!element[propName + 'temp']) {
		document.addEventListener('formfactor-update', e => {
			PlatformBool(element, propName, attrValue)
		})
		element[propName + 'temp'] = true
	}
	element[propName] = platformConditionParser(attrValue)
}

function platformConditionParser(condition) {
	return condition
		.split(';')
		.map(platformConditionParserLogic)
		.some(a => a)
}
function platformConditionParserLogic(condition) {
	switch(condition) {
		case 'phone':
			return platform.phone
			break
		case 'tablet':
			return platform.tablet
			break
	}
}
*/