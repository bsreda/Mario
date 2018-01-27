import Level from './Level.js';
import {createBackgroundLayer,createSpriteLayer} from './layers.js';
import SpriteSheet from './SpriteSheet.js'
import {createAnim} from './entities.js';
import Grid from './Grid.js';

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

class Font {
    constructor(sprites, size) {
        this.sprites = sprites;
        this.size = size;
    }

    print(text, context, x, y) {
        [...text].forEach((char, pos) => {
            this.sprites.draw(char, context, x + pos * this.size, y);
        });
    }
}

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

		if(sheetInfo.animations) {
			sheetInfo.animations.forEach(animInfo => {
				const animation = createAnim(animInfo.frames, animInfo.frameLen);
				sprites.defineAnim(animInfo.name, animation);
			});
		}
		return sprites;
	});
}
export function loadFont() {
	return loadImage('./img/font.png')
	.then(image => {
		const fontSprite = new SpriteSheet(image);

		const size = 8;
        const rowLen = image.width;
        for (let [index, char] of [...CHARS].entries()) {
            const x = index * size % rowLen;
            const y = Math.floor(index * size / rowLen) * size;
            fontSprite.define(char, x, y, size, size);
        }

		return new Font(fontSprite, size);
	})
}
export function loadLevel(name) {
    return loadJSON(`/levels/${name}.json`)
    .then(levelInfo => Promise.all([
        levelInfo,
        loadSpriteSheet(levelInfo.spriteSheet),
    ]))
    .then(([levelInfo, backgroundSprites]) => {
        const level = new Level();

        //collision
        const mergedTiles = levelInfo.layers.reduce((mergedTiles, layerSpec) => {
            return mergedTiles.concat(layerSpec.tiles);
        }, []);
        const collisionGrid = createCollisionGrid(mergedTiles, levelInfo.patterns);
        level.setCollisionGrid(collisionGrid);

        //bakground
        levelInfo.layers.forEach(layer => {
            const backgroundGrid = createBackgroundGrid(layer.tiles, levelInfo.patterns);
            const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
            level.cont.layers.push(backgroundLayer);
        });

        //entities
        levelInfo.koopa.forEach((info) =>{
        	level.koopas.push(info.pos);
        })

        levelInfo.goomba.forEach((info) =>{
        	level.goombas.push(info.pos);
        })

        const spriteLayer = createSpriteLayer(level.entities);
        level.cont.layers.push(spriteLayer);

        return level;
    });
}

function createCollisionGrid(tiles, patterns) {
    const grid = new Grid();

    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, {type: tile.type});
    }

    return grid;
}

function createBackgroundGrid(tiles, patterns) {
    const grid = new Grid();

    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, {name: tile.name});
    }

    return grid;
}


function* expandSpan(xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
            yield {x, y};
        }
    }
}

function expandRange(range) {
    if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(xStart, xLen, yStart, yLen);

    } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        return expandSpan(xStart, xLen, yStart, 1);

    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1);
    }
}

function* expandRanges(ranges) {
    for (const range of ranges) {
        for (const item of expandRange(range)) {
            yield item;
        }
    }
}

function expandTiles(tiles, patterns) {
    const expandedTiles = [];

    function walkTiles(tiles, offsetX, offsetY) {
        for (const tile of tiles) {
            for (const {x, y} of expandRanges(tile.ranges)) {
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;

                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    walkTiles(tiles, derivedX, derivedY);
                } else {
                    expandedTiles.push({
                        tile,
                        x: derivedX,
                        y: derivedY,
                    });
                }
            }
        }
    }

    walkTiles(tiles, 0, 0);

    return expandedTiles;
}
