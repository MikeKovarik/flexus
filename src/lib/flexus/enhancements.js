
// TODO: detect CPU, RAM and GPU and estimate how much material effects can the device handle
// to ensure best and jank free experience
//var cpuCores = navigator.hardwareConcurrency;


/*
function delegate(callback) {
document.addEventListener('click', e => {
	var el = e.target;
	while (el) {
		//console.log(el, el.localName);
		var name = el.localName;
		if (name == null) break;
		if (name == 'button') break;
		if (name == 'input') break;
		if (name == 'textarea') break;
		if (callback(el)) break;
		el = el.parentNode;
	}
})
}

delegate(elm => {
if (elm.getAttribute('expandable') != null) {
	//console.log('done', elm, elm.hasAttribute('expanded'));
	if (elm.hasAttribute('expanded')) {
		elm.removeAttribute('expanded');
		//var section = elm.querySelector('[expand]');
		//collapse(section);
	} else {
		// if there is another already expanded item within parent elemnt collapse it
		var otherExpanded = elm.parentNode.querySelector('[expanded]');
		if (otherExpanded) {
			otherExpanded.removeAttribute('expanded');
		}
		elm.setAttribute('expanded', '');
		//var section = elm.querySelector('[expand]');
		//expand(section);
	}
	return true;
} else {
	return false;
}
});

function expand(elm) {
elm.animate([
	{minHeight: 'initial', height: '0px'},
	{minHeight: 'initial', height: `${elm.offsetHeight}px`}
], 150)
//elm.style.overflow = 'hidden';
//elm.animate([
//	{minHeight: '0px', height: `${elm.offsetHeight}px`},
//	{minHeight: `${elm.offsetHeight}px`, height: `${elm.offsetHeight}px`}
//], 150)
}
function collapse(elm) {
elm.animate([
	{minHeight: 'initial', height: `${elm.offsetHeight}px`},
	{minHeight: 'initial', height: '0px'}
], 150)
}









var forEach = Array.prototype.forEach;



function materialEnhancements() {

var observer = new MutationObserver(mutationCallback);
function mutationCallback(mutations) {
	//console.log('mutations', mutations);
	mutations.forEach(mutation => {
		for (var i = 0; i < mutation.addedNodes.length; i++) {
			var node = mutation.addedNodes[i];
			//console.log('added', node)
			//if (node.localName == 'button') {
			//	addRipple(node);
			//}
		}
	})
}
observer.observe(document.body, {childList: true});

//document.addEventListener('DOMContentLoaded', function() {
setTimeout(() => {
	//var buttons = document.querySelectorAll('nexus-item, [nx-item], nexus-toolbar button');
	var buttons = document.querySelectorAll('[ink]');
	console.log('adding ripple to', buttons)
	//forEach.call(buttons, addRipple);
}, 2000)
//});

function addRipple(toElement) {
	// todo? create custom ripple
	var ripple = document.createElement('paper-ripple');
	toElement.appendChild(ripple);
}

}

//materialEnhancements();
*/
