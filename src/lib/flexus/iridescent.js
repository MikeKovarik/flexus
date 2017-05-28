// TODO implement UWP accent color (since the theme <meta> tag is already handled)


export class iridescent {


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////// CONVERSIONS ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static hexToRgb(string) {
		if (string.startsWith('#'))
			string = string.slice(1)
		var r = parseInt(string.substr(0,2), 16)
		var g = parseInt(string.substr(2,2), 16)
		var b = parseInt(string.substr(4,2), 16)
		return [r, g, b]
	}

	static rgbToHex(r, g, b) {
		var int = r << 16 | g << 8 | b
		return '#' + ('00000' + int.toString(16)).slice(-6).toUpperCase()
	}

	static rgbToHsl(r, g, b) {
		r /= 255
		g /= 255
		b /= 255
		var max = Math.max(r, g, b)
		var min = Math.min(r, g, b)
		var h
		var s
		var l = (max + min) / 2
		if (max == min) {
			h = s = 0 // achromatic
		} else {
			var d = max - min
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break
				case g: h = (b - r) / d + 2; break
				case b: h = (r - g) / d + 4; break
			}
			h /= 6
		}
		return [h, s, l]
	}


	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// UTILS //////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	// calculated appropriate text color for given background rgb color
	static rgbForeground(r, g, b) {
		var count = r + g + b
		var brightness = this.rgbBrightness(r, g, b)
		if (brightness > 140 || count > 450)
			return [0, 0, 0]
			//return '#000000'
		else
			return [255, 255, 255]
			//return '#FFFFFF'
	}

	static rgbBrightness(r, g, b) {
		return (r * 299 + g * 587 + b * 114) / 1000
	}

	// per ITU-R BT.709
	static rgbLuminance(r, g, b) {
		return 0.2126 * r + 0.7152 * g + 0.0722 * b
	}

	static rgbStrip(string) {
		return string
			.trim()
			.split(',')
			.map(Number)
	}

	static hex(string) {
		string = string.trim()
		if (string.startsWith('#')) {
			return string
		} else if (string.includes(',')) {
			if (string.endsWith(')')) {
				string = string.slice(0, -1)
			}
			if (string.startsWith('rgb(')) {
				string = string.slice(4)
			}
			return iridescent.rgbToHex(...this.rgbStrip(string))
		}
	}

	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////// PALETTE /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static get names() {
		return ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'gray', 'blue-gray']
	}
	static get shades() {
		return [100, 300, 500, 700, 900]
	}

	static loadPalette() {
		if (this.rgbPalette) return
		var computed = getComputedStyle(document.body)
		var rgbPalette = new Map
		var hslPalette = new Map
		this.names.forEach(name => {
			this.shades.forEach(shade => {
				var rgb = computed
					.getPropertyValue(`--palette-${name}-${shade}-rgb`)
					.trim()
					.split(',')
					.map(Number)
				var hsl = this.rgbToHsl(...rgb)
				rgbPalette.set(`${name}-${shade}`, rgb)
				hslPalette.set(`${name}-${shade}`, hsl)
			})
		})
		this.rgbPalette = rgbPalette
		this.hslPalette = hslPalette
	}


	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// UTILS //////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static closestPaletteColor(rgb) {
		var name
		var diff = 255
		var hsl = this.rgbToHsl(...rgb)
		var [h, s, l] = hsl
		//h = Math.round(h * 360)
		//s = Math.round(s * 100)
		//l = Math.round(l * 100)
		//console.log('closest rgb', rgb)
		//console.log('closest hsl', hsl)
		//console.log('hue', Math.round(hsl[0] * 360))
		//console.log('hue', h, s, l)
		this.hslPalette.forEach((value, colorName) => {
			var d = this.rgbDifference(...value, ...hsl)
			if (d < diff) {
				//console.log(colorName, d)
				name = colorName
				diff = d
			}
		})
		return name
	}


	static applyImageColor(img, target, type = 'primary') {
		var promise = this.calculateImageColor(img)
		return promise.then(([background, foreground]) => {
			//this.loadPalette()
			//var closest = this.closestPaletteColor(background)
			//console.log('closest', closest)
			this.setPrimary(target, type, background, foreground)
		})
	}
	static calculateImageColor(img) {
		return imgReady(img).then(img => {
			var vibrant = new Vibrant(img)
			var swatch = vibrant.VibrantSwatch
			var background = swatch.rgb
			var foreground = this.calculateForegroundRgb(...background)
			//var background = swatch.getHex()
			//var foreground = swatch.getTitleTextColor()
			return [background, foreground]
		})
	}

	static round(...args) {
		var [a, b, c] = unpackArgs(args)
		return [
			Number(a.toFixed(2)),
			Number(b.toFixed(2)),
			Number(c.toFixed(2)),
		]
	}

	static rgbDifference(r1, g1, b1, r2, g2, b2) {
		var sumOfSquares = 0
		sumOfSquares += Math.pow(r1 - r2, 2)
		sumOfSquares += Math.pow(g1 - g2, 2)
		sumOfSquares += Math.pow(b1 - b2, 2)
		return Math.sqrt(sumOfSquares)
	}


	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// META //////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static getMetaNode() {
		var name = 'theme-color'
		var meta = document.head.querySelector(`meta[name="${name}"]`)
		if (meta) return meta
		meta = document.createElement('meta')
		meta.name = name
		document.head.appendChild(meta)
		return meta
	}

	// returns #HEX value from <meta name="theme-color"> tag
	static get meta() {
		var meta = this.getMetaNode()
		return meta.content
	}

	// sets rgb() or #HEX value to <meta name="theme-color"> tag
	static set meta(string) {
		string = string.trim()
		if (string.startsWith('rgb')) {
			var rgb = string.match(/\d+/g).map(Number)
			string = this.rgbToHex(...rgb)
			//console.log(string)
		}
		var meta = this.getMetaNode()
		if (meta.content !== string)
			meta.content = string
	}


	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// FLEXUS //////////////////////////////////
	///////////////////////////////////////////////////////////////////////////


	static setPrimary(target, backgroundRgb, foregroundRgb) {
		this.setTypedColor(target, 'primary', backgroundRgb, foregroundRgb)
	}
	static setAccent(target, backgroundRgb, foregroundRgb) {
		this.setTypedColor(target, 'accent', backgroundRgb, foregroundRgb)
	}
	static setTypedColor(target, type, backgroundRgb, foregroundRgb) {
		target.setAttribute(type, 'custom')
		if (backgroundRgb) {
			var backgroundRgbString = getRgbInsideString(...backgroundRgb)
			target.style.setProperty(`--${type}-rgb`, backgroundRgbString)
		}
		if (foregroundRgb) {
			var foregroundRgbString = getRgbInsideString(...foregroundRgb)
			target.style.setProperty(`--${type}-foreground-rgb`, foregroundRgbString)
		}
		if (type === 'accent') {
			this.setTint(target, type, backgroundRgb, foregroundRgb)
		}
	}
	static setTint(target, type, backgroundRgb, foregroundRgb) {
		// Prevent way too bright colors to be assigned as adaptive accent
		// if given element has/is within light theme
		if (target.matches(':scope[light]') || target.matches('[light] :scope')) {
			// colors above 200 are way too bright to be on the white background
			if (this.rgbLuminance(...backgroundRgb) > 200) return
		}
		// do not overwrite existing accent value by primary
		if (type === 'primary' && target.style.getPropertyValue(`--tint-rgb`)) {
			return
		}
		target.style.setProperty(`--tint-rgb`, backgroundRgb)
		target.style.setProperty(`--tint-foreground-rgb`, foregroundRgb)
		// NOTE: if [accent] is changed later to something too bright like pure yellow
		// not only will it not be assigned as adaptive-tint (as expected)
		// but this code does not overwrite residual adaptive color from before
	}
	static setColor(target, backgroundRgb, foregroundRgb) {
		if (backgroundRgb) {
			var backgroundRgbString = getRgbInsideString(...backgroundRgb)
			target.style.setProperty(`--background-rgb`, backgroundRgbString)
		}
		if (foregroundRgb) {
			var foregroundRgbString = getRgbInsideString(...foregroundRgb)
			target.style.setProperty(`--foreground-rgb`, foregroundRgbString)
		}
	}

}



function getRgbInsideString(r, g, b) {
	return `${r}, ${g}, ${b}`
}
function getRgbString(r, g, b) {
	return `rgb(${r}, ${g}, ${b})`
}

function imgReady(img, callback) {
	return new Promise((resolve, reject) => {
		if (isImgLoaded(img)) {
			resolve(img)
		} else {
			function loadHandler() {
				img.removeEventListener('load', loadHandler)
				resolve(img)
			}
			img.addEventListener('load', loadHandler)
			function errorHandler() {
				img.removeEventListener('error', errorHandler)
				reject(img)
			}
			img.addEventListener('error', errorHandler)
		}
	})
}

function isImgLoaded(img) {
	return img.complete && img.naturalHeight !== 0
}
