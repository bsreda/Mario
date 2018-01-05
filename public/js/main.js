import {loadLevel} from './loaders.js';
import {loadBackgroundSprites} from './sprites.js';
import Container, {createBackgroundLayer,createSpriteLayer} from './layers.js';
import Entity from './Entity.js';
import {initMario} from './entities.js';
import Timer from './Timer.js';
import Keyboard from './controls.js';


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


Promise.all([  //Parallel loads
	initMario(),
	loadBackgroundSprites(),
	loadLevel('1-1'), 
])
.then(([mario, backgroundSprites, level]) => {
	const cont = new Container();

	const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites) ; // We will have different backgrounds for different levels
	cont.layers.push(backgroundLayer);
	const gravity = 2000;
	mario.pos.set(64,180);
	//mario.vel.set(200,-600);

	const SPACE = 32;
	const input = new Keyboard();
	input.addMapping(SPACE, keyState => {
		if(keyState) {
			mario.jump.start();
		} else {
			mario.jump.cancel();
		}
	})

	input.listenTo(window);

	const spriteLayer = createSpriteLayer(mario);
	cont.layers.push(spriteLayer);

	let lastTime = 0;
	let accumulatedTime = 0;
	const timer = new Timer(1/60);
	timer.update = function update(dt){
		mario.update(dt);
		cont.draw(context);
		
		mario.vel.y += gravity * dt;
	}
	timer.start();

	
});
