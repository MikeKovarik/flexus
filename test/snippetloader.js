
//var link = document.querySelector('link[rel="import"]')
var link

var range = document.createRange()
var regex = /<body[^>]*>((.|[\n\r])*)<\/body>/im

loadFile()
window.addEventListener('hashchange', loadFile)

function loadFile() {
	if (link)
		link.remove()
	var name = location.hash.substr(1)
	if (!name)
		return
	var path = `${name}.html`
	/*
	link = document.createElement('link')
	link.rel = 'import'
	link.href = path
	link.onload = () => insertToDoc(link.import.body)
	document.head.appendChild(link)
	*/
	fetch(path)
		.then(res => res.text())
		.then(html => {
			//console.log('html', html)
			if (html.includes('</body>')) {
				var array_matches = regex.exec(html)
				var bodyCode = array_matches[1]
			} else {
				var bodyCode = html
			}
			var bodyFragment = range.createContextualFragment(bodyCode)
			console.log('bodyFragment', bodyFragment)
			insertToDoc(bodyFragment)
			//document.body.innerHTML = body
		})
}

function insertToDoc(fragment) {
	window.fragment = fragment
	var scripts = Array.from(fragment.querySelectorAll('script[src]'))
	scripts.forEach(node => node.remove())
	//document.body.innerHTML = fragment.innerHTML
	document.body.innerHTML = ''
	document.body.append(fragment)
}
