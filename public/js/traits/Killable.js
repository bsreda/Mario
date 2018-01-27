import {Trait} from '../Entity.js';

export default class Killable extends Trait {
    constructor() {
        super('killable');
        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = 2;
    }

    kill() {
        this.queue(() => this.dead = true)
    }

    revive() {
    	this.dead = false;
    	this.deadTime = 0;
    }

    update(entity, dt, level) {
    	if (this.dead) {
    		this.deadTime += dt
    		if(this.deadTime > this.removeAfter){
    			level.entities.delete(entity);
    		}
    	}
    }

}