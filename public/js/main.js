import {loadLevel} from './loaders.js';
import Entity from './Entity.js';
import {initMario} from './entities.js';
import Timer from './Timer.js';
import View from './View.js'
import Keyboard, {setupKeyboard} from './controls.js';

import {createCollisionLayer} from './layers.js';



const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


Promise.all([  //Parallel loads
	initMario(),
	loadLevel('1-1'), 
])
.then(([mario, level]) => {
	
	const view = new View();

	mario.pos.set(64,64);

	level.cont.layers.push(createCollisionLayer(level));

	level.entities.add(mario);

	
	const input = setupKeyboard(mario);

	input.listenTo(window);

	//debug
	let lastEvent;
	['mousedown', 'mousemove'].forEach(eventName => {
		canvas.addEventListener(eventName, event => {
			if (event.buttons === 1 ) {
				mario.vel.set(0,0);
				mario.pos.set(
					event.offsetX + view.pos.x,
					event.offsetY + view.pos.y);
			} else if (event.buttons === 2 
				&& lastEvent && lastEvent.buttons === 2
				&& lastEvent.type === 'mousemove'){
				view.pos.x -= event.offsetX - lastEvent.offsetX;
			}
			lastEvent = event;
		});
	});
	canvas.addEventListener('contextmenu', event => {
		event.preventDefault();
	});

	const timer = new Timer(1/60);
	timer.update = function update(dt){
		level.update(dt);

		if (mario.pos.x > 100) {
			view.pos.x = mario.pos.x - 100
		}
		level.cont.draw(context, view);
	}
	timer.start();

	
});
