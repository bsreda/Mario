import {Trait} from '../Entity.js';

export default class AIWalk extends Trait {
    constructor() {
        super('aiWalk');
        this.enabled = true;
        this.speed = -30;
    }

    touches(entity, side) {
        if (side === 'left' || side === 'right') {
            this.speed = -this.speed;
        }
    }

    update(entity, dt) {
        if(this.enabled) {
            entity.vel.x = this.speed;
        }
        
    }
}