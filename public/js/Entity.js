
class Point {
	constructor(x, y){
		this.set(x,y);
	}
	set(x,y){
		this.x = x;
		this.y = y;
	}

}

export class Trait {
	constructor(name) {
		this.NAME = name;
	}

	update() {
		console.warn('Unhandled update call in Trait')
	}
}
export default class Entity {
	constructor(){
		this.name = '';
		this.pos = new Point(0,0);
		this.vel = new Point(0,0);
		this.size = new Point(0,0);
		this.traits = [];
	}

	addTrait(trait) {
		this.traits.push(trait);
		this[trait.NAME] = trait;
	}

	update(dt){
		this.traits.forEach(trait => {
			trait.update(this, dt);
		});
	}

	draw(context){
		this.sprite.draw(this.name, context, this.pos.x, this.pos.y); // this.sprite defined after creating instance
	}
}