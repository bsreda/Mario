import {loadLevel, loadFont} from './loaders.js';
import Entity from './Entity.js';
import {loadMario, loadGoomba, loadKoopa} from './entities.js';
import Timer from './Timer.js';
import View from './View.js'
import Keyboard, {setupKeyboard} from './controls.js';

import {createCollisionLayer, createViewLayer, createDashboardLayer} from './layers.js';



const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


Promise.all([  //Parallel loads
	loadMario(),
	loadGoomba(),
	loadKoopa(),
	loadFont(),
	loadLevel('1-1'), 
])
.then(([createMario, createGoomba, createKoopa, font, level]) => {
	
	const view = new View();

	const mario = createMario();
	mario.pos.set(64,64);
	level.entities.add(mario);

	level.goombas.forEach((pos) => {
		const goomba = createGoomba();
		goomba.pos.set(pos[0], pos[1]);
		level.entities.add(goomba);
	});

	level.koopas.forEach((pos) => {
		const koopa = createKoopa();
		koopa.pos.set(pos[0], pos[1]);
		level.entities.add(koopa);
	});



	level.cont.layers.push(
		createCollisionLayer(level),
		createViewLayer(view),
		createDashboardLayer(font, mario));

	
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

		view.pos.x = Math.max(0, mario.pos.x - 100);
		
		level.cont.draw(context, view);

	}
	timer.start();

	
});
