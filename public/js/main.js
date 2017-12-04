import {loadLevel} from './loaders.js'
import {loadMarioSprites, loadBackgroundSprites} from './sprites.js'
import Container, {createBackgroundLayer,createSpriteLayer} from './layers.js'


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([  //Parallel loads
	loadMarioSprites(),
	loadBackgroundSprites(),
	loadLevel('1-1'), 
])
.then(([marioSprite, backgroundSprites, level]) => {
	const cont = new Container();

	const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites) ; // We will have different backgrounds for different levels
	cont.layers.push(backgroundLayer);
	
	const pos = {
		x: 64,
		y: 64,
	}

	const spriteLayer = createSpriteLayer(marioSprite,pos);
	cont.layers.push(spriteLayer);

	function update(){
		cont.draw(context);
		marioSprite.draw('idle', context, pos.x, pos.y);
		pos.x += 1;
		requestAnimationFrame(update);
	}

	update();
	
});
