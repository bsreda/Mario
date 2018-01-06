import {Trait} from '../Entity.js'

export default class Move extends Trait {
	constructor() {
		super('move');

		this.dir = 0;
		this.speed = 2000;
	}

	update(entity, dt) {
		entity.vel.x = this.speed * this.dir * dt;

	}
}