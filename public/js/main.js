import {loadLevel} from './loaders.js';

import Entity from './Entity.js';
import {initMario} from './entities.js';
import Timer from './Timer.js';
import Keyboard, {setupKeyboard} from './controls.js';

import {createCollisionLayer} from './layers.js';



const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


Promise.all([  //Parallel loads
	initMario(),
	loadLevel('1-1'), 
])
.then(([mario, level]) => {
	
	
	mario.pos.set(64,64);

	level.cont.layers.push(createCollisionLayer(level));

	level.entities.add(mario);

	
	const input = setupKeyboard(mario);

	

	input.listenTo(window);

	['mousedown', 'mousemove'].forEach(eventName => {
		canvas.addEventListener(eventName, event => {
			if (event.buttons === 1 ) {
				mario.vel.set(0,0);
				mario.pos.set(event.offsetX, event.offsetY);
			}
		})
	})

	const timer = new Timer(1/60);
	timer.update = function update(dt){
		level.update(dt);
		level.cont.draw(context);
	}
	timer.start();

	
});
