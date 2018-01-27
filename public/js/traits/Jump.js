import {Trait} from '../Entity.js'

export default class Jump extends Trait {
	constructor() {
		super('jump');

		this.ready = false;
		this.duration = 0.3;
		this.velocity = 200;
		this.engageTime = 0;
		this.requestTime = 0;
		this.period = 0.1; // period in which mario can jump even if not touching ground
	}

	start() {
		this.requestTime = this.period;
	}

	cancel() {
		this.engageTime = 0;
		this.requestTime = 0;
	}

	touches(entity, side) {
		if(side === 'bottom') {
			this.ready = true;
		} else if (side === 'top') {
			this.cancel();
		}
	}

	update(entity, dt) {
		if(this.requestTime > 0) {
			if(this.ready){
				this.engageTime = this.duration;
				this.requestTime = 0;
			}

			this.requestTime -= dt;
		}
		if(this.engageTime > 0) {
			entity.vel.y = -this.velocity;
			this.engageTime -= dt;
		}

		this.ready = false;
	}
}