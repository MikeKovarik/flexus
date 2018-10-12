import {emit} from 'ganymede'
import {appElementReady} from './appElement'

// TODO: remove this file in favor of platform-detect library

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
	chrome: ua.includes('Chrome') && !ua.includes('Edge'), // TODO: veify
	// runtime
	browser: undefined,
	pwa: window.matchMedia('(display-mode: standalone)').matches,
	uwp: typeof Windows !== 'undefined',
	cordova: !!window.cordova,
	chromeapp: undefined,
	nwjs:     !!(typeof process !== 'undefined' && process.versions && process.versions.nw),
	electron: !!(typeof process !== 'undefined' && process.versions && process.versions.electron),
	// apis
	nativeCustomComponents: window.customElements && customElements.constructor.name === 'CustomElementRegistry',
}
platform.browser = !platform.uwp && !platform.uwp && !platform.cordova && !platform.nwjs && !platform.electron

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


// assign default color theme if none provided
appElementReady.then(root => {

	var targetNode = document.body.parentElement
	//var targetNode = root

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

/*

var {UIViewSettings, UserInteractionMode} = Windows.UI.ViewManagement
var {AnalyticsInfo} = Windows.System.Profile
var {EasClientDeviceInformation} = Windows.Security.ExchangeActiveSyncProvisioning


function getFormFactor() {
	switch (AnalyticsInfo.versionInfo.deviceFamily) {
		case 'Windows.Mobile':
			return 'Phone'
		case 'Windows.Desktop':
			return UIViewSettings.getForCurrentView().UserInteractionMode == UserInteractionMode.Mouse ? 'Desktop' : 'Tablet'
		case 'Windows.Universal':
			return 'IoT'
		case 'Windows.Team':
			return 'SurfaceHub'
		default:
			return 'Other'
	}
}

*/