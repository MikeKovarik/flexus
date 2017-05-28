(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ganymede')) :
	typeof define === 'function' && define.amd ? define('flexus', ['exports', 'ganymede'], factory) :
	(factory((global.flexus = global.flexus || {}),global.ganymede));
}(this, (function (exports,ganymede) { 'use strict';

var ganymede__default = 'default' in ganymede ? ganymede['default'] : ganymede;

;
var appElementReady = new Promise(resolve => {
	exports.app = document.querySelector('[fx-app]');
	if (exports.app) {
		return resolve(exports.app);
	}
	function listener(e) {
		exports.app = document.querySelector('[fx-app]');
		if (exports.app) {
			resolve(exports.app);
		} else {
			exports.app = document.body;
			exports.app.setAttribute('fx-app', '');
			resolve(exports.app);
		}
		document.removeEventListener('DOMContentLoaded', listener);
	}
	document.addEventListener('DOMContentLoaded', listener);
});

// Windows.System.Profile.AnalyticsInfo.DeviceForm

var ua = navigator.userAgent;

var platform$1 = {
	// orientation
	portrait: undefined,
	landscape: undefined,
	// design
	neon: undefined,
	material: undefined,
	// system
	windows: ua.includes('Windows'),
	android: ua.includes('Android'),
	chromeos: ua.includes('CrOS'),
	// browser
	edge: ua.includes('Edge'),
	chrome: ua.includes('Chrome') && !ua.includes('Edge'), ///////////////////////////////
	// runtime
	uwp: typeof Windows !== 'undefined',
	cordova: undefined,
	chromeapp: undefined,
	// apis
	nativeCustomComponents: window.customElements && customElements.constructor.name === 'CustomElementRegistry',
	// TODO - deprecate
	phone: undefined,
	tablet: undefined
};

platform$1.csp = platform$1.uwp || platform$1.chromeapp;

if (navigator.maxTouchPoints > 0) {
	platform$1.touch = true;
	platform$1.nontouch = false;
	platform$1.inputType = 'touch';
} else {
	platform$1.touch = true;
	platform$1.nontouch = false;
	platform$1.inputType = 'nontouch';
}

window.platform = platform$1;

// TODO deprecate
function determineFormfactor() {
	platform$1.phone = platform$1.phablet = platform$1.tablet = platform$1.laptop = platform$1.desktop = false;
	//if (platform.touch) {
	switch (platform$1.screensize) {
		case 'small':
			platform$1.phone = true;
			break;
		case 'medium':
			platform$1.phablet = true;
			platform$1.tablet = true;
			break;
		case 'large':
			platform$1.tablet = true;
			break;
	}
	//} else {
	//}
	applyFormfactorAttributes();
}

// todo deprecate
function applyFormfactorAttributes() {
	var htmlNode = document.body.parentElement;
	//console.log('applyFormfactorAttributes')
	if (platform$1.phone) htmlNode.setAttribute('phone', '');else htmlNode.removeAttribute('phone');
	if (platform$1.phablet) htmlNode.setAttribute('phablet', '');else htmlNode.removeAttribute('phablet');
	if (platform$1.tablet) htmlNode.setAttribute('tablet', '');else htmlNode.removeAttribute('tablet');
}

// assign default color theme if none provided
appElementReady.then(appElement => {
	determineFormfactor();

	var targetNode = document.body.parentElement;
	//var targetNode = appElement

	// assigning [touch] or [nontouch]
	if (targetNode.hasAttribute('touch') || targetNode.hasAttribute('nontouch')) {
		if (targetNode.hasAttribute('touch')) {
			platform$1.touch = true;
			platform$1.nontouch = false;
			platform$1.inputType = 'touch';
		} else {
			platform$1.touch = false;
			platform$1.nontouch = true;
			platform$1.inputType = 'nontouch';
		}
	} else {
		targetNode.setAttribute(platform$1.inputType, '');
	}
});

document.addEventListener('formfactor-update', determineFormfactor);

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

// TODO implement UWP accent color (since the theme <meta> tag is already handled)


let iridescent = class iridescent {

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////// CONVERSIONS ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static hexToRgb(string) {
		if (string.startsWith('#')) string = string.slice(1);
		var r = parseInt(string.substr(0, 2), 16);
		var g = parseInt(string.substr(2, 2), 16);
		var b = parseInt(string.substr(4, 2), 16);
		return [r, g, b];
	}

	static rgbToHex(r, g, b) {
		var int = r << 16 | g << 8 | b;
		return '#' + ('00000' + int.toString(16)).slice(-6).toUpperCase();
	}

	static rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h;
		var s;
		var l = (max + min) / 2;
		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);break;
				case g:
					h = (b - r) / d + 2;break;
				case b:
					h = (r - g) / d + 4;break;
			}
			h /= 6;
		}
		return [h, s, l];
	}

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// UTILS //////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	// calculated appropriate text color for given background rgb color
	static rgbForeground(r, g, b) {
		var count = r + g + b;
		var brightness = this.rgbBrightness(r, g, b);
		if (brightness > 140 || count > 450) return [0, 0, 0];
		//return '#000000'
		else return [255, 255, 255];
		//return '#FFFFFF'
	}

	static rgbBrightness(r, g, b) {
		return (r * 299 + g * 587 + b * 114) / 1000;
	}

	// per ITU-R BT.709
	static rgbLuminance(r, g, b) {
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	}

	static rgbStrip(string) {
		return string.trim().split(',').map(Number);
	}

	static hex(string) {
		string = string.trim();
		if (string.startsWith('#')) {
			return string;
		} else if (string.includes(',')) {
			if (string.endsWith(')')) {
				string = string.slice(0, -1);
			}
			if (string.startsWith('rgb(')) {
				string = string.slice(4);
			}
			return iridescent.rgbToHex(...this.rgbStrip(string));
		}
	}

	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////// PALETTE /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static get names() {
		return ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'gray', 'blue-gray'];
	}
	static get shades() {
		return [100, 300, 500, 700, 900];
	}

	static loadPalette() {
		if (this.rgbPalette) return;
		var computed = getComputedStyle(document.body);
		var rgbPalette = new Map();
		var hslPalette = new Map();
		this.names.forEach(name => {
			this.shades.forEach(shade => {
				var rgb = computed.getPropertyValue(`--palette-${ name }-${ shade }-rgb`).trim().split(',').map(Number);
				var hsl = this.rgbToHsl(...rgb);
				rgbPalette.set(`${ name }-${ shade }`, rgb);
				hslPalette.set(`${ name }-${ shade }`, hsl);
			});
		});
		this.rgbPalette = rgbPalette;
		this.hslPalette = hslPalette;
	}

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// UTILS //////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static closestPaletteColor(rgb) {
		var name;
		var diff = 255;
		var hsl = this.rgbToHsl(...rgb);
		var [h, s, l] = hsl;
		//h = Math.round(h * 360)
		//s = Math.round(s * 100)
		//l = Math.round(l * 100)
		//console.log('closest rgb', rgb)
		//console.log('closest hsl', hsl)
		//console.log('hue', Math.round(hsl[0] * 360))
		//console.log('hue', h, s, l)
		this.hslPalette.forEach((value, colorName) => {
			var d = this.rgbDifference(...value, ...hsl);
			if (d < diff) {
				//console.log(colorName, d)
				name = colorName;
				diff = d;
			}
		});
		return name;
	}

	static applyImageColor(img, target, type = 'primary') {
		var promise = this.calculateImageColor(img);
		return promise.then(([background, foreground]) => {
			//this.loadPalette()
			//var closest = this.closestPaletteColor(background)
			//console.log('closest', closest)
			this.setPrimary(target, type, background, foreground);
		});
	}
	static calculateImageColor(img) {
		return imgReady(img).then(img => {
			var vibrant = new Vibrant(img);
			var swatch = vibrant.VibrantSwatch;
			var background = swatch.rgb;
			var foreground = this.calculateForegroundRgb(...background);
			//var background = swatch.getHex()
			//var foreground = swatch.getTitleTextColor()
			return [background, foreground];
		});
	}

	static round(...args) {
		var [a, b, c] = unpackArgs(args);
		return [Number(a.toFixed(2)), Number(b.toFixed(2)), Number(c.toFixed(2))];
	}

	static rgbDifference(r1, g1, b1, r2, g2, b2) {
		var sumOfSquares = 0;
		sumOfSquares += Math.pow(r1 - r2, 2);
		sumOfSquares += Math.pow(g1 - g2, 2);
		sumOfSquares += Math.pow(b1 - b2, 2);
		return Math.sqrt(sumOfSquares);
	}

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// META //////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static getMetaNode() {
		var name = 'theme-color';
		var meta = document.head.querySelector(`meta[name="${ name }"]`);
		if (meta) return meta;
		meta = document.createElement('meta');
		meta.name = name;
		document.head.appendChild(meta);
		return meta;
	}

	// returns #HEX value from <meta name="theme-color"> tag
	static get meta() {
		var meta = this.getMetaNode();
		return meta.content;
	}

	// sets rgb() or #HEX value to <meta name="theme-color"> tag
	static set meta(string) {
		string = string.trim();
		if (string.startsWith('rgb')) {
			var rgb = string.match(/\d+/g).map(Number);
			string = this.rgbToHex(...rgb);
			//console.log(string)
		}
		var meta = this.getMetaNode();
		if (meta.content !== string) meta.content = string;
	}

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// FLEXUS //////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static setPrimary(target, backgroundRgb, foregroundRgb) {
		this.setTypedColor(target, 'primary', backgroundRgb, foregroundRgb);
	}
	static setAccent(target, backgroundRgb, foregroundRgb) {
		this.setTypedColor(target, 'accent', backgroundRgb, foregroundRgb);
	}
	static setTypedColor(target, type, backgroundRgb, foregroundRgb) {
		target.setAttribute(type, 'custom');
		if (backgroundRgb) {
			var backgroundRgbString = getRgbInsideString(...backgroundRgb);
			target.style.setProperty(`--${ type }-rgb`, backgroundRgbString);
		}
		if (foregroundRgb) {
			var foregroundRgbString = getRgbInsideString(...foregroundRgb);
			target.style.setProperty(`--${ type }-foreground-rgb`, foregroundRgbString);
		}
		if (type === 'accent') {
			this.setTint(target, type, backgroundRgb, foregroundRgb);
		}
	}
	static setTint(target, type, backgroundRgb, foregroundRgb) {
		// Prevent way too bright colors to be assigned as adaptive accent
		// if given element has/is within light theme
		if (target.matches(':scope[light]') || target.matches('[light] :scope')) {
			// colors above 200 are way too bright to be on the white background
			if (this.rgbLuminance(...backgroundRgb) > 200) return;
		}
		// do not overwrite existing accent value by primary
		if (type === 'primary' && target.style.getPropertyValue(`--tint-rgb`)) {
			return;
		}
		target.style.setProperty(`--tint-rgb`, backgroundRgb);
		target.style.setProperty(`--tint-foreground-rgb`, foregroundRgb);
		// NOTE: if [accent] is changed later to something too bright like pure yellow
		// not only will it not be assigned as adaptive-tint (as expected)
		// but this code does not overwrite residual adaptive color from before
	}
	static setColor(target, backgroundRgb, foregroundRgb) {
		if (backgroundRgb) {
			var backgroundRgbString = getRgbInsideString(...backgroundRgb);
			target.style.setProperty(`--background-rgb`, backgroundRgbString);
		}
		if (foregroundRgb) {
			var foregroundRgbString = getRgbInsideString(...foregroundRgb);
			target.style.setProperty(`--foreground-rgb`, foregroundRgbString);
		}
	}

};

function getRgbInsideString(r, g, b) {
	return `${ r }, ${ g }, ${ b }`;
}
function getRgbString(r, g, b) {
	return `rgb(${ r }, ${ g }, ${ b })`;
}

function imgReady(img, callback) {
	return new Promise((resolve, reject) => {
		if (isImgLoaded(img)) {
			resolve(img);
		} else {
			function loadHandler() {
				img.removeEventListener('load', loadHandler);
				resolve(img);
			}
			img.addEventListener('load', loadHandler);
			function errorHandler() {
				img.removeEventListener('error', errorHandler);
				reject(img);
			}
			img.addEventListener('error', errorHandler);
		}
	});
}

function isImgLoaded(img) {
	return img.complete && img.naturalHeight !== 0;
}

var head = document.head;

function loadStyle(path) {
	return new Promise((resolve, reject) => {
		var element = document.createElement('link');
		element.rel = 'stylesheet';
		element.type = 'text/css';
		element.href = path;
		element.media = 'all';
		head.appendChild(element);
		element.onload = resolve;
		element.onerror = reject;
	});
}

function loadScript(path) {
	return new Promise((resolve, reject) => {
		var element = document.createElement('script');
		element.src = path;
		head.appendChild(element);
		element.onload = resolve;
		element.onerror = reject;
	});
}

function relativePath(path) {
	var split = path.split('/');
	split.pop();
	if (split.length) split.pop();else split.push('..');
	return (split.join('/') || '.') + '/';
}

var rootPath = relativePath(document.currentScript.getAttribute('src'));
var path = {
	root: rootPath,
	lib: rootPath + 'lib/',
	css: rootPath + 'css/',
	elements: rootPath + 'elements/',
	polyfills: rootPath + 'polyfills/'
};

function isLoaded(partialPath) {
	return Array.from(document.scripts).some(script => script.src.includes(partialPath));
}

// loading polyfills

function loadPolyfill(src) {
	var promise = loadScript(path.root + src);
	ganymede.awaitPromises.push(promise);
}

// core set of custom elements polyfill
if (window.customElements === undefined) {
	if (!isLoaded('polyfills/custom-elements.min.js')) loadPolyfill('polyfills/custom-elements.min.js');
	if (!isLoaded('polyfills/shadydom.min.js')) loadPolyfill('polyfills/shadydom.min.js');
}

// Edge doesn't have :scope :scope selector 
var scopePoly = false;
try {
	document.querySelector(':scope');
} catch (e) {
	scopePoly = true;
}
if (scopePoly || Element.prototype.after === undefined) if (!isLoaded('polyfills/fx-polyfill.js')) loadPolyfill('polyfills/fx-polyfill.js');

// basic Element.animate() polyfill
if (Element.prototype.animate === undefined) loadPolyfill('polyfills/web-animations.min.js');
//loadPolyfill('node_modules/web-animations-js/web-animations.min.js')

// extensions of Element.animate() to allow animation clip-path
if (!isLoaded('polyfills/animate-polyfill.js')) loadPolyfill('polyfills/animate-polyfill.js');

//console.log('loading polyfills')
Promise.all(ganymede.awaitPromises).then(() => {
	//console.log('--- polyfills-loaded')
	ganymede.emit(document, 'polyfills-loaded'); // TODO: not firing
	ganymede.emit(document, 'flexus-ready'); // TODO: not firing
});

// utility function for hot-switching theme and loading styles
function loadNeon() {
	var style = ganymede.$('[href$="flexus-material.css"]');
	var icons = ganymede.$('[href$="flexus-material-icons.css"]');
	Promise.all([loadStyle(path.css + 'flexus-neon.css'), loadStyle(path.css + 'flexus-neon-icons.css')]).then(() => {
		platform.material = false;
		platform.neon = true;
		exports.app.removeAttribute('material');
		exports.app.setAttribute('neon', '');
		if (style) style.remove();
		if (icons) icons.remove();
	});
}
function loadMaterial() {
	var style = ganymede.$('[href$="flexus-neon.css"]');
	var icons = ganymede.$('[href$="flexus-neon-icons.css"]');
	Promise.all([loadStyle(path.css + 'flexus-material.css'), loadStyle(path.css + 'flexus-material-icons.css')]).then(() => {
		platform.neon = false;
		platform.material = true;
		exports.app.removeAttribute('neon');
		exports.app.setAttribute('material', '');
		if (style) style.remove();
		if (icons) icons.remove();
	});
}
function swapDesign() {
	console.warn('TODO: flexus.swapDesign() not implemented yet');
}
function swapTheme() {
	var darks = Array.from(ganymede.$$('[dark]'));
	var lights = Array.from(ganymede.$$('[light]'));
	darks.forEach(node => {
		node.removeAttribute('dark');
		node.setAttribute('light', '');
	});
	lights.forEach(node => {
		node.removeAttribute('light');
		node.setAttribute('dark', '');
	});
}

/*
function loadRipple() {
	var styles = Array.from(document.styleSheets)
					.map(style => style.href)
					.filter(href => href && href.includes('flexus'))
	//var design = 'material'
	var design = styles.some(path => path.includes('material')) ? 'material' : 'neon'

	if (design === 'material')
		loadScript(path.elements + 'flexus-ripple.js')

	document.addEventListener('DOMContentLoaded', function() {
		document.body.setAttribute(design, '')
	})
}
*/

// unfold UWPs API
if (platform$1.uwp) {
	var ViewManagement = Windows.UI.ViewManagement;
	var uiViewSettings = ViewManagement.UIViewSettings.getForCurrentView();
	var systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
	var uiSettings = new ViewManagement.UISettings();
	var { UserInteractionMode, UIColorType } = ViewManagement;
}

function loadDesign() {
	if (platform$1.design === 'material') loadMaterial();else loadNeon();
	platform$1.designLoaded = true;
}

function loadPlatformDesign() {
	if (platform$1.windows) loadNeon();else loadMaterial();
	platform$1.designLoaded = true;
}

function detectLoadedDesign() {
	var styleSheets = Array.from(document.styleSheets);
	if (styleSheets.some(s => s.href && s.href.includes('material'))) {
		platform$1.material = true;
		platform$1.design = 'material';
		platform$1.designLoaded = true;
	} else if (styleSheets.some(s => s.href && s.href.includes('neon'))) {
		platform$1.neon = true;
		platform$1.design = 'neon';
		platform$1.designLoaded = true;
	}
}

function detectNodeDesign(node) {
	if (node.hasAttribute('material')) {
		platform$1.material = true;
		platform$1.design = 'material';
	} else if (node.hasAttribute('neon')) {
		platform$1.neon = true;
		platform$1.design = 'neon';
	}
}

function detectTheme(node) {
	if (node.hasAttribute('light')) {
		platform$1.theme = 'light';
	} else if (node.hasAttribute('dark')) {
		platform$1.theme = 'dark';
	}
}

function applyDesignAttrs() {
	if (platform$1.neon) {
		exports.app.setAttribute('neon', '');
		exports.app.removeAttribute('material');
	} else {
		exports.app.setAttribute('material', '');
		exports.app.removeAttribute('neon');
	}
}

function applyThemeAttrs() {
	if (platform$1.theme === 'dark') {
		exports.app.setAttribute('dark', '');
		exports.app.removeAttribute('light');
	} else {
		exports.app.setAttribute('light', '');
		exports.app.removeAttribute('dark');
	}
}

// reads 'platform.primary' value which could be either #hex value or name from palette
// if its hex  -> applies the hex to CSS properties
// if its rgb  -> calculates hex from it, applies the hex to CSS properties
// if its name -> calculates hex from it
// then applies hex color to <meta> theme tag (for android chrome)
function applyPrimary(fromNode = exports.app) {
	if (!platform$1.primary) return;
	var hex = iridescent.hex(platform$1.primary);
	if (hex) {
		applyHexColorToNode(exports.app, 'primary', hex);
	} else {
		var computed = getComputedStyle(fromNode);
		var color = computed.getPropertyValue('--primary');
		hex = iridescent.hex(color);
	}
	if (hex) iridescent.meta = hex;
}

// TODO - make this work with --tint
function applyHexColorToNode(node, type, color) {
	color = color || node.getAttribute(type);
	if (color.includes(',')) {
		var backgroundRgb = iridescent.rgbStrip(color);
	} else {
		var backgroundRgb = iridescent.hexToRgb(color);
	}
	var foregroundRgb = iridescent.rgbForeground(...backgroundRgb);
	// Set [primary="custom"] or [accent="custom"] to handle custom colors properly and
	// assign css custom properties with given color and its computed foreground counterpart
	iridescent.setTypedColor(node, type, backgroundRgb, foregroundRgb);
}

function detectUwpTheme() {
	var bg = uiSettings.getColorValue(UIColorType.background);
	var isDark = bg.r + bg.g + bg.b < 382;
	platform$1.theme = isDark ? 'dark' : 'light';
	console.log('detectUwpTheme', platform$1.theme);
}

function detectUwpColor() {
	// note: UWP only uses single color with name 'accent', it'll be used as the primary for flexus
	var color = uiSettings.getColorValue(UIColorType.accent);
	platform$1.primary = `${ color.r },${ color.g },${ color.b }`;
}

// detect implicitly defined CSS files
if (!platform$1.design) detectLoadedDesign();
// load CSS if none was loaded, but defined through JS object
if (platform$1.design && !platform$1.designLoaded) loadDesign();

appElementReady.then(app$$1 => {

	var body = document.body;

	// import design if none was included
	if (!platform$1.designLoaded) {
		// find out what style user wants to load
		if (!platform$1.design) detectNodeDesign(app$$1);
		if (!platform$1.design && body !== app$$1) detectNodeDesign(body);
		// load some style but only in non-restrictive (non-cs)p environments
		if (!platform$1.csp) {
			if (platform$1.design) loadDesign();else loadPlatformDesign();
		}
	}
	applyDesignAttrs();

	if (!platform$1.theme) detectTheme(app$$1);
	if (!platform$1.theme && body !== app$$1) detectTheme(body);
	if (!platform$1.theme) {
		if (platform$1.uwp) {
			detectUwpTheme();
			uiSettings.addEventListener('colorvalueschanged', e => {
				detectUwpTheme();
				applyThemeAttrs();
			});
		}
	}
	applyThemeAttrs();

	var primaryElement;
	if (!platform$1.primary) {
		platform$1.primary = app$$1.getAttribute('primary');
		primaryElement = app$$1;
	}
	if (!platform$1.primary && body !== app$$1) {
		platform$1.primary = body.getAttribute('primary');
		primaryElement = body;
	}
	if (!platform$1.primary) {
		if (iridescent.meta) {
			platform$1.primary = iridescent.meta;
		} else if (platform$1.uwp) {
			detectUwpColor();
			uiSettings.addEventListener('colorvalueschanged', e => {
				detectUwpColor();
				applyPrimary();
			});
		}
	}
	applyPrimary(primaryElement);

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
});

// TODO - make this work with --tint
// apply custom primary colors defined by hex in attribute [primary]
Array.from(document.querySelectorAll('[primary^="#"]')).forEach(node => {
	applyHexColorToNode(node, 'primary');
});

// TODO - make this work with --tint and calculate 
// apply custom accent colors defined by hex in attribute [accent]
Array.from(document.querySelectorAll('[accent^="#"]')).forEach(node => {
	applyHexColorToNode(node, 'accent');
});

var effectSuppresion = {
	batteryLevel: 20,
	minCpuCores: 2
};

var batteryWise = false;
var cpuWise = navigator.hardwareConcurrency < effectSuppresion.minCpuCores;

function update() {
	if (batteryWise || cpuWise) {
		console.log('TODO: disable effects');
		exports.app.setAttribute('noeffects', '');
	} else {
		console.log('TODO: enable effects');
		exports.app.removeAttribute('noeffects');
	}
}

function batteryUpdated(level, charging) {
	batteryWise = !charging && level <= effectSuppresion.batteryLevel;
	update();
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
if (platform$1.web && navigator.getBattery) {
	appElementReady.then(navigator.getBattery()).then(battery => {
		var check = () => batteryUpdated(battery.level, battery.charging);
		battery.addEventListener('chargingchange', check);
		battery.addEventListener('levelchange', check);
	});
}

/*
// create and inject multipurpose overlay
export var overlay = document.createElement('div')
overlay.id = 'fx-overlay'
document.addEventListener('DOMContentLoaded', e => {
	document.body.insertBefore(overlay, document.body.childNodes[0])
})
*/

// creates <style> for adding additional custom rules of imported elements 
var styleEl = document.createElement('style');
styleEl.id = 'fx-addon-styles';
document.head.appendChild(styleEl);
var styleSheet = styleEl.sheet;

function addReadyAnimation(tagName) {
	styleSheet.addRule(`${ tagName }:not([ready])`, 'opacity: 0 !important', 0);
	styleSheet.addRule(`${ tagName }[ready]`, 'animation: 200ms fadein', 0);
}

// traverse node's parents until condition is met
function traverse(startNode, condition) {
	var node = startNode;
	while (node != null) {
		if (condition(node)) break;
		node = node.parentElement;
	}
	return node;
}
function traverseValue(startNode, condition) {
	var node = startNode;
	var result;
	while (node) {
		result = condition(node);
		if (result !== undefined && result !== null) return result;
		node = node.parentElement;
	}
}

function runAll(array) {
	for (var i = 0; i < array.length; i++) array[i]();
}

function clamp(num, min, max) {
	return num < min ? min : num > max ? max : num;
}

function mapRange(num, in_min, in_max, out_min, out_max) {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function isTouchEvent(e) {
	if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return true;
	if (e.pointerType && e.pointerType == 'touch') return true;
	return false;
}

if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
		var matches = (this.document || this.ownerDocument).querySelectorAll(s);
		var i = matches.length;
		while (--i >= 0 && matches.item(i) !== this) {}
		return i > -1;
	};
}

// todo: deprecate?
function draggable(ClassOrElement, name = '', handlersSource = ClassOrElement, bindingTarget = handlersSource, orientation = 'horizontal') {
	var handlers = name instanceof Array ? name : [`on${ name }DragStart`, `on${ name }DragMove`, `on${ name }DragEnd`];

	if (ClassOrElement instanceof Element) {
		// This means drggable used as a function (in some element created/ready callback or something)
		// and is used to handle dragging shadow dom sub element. Name as well as source was given 
		//handlersSource = ClassOrElement
		attachToInstance.call(ClassOrElement);
		// todo. make function like scheduleEvent but for non custom elements (sub elements in shadow tree) - because of killbacks
	} else {
		// This branch means draggable is used as class decorator to add general pointer handler.
		// methods come from Class prototype and will be bound and attached to element
		handlersSource = ClassOrElement.prototype;
		ganymede.scheduleEvent(ClassOrElement, 'created', attachToInstance);
	}

	function attachToInstance() {
		var startHandler, moveHandler, endHandler;
		var bindTo = bindingTarget || this;
		if (handlersSource[handlers[0]]) startHandler = handlersSource[handlers[0]].bind(bindTo);
		if (handlersSource[handlers[1]]) moveHandler = handlersSource[handlers[1]].bind(bindTo);
		if (handlersSource[handlers[2]]) endHandler = handlersSource[handlers[2]].bind(bindTo);

		// touch-action tells browser what direction is not handled by JS and is left to browser to handle
		if (orientation === 'vertical') {
			// browser natively scrolls X axis and JS consumes and takes care of Y axis events
			this.setAttribute('touch-action', 'pan-x');
		} else if (orientation === 'horizontal') {
			// browser natively scrolls Y axis and JS consumes and takes care of X axis events
			this.setAttribute('touch-action', 'pan-y');
		}

		this.addEventListener('pointerdown', onDragStart);
		bindTo.registerKillback(() => this.removeEventListener('pointerdown', onDragStart));

		function onDragStart(e) {
			e.stopPropagation();
			if (e.pointerType == 'mouse') e.preventDefault();
			document.addEventListener('pointermove', onDragMove);
			document.addEventListener('pointerup', onDragEnd);
			document.addEventListener('pointercancel', onDragEnd);
			if (startHandler) startHandler(e);
		}
		function onDragMove(e) {
			e.stopPropagation();
			e.preventDefault();
			if (moveHandler) moveHandler(e);
		}
		function onDragEnd(e) {
			e.stopPropagation();
			e.preventDefault();
			document.removeEventListener('pointermove', onDragMove);
			document.removeEventListener('pointerup', onDragEnd);
			document.removeEventListener('pointercancel', onDragEnd);
			if (endHandler) endHandler(e);
		}
	}
}

function pythagorean(a, b) {
	return Math.sqrt(a * a + b * b);
}

function durationByDistance(distance) {
	// 200 + 13x^0.5
	//return 200 + 12 * Math.sqrt(distance)
	return 100 + 11 * Math.sqrt(distance) || 0;
}

function eventPositionInContainer(e, container) {
	var containerBbox = container.getBoundingClientRect();
	var x = e.x - containerBbox.left;
	var y = e.y - containerBbox.top;
	var width = containerBbox.width;
	var height = containerBbox.height;
	//console.log(x, y, width, height)
	if (x > width) x = width;
	if (y > height) y = height;
	//console.log(x, y, width, height)
	return { x, y, width, height };
}
function nodePositionInContainer(node, container) {
	var nodeBbox = node.getBoundingClientRect();
	var containerBbox = container.getBoundingClientRect();
	var x = nodeBbox.left - containerBbox.left + nodeBbox.width / 2;
	var y = nodeBbox.top - containerBbox.top + nodeBbox.height / 2;
	var width = containerBbox.width;
	var height = containerBbox.height;
	if (x > width) x = width;
	if (y > height) y = height;
	return { x, y, width, height };
}

var animation = {

	durationByDistance,

	circle: {

		_calculate(element, from) {
			//var x = e.layerX
			//var y = e.layerY
			var position;
			if (typeof from === 'string') {
				position = from;
				var x = 0;
				var y = 0;
				var width = element.offsetWidth;
				var height = element.offsetHeight;
			} else if (from instanceof Element) {
				var { x, y, width, height } = nodePositionInContainer(from, element);
				position = `${ x }px ${ y }px`;
			} else if (from instanceof Event) {
				var { x, y, width, height } = eventPositionInContainer(from, element);
				position = `${ x }px ${ y }px`;
			}
			var a = x > width / 2 ? x : width - x;
			var b = y > height / 2 ? y : height - y;
			// distance to the furthest corner
			var distance = pythagorean(a, b);
			return { position, distance };
		},

		_setup(element, from, duration) {
			if (from) {
				var { position, distance } = this._calculate(element, from);
			} else {
				var position = 'center';
				var distance = pythagorean(element.offsetWidth, element.offsetHeight);
			}
			if (!duration) duration = durationByDistance(distance);
			return { position, distance, duration };
		},

		show(element, from, duration) {
			//console.log('from', from)
			var { position, distance, duration } = this._setup(element, from, duration);
			//console.log('position', position)
			//console.log('distance', distance)
			//console.log('duration', duration)
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
			element.style.visibility = '';
			var finished = element.animate([{ clipPath: `circle(0px at ${ position })` }, { clipPath: `circle(${ distance }px at ${ position })` }], {
				duration,
				easing: 'ease-in-out'
			}).finished;
			return finished;
		},

		hide(element, from, duration) {
			var { position, distance, duration } = this._setup(element, from, duration);
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
			var finished = element.animate([{ clipPath: `circle(${ distance }px at ${ position })` }, { clipPath: `circle(0px at ${ position })` }], {
				duration,
				easing: 'ease-in-out'
			}).finished;
			finished.then(() => element.style.visibility = 'hidden');
			return finished;
		}

	},

	fade: {

		in(element, duration = 140) {
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
			element.style.visibility = '';
			return element.animate([{ opacity: 0 }, { opacity: 1 }], duration).finished;
		},

		out(element, duration = 140) {
			var finished = element.animate([{ opacity: 1 }, { opacity: 0 }], duration).finished;
			finished.then(() => element.style.visibility = 'hidden');
			return finished;
		}
	},

	slideIn: {

		left(element) {
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
			element.style.visibility = '';
			var animation = element.animate([{ opacity: 0, transform: 'translate3d(10%,0,0)' }, { opacity: 1, transform: 'translate3d(0%,0,0)' }], {
				duration: 100, // ???
				easing: 'ease-out' // ???
			});
			return animation.finished;
		},

		right(element) {
			// reset display from hidden to previous.
			// empty string gets default css value (could be flex) rather than block
			element.style.visibility = '';
			var animation = element.animate([{ opacity: 0, transform: 'translate3d(-10%,0,0)' }, { opacity: 1, transform: 'translate3d(0%,0,0)' }], {
				duration: 100, // ???
				easing: 'ease-out' // ???
			});
			return animation.finished;
		}

	},

	slideOut: {

		left(element) {
			var animation = element.animate([{ opacity: 1, transform: 'translate3d(0%,0,0)' }, { opacity: 0, transform: 'translate3d(-10%,0,0)' }], {
				duration: 100, // ???
				easing: 'ease-out' // ???
			});
			animation.finished.then(() => element.style.visibility = 'hidden');
			return animation.finished;
		},

		right(element) {
			var animation = element.animate([{ opacity: 1, transform: 'translate3d(0%,0,0)' }, { opacity: 0, transform: 'translate3d(10%,0,0)' }], {
				duration: 100, // ???
				easing: 'ease-out' // ???
			});
			animation.finished.then(() => element.style.visibility = 'hidden');
			return animation.finished;
		}

	},

	rotateIcon: {

		show(element) {
			_.forEach(element.children, element => {
				if (element.localName == 'button' && element.hasAttribute('icon')) {
					anim(element);
				}
			});
			function anim(element) {
				element.animate([{ transform: 'rotate(-180deg)' }, { transform: 'rotate(0deg)' }], {
					duration: 300,
					easing: 'ease-in-out'
				});
			}
		},

		hide(element) {
			_.forEach(element.children, element => {
				if (element.localName == 'button' && element.hasAttribute('icon')) {
					anim(element);
				}
			});
			function anim(element) {
				element.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)' }], {
					duration: 300,
					easing: 'ease-in-out'
				});
			}
		}

	},

	swapContent(element, distance = 16, duration = 240) {
		var halfDuration = duration / 2;
		var visibleState = {
			opacity: 1,
			transform: `translate3d(0px, 0, 0)`
		};
		var slideOutState = {
			opacity: 0,
			transform: `translate3d(${ -distance }px, 0, 0)`
		};
		var slideInState = {
			opacity: 0,
			transform: `translate3d(${ distance }px, 0, 0)`
		};
		element.style.transitionDelay = duration + 'ms';
		return new Promise(resolve => {
			element.animate([visibleState, slideOutState], halfDuration).onfinish = () => {
				resolve();
				element.style.transitionDelay = '';
				element.style.transition = 'none';
				element.animate([slideInState, visibleState], halfDuration).onfinish = () => {
					element.style.transition = '';
				};
			};
		});
	},

	slideX: {
		show(element, from, to, duration, easing) {
			element.style.display = '';
			element.animate([{
				transform: `translate3d(${ from }, 0px, 0)`
			}, {
				transform: `translate3d(${ to }, 0px, 0)`
			}], duration);
		},
		hide(element, from, to, duration, easing) {
			element.animate([{
				transform: `translate3d(${ from }, 0px, 0)`
			}, {
				transform: `translate3d(${ to }, 0px, 0)`
			}], duration).onfinish = e => {
				element.style.display = 'none';
			};
		}
	},

	// experimental
	transition(element, values, keep, duration) {
		var from = {};
		var to = {};
		for (let key in values) {
			from[key] = values[key][0];
			to[key] = values[key][1];
		}
		if (typeof duration !== 'number') {
			if (duration === undefined) var prop = Object.keys(values)[0];else var prop = duration;
			var distance = Math.abs(parseInt(from[prop]) - parseInt(to[prop]));
			duration = durationByDistance(distance);
		}
		var player = element.animate([from, to], {
			duration,
			easing: 'ease-in-out'
		});
		if (keep) player.finished.then(() => {
			for (let key in to) {
				element.style[key] = to[key];
			}
		});
		return player.finished;
	}

};

if (window.ResizeObserver) {
	var ro = new ResizeObserver(entries => {
		for (let entry of entries) {
			if (entry.target.onresize) entry.target.onresize(entry);
			if (entry.target.onResize) entry.target.onResize(entry);
		}
	});
}

function setupWatchElement(element) {
	var obj = document.createElement('object');
	obj.type = 'text/html';
	obj.data = 'about:blank';
	obj.style.display = 'block';
	obj.style.position = 'absolute';
	obj.style.top = 0;
	obj.style.right = 0;
	obj.style.bottom = 0;
	obj.style.left = 0;
	obj.style.height = '100%';
	obj.style.width = '100%';
	obj.style.overflow = 'hidden';
	obj.style.pointerEvents = 'none';
	obj.style.zIndex = -1;
	element.style.position = 'relative';
	element.appendChild(obj);
	return obj;
}

function watchElement(obj, listener) {
	obj.onload = e => {
		obj.contentDocument.defaultView.addEventListener('resize', listener);
		//obj.contentDocument.defaultView.addEventListener('resize', e => {
		//	if (resizeRAF) cancelAnimationFrame(resizeRAF)
		//	resizeRAF = requestAnimationFrame(listener)
		//})
	};
	return () => obj.contentDocument.defaultView.removeEventListener('resize', listener);
}

var resizeRAF;
function diyDetector(target, listener) {
	var object;
	var watchesGlobalResize;
	var listenTarget;
	function resizeCallback() {
		console.log('resize');
		if (resizeRAF) cancelAnimationFrame(resizeRAF);
		resizeRAF = requestAnimationFrame(listener);
	}
	function listenObjectView() {
		listenTarget = object.contentDocument.defaultView;
		listenTarget.addEventListener('resize', resizeCallback);
	}
	function start() {
		if (target.offsetWidth === window.innerWidth) {
			watchesGlobalResize = true;
			listenTarget = window;
			listenTarget.addEventListener('resize', resizeCallback);
		} else if (watchesGlobalResize === undefined) {
			// Target element is not the exact width of window and custom inset object is used (for the first time).
			watchesGlobalResize = false;
			object = setupWatchElement(target);
			object.onload = listenObjectView;
		} else if (watchesGlobalResize === false) {
			// Target element is not the exact width of window and custom inset object is used (repeatedly).
			watchesGlobalResize = false;
			listenObjectView();
		}
	}

	start();
	document.addEventListener('formfactor-update', e => {
		console.log('formfactor-update');
		listenTarget.removeEventListener('resize', resizeCallback);
		start();
	});
}

function setupDetector(target) {
	if (window.ResizeObserver) {
		ro.observe(target);
		//ro.unobserve(target)
	} else {
		diyDetector(target, () => {
			//console.log('resize')
		});
	}
}

function resizeDetector(ClassOrCondition) {
	var condition;
	function init(Class) {
		ganymede.scheduleEvent(Class, 'created', function () {
			if (condition && !condition(this)) return;
			setupDetector(this);
		});
	}
	if (ClassOrCondition.name) {
		init(ClassOrCondition);
	} else {
		condition = ClassOrCondition;
		return init;
	}
}

function rafThrottle(callback) {
	var latestArg;
	var running = false;
	function run() {
		running = false;
		callback(latestArg);
	}
	return arg => {
		if (running === true) return;
		running = true;
		latestArg = arg;
		requestAnimationFrame(run);
	};
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

function _initDefineProp(target, property, descriptor, context) {
	if (!descriptor) return;
	Object.defineProperty(target, property, {
		enumerable: descriptor.enumerable,
		configurable: descriptor.configurable,
		writable: descriptor.writable,
		value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
	});
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

function _initializerWarningHelper(descriptor, context) {
	throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var screensizes = ['s', 'm', 'l'];

const SMALL = 's';
const MEDIUM = 'm';
const LARGE = 'l';

const SCREENSIZE = { SMALL, MEDIUM, LARGE };

var screenSizeFlags = {
	s: 0b001,
	m: 0b010,
	l: 0b100,
	gts: 0b110,
	ltl: 0b011
};

function matchFormFactorDef(def) {
	if (screenSizeFlags[def] === undefined) {
		// custom value applicable for all formfactors
		return true;
	} else {
		// query to enable only for certain formfactors
		def = screenSizeFlags[def];
		var ss = screenSizeFlags[platform$1.screensize];
		return (def & ss) > 0;
	}
}

// helpers for transforming numbers into breakpoint queries
var makeFirstQuery = value => `(max-width: ${ value }px)`;
var makeLastQuery = value => `(min-width: ${ value }px)`;
var makeStepQuery = (a, b) => `${ makeLastQuery(a) } and ${ makeFirstQuery(b) }`;

// transorms array of breakpoint numbers into queries describing these breakpoints
function makeBreakpointQueries(breakpoints) {
	//breakpoints = breakpoints.map(Number)
	breakpoints = breakpoints.map(num => parseInt(num)).filter(num => num); // for now just filter out empty breakpoints
	var queries = [makeFirstQuery(breakpoints[0])];
	var lastIndex = breakpoints.length - 1;
	if (lastIndex > 0) {
		for (var i = 0; i < lastIndex; i++) queries.push(makeStepQuery(breakpoints[i], breakpoints[i + 1]));
	}
	queries.push(makeLastQuery(breakpoints[lastIndex]));
	return queries;
}

function registerQueries(queries, onAlways, onUpdate, attrName, attrValues = []) {
	return queries.map((query, i) => {
		return registerQuery(query, onAlways, onUpdate, attrName, attrValues[i], i);
	});
}

function registerQuery(query, onAlways, onUpdate, attrName, attrValue = '', i = -1) {
	var mql = window.matchMedia(query);
	var listener = () => {
		onAlways(mql, i);
		onUpdate(mql, i);
	};
	var killback = () => mql.removeListener(listener);
	mql.addListener(listener);
	mql.attrName = attrName;
	mql.attrVal = attrValue;
	onAlways(mql, i);
	return killback;
}

var documentReady = false;
var htmlNode;
ganymede__default.ready.then(() => {
	documentReady = true;
	htmlNode = document.body.parentElement;
	htmlNode.setAttribute('screensize', platform$1.screensize);
	if (platform$1.portrait) htmlNode.setAttribute('portrait', '');
	if (platform$1.landscape) htmlNode.setAttribute('landscape', '');
});
function applyQuery(mql, i) {
	// assigns true or false and given attribute value if mql matches
	if (mql.matches) {
		if (mql.attrVal) platform$1[mql.attrName] = mql.attrVal;else platform$1[mql.attrName] = mql.matches;
		if (documentReady) htmlNode.setAttribute(mql.attrName, mql.attrVal);
	} else if (!mql.attrVal) {
		platform$1[mql.attrName] = mql.matches;
		if (documentReady) htmlNode.removeAttribute(mql.attrName);
	}
}

var debounceMap = new Map();
// warning: very naive implementation for single event type.
//          add some memory to store events in (and prevent duplicates) if used broadly
function debounceEmit(target, eventName) {
	var debounceTimeout = debounceMap.get(eventName);
	clearTimeout(debounceTimeout);
	debounceTimeout = setTimeout(() => {
		ganymede.emit(target, eventName);
		//console.log('emit', eventName)
	}, 50);
	//console.log('debounceEmit set', eventName, debounceTimeout)
	debounceMap.set(eventName, debounceTimeout);
}

function emitUpdateScreensize() {
	//console.log('emitUpdateScreensize')
	debounceEmit(document, 'screensize-update');
	debounceEmit(document, 'formfactor-update');
}
function emitUpdateOrientation() {
	//console.log('emitUpdateOrientation')
	debounceEmit(document, 'orientation-update');
	debounceEmit(document, 'formfactor-update');
}

function setupLocalBreakpointQueries(element, onAlways, onUpdate, attrName, attrValues) {
	var computed = getComputedStyle(element);
	var sm = computed.getPropertyValue('--breakpoint-s-m');
	var ml = computed.getPropertyValue('--breakpoint-m-l');
	var breakpoints = [sm, ml];
	var queries = makeBreakpointQueries(breakpoints);
	return registerQueries(queries, onAlways, onUpdate, attrName, attrValues);
}

// setup core screensize queries
setupLocalBreakpointQueries(document.documentElement, applyQuery, emitUpdateScreensize, 'screensize', screensizes);
//setupLocalBreakpointQueries(document.body, applyQuery, emitUpdateScreensize, 'screensize', screensizes)
// setup additional orientation queries
registerQuery('(orientation: portrait)', applyQuery, emitUpdateOrientation, 'portrait');
registerQuery('(orientation: landscape)', applyQuery, emitUpdateOrientation, 'landscape');
// inform other code relying on formfactor about the update

ganymede__default.ready.then(() => {
	ganymede.emit(document, 'formfactor-update');
});

let Breakpointable = SuperClass => {
	var _desc, _value, _class, _descriptor;

	return _class = class _class extends SuperClass {

		constructor() {
			super();
			//console.log('constructor', this)

			_initDefineProp(this, 'breakpointState', _descriptor, this);

			var applyQuery = (mql, i) => {
				if (!mql.matches) return;
				//console.log('breakpoint', screensizes[i])
				this.breakpointState = screensizes[i];
			};
			var emitUpdate = (mql, i) => {
				if (!mql.matches) return;
				this.emit('breakpoint', screensizes[i]);
			};
			var killbacks = setupLocalBreakpointQueries(this, applyQuery, emitUpdate);
			killbacks.forEach(this.registerKillback);
		}

	}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'breakpointState', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Number;
		}
	})), _class;
};

Breakpointable.SMALL = Breakpointable.S = SMALL;
Breakpointable.MEDIUM = Breakpointable.M = MEDIUM;
Breakpointable.LARGE = Breakpointable.L = LARGE;

/*
	// number of max reached states
	statesCount = 1
	@reflect breakpoint = ''

	constructor() {
		super()
		if (this.breakpoint)
			this._setupBreapointQueries()
		else
			this._processBreapointQueries(getCssBreakpoints(this))
	}

	//@observe('breakpoint')
	_setupBreapointQueries() {
		if (!this.breakpoint) return
		var breakpoints = String(this.breakpoint).match(/\d+/g)
		if (!breakpoints) return
		this._processBreapointQueries(breakpoints)
	}
	_processBreapointQueries(breakpoints) {
		console.log(breakpoints)
		console.log(makeBreakpointQueries(breakpoints))
		var handleQuery = (mql, i) => {
			if (!mql.matches) return
			this.breakpointState = i
			this.emit('breakpoint', i)
		}
		var queries = makeBreakpointQueries(breakpoints)
		this.statesCount = queries.length
		queries
			.map(query => window.matchMedia(query))
			.forEach((mql, i) => {
				if (mql.matches)
					this.breakpointState = i
				var listener = mql => handleQuery(mql, i)
				mql.addListener(listener)
				this.registerKillback(() => mql.removeListener(listener))
			})
	}
*/

function _initDefineProp$1(target, property, descriptor, context) {
	if (!descriptor) return;
	Object.defineProperty(target, property, {
		enumerable: descriptor.enumerable,
		configurable: descriptor.configurable,
		writable: descriptor.writable,
		value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
	});
}

function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

function _initializerWarningHelper$1(descriptor, context) {
	throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

const TOP = -1;
const RIGHT = 1;
const BOTTOM = 1;
const LEFT = -1;
const NO_DIR = 0;

let Draggable = SuperClass => {
	var _dec, _desc, _value, _class, _descriptor, _descriptor2, _class2, _temp2;

	return _dec = ganymede.once('ready'), (_class = (_temp2 = _class2 = class _class extends SuperClass {
		constructor(...args) {
			var _temp;

			return _temp = super(...args), _initDefineProp$1(this, 'draggable', _descriptor, this), _initDefineProp$1(this, 'dragOrientation', _descriptor2, this), this.dragThresholdDisable = false, this.dragThreshold = 0.15, this.dragPercentage = 0, this.dragDirMod = NO_DIR, _temp;
		}
		//@reflect dragOrientation = 'vertical'


		// threshold

		// current position percentage

		// direction from center (from percentage 1) in the drag is available


		setupDraggableDirection() {
			this.dragUp = this.dragUp || this.top || this.hasAttribute('top');
			this.dragRight = this.dragRight || this.right || this.hasAttribute('right');
			this.dragDown = this.dragDown || this.bottom || this.hasAttribute('bottom');
			this.dragLeft = this.dragLeft || this.left || this.hasAttribute('left');
			if (this.dragUp) this.dragDirMod = TOP;
			if (this.dragRight) this.dragDirMod = RIGHT;
			if (this.dragDown) this.dragDirMod = BOTTOM;
			if (this.dragLeft) this.dragDirMod = LEFT;
			if (!this.dragOrientation) {
				if (this.dragRight || this.dragLeft) this.dragOrientation = 'horizontal';else if (this.dragUp || this.dragDown) this.dragOrientation = 'vertical';
			}
		}

		//@once('beforeready')

		setupDraggable() {
			//console.log('setupDraggable', this.dragPercentage, this.hidden, this)
			this.setupDraggableDirection();
			if (!this.dragOrientation) return;
			this.setupDraggableHandlers();
			if (!this.dragThresholdDisable) this.setupDraggableThreshold();
			//this.setupWheel()
			this.dragRender();
		}

		setupDraggableThreshold() {
			this.on('drag-start', e => {
				if (this.dragPercentage === 0) this.dragThresholdTarget = this.dragThreshold;else this.dragThresholdTarget = this.dragPercentage - this.dragThreshold;
			});
			this.on('drag-end', e => {
				if (!this.dragMoved) return;
				if (this.dragPercentage > this.dragThresholdTarget) this.emit('show');else this.emit('hide');
			});
		}

		///////////////////////////////////////////////////////////////////////////
		///////////////////////////// EVENT LISTENERS /////////////////////////////
		///////////////////////////////////////////////////////////////////////////


		setupDraggableHandlers() {
			this.addEventListener('pointerdown', this.onDragStart);
			this.registerKillback(() => this.removeEventListener('pointerdown', this.onDragStart));
		}

		onDragStart(e) {
			// only continue if can drag
			if (!this.draggable) return;
			//if (!this.dragOrientation) return
			// default event handling and attaching following listeners
			e.stopPropagation();
			//if (e.pointerType == 'mouse')
			//	e.preventDefault()
			this.dragSkipFirstMoveBeforeCancel = true;
			document.addEventListener('pointercancel', this.onDragEnd);
			document.addEventListener('pointermove', this.onDragMove);
			document.addEventListener('pointerup', this.onDragEnd);
			this.dragStartHandler(e);
		}
		onDragMove(e) {
			// default event handling
			e.stopPropagation();
			if (this.dragSkipFirstMoveBeforeCancel) return this.dragSkipFirstMoveBeforeCancel = false;
			this.dragMoveHandler(e);
		}
		onDragEnd(e) {
			// default event handling
			e.stopPropagation();
			//e.preventDefault()
			document.removeEventListener('pointercancel', this.onDragEnd);
			document.removeEventListener('pointermove', this.onDragMove);
			document.removeEventListener('pointerup', this.onDragEnd);
			this.dragEndHandler(e);
		}

		///////////////////////////////////////////////////////////////////////////
		///////////////////////// MUNIPULATION & RENDERING ////////////////////////
		///////////////////////////////////////////////////////////////////////////


		getDragDistance() {
			if (this.dragOrientation === 'horizontal') return this.offsetWidth;else if (this.dragOrientation === 'vertical') return this.offsetHeight;
		}
		getDragPosition(e) {
			if (this.dragOrientation === 'horizontal') return e.x;else if (this.dragOrientation === 'vertical') return e.y;
		}

		dragStartHandler(e) {
			// individual code
			this.totalDistance = this.getDragDistance();
			// horizontal code
			this.initDragPosition = this.getDragPosition(e);
			// shared code
			this.dragMoved = false;
			this.dragInitPercentage = this.dragPercentage;
			// show [dragging] attribute for elements to suppres transitions, etc...
			this.setAttribute('dragging', '');
			this.emit('drag-start');
		}
		dragMoveHandler(e) {
			//e.preventDefault()
			// only continue if can drag
			//if (!this.dragOrientation) return
			var dragged = this.getDragPosition(e) - this.initDragPosition;
			// move events gets fired even though move didnt happen
			if (dragged !== 0) this.dragMoved = true;
			//var percentage = this.dragInitPercentage - (dragged / this.totalDistance)
			var percentage = this.dragInitPercentage - dragged / this.totalDistance * this.dragDirMod;
			this.dragPercentage = clamp(percentage, 0, 1);
			//this.dragPercentage = clamp(percentage, this.dragClampMin, this.dragClampMax)
			this.dragRender(this.dragPercentage);
			this.emit('drag', this.dragPercentage);
		}
		dragEndHandler(e) {
			// only continue if can drag
			//if (!this.dragOrientation) return
			// remove [dragging] attribute for elements to reenable transitions, etc...
			this.removeAttribute('dragging');
			this.emit('drag-end');
		}

		//@on('drag')
		dragRender(percentage = this.dragPercentage) {
			var value = (1 - percentage) * this.dragDirMod * 100;
			//console.log('dragRender', value, percentage, this.dragPercentage, this.hidden, this.visible, this)
			this._dragRender(value);
		}
		_dragRender(value) {
			if (this.dragOrientation === 'horizontal') this._dragRenderHorizontal(value);else this._dragRenderVertical(value);
		}
		_dragRenderHorizontal(value) {
			this.style.transform = `translate3d(${ value }%, 0px, 0)`;
		}
		_dragRenderVertical(value) {
			this.style.transform = `translate3d(0px, ${ value }%, 0)`;
		}

		///////////////////////////////////////////////////////////////////////////
		////////////////////////// MOUSEWHEEL EXPERIMENT //////////////////////////
		///////////////////////////////////////////////////////////////////////////


		/*
  	@observe('draggable')
  	setupWheel() {
  		if (this.draggable && this.dragByWheel && !this.dragWheelListening) {
  			this.attachWheel()
  		} else {
  			this.detachWheel()
  		}
  	}
  
  	// stand in for PAN-UP/PAN-DOWN to close fom touch devices to wheel
  	@reflect dragByWheel = true
  	dragWheelListening = false
  	attachWheel() {
  		console.log('&&& attachWheel')
  		if (this.dragWheelListening) return
  		var name = 'mousewheel'// 'DOMMouseScroll'
  		this.addEventListener('mousewheel', this.onWheel)
  		console.log('attached')
  	}
  	detachWheel() {
  		if (!this.dragWheelListening) return
  		var name = 'mousewheel'// 'DOMMouseScroll'
  		this.removeEventListener('mousewheel', this.onWheel, {passive: true})
  	}
  	_wheelTimeout
  	wheelPristine = true
  	wheelTimeout = 100
  	wheelDragged = 0
  	@autobind onWheel(e) {
  		//var scrolled = e.wheelDeltaY
  		this.wheelDragged += e.wheelDeltaY
  		var scrolled = this.wheelDragged
  		console.log('', scrolled, '|', this.canDragDown, this.isScrolledToTop, scrolled >= 0, '|', this.canDragUp, this.isScrolledToBottom, scrolled <= 0)
  		if ((this.canDragDown && this.isScrolledToTop    && scrolled >= 0)
  		||  (this.canDragUp   && this.isScrolledToBottom && scrolled <= 0)) {
  			e.preventDefault()
  			e.stopPropagation()
  		} else {
  			return
  		}
  		// mousewheel events dont have start/move/end, so we have to figure out
  		// ourself through timeouts
  		clearTimeout(this._wheelTimeout)
  		this._wheelTimeout = setTimeout(this.onWheelTimeout, this.wheelTimeout)
  		if (this.wheelPristine) {
  			this.wheelPristine = false
  			this.wheelStartHandler(e)
  		} else {
  			this.wheelMoveHandler(e)
  		}
  	}
  	@autobind onWheelTimeout() {
  		this.wheelPristine = true
  		this.wheelEndHandler()
  	}
  
  	wheelStartHandler(e) {
  		// individual code
  		this.totalDistance = this.getDragDistance()
  		// horizontal code
  		//this.initDragPosition = this.getDragPosition(e)
  		// shared code
  		this.dragMoved = false
  		this.dragInitPercentage = this.dragPercentage
  		// show [dragging] attribute for elements to suppres transitions, etc...
  		this.setAttribute('dragging', '')
  		this.emit('drag-start')
  	}
  	wheelMoveHandler(e) {
  		//e.preventDefault()
  		// only continue if can drag
  		//if (!this.dragOrientation) return
  		var dragged = this.wheelDragged
  		console.log('dragged', dragged)
  		//var dragged = this.getDragPosition(e) - this.initDragPosition
  		// move events gets fired even though move didnt happen
  		if (dragged !== 0)
  			this.dragMoved = true
  		//var percentage = this.dragInitPercentage - (dragged / this.totalDistance)
  		var percentage = this.dragInitPercentage - ((dragged / this.totalDistance) * this.dragDirMod)
  		this.dragPercentage = clamp(percentage, 0, 1)
  		//this.dragPercentage = clamp(percentage, this.dragClampMin, this.dragClampMax)
  		this.dragRender(this.dragPercentage)
  		this.emit('drag', this.dragPercentage)
  	}
  	wheelEndHandler() {
  		// only continue if can drag
  		//if (!this.dragOrientation) return
  		// remove [dragging] attribute for elements to reenable transitions, etc...
  		this.removeAttribute('dragging')
  		this.emit('drag-end')
  		this.wheelDragged = 0
  	}
  */

		// todo, add event listener to pressing escape key to close view
		//@reflect closeByEscape = false
		setupEscClose() {
			if (!this.dismissable) return;
			// TODO
		}

	}, _class2.TOP = TOP, _class2.RIGHT = RIGHT, _class2.BOTTOM = BOTTOM, _class2.LEFT = LEFT, _class2.NO_DIR = NO_DIR, _temp2), (_descriptor = _applyDecoratedDescriptor$1(_class.prototype, 'draggable', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return true;
		}
	}), _descriptor2 = _applyDecoratedDescriptor$1(_class.prototype, 'dragOrientation', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return String;
		}
	}), _applyDecoratedDescriptor$1(_class.prototype, 'setupDraggable', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'setupDraggable'), _class.prototype), _applyDecoratedDescriptor$1(_class.prototype, 'onDragStart', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class.prototype, 'onDragStart'), _class.prototype), _applyDecoratedDescriptor$1(_class.prototype, 'onDragMove', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class.prototype, 'onDragMove'), _class.prototype), _applyDecoratedDescriptor$1(_class.prototype, 'onDragEnd', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class.prototype, 'onDragEnd'), _class.prototype)), _class);
};

// probably temporary function, to be deleted
function isDescendant(parent, child) {
	var node = child.parentNode;
	while (node !== null) {
		if (node === parent) return true;
		node = node.parentNode;
	}
	return false;
}

function _initDefineProp$2(target, property, descriptor, context) {
	if (!descriptor) return;
	Object.defineProperty(target, property, {
		enumerable: descriptor.enumerable,
		configurable: descriptor.configurable,
		writable: descriptor.writable,
		value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
	});
}

function _applyDecoratedDescriptor$2(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

function _initializerWarningHelper$2(descriptor, context) {
	throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var overlayMaxOpacity = 0.7;

// Panel requires to be used together with Visibility class
let Panel = SuperClass => {
	var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13;

	return _dec = ganymede.defaultValue(true), _dec2 = ganymede.defaultValue(platform$1.material), _dec3 = ganymede.defaultValue(true), _dec4 = ganymede.once('beforeready'), _dec5 = ganymede.on(document, 'screensize-update', self => self.panel), _dec6 = ganymede.on('show'), _dec7 = ganymede.on('hide'), _dec8 = ganymede.observe('pinned'), (_class = class _class extends SuperClass {

		// [visible] = panel is in shown in overlay mode
		// [visible][pinned] = panel is in shown in pinned mode

		//@reflect dismissable = false

		//@reflect pinned = Boolean
		// automaticaly show on larger screen, if the panel if its pinnable
		// false = panel does not show up automatically on larger screens, even if its pinnable
		// true  = panel becomes visible on larger screens if pinnable


		// docked
		constructor() {
			super();
			// set soft default value

			_initDefineProp$2(this, 'dragEdge', _descriptor, this);

			_initDefineProp$2(this, 'overlayFade', _descriptor2, this);

			_initDefineProp$2(this, 'overlayBg', _descriptor3, this);

			_initDefineProp$2(this, 'pinnable', _descriptor4, this);

			_initDefineProp$2(this, 'pinned', _descriptor5, this);

			_initDefineProp$2(this, 'autoShow', _descriptor6, this);

			_initDefineProp$2(this, 'autoHide', _descriptor7, this);

			_initDefineProp$2(this, 'panel', _descriptor8, this);

			this.hasOverlayBg = false;

			_initDefineProp$2(this, 'overlayBg', _descriptor9, this);

			_initDefineProp$2(this, 'top', _descriptor10, this);

			_initDefineProp$2(this, 'right', _descriptor11, this);

			_initDefineProp$2(this, 'bottom', _descriptor12, this);

			_initDefineProp$2(this, 'left', _descriptor13, this);

			this.zIndex = 200;
			if (this.overlayBg === undefined) this.overlayBg = true;
			// store the default value for future state changes
			// note: this is only used by inheritors, since by the time constructor is called
			//       no attribute values were read and assigned yet
			this.__overlayBgDefault = this.overlayBg;
		}

		//@once('ready')

		// automaticaly hide after resizing down,
		// false = pinned panel becomes overlay on smaller screen and does not hide
		// true  = pinned panel becomes hidden on smaller screen


		//	@reflect overlayFade = true

		// todo rename to hasOverlay

		setupPanel() {
			//console.log('setupPanel --------------------------------------')
			//console.log(this)
			//console.log('this.hidden', this.hidden)
			//console.log('this.visible', this.visible)
			//console.log('this.pinned', this.pinned)
			//console.log('this.pinnable', this.pinnable)
			//console.log('---')
			if (!this.panel) return;

			this.autoAssignPosition();

			var isForciblyVisible = this.visible === true;
			var isForciblyHidden = this.hidden === true;

			if (this.autoShow === undefined) if (this.hidden) this.autoShow = false;else this.autoShow = true;
			if (this.autoHide === undefined) if (this.hidden) this.autoHide = true;else this.autoHide = false;

			if (this.hidden === undefined && this.visible === undefined) this.hidden = true;else if (this.visible === true) this.hidden = false;else if (this.hidden === true) this.visible = false;else if (this.visible === false) this.hidden = true;else if (this.hidden === false) this.visible = true;
			// ensure visible/hidden are correctly loaded
			//this.configureVisibilityAttributes()
			// if [pinned] was manually enabled, store info about it as pinnable
			if (this.pinned) this.pinnable = true;
			// if this panel can become pinned, only pin it if the screensize is right
			if (this.pinnable && this.autoShow && (isForciblyVisible || !isForciblyHidden))
				//if (this.pinnable && this.autoShow && this.hidden !== true)
				this.pinned = platform$1.screensize === 'l';else if (this.pinned === undefined) this.pinned = false;
			// and if not, hide it (not to show big overlay)
			if (this.pinned) this.hidden = false;
			//console.log('this.hidden', this.hidden)
			//console.log('this.visible', this.visible)
			//console.log('this.pinned', this.pinned)
			//console.log('this.pinnable', this.pinnable)
			//console.log('side', this.top, this.right, this.bottom, this.left)
			//if (this.hasOverlayBg)
			this.setupDragOverlay();
			//console.log('this.dragEdge', this.dragEdge, 'this.dragOrientation', this.dragOrientation)
			//if (this.dragEdge && this.dragOrientation)
			if (this.dragEdge) this.setupDragEdge();
			// NOTE: not using @on, nor @autobind because of inheritance
			// and possible changes by inheritors classes
			//this.on('show', () => this.onShow())
			//this.on('hide', () => this.onHide())
			this.applyDragVisibleState();
			if (this.id) this.attachInvokerListeners();
			// re render pinned
			//console.log('CALLING pinnedChanged')
			this.pinnedChanged();
			//console.log('CALLING applyVisibilityState')
			this.applyVisibilityState();
		}

		autoAssignPosition() {
			if (this.top || this.right || this.bottom || this.left) return;
			if (this.hasAttribute('right') || this.hasAttribute('left')) return;
			var next = this.nextElementSibling;
			var prev = this.previousElementSibling;
			if (next === null || next.localName !== 'flexus-view') {
				this.right = true;
				//this.setAttribute('right', '')
			} else if (prev === null || prev.localName !== 'flexus-view') {
				this.left = true;
				this.setAttribute('left', '');
			}
		}

		attachInvokerListeners() {
			// lets wait for a good measure
			setTimeout(() => this._attachInvokerListeners());
		}
		_attachInvokerListeners() {
			var nodes = Array.from(document.querySelectorAll(`[for="${ this.id }"]`));
			nodes.forEach(node => {
				//console.log('node', node)
				// note: autobound #show(), #hide(), #toggle() are all inherited from Visibility class
				this.on(node, 'click', this.toggle);
			});
		}

		onResize() {
			if (platform$1.screensize === SCREENSIZE.LARGE) {
				//console.log('onResize LARGE')
				//console.log('this.pinned', this.pinned, '->', this.pinnable)
				this.pinned = this.pinnable;
			} else {
				//console.log('onResize OTHER')
				//console.log('this.pinned', this.pinned, '->', false)
				this.pinned = false;
			}
		}

		onShowPanel(percentage) {
			//console.log('### onShowPanel')
			//if (!this.hidden) return
			this.dragPercentage = 1;
			if (this.draggable) this.dragRender();
			// make overlay clickable
			if (this.overlayBg && this.overlayElement) this.overlayElement.show();
			// assign universal api [hidden] attribute
			// (css to be handled by inheritor)
			//this.removeAttribute('hidden')
			this.hidden = false;
			this.applyDragVisibleState();
		}

		onHidePanel(percentage) {
			//console.log('### onHidePanel')
			//if (this.pinned) return
			//if (this.hidden) return
			this.dragPercentage = 0;
			if (this.draggable) this.dragRender();
			// make overlay click through again
			if (this.overlayBg && this.overlayElement) this.overlayElement.hide();
			// assign universal api [hidden] attribute
			// (css to be handled by inheritor)
			//this.setAttribute('hidden', '')
			this.hidden = true;
			this.applyDragHiddenState();
		}

		pin() {
			this.pinned = true;
		}
		unpin() {
			this.pinned = false;
		}

		// dock
		onPinPanel() {
			//console.log('### onPinPanel')
			//if (this.pinned) return
			this.overlayBg = false;
			if (this.overlayElement) this.overlayElement.hide();
			if (this.autoShow) {
				//this.dragPercentage = 1
				//this.dragRender()
				//this.hidden = false
				this.show();
				this.dragRender();
			}
			this.draggable = false;
			//this.dismissable = true
		}

		// undock
		onUnpinPanel() {
			//console.log('### onUnpinPanel')
			//if (!this.pinned) return
			this.overlayBg = this.__overlayBgDefault;
			this.draggable = true;
			if (this.overlayElement && this.overlayBg) this.overlayElement.show();
			if (this.autoHide) {
				//this.dragPercentage = 0
				//this.dragRender()
				this.hide();
			}
			//this.dismissable = false
		}

		// TODO: bug in ganymede does not automatically assign 'pinnedChanged' as observer.
		// Something must be wrong with the 'Changed' observer detection

		pinnedChanged() {
			if (this.pinned) this.onPinPanel();else this.onUnpinPanel();
		}

		hiddenChanged(hidden) {
			if (hidden === false && this.dragPercentage !== 1) this.show();else if (hidden === true && this.dragPercentage !== 0) this.hide();
		}

		applyVisibilityState() {
			if (this.hidden === true) this.hide();else if (this.hidden === false) this.show();
		}
		forceVisibilityState() {
			if (this.hidden === true) {
				this.hide();
				this.onHidePanel();
			} else if (this.hidden === false) {
				this.show();
				this.onShowPanel();
			}
		}

		// dragLeft is fixed, meaning the panel is on left side,
		// meaning it can be dragged (from active state) to left to close it
		// canDragLeft is state based and is true if the panel is openned
		// and then becomes false whereas canDragRight becomes true when closed
		applyDragVisibleState() {
			this.canDragUp = this.dragUp;
			this.canDragRight = this.dragRight;
			this.canDragDown = this.dragDown;
			this.canDragLeft = this.dragLeft;
		}
		applyDragHiddenState() {
			// pannel is hidden, set drag direction in which it can be dragged out
			// from over the edge
			this.canDragUp = false;
			this.canDragRight = false;
			this.canDragDown = false;
			this.canDragLeft = false;
			if (this.dragDown) this.canDragUp = true;
			if (this.dragLeft) this.canDragRight = true;
			if (this.dragUp) this.canDragDown = true;
			if (this.dragRight) this.canDragLeft = true;
		}

		setupDragOverlay() {
			//console.log('setupDragOverlay')
			this.overlayElement = createOverlay(this, this.overlayFade);
			//this.on(this.overlayElement, 'click', () => this.hide())
			this.on(this.overlayElement, 'click', () => this.onOverlayClick());
			this.on('drag-start', () => {
				if (!this.overlayBg) return;
				this.overlayElement.dragstart();
				if (!this.overlayFade) return;
				this.on('drag', this.overlayElement.drag);
			});
			this.on('drag-end', () => {
				if (!this.overlayBg) return;
				this.overlayElement.dragend();
				if (!this.overlayFade) return;
				this.off('drag', this.overlayElement.drag);
			});
		}

		// this is a separate function to be overriden by inheritors
		onOverlayClick() {
			this.hide();
		}

		setupDragEdge() {
			this.edgeElement = document.createElement('div');
			this.edgeElement.setAttribute('edge', '');
			this.appendChild(this.edgeElement);
			//console.log('setupDragEdge', this.edgeElement)
		}

	}, (_descriptor = _applyDecoratedDescriptor$2(_class.prototype, 'dragEdge', [_dec, ganymede.reflect], {
		enumerable: true,
		initializer: null
	}), _descriptor2 = _applyDecoratedDescriptor$2(_class.prototype, 'overlayFade', [_dec2, ganymede.reflect], {
		enumerable: true,
		initializer: null
	}), _descriptor3 = _applyDecoratedDescriptor$2(_class.prototype, 'overlayBg', [_dec3, ganymede.reflect], {
		enumerable: true,
		initializer: null
	}), _descriptor4 = _applyDecoratedDescriptor$2(_class.prototype, 'pinnable', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return false;
		}
	}), _descriptor5 = _applyDecoratedDescriptor$2(_class.prototype, 'pinned', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return false;
		}
	}), _descriptor6 = _applyDecoratedDescriptor$2(_class.prototype, 'autoShow', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Boolean;
		}
	}), _descriptor7 = _applyDecoratedDescriptor$2(_class.prototype, 'autoHide', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Boolean;
		}
	}), _descriptor8 = _applyDecoratedDescriptor$2(_class.prototype, 'panel', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return true;
		}
	}), _descriptor9 = _applyDecoratedDescriptor$2(_class.prototype, 'overlayBg', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Boolean;
		}
	}), _descriptor10 = _applyDecoratedDescriptor$2(_class.prototype, 'top', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Boolean;
		}
	}), _descriptor11 = _applyDecoratedDescriptor$2(_class.prototype, 'right', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Boolean;
		}
	}), _descriptor12 = _applyDecoratedDescriptor$2(_class.prototype, 'bottom', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Boolean;
		}
	}), _descriptor13 = _applyDecoratedDescriptor$2(_class.prototype, 'left', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Boolean;
		}
	}), _applyDecoratedDescriptor$2(_class.prototype, 'setupPanel', [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, 'setupPanel'), _class.prototype), _applyDecoratedDescriptor$2(_class.prototype, 'onResize', [_dec5], Object.getOwnPropertyDescriptor(_class.prototype, 'onResize'), _class.prototype), _applyDecoratedDescriptor$2(_class.prototype, 'onShowPanel', [_dec6], Object.getOwnPropertyDescriptor(_class.prototype, 'onShowPanel'), _class.prototype), _applyDecoratedDescriptor$2(_class.prototype, 'onHidePanel', [_dec7], Object.getOwnPropertyDescriptor(_class.prototype, 'onHidePanel'), _class.prototype), _applyDecoratedDescriptor$2(_class.prototype, 'pinnedChanged', [_dec8], Object.getOwnPropertyDescriptor(_class.prototype, 'pinnedChanged'), _class.prototype)), _class);
};

function createOverlay(overlayForElement, overlayFade) {
	var overlay = document.createElement('div');
	if (platform$1.neon) overlay.style.opacity = '0 !important';
	//console.warn('remove me')
	overlay.className = 'fx-overlay';
	overlay.setAttribute('hidden', '');
	if (overlayFade) overlay.setAttribute('fade', '');
	if (overlayForElement) {
		/*var zIndex = overlayForElement.zIndex
  		|| overlayForElement.style.zIndex
  		|| parseInt(getComputedStyle(overlayForElement).zIndex)
  		|| 500*/
		var zIndex = parseInt(getComputedStyle(overlayForElement).zIndex);
		overlay.style.zIndex = zIndex;
		overlayForElement.before(overlay);
	}
	overlay.show = function (val) {
		overlay.style.opacity = '';
		overlay.removeAttribute('hidden');
	};
	overlay.hide = function (val) {
		overlay.style.opacity = '';
		overlay.setAttribute('hidden', '');
	};
	overlay.drag = percentage => {
		//console.log('drag', percentage)
		overlay.style.opacity = percentage * overlayMaxOpacity;
	};
	overlay.dragstart = () => {
		//overlay.style.zIndex = this.zIndex - 1
		overlay.style.transition = 'none';
	};
	overlay.dragend = () => {
		overlay.style.transition = '';
	};
	return overlay;
}

function _initDefineProp$3(target, property, descriptor, context) {
	if (!descriptor) return;
	Object.defineProperty(target, property, {
		enumerable: descriptor.enumerable,
		configurable: descriptor.configurable,
		writable: descriptor.writable,
		value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
	});
}

function _initializerWarningHelper$3(descriptor, context) {
	throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

function _applyDecoratedDescriptor$3(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

//class Listeners extends Array {
//}

let Scrollable = SuperClass => {
	var _dec, _desc, _value, _class;

	return _dec = ganymede.observe('isScrolledToTop', 'isScrolledToBottom'), (_class = class _class extends SuperClass {
		constructor(...args) {
			var _temp;

			return _temp = super(...args), this.scrollTarget = undefined, this.scrollListeners = [], this.isScrolledToTop = true, this.isScrolledToBottom = true, this.scrollReflectsTouchAction = false, _temp;
		}

		// keeps reflecting touch-action css property according to scroll position


		//@once('ready')
		setupScrollable(target) {
			target = this.scrollTarget || target;
			// for now only available for scrolling on <main> elements
			if (!target || target.localName !== 'main') {
				this.scrollTarget = target = undefined;
				return false;
			}
			this.scrollTarget = target;
			// merge local and preexisting scroll listeners in case scrollTarget is shared
			// between multiple consumers
			// WARNING: it is necessary to share single scrollListeners array by reference
			//          with everyone listening to the same scrollTarget
			var listeners = target.scrollListeners = target.scrollListeners || [];
			listeners.push(...this.scrollListeners);
			this.scrollListeners = listeners;
			// some scrollable elements need to update their touch-action in combination with Draggable
			if (this.scrollReflectsTouchAction) {
				listeners.push(this.onScrollChange);
				this.updateTouchAction();
			}
			this.executeScrollThrottled = rafThrottle(() => {
				var scrolled = this.scrolled;
				for (var i = 0; i < listeners.length; i++) listeners[i](scrolled);
			});
			this.startScrollListening();
			return true;
		}

		startScrollListening() {
			var target = this.scrollTarget;
			if (this.scrollListeners.length === 0) return false;
			if (target.scrollListenerActive) return false;
			target.addEventListener('scroll', this.executeScrollThrottled, { passive: true });
			target.scrollListenerActive = true;
			return true;
		}
		endScrollListening() {
			var target = this.scrollTarget;
			if (this.scrollListeners.length > 0) return false;
			if (!target.scrollListenerActive) return false;
			target.removeEventListener('scroll', this.executeScrollThrottled);
			target.scrollListenerActive = false;
			return true;
		}

		addScrollListeners(listener) {
			this.scrollListeners.push(listener);
			this.startScrollListening();
		}
		removeScrollListeners(listener) {
			var index = this.scrollListeners.indexOf(listener);
			if (index !== -1) this.scrollListeners.splice(index, 1);
			this.endScrollListening();
		}

		updateTouchAction() {
			if (this.isContentScrollable) {
				this.onScrollChange(this.scrolled);
				this.reflectTouchAction();
			} else {
				this.isScrolledToTop = true;
				this.isScrolledToBottom = true;
			}
		}

		onScrollChange(scrolled) {
			var max = this.maxScrollable;
			if (scrolled <= 0) {
				//console.log('onScrollChange start', scrolled)
				this.isScrolledToTop = true;
				this.isScrolledToBottom = false;
			} else if (scrolled >= max) {
				//console.log('onScrollChange end', scrolled)
				this.isScrolledToTop = false;
				this.isScrolledToBottom = true;
			} else {
				//console.log('onScrollChange mid', scrolled)
				this.isScrolledToTop = false;
				this.isScrolledToBottom = false;
			}
		}

		reflectTouchAction() {
			//console.log('reflectTouchAction')
			//if (!this.scrollTarget)
			//	return
			if (this.isScrolledToTop && this.isScrolledToBottom) this.scrollTarget.style.touchAction = 'none';else if (this.isScrolledToTop) this.scrollTarget.style.touchAction = 'pan-down';else if (this.isScrolledToBottom) this.scrollTarget.style.touchAction = 'pan-up';else this.scrollTarget.style.touchAction = 'pan-y';
			//console.log('touch-action', this.scrollTarget.style.touchAction, this)
			//console.log('touch-action', this.scrollTarget.style.touchAction)
		}

		get scrolled() {
			return Math.round(this.scrollTarget.scrollTop);
		}
		// return true if content of scrolltarget is taller than whats visible
		get isContentScrollable() {
			var scrollTarget = this.scrollTarget;
			return scrollTarget.scrollHeight !== scrollTarget.offsetHeight;
		}
		get maxScrollable() {
			var scrollTarget = this.scrollTarget;
			return scrollTarget.scrollHeight - scrollTarget.offsetHeight;
		}

	}, (_applyDecoratedDescriptor$3(_class.prototype, 'onScrollChange', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class.prototype, 'onScrollChange'), _class.prototype), _applyDecoratedDescriptor$3(_class.prototype, 'reflectTouchAction', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'reflectTouchAction'), _class.prototype)), _class);
};

const UP = -1;
const RIGHT$1 = 1;
const DOWN = 1;
const LEFT$1 = -1;
const NO_DIR$1 = 0;

// class implementing Retractable is required to also inherit Scrollable
// it also asumes 'scrollTarget' is defined on ready event
let Retractable = SuperClass => {
	var _desc2, _value2, _class3, _descriptor, _class4, _temp3;

	return _class3 = (_temp3 = _class4 = class _class3 extends SuperClass {
		/*
  	@on('ready')
  	onRetractableReady() {
  		console.log('onRetractableReady', this.retractable)
  		if (!this.retractable) return
  		var thisStyle = this.style
  		var pivot = 0
  		var totalScrolled = 0
  		var lastY = 0
  		var timeout
  		var inactivated = () => {
  			if (Math.abs(lastY) < this.offsetHeight / 2) {
  				pivot = totalScrolled
  				this.show()
  			} else {
  				pivot = totalScrolled - this.offsetHeight
  				this.hide()
  			}
  			console.log('inactivated |',
  				'lastY', lastY,
  				'totalScrolled', totalScrolled,
  				'this.offsetHeight', this.offsetHeight,
  				'|', lastY < this.offsetHeight / 2)
  		}
  		var onScroll = scrolled => {
  			clearTimeout(timeout)
  			timeout = setTimeout(inactivated, 400)
  			var y = (scrolled - pivot) * this.retractDirMod
  			totalScrolled = scrolled
  			lastY = y
  			console.log('onScroll', scrolled, pivot, '|', y)
  			thisStyle.transform = `translate3d(0px, ${y}px, 0)`
  		}
  		this.addScrollListeners(onScroll)
  		this.registerKillback(() => this.removeScrollListeners(onScroll))
  	}
  */
		constructor(...args) {
			var _temp2;

			return _temp2 = super(...args), _initDefineProp$3(this, 'retractable', _descriptor, this), this.retractDirMod = UP, _temp2;
		}
		// direction from center


	}, _class4.UP = UP, _class4.RIGHT = RIGHT$1, _class4.DOWN = DOWN, _class4.LEFT = LEFT$1, _class4.NO_DIR = NO_DIR$1, _temp3), (_descriptor = _applyDecoratedDescriptor$3(_class3.prototype, 'retractable', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return true;
		}
	})), _class3;
};

function getParallaxApplicator(node) {
	var ratio = node.getAttribute('parallax');
	var { style } = node;
	if (ratio === 'custom') return scrolled => console.warn('TODO: custom parallax');else {
		ratio = -Number(ratio || 0.2);
		return scrolled => style.transform = `translate3d(0, ${ scrolled * ratio }px, 0)`;
	}
}

function _initDefineProp$4(target, property, descriptor, context) {
	if (!descriptor) return;
	Object.defineProperty(target, property, {
		enumerable: descriptor.enumerable,
		configurable: descriptor.configurable,
		writable: descriptor.writable,
		value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
	});
}

function _initializerWarningHelper$4(descriptor, context) {
	throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

function _applyDecoratedDescriptor$4(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

function isNodeAvailable(node) {
	return !!node && !node.disabled && !isAttrBlocked(node, 'disabled') && !isAttrBlocked(node, 'hidden');
}

function isAttrBlocked(node, attrName) {
	var val = node.getAttribute(attrName);
	if (val === null) return false;
	if (val === '') return true;
	if (platform.screensize === 's' && val.includes('small')) return true;
	if (platform.screensize === 'm' && val.includes('medium')) return true;
	if (platform.screensize === 'l' && val.includes('large')) return true;
	return false;
}

function selectedValidator(newIndex, self) {
	if (self.selected === newIndex) return newIndex;
	var children = this.children;
	if (self.children.length === 0) return 0;
	if (newIndex < 0) newIndex = 0;
	if (newIndex > children.length - 1) newIndex = children.length - 1;
	var target = children[newIndex];
	if (isNodeAvailable(target)) {
		return newIndex;
	} else {
		return self.selected;
	}
}

let LinearSelectable = SuperClass => {
	var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor;

	return _dec = ganymede.on('ready'), _dec2 = ganymede.validate(selectedValidator), _dec3 = ganymede.observe('selected'), (_class = class _class extends SuperClass {
		constructor(...args) {
			var _temp;

			return _temp = super(...args), _initDefineProp$4(this, 'selected', _descriptor, this), _temp;
		}

		onReady() {
			//console.log('LinearSelectable', this.children.length, this.children)
			//console.log('selected', this.querySelector('[selected]'))
			this._selectedChanged(this.selected);
		}

		_selectedChanged(newIndex, oldIndex) {
			//console.log('_selectedChanged', newIndex, oldIndex)
			if (this.activeTab) this.activeTab.removeAttribute('selected');
			this.activeTab = this.children[newIndex];
			if (this.activeTab) this.activeTab.setAttribute('selected', '');
			this.emit('selected', newIndex);
		}

		linkToOtherSelectable(target) {
			//console.log('link', this, 'to target', target)
			this.selected = target.selected;
			target.on('selected', newIndex => {
				//console.log('target changed', newIndex)
				this.selected = newIndex;
			});
			this.on('selected', newIndex => {
				//console.log('pages changed', newIndex)
				target.selected = newIndex;
			});
		}

		select(index) {
			this.selected = index;
		}
		prev() {
			this.selected--;
		}
		next() {
			this.selected++;
		}

	}, (_applyDecoratedDescriptor$4(_class.prototype, 'onReady', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'onReady'), _class.prototype), _descriptor = _applyDecoratedDescriptor$4(_class.prototype, 'selected', [_dec2, ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return 0;
		}
	}), _applyDecoratedDescriptor$4(_class.prototype, '_selectedChanged', [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, '_selectedChanged'), _class.prototype)), _class);
};

function _initDefineProp$5(target, property, descriptor, context) {
	if (!descriptor) return;
	Object.defineProperty(target, property, {
		enumerable: descriptor.enumerable,
		configurable: descriptor.configurable,
		writable: descriptor.writable,
		value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
	});
}

function _applyDecoratedDescriptor$5(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

function _initializerWarningHelper$5(descriptor, context) {
	throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

let Visibility = SuperClass => {
	var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2;

	return _dec = ganymede.once('ready'), _dec2 = ganymede.observe('hidden'), _dec3 = ganymede.observe('visible'), (_class = class _class extends SuperClass {
		constructor(...args) {
			var _temp;

			return _temp = super(...args), _initDefineProp$5(this, 'hidden', _descriptor, this), _initDefineProp$5(this, 'visible', _descriptor2, this), _temp;
		}

		configureVisibilityAttributes() {
			//console.log('+++++ onready Visibility +++++')
			//console.log('this.visible', this.visible, this.hasAttribute('visible'))
			//console.log('this.hidden', this.hidden, this.hasAttribute('hidden'))
			// WARNING: at this point, attributes were read and if [visible] is defined
			//          both hidden and visible properties could be true. Setting hidden to false
			//          gets the ball rolling and keeps it properly synced
			if (this.visible) this.hidden = false;else if (this.hidden) this.visible = false;
			//console.log('this.visible', this.visible, this.hasAttribute('visible'))
			//console.log('this.hidden', this.hidden, this.hasAttribute('hidden'))
		}

		hiddenChangedReflector() {
			//console.log('hiddenChanged to', this.hidden, '|', this.__preventHiddenFromUpdatingVisible)
			if (this.__preventHiddenFromUpdatingVisible === true) {
				this.__preventHiddenFromUpdatingVisible = false;
			} else {
				this.__preventVisibleFromUpdatingHidden = true;
				//console.log('setting visible to', !this.hidden)
				this.visible = !this.hidden;
				this.__preventVisibleFromUpdatingHidden = false;
			}
		}

		visibleChangedReflector() {
			//console.log('visibleChanged to', this.visible, '|', this.__preventVisibleFromUpdatingHidden)
			if (this.__preventVisibleFromUpdatingHidden === true) {
				this.__preventVisibleFromUpdatingHidden = false;
			} else {
				this.__preventHiddenFromUpdatingVisible = true;
				//console.log('setting hidden to', !this.visible)
				this.hidden = !this.visible;
				this.__preventHiddenFromUpdatingVisible = false;
			}
		}

		show() {
			this.emit('show');
		}

		hide() {
			this.emit('hide');
		}

		toggle() {
			//console.log('toggle', this.hidden, this.visible)
			if (this.hidden) this.show();else this.hide();
		}

		toggleVisibility() {
			//console.log('toggle', this.hidden, this.visible)
			if (this.hidden) this.show();else this.hide();
		}

	}, (_descriptor = _applyDecoratedDescriptor$5(_class.prototype, 'hidden', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Boolean;
		}
	}), _descriptor2 = _applyDecoratedDescriptor$5(_class.prototype, 'visible', [ganymede.reflect], {
		enumerable: true,
		initializer: function () {
			return Boolean;
		}
	}), _applyDecoratedDescriptor$5(_class.prototype, 'configureVisibilityAttributes', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'configureVisibilityAttributes'), _class.prototype), _applyDecoratedDescriptor$5(_class.prototype, 'hiddenChangedReflector', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'hiddenChangedReflector'), _class.prototype), _applyDecoratedDescriptor$5(_class.prototype, 'visibleChangedReflector', [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, 'visibleChangedReflector'), _class.prototype), _applyDecoratedDescriptor$5(_class.prototype, 'show', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class.prototype, 'show'), _class.prototype), _applyDecoratedDescriptor$5(_class.prototype, 'hide', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class.prototype, 'hide'), _class.prototype), _applyDecoratedDescriptor$5(_class.prototype, 'toggle', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class.prototype, 'toggle'), _class.prototype), _applyDecoratedDescriptor$5(_class.prototype, 'toggleVisibility', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class.prototype, 'toggleVisibility'), _class.prototype)), _class);
};

//import * as ganymede from 'ganymede'
// NOTE: Can't use 'export * from ganymede' because rollup is unable to resolve dependencies

//import {RenderManager} from './raf.js'
//export var render = new RenderManager


// ----------------------------------------------------------------------------------------------------------------------
// --------------------------------------------- CORE -------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

/*
function getFlexusPath() {
	// get attribute instead of property which would contain the whole origin with http://
	var scriptPath = document.currentScript.getAttribute('src')
	console.log('scriptPath', scriptPath)
	if (scriptPath.includes('/')) {
		var split = scriptPath.split('/')
		split.pop()
		return split.join('/') + '/'
	} else {
		return ''
	}
}

export var flexusRootPath = getFlexusPath()
export var libPath = flexusRootPath + 'lib/'
export var elementsPath = flexusRootPath + 'elements/'
export var cssPath = flexusRootPath + 'css/'
*/

function createMissingTag(tagName, idName, idValue, contentName, contentValue, override = false) {
	var node = document.head.querySelector(`${ tagName }[${ idName }="${ idValue }"]`);
	if (node && !override) return;
	if (!node) {
		node = document.createElement(tagName);
		node[idName] = idValue;
		document.head.appendChild(node);
	}
	node[contentName] = contentValue;
}

function createMissingMeta(idName, contentName, override) {
	createMissingTag('meta', 'name', idName, 'content', contentName, override);
}
function createMissingLink(idName, contentName, override) {
	createMissingTag('link', 'rel', idName, 'href', contentName, override);
}
/*
function createMissingMeta(name, content, override = false) {
	var meta = document.head.querySelector(`meta[name="${name}"]`)
	if (meta && !override) return
	if (!meta) {
		meta = document.createElement('meta')
		meta.name = name
		document.head.appendChild(meta)
	}
	meta.content = content
}
*/
// progressive web app
var pwa = !platform$1.app;
var title = 'Flexus Test App';
var description = 'Flexus description';

//createMissingMeta('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
createMissingMeta('viewport', 'width=device-width, user-scalable=no');

// give user time to opt out from setting up web app meta tags
setTimeout(() => {
	if (!pwa) return;
	// NOTE: these do not override existing meta tags
	createMissingMeta('mobile-web-app-capable', 'yes');
	createMissingMeta('apple-mobile-web-app-capable', 'yes');
	//<meta name="apple-mobile-web-app-status-bar-style" content="black">
	//<meta name="msapplication-TileColor" content="#2196F3">//

	createMissingMeta('application-name', title);
	createMissingMeta('apple-mobile-web-app-title', title);
	createMissingMeta('description', description);
	// TODO title
	createMissingLink('manifest', 'manifest.json');
}, 200);

exports.pwa = pwa;
exports.title = title;
exports.description = description;
exports.$$ = ganymede.$$;
exports.$ = ganymede.$;
exports.ready = ganymede.ready;
exports.appElementReady = appElementReady;
exports.platform = platform$1;
exports.animation = animation;
exports.styleSheet = styleSheet;
exports.addReadyAnimation = addReadyAnimation;
exports.traverse = traverse;
exports.traverseValue = traverseValue;
exports.runAll = runAll;
exports.clamp = clamp;
exports.mapRange = mapRange;
exports.isTouchEvent = isTouchEvent;
exports.draggable = draggable;
exports.iridescent = iridescent;
exports.path = path;
exports.loadNeon = loadNeon;
exports.loadMaterial = loadMaterial;
exports.swapDesign = swapDesign;
exports.swapTheme = swapTheme;
exports.resizeDetector = resizeDetector;
exports.rafThrottle = rafThrottle;
exports.SCREENSIZE = SCREENSIZE;
exports.matchFormFactorDef = matchFormFactorDef;
exports.Breakpointable = Breakpointable;
exports.Draggable = Draggable;
exports.Panel = Panel;
exports.Scrollable = Scrollable;
exports.Retractable = Retractable;
exports.getParallaxApplicator = getParallaxApplicator;
exports.isNodeAvailable = isNodeAvailable;
exports.LinearSelectable = LinearSelectable;
exports.Visibility = Visibility;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=flexus.js.map
