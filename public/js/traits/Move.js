import {Trait} from '../Entity.js'

export default class Move extends Trait {
	constructor() {
		super('move');

		this.dir = 0;
		this.acceleration = 400;
		this.deceleration = 300;
		this.dragFactor = 1/5000;

		this.distance = 0;
		this.heading = 1;
	}

	update(entity, dt) {

		if(this.dir) {
			entity.vel.x += this.acceleration * dt * this.dir;
			this.heading = this.dir;
			this.distance += Math.abs(entity.vel.x) * dt;
		} else if (entity.vel.x !== 0) {
			const decel = Math.min(Math.abs(entity.vel.x), this.deceleration * dt);
			entity.vel.x += entity.vel.x > 0 ? -decel : decel ;
		} else {
			this.distance = 0;
		}
		
		const drag = this.dragFactor * entity.vel.x * Math.abs(entity.vel.x); // so that Mario does not run infinitely fast
		entity.vel.x -= drag; 
	}
}