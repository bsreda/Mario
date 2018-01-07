import Entity from './Entity.js'


export default class Container { // contains all the layers to display
	constructor() {
		this.layers = []; // array of layers. A layer is a function that draws in a context
	}
	draw(context, view){
		this.layers.forEach(layer => { 
			layer(context, view);
		});
	}
}



export function createBackgroundLayer(level, sprites){ // High order function. Returns function that draws background layer
	const buffer = document.createElement('canvas');
	buffer.width = 200*16;
	buffer.height = 14*16;

	const context = buffer.getContext('2d');

	level.tiles.forEach((tile, x, y) => {
		sprites.drawTile(tile.name,context,x,y);
	});

	return function drawBackgroundLayer(context, view) {
		context.drawImage(buffer, -view.pos.x, -view.pos.y);
	}
}

export function createSpriteLayer(entities, width = 64, height = 64){ // High order function. Returns function that draws sprite layer
	const spriteBuffer = document.createElement('canvas');
	spriteBuffer.width = width;
	spriteBuffer.height = height;
	const spriteBufferContext = spriteBuffer.getContext('2d');

	return function drawSpriteLayer(context, view) {
		entities.forEach(entity => {
			spriteBufferContext.clearRect(0,0,width, height)
			entity.draw(spriteBufferContext);
			context.drawImage(
				spriteBuffer,
				entity.pos.x - view.pos.x,
				entity.pos.y - view.pos.y);
		})	
	}
}

export function createCollisionLayer(level) {
	const resolvedTiles = [];

	const resolver = level.collider.tiles;
	const tileSize = resolver.tileSize;

	const getByIndexOriginal = resolver.getByIndex;
	resolver.getByIndex = function getByIndexFake(x, y) {
		resolvedTiles.push({x, y});
		return getByIndexOriginal.call(resolver, x, y);
	}

	return function drawCollision(context, view) {
		context.strokeStyle = 'blue';
		resolvedTiles.forEach(({x, y}) =>{
			context.beginPath();
			context.rect(
				x*tileSize - view.pos.x, y*tileSize - view.pos.y,
			 	tileSize, tileSize);
			context.stroke();
		});

		context.strokeStyle = 'red';
		level.entities.forEach(entity => {
			context.beginPath();
			context.rect(
				entity.pos.x - view.pos.x,
				entity.pos.y - view.pos.y,
			 	entity.size.x, entity.size.y);
			context.stroke();
		})

		resolvedTiles.length=0;
	}
}

