(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede'), require('flexus')) :
	typeof define === 'function' && define.amd ? define('scene', ['ganymede', 'flexus'], factory) :
	(factory(global.ganymede,global.flexus));
}(this, (function (ganymede,flexus) { 'use strict';

var _dec;
var _dec2;
var _dec3;
var _class;
var _desc;
var _value;
var _class2;
var _descriptor;
var _descriptor2;
var _descriptor3;

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

var animationRuleLists = {
	text: ['fontSize', 'fontWeight', 'backgroundColor', 'color'],
	//image: ['backgroundColor', /*'width', 'height',*/ 'borderRadius'],
	image: []
};

function showView(view) {
	view.removeAttribute('hidden');
}
function hideView(view) {
	view.setAttribute('hidden', '');
}

//@template(`
//	<slot></slot>
//	<pre id="state"></pre>
//`)
//@css(`
//#state {
//	position: absolute;
//	z-index: 999;
//	left: 5px;
//	bottom: 5px;
//	padding: 5px;
//	background-color: rgba(0,0,0,0.5)
//}
//`)

let FlexusScene = (_dec = ganymede.on('click'), _dec2 = ganymede.on('detail', 'show'), _dec3 = ganymede.on('detail', 'hide'), ganymede.customElement(_class = (_class2 = class FlexusScene extends ganymede.ganymedeElement(flexus.Breakpointable) {
	constructor(...args) {
		var _temp;

		return _temp = super(...args), _initDefineProp(this, 'selected', _descriptor, this), _initDefineProp(this, 'type', _descriptor2, this), _initDefineProp(this, 'dismissable', _descriptor3, this), this.transitionDuration = 300, _temp;
	}
	//@reflect noOverlay = undefined


	ready() {}

	ready() {
		this.master = this.querySelector(':scope > [master]');
		this.detail = this.querySelector(':scope > [detail]');
		if (!this.master) {
			var views = Array.from(this.querySelectorAll('flexus-view'));
			this.master = views[0];
			this.detail = views[1];
			this.master.setAttribute('master', '');
			this.detail.setAttribute('detail', '');
		}
		this.detailToolbar = this.detail.querySelector('flexus-toolbar');
		console.log(this.detail);
		console.log(this.detailToolbar);
		/*
  		if (platform.screensize === 's') {
  			if (this.selected === 'master')
  				this.hideDetail()
  			else
  				this.showDetail()
  		}
  */
		if (this.type === 'master-detail') {
			this.resizeMasterDetail();
			this.on(document, 'screensize-update', this.resizeMasterDetail);
		}
	}

	resizeMasterDetail() {
		console.log('--------- resizeMasterDetail --------------');
		console.log('platform.screensize', flexus.platform.screensize);
		console.log('this.selected', this.selected);
		if (this.selected === 'detail') {
			if (flexus.platform.screensize === 's') this.navigateToDetail();else this.showDetail();
		} else {
			this.hideDetail();
		}
		if (this.detailToolbar) this.detailToolbar.refreshScroll();
	}

	onClick(value, { target }) {
		if (target.matches(`[show-detail],
							flexus-view[master] a[href]:not([show-detail="false"]),
							flexus-view[master] a[href]:not([show-detail="false"]) > *`)) this.navigateToDetail();
		if (target.matches('flexus-view[detail] [icon="arrow-back"]:not([hide-detail="false"]), [hide-detail]')) this.hideDetail();
	}

	navigateToDetail() {
		this.showDetail();
		if (this.detailToolbar) {
			this.detailToolbar.resetScroll();
			/*if (this.detailToolbar.scrollTarget.scrollTop)
   	this.detailToolbar.scrollTarget.scrollTop = 0
   	setTimeout(() => this.detailToolbar.scrollTarget.scrollTop = 0, 500)
   if (this.detailToolbar.measureHeight) {
   	// measure immediately
   	this.detailToolbar.measureHeight()
   	// do another measurement in case the first one was too soon
   	setTimeout(() => this.detailToolbar.measureHeight(), 500)
   }*/
		} else if (this.detail.scrollTarget) this.detail.scrollTarget.scrollTop = 0;
	}

	showDetail() {
		console.log('showDetail');
		this.selected = 'detail';
		showView(this.detail);
		if (flexus.platform.screensize === 's') hideView(this.master);else showView(this.master);
	}

	hideDetail() {
		console.log('hideDetail');
		this.selected = 'master';
		showView(this.master);
		if (flexus.platform.screensize === 's') hideView(this.detail);else showView(this.detail);
	}

	onDetailShow() {
		console.log('onDetailShow');
		hideView(this.master);
		//showView(this.detail)
		this.selected = 'detail';
	}

	onDetailHide() {
		console.log('onDetailHide');
		showView(this.master);
		//hideView(this.detail)
		this.selected = 'master';
	}
	/*
 	masterShow() {
 		showView(this.master)
 		hideView(this.detail)
 		this.selected = 'master'
 	}
 	detailHide() {
 		showView(this.master)
 		hideView(this.detail)
 		this.selected = 'master'
 	}
 
 	masterHide() {
 		hideView(this.master)
 		showView(this.detail)
 		this.selected = 'detail'
 	}
 	detailShow() {
 		hideView(this.master)
 		showView(this.detail)
 		this.selected = 'detail'
 	}
 */

	/*
 	animateViews(toBeHiddenView, toBeShownView) {
 		//this.emit('change', 'detail')
 		//this.hideView(this.master)
 
 		var addHelperAttrs = () => {
 			this.detail.setAttribute('fit', '')
 			toBeHiddenView.style.zIndex = 0
 			toBeShownView.style.zIndex = 1
 		}
 		var removeHelperAttrs = () => {
 			this.detail.removeAttribute('fit')
 			toBeHiddenView.style.zIndex = ''
 			toBeShownView.style.zIndex = ''
 		}
 
 		addHelperAttrs()
 		//this.showView(toBeShownView)
 		
 		toBeHiddenView.setAttribute('offscreen', '')
 		toBeShownView.removeAttribute('offscreen')
 		toBeShownView.removeAttribute('hidden')
 
 		toBeHiddenView.setAttribute('hiding', '')
 		toBeShownView.setAttribute('showing', '')
 
 		this.viewAnimation = toBeShownView.animate({
 			opacity: [0, 1],
 		}, {
 			duration: this.transitionDuration
 		})
 
 		this.viewAnimation.finished.then(() => {
 			removeHelperAttrs()
 			//this.hideView(toBeHiddenView)
 			toBeHiddenView.setAttribute('hidden', '')
 			toBeHiddenView.removeAttribute('hiding')
 			toBeShownView.removeAttribute('showing')
 		})
 	}
 
 	animateDetails(direction) {
 		if (!this.masterOrigin) return
 		var animationPoints = Array.from(this.masterOrigin.querySelectorAll('[animate]'))
 		animationPoints.forEach(origin => {
 			var animationName = origin.getAttribute('animate')
 			var target = this.detail.querySelector(`[animate="${animationName}"]`)
 			if (!target) return
 			if (direction)
 				this.animateDetail(origin, target)
 			else
 				this.animateDetail(target, origin)
 		})
 	}
 
 	animateDetail(origin, target) {
 		var originBbox = origin.getBoundingClientRect()
 		var targetBbox = target.getBoundingClientRect()
 		var originStyle = window.getComputedStyle(origin)
 		var targetStyle = window.getComputedStyle(target)
 
 		var distanceX = targetBbox.left - originBbox.left
 		var distanceY = targetBbox.top - originBbox.top
 		var duration = animation.durationByDistance(Math.abs(distanceY))
 
 		if (isImage(origin) || isImage(target)) {
 			var ruleList = animationRuleLists.image
 			var doScale = true
 		} else {
 			var ruleList = animationRuleLists.text
 			var doScale = false
 		}
 
 		var rules = {}
 		ruleList.forEach(key => {
 			rules[key] = [originStyle[key], targetStyle[key]]
 		})
 
 		if (doScale) {
 			var blank = 'translate3d(0px, 0px, 0) scale(1)'
 			var originCenterX = originBbox.left + (originBbox.width / 2)
 			var originCenterY = originBbox.top + (originBbox.height / 2)
 			var targetCenterX = targetBbox.left + (targetBbox.width / 2)
 			var targetCenterY = targetBbox.top + (targetBbox.height / 2)
 			var distanceX = targetCenterX - originCenterX
 			var distanceY = targetCenterY - originCenterY
 			var originEndScale = targetBbox.width / originBbox.width
 			var targetStartScale = originBbox.width / targetBbox.width
 			var originEnd   = `translate3d(${distanceX}px, ${distanceY}px, 0) scale(${originEndScale})`
 			var targetStart = `translate3d(${-distanceX}px, ${-distanceY}px, 0) scale(${targetStartScale})`
 			var originRules = Object.assign({transform: [blank, originEnd]}, rules)
 			var targetRules = Object.assign({transform: [targetStart, blank]}, rules)
 		} else {
 			var blank = 'translate3d(0px, 0px, 0)'
 			var originEnd   = `translate3d(${distanceX}px, ${distanceY}px, 0)`
 			var targetStart = `translate3d(${-distanceX}px, ${-distanceY}px, 0)`
 			var originRules = Object.assign({transform: [blank, originEnd]}, rules)
 			var targetRules = Object.assign({transform: [targetStart, blank]}, rules)
 		}
 
 		var options = {
 			duration,
 			easing: 'ease-in-out'
 		}
 
 		var originAnimation
 		var targetAnimation
 
 		if (this.transitionDuration > duration) {
 			options.fill = 'forwards'
 			this.viewAnimation.finished.then(() => {
 				originAnimation.cancel()
 				targetAnimation.cancel()
 			})
 		}
 
 		originAnimation = origin.animate(originRules, options)
 		targetAnimation = target.animate(targetRules, options)
 
 		Promise.all([
 			originAnimation.finished,
 			targetAnimation.finished,
 		]).then(() => {
 		})
 	}
 */
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'selected', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return 'master';
	}
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'type', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return String;
	}
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'dismissable', [ganymede.reflect], {
	enumerable: true,
	initializer: function () {
		return undefined;
	}
}), _applyDecoratedDescriptor(_class2.prototype, 'resizeMasterDetail', [ganymede.autobind], Object.getOwnPropertyDescriptor(_class2.prototype, 'resizeMasterDetail'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onClick', [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, 'onClick'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onDetailShow', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'onDetailShow'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onDetailHide', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'onDetailHide'), _class2.prototype)), _class2)) || _class);


function isImage(target) {
	return target.localName === 'img' || target.style.backgroundImage || target.hasAttribute('avatar');
}

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NlbmUuanMiLCJzb3VyY2VzIjpbInNyYy9lbGVtZW50cy9zY2VuZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge18sIHRlbXBsYXRlLCBjc3MsIHJlZmxlY3QsIG9uLCBjdXN0b21FbGVtZW50LCBnYW55bWVkZUVsZW1lbnQsIGF1dG9iaW5kfSBmcm9tICdnYW55bWVkZSdcclxuaW1wb3J0IHthbmltYXRpb24sIHBsYXRmb3JtLCBkcmFnZ2FibGUsIGNsYW1wLCBCcmVha3BvaW50YWJsZX0gZnJvbSAnZmxleHVzJ1xyXG5cclxuXHJcbnZhciBhbmltYXRpb25SdWxlTGlzdHMgPSB7XHJcblx0dGV4dDogWydmb250U2l6ZScsICdmb250V2VpZ2h0JywgJ2JhY2tncm91bmRDb2xvcicsICdjb2xvciddLFxyXG5cdC8vaW1hZ2U6IFsnYmFja2dyb3VuZENvbG9yJywgLyond2lkdGgnLCAnaGVpZ2h0JywqLyAnYm9yZGVyUmFkaXVzJ10sXHJcblx0aW1hZ2U6IFtdLFxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93Vmlldyh2aWV3KSB7XHJcblx0dmlldy5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXHJcbn1cclxuZnVuY3Rpb24gaGlkZVZpZXcodmlldykge1xyXG5cdHZpZXcuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJylcclxufVxyXG5cclxuLy9AdGVtcGxhdGUoYFxyXG4vL1x0PHNsb3Q+PC9zbG90PlxyXG4vL1x0PHByZSBpZD1cInN0YXRlXCI+PC9wcmU+XHJcbi8vYClcclxuLy9AY3NzKGBcclxuLy8jc3RhdGUge1xyXG4vL1x0cG9zaXRpb246IGFic29sdXRlO1xyXG4vL1x0ei1pbmRleDogOTk5O1xyXG4vL1x0bGVmdDogNXB4O1xyXG4vL1x0Ym90dG9tOiA1cHg7XHJcbi8vXHRwYWRkaW5nOiA1cHg7XHJcbi8vXHRiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDAuNSlcclxuLy99XHJcbi8vYClcclxuXHJcbkBjdXN0b21FbGVtZW50XHJcbmNsYXNzIEZsZXh1c1NjZW5lIGV4dGVuZHMgZ2FueW1lZGVFbGVtZW50KEJyZWFrcG9pbnRhYmxlKSB7XHJcblxyXG5cdC8vQHJlZmxlY3QgdmVydGljYWwgPSBQbGF0Zm9ybUJvb2xcclxuXHJcblx0QHJlZmxlY3Qgc2VsZWN0ZWQgPSAnbWFzdGVyJ1xyXG5cclxuXHRAcmVmbGVjdCB0eXBlID0gU3RyaW5nXHJcblx0Ly9AcmVmbGVjdCBub092ZXJsYXkgPSB1bmRlZmluZWRcclxuXHRAcmVmbGVjdCBkaXNtaXNzYWJsZSA9IHVuZGVmaW5lZFxyXG5cclxuXHR0cmFuc2l0aW9uRHVyYXRpb24gPSAzMDBcclxuXHJcblx0cmVhZHkoKSB7XHJcblx0fVxyXG5cclxuXHRyZWFkeSgpIHtcclxuXHRcdHRoaXMubWFzdGVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiBbbWFzdGVyXScpXHJcblx0XHR0aGlzLmRldGFpbCA9IHRoaXMucXVlcnlTZWxlY3RvcignOnNjb3BlID4gW2RldGFpbF0nKVxyXG5cdFx0aWYgKCF0aGlzLm1hc3Rlcikge1xyXG5cdFx0XHR2YXIgdmlld3MgPSBBcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbCgnZmxleHVzLXZpZXcnKSlcclxuXHRcdFx0dGhpcy5tYXN0ZXIgPSB2aWV3c1swXVxyXG5cdFx0XHR0aGlzLmRldGFpbCA9IHZpZXdzWzFdXHJcblx0XHRcdHRoaXMubWFzdGVyLnNldEF0dHJpYnV0ZSgnbWFzdGVyJywgJycpXHJcblx0XHRcdHRoaXMuZGV0YWlsLnNldEF0dHJpYnV0ZSgnZGV0YWlsJywgJycpXHJcblx0XHR9XHJcblx0XHR0aGlzLmRldGFpbFRvb2xiYXIgPSB0aGlzLmRldGFpbC5xdWVyeVNlbGVjdG9yKCdmbGV4dXMtdG9vbGJhcicpXHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLmRldGFpbClcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMuZGV0YWlsVG9vbGJhcilcclxuLypcclxuXHRcdGlmIChwbGF0Zm9ybS5zY3JlZW5zaXplID09PSAncycpIHtcclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWQgPT09ICdtYXN0ZXInKVxyXG5cdFx0XHRcdHRoaXMuaGlkZURldGFpbCgpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLnNob3dEZXRhaWwoKVxyXG5cdFx0fVxyXG4qL1xyXG5cdFx0aWYgKHRoaXMudHlwZSA9PT0gJ21hc3Rlci1kZXRhaWwnKSB7XHJcblx0XHRcdHRoaXMucmVzaXplTWFzdGVyRGV0YWlsKClcclxuXHRcdFx0dGhpcy5vbihkb2N1bWVudCwgJ3NjcmVlbnNpemUtdXBkYXRlJywgdGhpcy5yZXNpemVNYXN0ZXJEZXRhaWwpXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0QGF1dG9iaW5kIHJlc2l6ZU1hc3RlckRldGFpbCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCctLS0tLS0tLS0gcmVzaXplTWFzdGVyRGV0YWlsIC0tLS0tLS0tLS0tLS0tJylcclxuXHRcdGNvbnNvbGUubG9nKCdwbGF0Zm9ybS5zY3JlZW5zaXplJywgcGxhdGZvcm0uc2NyZWVuc2l6ZSlcclxuXHRcdGNvbnNvbGUubG9nKCd0aGlzLnNlbGVjdGVkJywgdGhpcy5zZWxlY3RlZClcclxuXHRcdGlmICh0aGlzLnNlbGVjdGVkID09PSAnZGV0YWlsJykge1xyXG5cdFx0XHRpZiAocGxhdGZvcm0uc2NyZWVuc2l6ZSA9PT0gJ3MnKVxyXG5cdFx0XHRcdHRoaXMubmF2aWdhdGVUb0RldGFpbCgpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLnNob3dEZXRhaWwoKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5oaWRlRGV0YWlsKClcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmRldGFpbFRvb2xiYXIpXHJcblx0XHRcdHRoaXMuZGV0YWlsVG9vbGJhci5yZWZyZXNoU2Nyb2xsKClcclxuXHR9XHJcblxyXG5cclxuXHRAb24oJ2NsaWNrJylcclxuXHRvbkNsaWNrKHZhbHVlLCB7dGFyZ2V0fSkge1xyXG5cdFx0aWYgKHRhcmdldC5tYXRjaGVzKGBbc2hvdy1kZXRhaWxdLFxyXG5cdFx0XHRcdFx0XHRcdGZsZXh1cy12aWV3W21hc3Rlcl0gYVtocmVmXTpub3QoW3Nob3ctZGV0YWlsPVwiZmFsc2VcIl0pLFxyXG5cdFx0XHRcdFx0XHRcdGZsZXh1cy12aWV3W21hc3Rlcl0gYVtocmVmXTpub3QoW3Nob3ctZGV0YWlsPVwiZmFsc2VcIl0pID4gKmApKVxyXG5cdFx0XHR0aGlzLm5hdmlnYXRlVG9EZXRhaWwoKVxyXG5cdFx0aWYgKHRhcmdldC5tYXRjaGVzKCdmbGV4dXMtdmlld1tkZXRhaWxdIFtpY29uPVwiYXJyb3ctYmFja1wiXTpub3QoW2hpZGUtZGV0YWlsPVwiZmFsc2VcIl0pLCBbaGlkZS1kZXRhaWxdJykpXHJcblx0XHRcdHRoaXMuaGlkZURldGFpbCgpXHJcblx0fVxyXG5cclxuXHRuYXZpZ2F0ZVRvRGV0YWlsKCkge1xyXG5cdFx0dGhpcy5zaG93RGV0YWlsKClcclxuXHRcdGlmICh0aGlzLmRldGFpbFRvb2xiYXIpIHtcclxuXHRcdFx0dGhpcy5kZXRhaWxUb29sYmFyLnJlc2V0U2Nyb2xsKClcclxuXHRcdFx0LyppZiAodGhpcy5kZXRhaWxUb29sYmFyLnNjcm9sbFRhcmdldC5zY3JvbGxUb3ApXHJcblx0XHRcdFx0dGhpcy5kZXRhaWxUb29sYmFyLnNjcm9sbFRhcmdldC5zY3JvbGxUb3AgPSAwXHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB0aGlzLmRldGFpbFRvb2xiYXIuc2Nyb2xsVGFyZ2V0LnNjcm9sbFRvcCA9IDAsIDUwMClcclxuXHRcdFx0aWYgKHRoaXMuZGV0YWlsVG9vbGJhci5tZWFzdXJlSGVpZ2h0KSB7XHJcblx0XHRcdFx0Ly8gbWVhc3VyZSBpbW1lZGlhdGVseVxyXG5cdFx0XHRcdHRoaXMuZGV0YWlsVG9vbGJhci5tZWFzdXJlSGVpZ2h0KClcclxuXHRcdFx0XHQvLyBkbyBhbm90aGVyIG1lYXN1cmVtZW50IGluIGNhc2UgdGhlIGZpcnN0IG9uZSB3YXMgdG9vIHNvb25cclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHRoaXMuZGV0YWlsVG9vbGJhci5tZWFzdXJlSGVpZ2h0KCksIDUwMClcclxuXHRcdFx0fSovXHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuZGV0YWlsLnNjcm9sbFRhcmdldClcclxuXHRcdFx0dGhpcy5kZXRhaWwuc2Nyb2xsVGFyZ2V0LnNjcm9sbFRvcCA9IDBcclxuXHR9XHJcblxyXG5cdHNob3dEZXRhaWwoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnc2hvd0RldGFpbCcpXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gJ2RldGFpbCdcclxuXHRcdHNob3dWaWV3KHRoaXMuZGV0YWlsKVxyXG5cdFx0aWYgKHBsYXRmb3JtLnNjcmVlbnNpemUgPT09ICdzJylcclxuXHRcdFx0aGlkZVZpZXcodGhpcy5tYXN0ZXIpXHJcblx0XHRlbHNlXHJcblx0XHRcdHNob3dWaWV3KHRoaXMubWFzdGVyKVxyXG5cdH1cclxuXHJcblx0aGlkZURldGFpbCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdoaWRlRGV0YWlsJylcclxuXHRcdHRoaXMuc2VsZWN0ZWQgPSAnbWFzdGVyJ1xyXG5cdFx0c2hvd1ZpZXcodGhpcy5tYXN0ZXIpXHJcblx0XHRpZiAocGxhdGZvcm0uc2NyZWVuc2l6ZSA9PT0gJ3MnKVxyXG5cdFx0XHRoaWRlVmlldyh0aGlzLmRldGFpbClcclxuXHRcdGVsc2VcclxuXHRcdFx0c2hvd1ZpZXcodGhpcy5kZXRhaWwpXHJcblx0fVxyXG5cclxuXHRAb24oJ2RldGFpbCcsICdzaG93JylcclxuXHRvbkRldGFpbFNob3coKSB7XHJcblx0XHRjb25zb2xlLmxvZygnb25EZXRhaWxTaG93JylcclxuXHRcdGhpZGVWaWV3KHRoaXMubWFzdGVyKVxyXG5cdFx0Ly9zaG93Vmlldyh0aGlzLmRldGFpbClcclxuXHRcdHRoaXMuc2VsZWN0ZWQgPSAnZGV0YWlsJ1xyXG5cdH1cclxuXHJcblx0QG9uKCdkZXRhaWwnLCAnaGlkZScpXHJcblx0b25EZXRhaWxIaWRlKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ29uRGV0YWlsSGlkZScpXHJcblx0XHRzaG93Vmlldyh0aGlzLm1hc3RlcilcclxuXHRcdC8vaGlkZVZpZXcodGhpcy5kZXRhaWwpXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gJ21hc3RlcidcclxuXHR9XHJcbi8qXHJcblx0bWFzdGVyU2hvdygpIHtcclxuXHRcdHNob3dWaWV3KHRoaXMubWFzdGVyKVxyXG5cdFx0aGlkZVZpZXcodGhpcy5kZXRhaWwpXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gJ21hc3RlcidcclxuXHR9XHJcblx0ZGV0YWlsSGlkZSgpIHtcclxuXHRcdHNob3dWaWV3KHRoaXMubWFzdGVyKVxyXG5cdFx0aGlkZVZpZXcodGhpcy5kZXRhaWwpXHJcblx0XHR0aGlzLnNlbGVjdGVkID0gJ21hc3RlcidcclxuXHR9XHJcblxyXG5cdG1hc3RlckhpZGUoKSB7XHJcblx0XHRoaWRlVmlldyh0aGlzLm1hc3RlcilcclxuXHRcdHNob3dWaWV3KHRoaXMuZGV0YWlsKVxyXG5cdFx0dGhpcy5zZWxlY3RlZCA9ICdkZXRhaWwnXHJcblx0fVxyXG5cdGRldGFpbFNob3coKSB7XHJcblx0XHRoaWRlVmlldyh0aGlzLm1hc3RlcilcclxuXHRcdHNob3dWaWV3KHRoaXMuZGV0YWlsKVxyXG5cdFx0dGhpcy5zZWxlY3RlZCA9ICdkZXRhaWwnXHJcblx0fVxyXG4qL1xyXG5cclxuXHJcbi8qXHJcblx0YW5pbWF0ZVZpZXdzKHRvQmVIaWRkZW5WaWV3LCB0b0JlU2hvd25WaWV3KSB7XHJcblx0XHQvL3RoaXMuZW1pdCgnY2hhbmdlJywgJ2RldGFpbCcpXHJcblx0XHQvL3RoaXMuaGlkZVZpZXcodGhpcy5tYXN0ZXIpXHJcblxyXG5cdFx0dmFyIGFkZEhlbHBlckF0dHJzID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmRldGFpbC5zZXRBdHRyaWJ1dGUoJ2ZpdCcsICcnKVxyXG5cdFx0XHR0b0JlSGlkZGVuVmlldy5zdHlsZS56SW5kZXggPSAwXHJcblx0XHRcdHRvQmVTaG93blZpZXcuc3R5bGUuekluZGV4ID0gMVxyXG5cdFx0fVxyXG5cdFx0dmFyIHJlbW92ZUhlbHBlckF0dHJzID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmRldGFpbC5yZW1vdmVBdHRyaWJ1dGUoJ2ZpdCcpXHJcblx0XHRcdHRvQmVIaWRkZW5WaWV3LnN0eWxlLnpJbmRleCA9ICcnXHJcblx0XHRcdHRvQmVTaG93blZpZXcuc3R5bGUuekluZGV4ID0gJydcclxuXHRcdH1cclxuXHJcblx0XHRhZGRIZWxwZXJBdHRycygpXHJcblx0XHQvL3RoaXMuc2hvd1ZpZXcodG9CZVNob3duVmlldylcclxuXHRcdFxyXG5cdFx0dG9CZUhpZGRlblZpZXcuc2V0QXR0cmlidXRlKCdvZmZzY3JlZW4nLCAnJylcclxuXHRcdHRvQmVTaG93blZpZXcucmVtb3ZlQXR0cmlidXRlKCdvZmZzY3JlZW4nKVxyXG5cdFx0dG9CZVNob3duVmlldy5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXHJcblxyXG5cdFx0dG9CZUhpZGRlblZpZXcuc2V0QXR0cmlidXRlKCdoaWRpbmcnLCAnJylcclxuXHRcdHRvQmVTaG93blZpZXcuc2V0QXR0cmlidXRlKCdzaG93aW5nJywgJycpXHJcblxyXG5cdFx0dGhpcy52aWV3QW5pbWF0aW9uID0gdG9CZVNob3duVmlldy5hbmltYXRlKHtcclxuXHRcdFx0b3BhY2l0eTogWzAsIDFdLFxyXG5cdFx0fSwge1xyXG5cdFx0XHRkdXJhdGlvbjogdGhpcy50cmFuc2l0aW9uRHVyYXRpb25cclxuXHRcdH0pXHJcblxyXG5cdFx0dGhpcy52aWV3QW5pbWF0aW9uLmZpbmlzaGVkLnRoZW4oKCkgPT4ge1xyXG5cdFx0XHRyZW1vdmVIZWxwZXJBdHRycygpXHJcblx0XHRcdC8vdGhpcy5oaWRlVmlldyh0b0JlSGlkZGVuVmlldylcclxuXHRcdFx0dG9CZUhpZGRlblZpZXcuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJylcclxuXHRcdFx0dG9CZUhpZGRlblZpZXcucmVtb3ZlQXR0cmlidXRlKCdoaWRpbmcnKVxyXG5cdFx0XHR0b0JlU2hvd25WaWV3LnJlbW92ZUF0dHJpYnV0ZSgnc2hvd2luZycpXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0YW5pbWF0ZURldGFpbHMoZGlyZWN0aW9uKSB7XHJcblx0XHRpZiAoIXRoaXMubWFzdGVyT3JpZ2luKSByZXR1cm5cclxuXHRcdHZhciBhbmltYXRpb25Qb2ludHMgPSBBcnJheS5mcm9tKHRoaXMubWFzdGVyT3JpZ2luLnF1ZXJ5U2VsZWN0b3JBbGwoJ1thbmltYXRlXScpKVxyXG5cdFx0YW5pbWF0aW9uUG9pbnRzLmZvckVhY2gob3JpZ2luID0+IHtcclxuXHRcdFx0dmFyIGFuaW1hdGlvbk5hbWUgPSBvcmlnaW4uZ2V0QXR0cmlidXRlKCdhbmltYXRlJylcclxuXHRcdFx0dmFyIHRhcmdldCA9IHRoaXMuZGV0YWlsLnF1ZXJ5U2VsZWN0b3IoYFthbmltYXRlPVwiJHthbmltYXRpb25OYW1lfVwiXWApXHJcblx0XHRcdGlmICghdGFyZ2V0KSByZXR1cm5cclxuXHRcdFx0aWYgKGRpcmVjdGlvbilcclxuXHRcdFx0XHR0aGlzLmFuaW1hdGVEZXRhaWwob3JpZ2luLCB0YXJnZXQpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLmFuaW1hdGVEZXRhaWwodGFyZ2V0LCBvcmlnaW4pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0YW5pbWF0ZURldGFpbChvcmlnaW4sIHRhcmdldCkge1xyXG5cdFx0dmFyIG9yaWdpbkJib3ggPSBvcmlnaW4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHRcdHZhciB0YXJnZXRCYm94ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblx0XHR2YXIgb3JpZ2luU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShvcmlnaW4pXHJcblx0XHR2YXIgdGFyZ2V0U3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQpXHJcblxyXG5cdFx0dmFyIGRpc3RhbmNlWCA9IHRhcmdldEJib3gubGVmdCAtIG9yaWdpbkJib3gubGVmdFxyXG5cdFx0dmFyIGRpc3RhbmNlWSA9IHRhcmdldEJib3gudG9wIC0gb3JpZ2luQmJveC50b3BcclxuXHRcdHZhciBkdXJhdGlvbiA9IGFuaW1hdGlvbi5kdXJhdGlvbkJ5RGlzdGFuY2UoTWF0aC5hYnMoZGlzdGFuY2VZKSlcclxuXHJcblx0XHRpZiAoaXNJbWFnZShvcmlnaW4pIHx8IGlzSW1hZ2UodGFyZ2V0KSkge1xyXG5cdFx0XHR2YXIgcnVsZUxpc3QgPSBhbmltYXRpb25SdWxlTGlzdHMuaW1hZ2VcclxuXHRcdFx0dmFyIGRvU2NhbGUgPSB0cnVlXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcnVsZUxpc3QgPSBhbmltYXRpb25SdWxlTGlzdHMudGV4dFxyXG5cdFx0XHR2YXIgZG9TY2FsZSA9IGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHJ1bGVzID0ge31cclxuXHRcdHJ1bGVMaXN0LmZvckVhY2goa2V5ID0+IHtcclxuXHRcdFx0cnVsZXNba2V5XSA9IFtvcmlnaW5TdHlsZVtrZXldLCB0YXJnZXRTdHlsZVtrZXldXVxyXG5cdFx0fSlcclxuXHJcblx0XHRpZiAoZG9TY2FsZSkge1xyXG5cdFx0XHR2YXIgYmxhbmsgPSAndHJhbnNsYXRlM2QoMHB4LCAwcHgsIDApIHNjYWxlKDEpJ1xyXG5cdFx0XHR2YXIgb3JpZ2luQ2VudGVyWCA9IG9yaWdpbkJib3gubGVmdCArIChvcmlnaW5CYm94LndpZHRoIC8gMilcclxuXHRcdFx0dmFyIG9yaWdpbkNlbnRlclkgPSBvcmlnaW5CYm94LnRvcCArIChvcmlnaW5CYm94LmhlaWdodCAvIDIpXHJcblx0XHRcdHZhciB0YXJnZXRDZW50ZXJYID0gdGFyZ2V0QmJveC5sZWZ0ICsgKHRhcmdldEJib3gud2lkdGggLyAyKVxyXG5cdFx0XHR2YXIgdGFyZ2V0Q2VudGVyWSA9IHRhcmdldEJib3gudG9wICsgKHRhcmdldEJib3guaGVpZ2h0IC8gMilcclxuXHRcdFx0dmFyIGRpc3RhbmNlWCA9IHRhcmdldENlbnRlclggLSBvcmlnaW5DZW50ZXJYXHJcblx0XHRcdHZhciBkaXN0YW5jZVkgPSB0YXJnZXRDZW50ZXJZIC0gb3JpZ2luQ2VudGVyWVxyXG5cdFx0XHR2YXIgb3JpZ2luRW5kU2NhbGUgPSB0YXJnZXRCYm94LndpZHRoIC8gb3JpZ2luQmJveC53aWR0aFxyXG5cdFx0XHR2YXIgdGFyZ2V0U3RhcnRTY2FsZSA9IG9yaWdpbkJib3gud2lkdGggLyB0YXJnZXRCYm94LndpZHRoXHJcblx0XHRcdHZhciBvcmlnaW5FbmQgICA9IGB0cmFuc2xhdGUzZCgke2Rpc3RhbmNlWH1weCwgJHtkaXN0YW5jZVl9cHgsIDApIHNjYWxlKCR7b3JpZ2luRW5kU2NhbGV9KWBcclxuXHRcdFx0dmFyIHRhcmdldFN0YXJ0ID0gYHRyYW5zbGF0ZTNkKCR7LWRpc3RhbmNlWH1weCwgJHstZGlzdGFuY2VZfXB4LCAwKSBzY2FsZSgke3RhcmdldFN0YXJ0U2NhbGV9KWBcclxuXHRcdFx0dmFyIG9yaWdpblJ1bGVzID0gT2JqZWN0LmFzc2lnbih7dHJhbnNmb3JtOiBbYmxhbmssIG9yaWdpbkVuZF19LCBydWxlcylcclxuXHRcdFx0dmFyIHRhcmdldFJ1bGVzID0gT2JqZWN0LmFzc2lnbih7dHJhbnNmb3JtOiBbdGFyZ2V0U3RhcnQsIGJsYW5rXX0sIHJ1bGVzKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGJsYW5rID0gJ3RyYW5zbGF0ZTNkKDBweCwgMHB4LCAwKSdcclxuXHRcdFx0dmFyIG9yaWdpbkVuZCAgID0gYHRyYW5zbGF0ZTNkKCR7ZGlzdGFuY2VYfXB4LCAke2Rpc3RhbmNlWX1weCwgMClgXHJcblx0XHRcdHZhciB0YXJnZXRTdGFydCA9IGB0cmFuc2xhdGUzZCgkey1kaXN0YW5jZVh9cHgsICR7LWRpc3RhbmNlWX1weCwgMClgXHJcblx0XHRcdHZhciBvcmlnaW5SdWxlcyA9IE9iamVjdC5hc3NpZ24oe3RyYW5zZm9ybTogW2JsYW5rLCBvcmlnaW5FbmRdfSwgcnVsZXMpXHJcblx0XHRcdHZhciB0YXJnZXRSdWxlcyA9IE9iamVjdC5hc3NpZ24oe3RyYW5zZm9ybTogW3RhcmdldFN0YXJ0LCBibGFua119LCBydWxlcylcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgb3B0aW9ucyA9IHtcclxuXHRcdFx0ZHVyYXRpb24sXHJcblx0XHRcdGVhc2luZzogJ2Vhc2UtaW4tb3V0J1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBvcmlnaW5BbmltYXRpb25cclxuXHRcdHZhciB0YXJnZXRBbmltYXRpb25cclxuXHJcblx0XHRpZiAodGhpcy50cmFuc2l0aW9uRHVyYXRpb24gPiBkdXJhdGlvbikge1xyXG5cdFx0XHRvcHRpb25zLmZpbGwgPSAnZm9yd2FyZHMnXHJcblx0XHRcdHRoaXMudmlld0FuaW1hdGlvbi5maW5pc2hlZC50aGVuKCgpID0+IHtcclxuXHRcdFx0XHRvcmlnaW5BbmltYXRpb24uY2FuY2VsKClcclxuXHRcdFx0XHR0YXJnZXRBbmltYXRpb24uY2FuY2VsKClcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRvcmlnaW5BbmltYXRpb24gPSBvcmlnaW4uYW5pbWF0ZShvcmlnaW5SdWxlcywgb3B0aW9ucylcclxuXHRcdHRhcmdldEFuaW1hdGlvbiA9IHRhcmdldC5hbmltYXRlKHRhcmdldFJ1bGVzLCBvcHRpb25zKVxyXG5cclxuXHRcdFByb21pc2UuYWxsKFtcclxuXHRcdFx0b3JpZ2luQW5pbWF0aW9uLmZpbmlzaGVkLFxyXG5cdFx0XHR0YXJnZXRBbmltYXRpb24uZmluaXNoZWQsXHJcblx0XHRdKS50aGVuKCgpID0+IHtcclxuXHRcdH0pXHJcblx0fVxyXG4qL1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNJbWFnZSh0YXJnZXQpIHtcclxuXHRyZXR1cm4gdGFyZ2V0LmxvY2FsTmFtZSA9PT0gJ2ltZycgfHwgdGFyZ2V0LnN0eWxlLmJhY2tncm91bmRJbWFnZSB8fCB0YXJnZXQuaGFzQXR0cmlidXRlKCdhdmF0YXInKVxyXG59Il0sIm5hbWVzIjpbImFuaW1hdGlvblJ1bGVMaXN0cyIsInNob3dWaWV3IiwidmlldyIsInJlbW92ZUF0dHJpYnV0ZSIsImhpZGVWaWV3Iiwic2V0QXR0cmlidXRlIiwiRmxleHVzU2NlbmUiLCJvbiIsImN1c3RvbUVsZW1lbnQiLCJnYW55bWVkZUVsZW1lbnQiLCJCcmVha3BvaW50YWJsZSIsInRyYW5zaXRpb25EdXJhdGlvbiIsIm1hc3RlciIsInF1ZXJ5U2VsZWN0b3IiLCJkZXRhaWwiLCJ2aWV3cyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJkZXRhaWxUb29sYmFyIiwibG9nIiwidHlwZSIsInJlc2l6ZU1hc3RlckRldGFpbCIsImRvY3VtZW50IiwicGxhdGZvcm0iLCJzY3JlZW5zaXplIiwic2VsZWN0ZWQiLCJuYXZpZ2F0ZVRvRGV0YWlsIiwic2hvd0RldGFpbCIsImhpZGVEZXRhaWwiLCJyZWZyZXNoU2Nyb2xsIiwidmFsdWUiLCJ0YXJnZXQiLCJtYXRjaGVzIiwicmVzZXRTY3JvbGwiLCJzY3JvbGxUYXJnZXQiLCJzY3JvbGxUb3AiLCJyZWZsZWN0IiwiU3RyaW5nIiwidW5kZWZpbmVkIiwiYXV0b2JpbmQiLCJpc0ltYWdlIiwibG9jYWxOYW1lIiwic3R5bGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJoYXNBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQ0EsQUFHQSxJQUFJQSxxQkFBcUI7T0FDbEIsQ0FBQyxVQUFELEVBQWEsWUFBYixFQUEyQixpQkFBM0IsRUFBOEMsT0FBOUMsQ0FEa0I7O1FBR2pCO0NBSFI7O0FBTUEsU0FBU0MsUUFBVCxDQUFrQkMsSUFBbEIsRUFBd0I7TUFDbEJDLGVBQUwsQ0FBcUIsUUFBckI7O0FBRUQsU0FBU0MsUUFBVCxDQUFrQkYsSUFBbEIsRUFBd0I7TUFDbEJHLFlBQUwsQ0FBa0IsUUFBbEIsRUFBNEIsRUFBNUI7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1CS0Msc0JBNERKQyxZQUFHLE9BQUgs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
