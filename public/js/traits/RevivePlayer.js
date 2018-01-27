import {Trait} from '../Entity.js';
import Point from '../utils.js';

export default class RevivePlayer extends Trait {
    constructor(entity) {
        super('revivePlayer');
        this.checkpoint = new Point(64, 64);
        this.player = entity;
    }

    update(entity, dt, level) {
        if (!level.entities.has(this.player)) {
            this.player.killable.revive();
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
        }
    }
}