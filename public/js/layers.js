import Entity from './Entity.js'


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



export function createBackgroundLayer(level, sprites){ // High order function. Returns function that draws background layer
	const buffer = document.createElement('canvas');
	buffer.width = 25*16;
	buffer.height = 14*16;

	const context = buffer.getContext('2d');

	level.tiles.forEach((tile, x, y) => {
		sprites.drawTile(tile.name,context,x,y);
	});

	return function drawBackgroundLayer(context) {
		context.drawImage(buffer, 0, 0);
	}
}

export function createSpriteLayer(entities){ // High order function. Returns function that draws sprite layer
	return function drawSpriteLayer(context) {
		entities.forEach(entity => {
			entity.draw(context);
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

	return function drawCollision(context) {
		context.strokeStyle = 'blue';
		resolvedTiles.forEach(({x, y}) =>{
			context.beginPath();
			context.rect(
				x*tileSize, y*tileSize,
			 	tileSize, tileSize);
			context.stroke();
		});

		context.strokeStyle = 'red';
		level.entities.forEach(entity => {
			context.beginPath();
			context.rect(
				entity.pos.x, entity.pos.y,
			 	entity.size.x, entity.size.y);
			context.stroke();
		})

		resolvedTiles.length=0;
	}
}