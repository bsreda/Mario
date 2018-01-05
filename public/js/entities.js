import Entity from './Entity.js';
import Velocity from './traits/Velocity.js';
import Jump from './traits/Jump.js';
import {loadMarioSprites} from './sprites.js';


export function initMario(){
	return loadMarioSprites()
	.then(sprite => {
		const mario = new Entity();
		mario.sprite = sprite;
		mario.name = 'idle';
		mario.addTrait(new Velocity());
		mario.addTrait(new Jump());
		return mario;
	});
}