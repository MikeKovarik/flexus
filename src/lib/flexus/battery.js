import {platform} from './platform'
import {app, appElementReady} from './appElement'


export var effectSuppresion = {
	batteryLevel: 20,
	minCpuCores: 2,
}

var batteryWise = false
var cpuWise = navigator.hardwareConcurrency < effectSuppresion.minCpuCores

function update() {
	if (batteryWise || cpuWise) {
		console.log('TODO: disable effects')
		app.setAttribute('noeffects', '')
	} else {
		console.log('TODO: enable effects')
		app.removeAttribute('noeffects')
	}
}

function batteryUpdated(level, charging) {
	batteryWise = !charging && level <= effectSuppresion.batteryLevel
	update()
}

// TODO: detect battery status and disable acrylic and other expensive effects
// TODO: detect old and slow devices (cpu cores, available memory)
/*if (platform.uwp) {
	var Battery = Windows.Devices.Power.Battery
	var BatteryStatus = Windows.System.BatteryStatus
	var aggBattery = Battery.aggregateBattery
	var report = aggBattery.getReport()
	if (report.status !== BatteryStatus.notPresent) {
		var check = () => {
	        var max = report.fullChargeCapacityInMilliwattHours
	        var value = report.remainingCapacityInMilliwattHours
	        var level = Math.round((value / max) * 100)
			batteryUpdated(level, report.status === BatteryStatus.charging)
		}
		check()
	}
}*/

// web platform outside any app runtime might have W3C Battery API available
if (platform.web && navigator.getBattery) {
	appElementReady
		.then(navigator.getBattery())
		.then(battery => {
			var check = () => batteryUpdated(battery.level, battery.charging)
			battery.addEventListener('chargingchange', check)
			battery.addEventListener('levelchange', check)
		})
}
