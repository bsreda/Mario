import Entity from './Entity.js';
import {loadMarioSprites} from './sprites.js';

export function initMario(){
	return loadMarioSprites()
	.then(sprite => {
		const mario = new Entity();
		mario.sprite = sprite;
		mario.name = 'idle';

		return mario;
	});
}