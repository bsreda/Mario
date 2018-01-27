import {Trait} from '../Entity.js';

export default class GoombaReact extends Trait {
    constructor() {
        super('goombaReact');
    }

    collides(us, them) {
    	if(us.killable.dead) {
    		return;
    	}
    	if(them.marioReact){
    		if(them.vel.y > us.vel.y){
	    		us.killable.kill();
	    		us.aiWalk.speed = 0;
    		}
    		else{
    			them.killable.kill();
    		}
    	}
    }
}