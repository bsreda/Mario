import Resolver from './Resolver.js';


export default class Collider {
	constructor(tileGrid) {
		this.tiles = new Resolver(tileGrid);
	}
	checkX(entity) {
		let x;
		if(entity.vel.x > 0) {
			x = entity.bounds.right;
		} 
		else if (entity.vel.x < 0) {
			x = entity.bounds.left;
		}
		else {
			return;
		}

		const matches = this.tiles.searchByRange(
			x, x,
			entity.bounds.top, entity.bounds.bottom); // old : offset = 0
		matches.forEach(match => {
			if(match.tile.type !== 'ground') {
				return;
			}

			if(entity.vel.x > 0) {
				if(entity.bounds.right > match.x1) {
					entity.bounds.right = match.x1 ;
					entity.vel.x = 0;

					entity.touches('right');
				}
			}
			else if(entity.vel.x < 0) {
				if(entity.bounds.left < match.x2) {
					entity.bounds.left = match.x2;
					entity.vel.x = 0;

					entity.touches('left');
				}
			}
		});
	}


	checkY(entity) {
		let y;
		if(entity.vel.y > 0) {
			y = entity.bounds.bottom;
		} 
		else if (entity.vel.y < 0) {
			y = entity.bounds.top; // old : offset = 0
		}
		else {
			return;
		}
		const matches = this.tiles.searchByRange(
			entity.bounds.left, entity.bounds.right,
			y, y);
		matches.forEach(match => {
			if(match.tile.type !== 'ground') {
				return;
			}

			if(entity.vel.y > 0) {
				if(entity.bounds.bottom > match.y1) {
					entity.bounds.bottom = match.y1 ;
					entity.vel.y = 0;

					entity.touches('bottom');
				}
			}
			else if(entity.vel.y < 0) {
				if(entity.bounds.top < match.y2) {
					entity.bounds.top = match.y2;
					entity.vel.y = 0;

					entity.touches('top');
				}

			}
		});

		
	}

}