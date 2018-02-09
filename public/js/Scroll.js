export default class Scroll{
	constructor(entities, background, em){
		this.entities = entities;
		this.background = background;
		this.origin = 0;
		this.em = em;
		this.em.scroll = this;
	}
	setOrigin(origin){
		this.origin = origin;
		this.em.setOrigins(this.origin);
		this.background.origin = this.origin;

	}
	add(entity){
		this.entities.push(entity);
	}
	adjust(){
		this.entities.forEach(entity => {
			if (entity.pos.x - this.origin > 320){
				this.setOrigin(entity.pos.x - 320);
			}
		});
	}
}
