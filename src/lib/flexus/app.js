import {autobind} from 'ganymede' // TODO: drop dependency on ganymede
import {platform} from './platform'
import {root, appElementReady} from './appElement'


// TODO: replace this with EventEmitter or something better
class ElementEmitter {
	constructor() {
		var delegate = this.root || document.createDocumentFragment()
		this.on = delegate.addEventListener.bind(delegate)
		this.off = delegate.removeEventListener.bind(delegate)
		this.removeListener = delegate.removeEventListener.bind(delegate)
		this.emit = name => delegate.dispatchEvent(new CustomEvent(name))
	}
}

class App extends ElementEmitter {

	// Backward compatibility
	get root() {
		return root
	}
	get rootReady() {
		return appElementReady
	}

}


export var app = new App