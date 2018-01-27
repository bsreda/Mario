
import Point, {BoundingBox} from './utils.js'

export class Trait {
	constructor(name) {
		this.NAME = name;

		this.tasks = [];
	}

	finalize() {
		this.tasks.forEach(task => task());
		this.tasks.length = 0;
	}

	queue(task) {
		this.tasks.push(task);
	}

	collides(us, them) {

	}

	touches() {

	}

	update() {

	}
}
export default class Entity {
	constructor(){
		this.canCollide = true;
		
		this.pos = new Point(0,0);
		this.vel = new Point(0,0);
		this.size = new Point(0,0);
		this.offset = new Point(0,0);
		this.bounds = new BoundingBox(this.pos, this.size, this.offset);
		this.score = 0;
		this.lifetime = 0;
		this.traits = [];
	}

	addTrait(trait) {
		this.traits.push(trait);
		this[trait.NAME] = trait;
	}

	update(dt, level){
		this.traits.forEach(trait => {
			trait.update(this, dt, level);
		});

		this.lifetime += dt;
	}

	collides(candidate) {
		this.traits.forEach(trait => {
			trait.collides(this, candidate);
		});
	}

	touches(side) {
		this.traits.forEach(trait => {
			trait.touches(this, side);
		});
	}

	draw(){

	}

	finalize() {
		this.traits.forEach(trait => {
			trait.finalize();
		});
	}

	
}