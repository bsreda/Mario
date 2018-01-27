import Container from './layers.js';
import Collider from './Collider.js';
import EntityCollider from './EntityCollider.js'

export default class Level {
	constructor() {	
		this.gravity = 1500;
		this.totalTime = 0;
		this.goombas = []; // array of initial positions
		this.koopas = []; // array of initial positions

		this.cont = new Container();
		this.entities = new Set();

		this.entityCollider = new EntityCollider(this.entities);
		this.collider = null;
	}

	setCollisionGrid(grid) {
        this.collider = new Collider(grid);
    }

	update(dt) {
		this.entities.forEach(entity => {
			entity.update(dt, this);

			entity.pos.x += entity.vel.x * dt;
			if (entity.canCollide) {
				this.collider.checkX(entity);
			}

			entity.pos.y += entity.vel.y * dt;
			if (entity.canCollide) {
				this.collider.checkY(entity);
			}
			
			entity.vel.y += this.gravity * dt;
		});

		this.entities.forEach(entity => {
			if (entity.canCollide) {
				this.entityCollider.check(entity);
			}
		});

		this.entities.forEach(entity => {
			entity.finalize();
		});
		this.totalTime += dt;
	}
}