import Grid from './Grid.js'
const TILE_SIZE = 16;
import {loadJSON} from './utils.js'
export default class BackgroundElements{
	constructor(image, context){
		this.image = image;
		this.context = context;
		this.elementsMap = new Map();
		this.patternsMap = new Map();
		this.matrix = new Grid();
		this.components = [];
		this.origin = 0;
	}
	createSpriteBuffer(image, x, y, width, height){
		const buffer = document.createElement('canvas');
					buffer
					.getContext('2d')
					.drawImage(
						image,
						x , // The x coordinate where to start clipping
						y , // The y coordinate where to start clipping
						width, // The width of the clipped image
						height, // The height of the clipped image
						0, // The x coordinate where to place the image on the canvas
						0, // The y coordinate where to place the image on the canvas
						width, // The width of the image to use (stretch or reduce the image)
						height);
		return buffer;
	}
	copyBuffer(buffer0, x, y, width, height){
		const buffer = document.createElement('canvas');

					const context = buffer.getContext('2d')

					for (var x = 0; x < width; x++) {
						for (var y = 0; y < height; y++) {
							context.drawImage(

													buffer0,
													x*TILE_SIZE , // The x coordinate where to start clipping
													y*TILE_SIZE , // The y coordinate where to start clipping
													width, // The width of the clipped image
													height, // The height of the clipped image
													0, // The x coordinate where to place the image on the canvas
													0, // The y coordinate where to place the image on the canvas
													width, // The width of the image to use (stretch or reduce the image)
													height);
						}
					}
					return buffer
	}
	addSprite(name, type, x, y){
		this.elementsMap.set(name, [this.createSpriteBuffer(this.image, x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE), type]);
	}
	addComponent(name, posx, posy, width, height){
		var buffer;
		var type;
		 [buffer, type] = this.elementsMap.get(name);
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				this.matrix.set(posx + x, posy + y, type);
				this.components.push([buffer, (posx+x)*TILE_SIZE, (posy+y)*TILE_SIZE]);
			}
		}
	}
createPattern(name, table){
		this.patternsMap.set(name,  table);
}
addPattern(name, posx, posy){
	const table = this.patternsMap.get(name);

	for (var i=0;i<table.length;i++){
		var [elementname, patternname, type, ranges] = [table[i].get("name"), table[i].get("pattern"), table[i].get("type"), table[i].get("ranges")];
			//console.log( [elementname, patternname, type, ranges]);
		if (type == "element"){

			for (var j=0;j < ranges.length; j++){
				var range = ranges[j];
				if (range.length === 4) {
					var [xStart, xLen, yStart, yLen] = range;

				} 	else if (range.length === 3) {
					var [xStart, xLen, yStart] = range;
					var yLen = 1;
				} else if (range.length === 2) {
					var [xStart, yStart] = range;
					var xLen = 1;
					var yLen = 1;
				}

				this.addComponent(elementname, posx+xStart, posy+yStart, xLen, yLen);
			}
		}else if (type == "pattern"){
			for (var j=0;j < ranges.length; j++){
				var range = ranges[j];
				if (range.length === 4) {
					var [xStart, xLen, yStart, yLen] = range;
				} 	else if (range.length === 3) {
					var [xStart, xLen, yStart] = range;
					var yLen = 1;
				} else if (range.length === 2) {
					var [xStart, yStart] = range;
					var xLen = 1;
					var yLen = 1;
				}
				for (var  x=xStart;x<xStart+xLen;x++){
					for(var y=yStart;y<yStart+yLen;y++){
						this.addPattern(patternname, posx+x, posy+y);
					}
				}
			}
		}
	}
}
reset(){
	this.matrix = new Grid();
	this.components = [];
}
resetSprites(){
	this.elementsMap = new Map();
	this.patternMap = new Map();
}
loadLevel(name){
	this.reset();
	return loadJSON( `/levels/${name}.json`)
	.then(levelInfo => {
	for (var patternname in levelInfo.patterns){
		var pattern = levelInfo.patterns[patternname];
		var subpatterns = [];
		pattern.tiles.forEach(tile => {
			var subpattern = new Map();

			if ("name" in tile){
				subpattern.set("pattern", "");
				subpattern.set("name", tile["name"]);
				subpattern.set("type", "element");

			}else if("pattern" in tile) {
				subpattern.set("pattern", tile["pattern"]);
				subpattern.set("name", "");
				subpattern.set("type", "pattern");
			}
			subpattern.set("ranges", tile["ranges"]);
			subpatterns.push(subpattern);
		});

		this.createPattern(patternname, subpatterns);
	}
levelInfo.layers.forEach(layer => {
		layer.tiles.forEach(tile => {
				tile.ranges.forEach(range => {
					if ("name" in tile){
						if (range.length === 4) {
							var [xStart, xLen, yStart, yLen] = range;
							this.addComponent(tile["name"], xStart, yStart, xLen, yLen);
						} else if (range.length === 3) {
							var [xStart, xLen, yStart] = range;
							this.addComponent(tile["name"], xStart, yStart, xLen, 1);
						} else if (range.length === 2) {
							var [xStart, yStart] = range;
							this.addComponent(tile["name"], xStart, yStart, 1, 1);
						}
					}else if ("pattern" in tile){
						var [xStart, yStart] = range;
						this.addPattern(tile["pattern"], xStart, yStart);
			}

		});//range
});//tile
});//layers
});//level info
}
loadSprites(name){
 this.resetSprites();
	return loadJSON( `/sprites/${name}.json`).then(levelInfo=>{
		levelInfo.tiles.forEach(tile=>{
			this.addSprite(tile["name"], tile["type"], tile["index"][0], tile["index"][1]);
		});
	});
}
drawAll(){
	var component = [];
	var buffer;
	var posx;
	var posy;
	for(var k = 0; k < this.components.length; k++){
		component = this.components[k];
		[buffer, posx, posy] = component;
		this.context.drawImage(buffer, posx - this.origin, posy);
	}
}
}
