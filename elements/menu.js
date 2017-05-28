(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('ganymede'), require('flexus')) :
	typeof define === 'function' && define.amd ? define('menu', ['ganymede', 'flexus'], factory) :
	(factory(global.ganymede,global.flexus));
}(this, (function (ganymede,flexus) { 'use strict';

var _dec;
var _dec2;
var _class;

let FlexusMenu = (_dec = ganymede.css(flexus.platform.neon ? `
	:host {
		padding: 8px 0;
		flex-direction: column;
		display: none;
		border: 1px solid var(--color-contour, rgba(var(--theme-base), 0.35));
		background-color: var(--color-menu-bg, var(--color-bg));
		text-align: left !important;
	}

	/*:host-context([light]) {
		background-color: #f2f2f2;
	}
	:host-context([dark]) {
		background-color: #2b2b2b;
	}*/

	:host-context([light]) {
		--color-bg: #f2f2f2;
	}
	:host-context([dark]) {
		--color-bg: #2b2b2b;
	}
	:host([light]) {
		--color-bg: #f2f2f2;
	}
	:host([dark]) {
		--color-bg: #2b2b2b;
	}

	:host([narrow]) {
		padding: 0;
	}
	.wrapper ::slotted(*:not(hr)) {
		align-items: center;
		justify-content: flex-start !important;
		text-align: left !important;
		display: flex !important;
		margin: 0 !important;
		padding: 0 12px !important;
		height: 32px !important;
		min-height: initial !important;
		width: 100% !important;
		min-width: initial !important;
		background-color: transparent !important;
		border: none !important;
		transition: transform 0.2s;
		font-size: 15px !important;
		letter-spacing: 0 !important;
	}
	:host-context([touch]) .wrapper ::slotted(*:not(hr)) {
		height: 44px !important;
	}
	.wrapper ::slotted(*:not(hr):active) {
		transform: scale(0.98) !important;
	}

	.wrapper ::slotted(*:not(hr):hover) {
		background-color: rgba(var(--foreground-rgb), 0.1) !important;
	}
	.wrapper ::slotted(*:not(hr):active) {
		background-color: rgba(var(--foreground-rgb), 0.2) !important;
	}

	.wrapper ::slotted(hr) {
		border: none !important;
		width: initial !important;
		height: 1px !important;
		margin: 4px 12px !important;
		display: block !important;
	}
	
	/*.wrapper ::slotted([icon]):before {*/
	::slotted([icon]::before),
	::slotted([icon])::before {
		outline: 2px solid red !important;
	}
` : `
`), _dec2 = ganymede.template(`
	<div class="wrapper">
		<slot></slot>
	</div>
`), ganymede.customElement(_class = _dec(_class = _dec2(_class = class FlexusMenu extends ganymede.ganymedeElement(flexus.Visibility) {

	constructor() {
		super();
		//this.style.position = 'absolute'
		//this.style.backgroundColor = '#2b2b2b'
		//this.style.border = '1px solid #767676'
		//this.style.zIndex = '9999'
		console.log('constructor menu');
	}

	hiddenChanged() {
		console.log('MENU hiddenChanged');
		this.style.display = this.hidden ? 'none' : 'inline-block';
		console.log('this.style.display', this.style.display);
	}

}) || _class) || _class) || _class);

})));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZXMiOlsic3JjL2VsZW1lbnRzL21lbnUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt0ZW1wbGF0ZSwgY3NzLCByZWZsZWN0LCBjdXN0b21FbGVtZW50LCBnYW55bWVkZUVsZW1lbnR9IGZyb20gJ2dhbnltZWRlJ1xyXG5pbXBvcnQge3BsYXRmb3JtLCBpc1RvdWNoRXZlbnQsIFZpc2liaWxpdHl9IGZyb20gJ2ZsZXh1cydcclxuXHJcblxyXG5AY3VzdG9tRWxlbWVudFxyXG5AY3NzKHBsYXRmb3JtLm5lb24gPyBgXHJcblx0Omhvc3Qge1xyXG5cdFx0cGFkZGluZzogOHB4IDA7XHJcblx0XHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG5cdFx0ZGlzcGxheTogbm9uZTtcclxuXHRcdGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNvbG9yLWNvbnRvdXIsIHJnYmEodmFyKC0tdGhlbWUtYmFzZSksIDAuMzUpKTtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yLW1lbnUtYmcsIHZhcigtLWNvbG9yLWJnKSk7XHJcblx0XHR0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XHJcblx0fVxyXG5cclxuXHQvKjpob3N0LWNvbnRleHQoW2xpZ2h0XSkge1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogI2YyZjJmMjtcclxuXHR9XHJcblx0Omhvc3QtY29udGV4dChbZGFya10pIHtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6ICMyYjJiMmI7XHJcblx0fSovXHJcblxyXG5cdDpob3N0LWNvbnRleHQoW2xpZ2h0XSkge1xyXG5cdFx0LS1jb2xvci1iZzogI2YyZjJmMjtcclxuXHR9XHJcblx0Omhvc3QtY29udGV4dChbZGFya10pIHtcclxuXHRcdC0tY29sb3ItYmc6ICMyYjJiMmI7XHJcblx0fVxyXG5cdDpob3N0KFtsaWdodF0pIHtcclxuXHRcdC0tY29sb3ItYmc6ICNmMmYyZjI7XHJcblx0fVxyXG5cdDpob3N0KFtkYXJrXSkge1xyXG5cdFx0LS1jb2xvci1iZzogIzJiMmIyYjtcclxuXHR9XHJcblxyXG5cdDpob3N0KFtuYXJyb3ddKSB7XHJcblx0XHRwYWRkaW5nOiAwO1xyXG5cdH1cclxuXHQud3JhcHBlciA6OnNsb3R0ZWQoKjpub3QoaHIpKSB7XHJcblx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xyXG5cdFx0anVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0ICFpbXBvcnRhbnQ7XHJcblx0XHR0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XHJcblx0XHRkaXNwbGF5OiBmbGV4ICFpbXBvcnRhbnQ7XHJcblx0XHRtYXJnaW46IDAgIWltcG9ydGFudDtcclxuXHRcdHBhZGRpbmc6IDAgMTJweCAhaW1wb3J0YW50O1xyXG5cdFx0aGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XHJcblx0XHRtaW4taGVpZ2h0OiBpbml0aWFsICFpbXBvcnRhbnQ7XHJcblx0XHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG5cdFx0bWluLXdpZHRoOiBpbml0aWFsICFpbXBvcnRhbnQ7XHJcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xyXG5cdFx0Ym9yZGVyOiBub25lICFpbXBvcnRhbnQ7XHJcblx0XHR0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycztcclxuXHRcdGZvbnQtc2l6ZTogMTVweCAhaW1wb3J0YW50O1xyXG5cdFx0bGV0dGVyLXNwYWNpbmc6IDAgIWltcG9ydGFudDtcclxuXHR9XHJcblx0Omhvc3QtY29udGV4dChbdG91Y2hdKSAud3JhcHBlciA6OnNsb3R0ZWQoKjpub3QoaHIpKSB7XHJcblx0XHRoZWlnaHQ6IDQ0cHggIWltcG9ydGFudDtcclxuXHR9XHJcblx0LndyYXBwZXIgOjpzbG90dGVkKCo6bm90KGhyKTphY3RpdmUpIHtcclxuXHRcdHRyYW5zZm9ybTogc2NhbGUoMC45OCkgIWltcG9ydGFudDtcclxuXHR9XHJcblxyXG5cdC53cmFwcGVyIDo6c2xvdHRlZCgqOm5vdChocik6aG92ZXIpIHtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6IHJnYmEodmFyKC0tZm9yZWdyb3VuZC1yZ2IpLCAwLjEpICFpbXBvcnRhbnQ7XHJcblx0fVxyXG5cdC53cmFwcGVyIDo6c2xvdHRlZCgqOm5vdChocik6YWN0aXZlKSB7XHJcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKHZhcigtLWZvcmVncm91bmQtcmdiKSwgMC4yKSAhaW1wb3J0YW50O1xyXG5cdH1cclxuXHJcblx0LndyYXBwZXIgOjpzbG90dGVkKGhyKSB7XHJcblx0XHRib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcclxuXHRcdHdpZHRoOiBpbml0aWFsICFpbXBvcnRhbnQ7XHJcblx0XHRoZWlnaHQ6IDFweCAhaW1wb3J0YW50O1xyXG5cdFx0bWFyZ2luOiA0cHggMTJweCAhaW1wb3J0YW50O1xyXG5cdFx0ZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcclxuXHR9XHJcblx0XHJcblx0Lyoud3JhcHBlciA6OnNsb3R0ZWQoW2ljb25dKTpiZWZvcmUgeyovXHJcblx0OjpzbG90dGVkKFtpY29uXTo6YmVmb3JlKSxcclxuXHQ6OnNsb3R0ZWQoW2ljb25dKTo6YmVmb3JlIHtcclxuXHRcdG91dGxpbmU6IDJweCBzb2xpZCByZWQgIWltcG9ydGFudDtcclxuXHR9XHJcbmAgOiBgXHJcbmApXHJcbkB0ZW1wbGF0ZShgXHJcblx0PGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cclxuXHRcdDxzbG90Pjwvc2xvdD5cclxuXHQ8L2Rpdj5cclxuYClcclxuY2xhc3MgRmxleHVzTWVudSBleHRlbmRzIGdhbnltZWRlRWxlbWVudChWaXNpYmlsaXR5KSB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKVxyXG5cdFx0Ly90aGlzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xyXG5cdFx0Ly90aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjMmIyYjJiJ1xyXG5cdFx0Ly90aGlzLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgIzc2NzY3NidcclxuXHRcdC8vdGhpcy5zdHlsZS56SW5kZXggPSAnOTk5OSdcclxuXHRcdGNvbnNvbGUubG9nKCdjb25zdHJ1Y3RvciBtZW51JylcclxuXHR9XHJcblxyXG5cdGhpZGRlbkNoYW5nZWQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnTUVOVSBoaWRkZW5DaGFuZ2VkJylcclxuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IHRoaXMuaGlkZGVuID8gJ25vbmUnIDogJ2lubGluZS1ibG9jaydcclxuXHRcdGNvbnNvbGUubG9nKCd0aGlzLnN0eWxlLmRpc3BsYXknLCB0aGlzLnN0eWxlLmRpc3BsYXkpXHJcblx0fVxyXG5cclxufVxyXG5cclxuXHJcbiJdLCJuYW1lcyI6WyJGbGV4dXNNZW51IiwiY3NzIiwicGxhdGZvcm0iLCJuZW9uIiwidGVtcGxhdGUiLCJjdXN0b21FbGVtZW50IiwiZ2FueW1lZGVFbGVtZW50IiwiVmlzaWJpbGl0eSIsImxvZyIsInN0eWxlIiwiZGlzcGxheSIsImhpZGRlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLEFBQ0EsSUF3Rk1BLHFCQXBGTEMsYUFBSUMsZ0JBQVNDLElBQVQsR0FBaUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBQWpCLEdBNkVBO0NBN0VKLFdBK0VBQyxrQkFBVTs7OztDQUFWLEdBaEZBQyw2REFxRkQsTUFBTUwsVUFBTixTQUF5Qk0seUJBQWdCQyxpQkFBaEIsQ0FBekIsQ0FBcUQ7O2VBRXRDOzs7Ozs7VUFNTEMsR0FBUixDQUFZLGtCQUFaOzs7aUJBR2U7VUFDUEEsR0FBUixDQUFZLG9CQUFaO09BQ0tDLEtBQUwsQ0FBV0MsT0FBWCxHQUFxQixLQUFLQyxNQUFMLEdBQWMsTUFBZCxHQUF1QixjQUE1QztVQUNRSCxHQUFSLENBQVksb0JBQVosRUFBa0MsS0FBS0MsS0FBTCxDQUFXQyxPQUE3Qzs7Ozs7In0=
