import {Trait} from '../Entity.js';

export default class MarioReact extends Trait {
    constructor() {
        super('marioReact');
        this.bounceSpeed = 400;
    }

    bounce(us, them) {
    	us.bounds.bottom = them.bounds.top;
    	us.vel.y = -this.bounceSpeed;
        us.score += 100;
    }

    collides(us, them) {
    	if (!them.killable || (them.killable.dead)) {
    		return;
    	}

    	if(us.vel.y > them.vel.y) {
    		this.bounce(us, them);
    	}
    }
}