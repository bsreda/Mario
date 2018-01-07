import Entity from './Entity.js';
import Move from './traits/Move.js';
import Jump from './traits/Jump.js';
import {loadSpriteSheet} from './loaders.js';


export function initMario(){
	return loadSpriteSheet('mario')
	.then(sprite => {
		const mario = new Entity();
		mario.size.set(14, 16);
		mario.sprite = sprite;
		mario.name = 'idle';
		mario.addTrait(new Move());
		mario.addTrait(new Jump());
		
		return mario;
	});
}