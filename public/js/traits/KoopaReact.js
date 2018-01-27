import {Trait} from '../Entity.js';

export default class KoopaReact extends Trait {
    constructor() {
        super('koopaReact');

        this.hideTime = 0;
        this.hideDuration = 5;

        this.walkSpeed = null;
        this.panicSpeed = 300;

        this.state = 'walking';
    }

    collides(us, them) {
        if (us.killable.dead) {
            return;
        }
        if (them.marioReact) {
            if (them.vel.y > us.vel.y) {
                this.handleStomp(us, them);
            } else {
                this.handlePush(us, them);
            }
        }
    }

    handlePush(us, them) {
        if (this.state === 'walking') {
            them.killable.kill();
        } else if (this.state === 'hiding') {
            this.panic(us, them);
        } else if (this.state === 'panic') {
            const travelDir = Math.sign(us.vel.x);
            const impactDir = Math.sign(us.pos.x - them.pos.x);
            if (travelDir !== 0 && travelDir !== impactDir) {
                them.killable.kill();
            }
        }
    }

    handleStomp(us, them) {
        if (this.state === 'walking') {
            this.hide(us);
        } else if (this.state === 'hiding') {
            
            us.killable.kill();
            us.vel.set(100, -200);
            us.canCollide = false;
        } else if (this.state === 'panic') {
            this.hide(us);
        }
    }

    hide(us) {
        us.vel.x = 0;
        us.aiWalk.enabled = false;
        if (this.walkSpeed === null) {
            this.walkSpeed = us.aiWalk.speed;
        }
        this.hideTime = 0;
        this.state = 'hiding'
    }

    unhide(us) {
        us.aiWalk.enabled = true;
        us.aiWalk.speed = this.walkSpeed;
        this.state = 'walking';
    }

    panic(us, them) {
        us.aiWalk.enabled = true;
        us.aiWalk.speed = this.panicSpeed * Math.sign(them.vel.x);
        this.state = 'panic';
    }

    update(us, dt) {
        if (this.state === 'hiding') {
            this.hideTime += dt;
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }

}