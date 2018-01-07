
import Point from './utils.js'

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
		this.sprite.draw(this.name, context, 0, 0); // this.sprite defined after creating instance
	}
}