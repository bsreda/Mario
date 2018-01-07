import Level from './Level.js';
import {createBackgroundLayer,createSpriteLayer} from './layers.js';
import SpriteSheet from './SpriteSheet.js'

export function loadImage(url){
	return new Promise(resolve=>{
		const image = new Image();
		image.addEventListener('load',()=>{
			resolve(image);
		});
		image.src = url;
	});
	
}

function loadJSON(url) {
	return fetch(url)
	.then(r => r.json());
}

function createTiles(level, backgrounds) {

	function applyRange(background, xStart, xLen, yStart, yLen) {
		const xEnd = xStart + xLen;
		const yEnd = yStart + yLen;
		for(let x = xStart; x < xEnd; ++x){
			for(let y = yStart; y < yEnd; ++y){
				level.tiles.set(x, y, {
					name: background.tile,
					type: background.type,
				});
			}
		}
	}
	backgrounds.forEach(background => {
		background.ranges.forEach(range =>{
			if (range.length === 4) {
				const [xStart, xLen, yStart, yLen] = range;
				applyRange(background, xStart, xLen, yStart, yLen);
			} else if (range.length === 3) {
				const [xStart, xLen, yStart] = range;
				applyRange(background, xStart, xLen, yStart, 1);
			} else if (range.length === 2) {
				const [xStart, yStart] = range;
				applyRange(background, xStart, 1, yStart, 1);
			}
		});
	});
	
}

export function loadSpriteSheet(name) {
	return loadJSON( `/sprites/${name}.json`)
	.then(sheetInfo => Promise.all([
		sheetInfo,
		loadImage(sheetInfo.imageURL),
	]))
	.then(([sheetInfo,image]) => {
		const sprites = new SpriteSheet(image,
			sheetInfo.tileW,
			sheetInfo.tileH);

		if (sheetInfo.tiles) {
			sheetInfo.tiles.forEach(tileInfo => {
			sprites.defineTile(
				tileInfo.name,
				tileInfo.index[0],
				tileInfo.index[1]);
			});
		}

		if(sheetInfo.frames) {
			sheetInfo.frames.forEach(frameInfo => {
				sprites.define(frameInfo.name, ...frameInfo.rect);
			});
		}

		

		return sprites;
	});
}

export function loadLevel(name){
	return loadJSON( `/levels/${name}.json`)
	.then(levelInfo => Promise.all([
			levelInfo,
			loadSpriteSheet(levelInfo.spriteSheet),
	]))
	.then(([levelInfo, backgroundSprite]) => {
		const level = new Level();

		createTiles(level, levelInfo.backgrounds);

		const backgroundLayer = createBackgroundLayer(level, backgroundSprite) ; // We will have different backgrounds for different levels
		level.cont.layers.push(backgroundLayer);

		const spriteLayer = createSpriteLayer(level.entities);
		level.cont.layers.push(spriteLayer);

		return level;
	})
}