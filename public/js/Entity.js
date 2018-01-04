
class Point {
	constructor(x, y){
		this.set(x,y);
	}
	set(x,y){
		this.x = x;
		this.y = y;
	}

}
export default class Entity {
	constructor(){
		this.name = '';
		this.pos = new Point(0,0);
		this.vel = new Point(0,0);
		//this.sprite = new SpriteSheet();
	}
	update(dt){
		this.pos.x += this.vel.x * dt;
		this.pos.y += this.vel.y * dt;
	}
	draw(context){
		this.sprite.draw(this.name, context, this.pos.x, this.pos.y); // this.sprite defined after creating instance
	}
}