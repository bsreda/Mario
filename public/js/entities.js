import Entity from './Entity.js';
import Move from './traits/Move.js';
import Jump from './traits/Jump.js';
import AIWalk from './traits/AIWalk.js';
import GoombaReact from './traits/GoombaReact.js';
import MarioReact from './traits/MarioReact.js';
import KoopaReact from './traits/KoopaReact.js';
import Killable from './traits/Killable.js';
import RevivePlayer from './traits/RevivePlayer.js';
import {loadSpriteSheet} from './loaders.js';

export function createAnim(frames, frameLen) { // put into animation module ?
	return function resolveFrame(distance) {
		const frameIndex = Math.floor(distance / frameLen) % frames.length;
		const frameName = frames[frameIndex];
		return frameName;
	}
}


export function loadMario(){
	return loadSpriteSheet('mario')
	.then(sprite => {
		return function createMario() {

			const mario = new Entity();
			mario.size.set(14, 16);
			mario.sprite = sprite;
			mario.name = 'idle';
			mario.addTrait(new Move());
			mario.addTrait(new Jump());
			mario.addTrait(new MarioReact());
			mario.addTrait(new Killable());
			mario.addTrait(new RevivePlayer(mario));

			mario.killable.removeAfter = 0;

			const runAnim = sprite.animations.get('run');

			function frames(mario) {
		        if (!mario.jump.ready) {
		            return 'jump';
		        }

		        if (mario.move.distance > 0) {
		            if ((mario.vel.x > 0 && mario.move.dir < 0) || (mario.vel.x < 0 && mario.move.dir > 0)) {
		                return 'break';
		            }

		            return runAnim(mario.move.distance);
		        }

		        return 'idle';
		    }

		    mario.draw = function drawMario(context) {
		    	this.sprite.draw(frames(this), context, 0, 0, this.move.heading < 0);
		    }
			return mario;
		}
	});
}

export function loadGoomba() {
    return loadSpriteSheet('goomba')
    .then(sprite => {	
		return function createGoomba() {
			const goomba = new Entity();
			goomba.size.set(16, 16);
			const walkAnim = sprite.animations.get('walk');
			function frames(goomba) {
				if(goomba.killable.dead) {
					return 'flat';
				}

				return walkAnim(goomba.lifetime);
			}


			goomba.addTrait(new AIWalk());
			goomba.addTrait(new GoombaReact());
			goomba.addTrait(new Killable());

			

			goomba.draw = function drawGoomba(context) {
				sprite.draw(frames(this), context, 0, 0);
			}
			return goomba;
		}
	});
}

export function loadKoopa() {
    return loadSpriteSheet('koopa')
    .then(sprite => {
		return function createKoopa() {
			const koopa = new Entity();
			koopa.size.set(16, 16);
			koopa.offset.y = 8;
			const walkAnim = sprite.animations.get('walk');
			const wakeAnim = sprite.animations.get('wake');
			function frames(koopa) {
				if (koopa.koopaReact.state === 'hiding') {
		            if (koopa.koopaReact.hideTime > 3) {
		                return wakeAnim(koopa.koopaReact.hideTime);
	            	}
	            	return 'hiding';
		        }

		        if (koopa.koopaReact.state === 'panic') {
		            return 'hiding';
		        }

		        return walkAnim(koopa.lifetime);

			}

			koopa.addTrait(new AIWalk());
			koopa.addTrait(new KoopaReact());
			koopa.addTrait(new Killable());

			

			koopa.draw = function drawKoopa(context) {
				sprite.draw(frames(koopa), context, 0, 0, this.vel.x < 0);
			}
			return koopa;
		}
	});
}