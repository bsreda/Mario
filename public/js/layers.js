import Entity from './Entity.js'
import Resolver from './Resolver.js';

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



export function createBackgroundLayer(level, tiles, sprites){ // High order function. Returns function that draws background layer
	const resolver = new Resolver(tiles)

	const buffer = document.createElement('canvas');
	buffer.width = 256 + 16;
	buffer.height = 240;

	const context = buffer.getContext('2d');

	function redraw(startIndex, endIndex) {
		context.clearRect(0, 0, buffer.width, buffer.height);


		for (let x = startIndex; x <= endIndex; ++x){
			const col = tiles.grid[x];
			if (col) {
				col.forEach((tile, y) => {
					if(sprites.animations.has(tile.name)){
						sprites.drawAnim(tile.name, context, x - startIndex, y, level.totalTime);
					}else {
						sprites.drawTile(tile.name, context, x - startIndex, y);
					}
					
				});
			}
		}
	}
	return function drawBackgroundLayer(context, view) {
		const drawWidth = resolver.toIndex(view.size.x);
		const drawFrom = resolver.toIndex(view.pos.x);
		const drawTo = drawFrom + drawWidth;
		redraw(drawFrom, drawTo);
		context.drawImage(buffer, 
			-view.pos.x % 16,
			-view.pos.y % 16);
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
				entity.bounds.left - view.pos.x,
				entity.bounds.top - view.pos.y,
			 	entity.size.x, entity.size.y);
			context.stroke();
		})

		resolvedTiles.length=0;
	}
}

export function createViewLayer(viewToDraw){
	return function drawViewRect(context, fromView){
		context.strokeStyle = 'purple';
		context.beginPath();
		context.rect(
			viewToDraw.pos.x - fromView.pos.x,
			viewToDraw.pos.y - fromView.pos.y,
			viewToDraw.size.x,
			viewToDraw.size.y);
		context.stroke();
	};
}

export function createDashboardLayer(font){
	const coins = 13;
    const score = 24500;
    const time = 26;
	return function drawDashboard(context){

		font.print('MARIO', context, 16, font.size);
		font.print(score.toString().padStart(6, '0'), context, 16, 2*font.size);

		font.print('@x' + coins.toString().padStart(2, '0'), context, 96, font.size)

		font.print('WORLD', context, 152, font.size);
		font.print('1-1', context, 160, 2*font.size);

		font.print('TIME', context, 208, font.size);
		font.print(time.toString().padStart(3, '0'), context, 216, 2*font.size);
	};
}

