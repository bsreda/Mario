import Point from './utils.js'
import Collision from './collision.js'
export default class Entity {
	constructor(background, entities){
		this.name = '';
		this.pos = new Point(0,0);
		this.vel = new Point(0,0);
		this.accel = new Point(0, 0.2);
		this.size = new Point(0,0);
		this.sprites = new Map();
		this.currentsprite;
		this.width = 0;
		this.height = 0;
		this.collision = new Collision();
		this.env = background;
		this.context = this.env.context;
		this.origin = 0;
		entities.add(this);
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

	//Move(vel, accel) {

	//}
	addSprite(spritename, image, x, y, width, height){
		this.sprites.set(spritename, [this.createSpriteBuffer(image, x, y, width, height), width, height]);
		this.currentsprite = this.createSpriteBuffer(image, x, y, width, height);
		this.width = width;
		this.height = height;
	}
	selectSprite(spritename){
		this.currentsprite = this.sprites.get(spritename)[0];
		this.width = this.sprites.get(spritename)[1];
		this.height = this.sprites.get(spritename)[2];
	}

	draw(){
		const buffer = this.currentsprite;
		this.context.drawImage(buffer, this.pos.x-this.origin, this.pos.y);
	}

	update(){
		this.vel.x += this.accel.x;
		this.pos.x += this.vel.x;
		this.collision.checkBlockCollison(this, "X");
		this.vel.y += this.accel.y;
		this.pos.y += this.vel.y;
		this.collision.checkBlockCollison(this, "Y");
		this.collision.checkLimitCollision(this);
	}
}
