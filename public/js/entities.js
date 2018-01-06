import Entity from './Entity.js';
import Velocity from './traits/Velocity.js';
import Move from './traits/Move.js';
import Jump from './traits/Jump.js';
import {loadMarioSprites} from './sprites.js';


export function initMario(){
	return loadMarioSprites()
	.then(sprite => {
		const mario = new Entity();
		mario.size.set(14, 16);
		mario.sprite = sprite;
		mario.name = 'idle';
		mario.addTrait(new Move());
		mario.addTrait(new Jump());
		//mario.addTrait(new Velocity());
		
		return mario;
	});
}