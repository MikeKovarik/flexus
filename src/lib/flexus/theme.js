import {app} from './app'
import {platform} from './platform'
import {iridescent} from './iridescent'
import {loadNeon, loadMaterial} from './loader'


// TODO: integrate this into app.js

// unfold UWPs API
if (platform.uwp) {
	var ViewManagement = Windows.UI.ViewManagement
	var uiViewSettings = ViewManagement.UIViewSettings.getForCurrentView()
	var systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView()
	var uiSettings = new ViewManagement.UISettings()
	var {UserInteractionMode, UIColorType} = ViewManagement
}


function loadDesign() {
	if (platform.design === 'material')
		loadMaterial()
	else
		loadNeon()
	platform.designLoaded = true
}

function loadPlatformDesign() {
	if (platform.windows)
		loadNeon()
	else
		loadMaterial()
	platform.designLoaded = true
}

function detectLoadedDesign() {
	var styleSheets = Array.from(document.styleSheets)
	if (styleSheets.some(s => s.href && s.href.includes('material'))) {
		platform.material = true
		platform.design = 'material'
		platform.designLoaded = true
	} else if (styleSheets.some(s => s.href && s.href.includes('neon'))) {
		platform.neon = true
		platform.design = 'neon'
		platform.designLoaded = true
	}
}

function detectNodeDesign(node) {
	if (node.hasAttribute('material')) {
		platform.material = true
		platform.design = 'material'
	} else if (node.hasAttribute('neon')) {
		platform.neon = true
		platform.design = 'neon'
	}
}

function detectTheme(node) {
	if (node.hasAttribute('light')) {
		platform.theme = 'light'
	} else if (node.hasAttribute('dark')) {
		platform.theme = 'dark'
	}
}


function applyDesignAttrs() {
	if (platform.neon) {
		app.root.setAttribute('neon', '')
		app.root.removeAttribute('material')
	} else {
		app.root.setAttribute('material', '')
		app.root.removeAttribute('neon')
	}
}

function applyThemeAttrs() {
	if (platform.theme === 'dark') {
		app.root.setAttribute('dark', '')
		app.root.removeAttribute('light')
	} else {
		app.root.setAttribute('light', '')
		app.root.removeAttribute('dark')
	}
}

// reads 'platform.primary' value which could be either #hex value or name from palette
// if its hex  -> applies the hex to CSS properties
// if its rgb  -> calculates hex from it, applies the hex to CSS properties
// if its name -> calculates hex from it
// then applies hex color to <meta> theme tag (for android chrome)
function applyPrimary(fromNode = app.root) {
	if (!platform.primary)
		return
	var hex = iridescent.hex(platform.primary)
	if (hex) {
		applyHexColorToNode(app.root, 'primary', hex)
	} else {
		var computed = getComputedStyle(fromNode)
		var color = computed.getPropertyValue('--primary')
		hex = iridescent.hex(color)
	}
	if (hex)
		iridescent.meta = hex
}

// TODO - make this work with --tint
function applyHexColorToNode(node, type, color) {
	color = color || node.getAttribute(type)
	if (color.includes(',')) {
		var backgroundRgb = iridescent.rgbStrip(color)
	} else {
		var backgroundRgb = iridescent.hexToRgb(color)
	}
	var foregroundRgb = iridescent.rgbForeground(...backgroundRgb)
	// Set [primary="custom"] or [accent="custom"] to handle custom colors properly and
	// assign css custom properties with given color and its computed foreground counterpart
	iridescent.setTypedColor(node, type, backgroundRgb, foregroundRgb)
}


function detectUwpTheme() {
	var bg = uiSettings.getColorValue(UIColorType.background)
	var isDark = (bg.r + bg.g + bg.b) < 382
	platform.theme = isDark ? 'dark' : 'light'
	console.log('detectUwpTheme', platform.theme)
}

function detectUwpColor() {
	// note: UWP only uses single color with name 'accent', it'll be used as the primary for flexus
	var color = uiSettings.getColorValue(UIColorType.accent)
	platform.primary = `${color.r},${color.g},${color.b}`
}


// detect implicitly defined CSS files
if (!platform.design)
	detectLoadedDesign()
// load CSS if none was loaded, but defined through JS object
if (platform.design && !platform.designLoaded)
	loadDesign()

app.rootReady.then(root => {

	var body = document.body

	// import design if none was included
	if (!platform.designLoaded) {
		// find out what style user wants to load
		if (!platform.design)
			detectNodeDesign(app.root)
		if (!platform.design && body !== app.root)
			detectNodeDesign(body)
		// load some style but only in non-restrictive (non-cs)p environments
		if (!platform.csp) {
			if (platform.design)
				loadDesign()
			else
				loadPlatformDesign()
		}
	}
	applyDesignAttrs()


	if (!platform.theme)
		detectTheme(app.root)
	if (!platform.theme && body !== app.root)
		detectTheme(body)
	if (!platform.theme) {
		if (platform.uwp) {
			detectUwpTheme()
			uiSettings.addEventListener('colorvalueschanged', e => {
				detectUwpTheme()
				applyThemeAttrs()
			})
		}
	}
	applyThemeAttrs()


	var primaryElement
	if (!platform.primary) {
		platform.primary = app.root.getAttribute('primary')
		primaryElement = app.root
	}
	if (!platform.primary && body !== app.root) {
		platform.primary = body.getAttribute('primary')
		primaryElement = body
	}
	if (!platform.primary) {
		if (iridescent.meta) {
			platform.primary = iridescent.meta
		} else if (platform.uwp) {
			detectUwpColor()
			uiSettings.addEventListener('colorvalueschanged', e => {
				detectUwpColor()
				applyPrimary()
			})
		}
	}
	applyPrimary(primaryElement)

/*
	// read color from meta tag <meta name="theme-color">
	var primaryElement = document.querySelector('[primary]:not([primary=""])')
	var metaColor = iridescent.meta
	if (metaColor) {
		applyHexColorToNode(app, 'primary', metaColor)
	} else if (primaryElement) {
		// meta[theme-color] was not specified but some [primary] has been.
		// Apply it to meta[theme-color]
		var color = primaryElement.getAttribute('primary')
		if (!color.startsWith('#')) {
			var computed = getComputedStyle(primaryElement)
			color = computed.getPropertyValue('--primary').trim()
		}
		iridescent.meta = color
	}*/
})

// TODO - make this work with --tint
// apply custom primary colors defined by hex in attribute [primary]
Array.from(document.querySelectorAll('[primary^="#"]')).forEach(node => {
	applyHexColorToNode(node, 'primary')
})

// TODO - make this work with --tint and calculate 
// apply custom accent colors defined by hex in attribute [accent]
Array.from(document.querySelectorAll('[accent^="#"]')).forEach(node => {
	applyHexColorToNode(node, 'accent')
})
