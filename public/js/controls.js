const PRESSED  = 1;
const RELEASED = 0;

export default class Keyboard {
	constructor(){
		// Stores states of different keys (pressed or not). We want to ignore keys that are already pressed.
		this.keyStates = new Map(); 

		// Holds the function to call for a key code (callbacks) 
		this.keyMap = new Map(); 
	}

	addMapping(keyCode, callback){
		this.keyMap.set(keyCode, callback);
	}

	handleEvent(event){
		const {keyCode} = event;

		if(!this.keyMap.has(keyCode)) {
			// Did not have key mapped
			return ;
		}

		event.preventDefault();

		const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

		if(this.keyStates.get(keyCode) === keyState) {
			return;
		}

		this.keyStates.set(keyCode, keyState);

		this.keyMap.get(keyCode)(keyState);
	}

	listenTo(window){
		['keydown','keyup'].forEach(eventName =>  {
			window.addEventListener(eventName, event => {
				this.handleEvent(event);
			});
		});
		
	}
}