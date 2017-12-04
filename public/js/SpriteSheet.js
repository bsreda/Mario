

export default class SpriteSheet {
	constructor(image, width, height){
		this.image = image; // Image to clip from
		this.width = width; // width of the clipped image
		this.height = height; // height of the clipped image
		this.tiles = new Map();  // links tiles on the SpriteSheet with a given name
	}

	define(name, x, y, width, height) { // stores sub-image of this.image in this.tiles with a given name 
		const buffer = document.createElement('canvas'); 
		buffer.width=width;
		buffer.height=height;
		buffer
			.getContext('2d')
			.drawImage(
				this.image,
				x , // The x coordinate where to start clipping
				y , // The y coordinate where to start clipping
				width, // The width of the clipped image
				height, // The height of the clipped image
				0, // The x coordinate where to place the image on the canvas
				0, // The y coordinate where to place the image on the canvas
				width, // The width of the image to use (stretch or reduce the image)
				height); // The height of the image to use (stretch or reduce the image)
		this.tiles.set(name,buffer);
	}

	defineTile(name, x, y){ // if all tiles in this.image are of size (this.width x this.height), we start clipping at (x*this.width,y*this.height)
		this.define(name, x*this.width, y*this.height, this.width, this.height);
	}

	draw(name, context, x, y) { // draw tile named 'name' in context at position (x,y)
		const buffer = this.tiles.get(name);
		context.drawImage(buffer,x,y);
	}

	drawTile(name, context, x, y){ // used to draw tile named 'name' multiple times.
		this.draw(name, context, x * this.width, y * this.height);
	}
}
