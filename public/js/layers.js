


export default class Container { // contains all the layers to display
	constructor() {
		this.layers = []; // array of layers. A layer is a function that draws in a context
	}
	draw(context){
		this.layers.forEach(layer => { 
			layer(context);
		});
	}
}

function drawBackground(background, context, sprites){ // draws background using sprites in given ranges within context
	background.ranges.forEach(([x1, x2, y1, y2]) =>{
		for(let x = x1; x < x2; ++x){
			for(let y = y1; y < y2; ++y){
				sprites.drawTile(background.tile,context,x,y);
			}
		}
	});
}

export function createBackgroundLayer(backgrounds, sprites){ // High order function. Returns function that draws background layer
	const buffer = document.createElement('canvas');
	buffer.width = 25*16;
	buffer.height = 14*16;

	backgrounds.forEach(background => {
		drawBackground(background,buffer.getContext('2d'),sprites);
	});

	return function drawBackgroundLayer(context) {
		context.drawImage(buffer, 0, 0);
	}
}

export function createSpriteLayer(sprite, pos){ // High order function. Returns function that draws sprite layer
	return function drawSpriteLayer(context) {
		sprite.draw('idle', context, pos.x, pos.y);
	}
}