const PRESSED  = 1;
const RELEASED = 0;

export default class Keyboard {
	constructor(){
		// Stores states of different keys (pressed or not). We want to ignore keys that are already pressed.
		this.keyStates = new Map(); 

		// Holds the function to call for a key code (callbacks) 
		this.keyMap = new Map(); 
	}

	addMapping(code, callback){
		this.keyMap.set(code, callback);
	}

	handleEvent(event){
		const {code} = event;

		if(!this.keyMap.has(code)) {
			// Did not have key mapped
			return ;
		}

		event.preventDefault();

		const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

		if(this.keyStates.get(code) === keyState) {
			return;
		}

		this.keyStates.set(code, keyState);

		this.keyMap.get(code)(keyState);
	}

	listenTo(window){
		['keydown','keyup'].forEach(eventName =>  {
			window.addEventListener(eventName, event => {
				this.handleEvent(event);
			});
		});
		
	}
}

export function setupKeyboard(entity) {
	const input = new Keyboard();

	input.addMapping('Space', keyState => {
		if(keyState) {
			entity.jump.start();
		} else {
			entity.jump.cancel();
		}
	})

	input.addMapping('ArrowRight', keyState => {
		entity.move.dir = keyState;
	})
	input.addMapping('ArrowLeft', keyState => {
		entity.move.dir = -keyState;
	})
	return input;
}