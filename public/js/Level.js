import Container from './layers.js';
import Grid from './Grid.js';
import Collider from './Collider.js'

export default class Level {
	constructor() {
		this.gravity = 2000;
		this.cont = new Container();
		this.entities = new Set();
		this.tiles = new Grid();
		this.collider = new Collider(this.tiles);
	}

	update(dt) {
		this.entities.forEach(entity => {
			entity.update(dt);

			entity.pos.y += entity.vel.y * dt;
			this.collider.checkY(entity)
			entity.pos.x += entity.vel.x * dt;
			this.collider.checkX(entity)

			

			entity.vel.y += this.gravity * dt;
		});
	}
}