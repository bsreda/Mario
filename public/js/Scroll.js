export default class Scroll{
	constructor(entity, background, em){
		this.entity = entity;
		this.background = background;
		this.origin = 0;
		this.em = em;
	}
	setOrigin(origin){
		this.origin = origin;
		this.em.setOrigins(this.origin);
		this.background.origin = this.origin;

	}
	adjust(){
		if (this.entity.pos.x - this.origin > 320){
			this.setOrigin(this.entity.pos.x - 320);
		}
	}
}
