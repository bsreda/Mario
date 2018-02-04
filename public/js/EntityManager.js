export default class EntityManager{
	constructor(){
		this.tab = [];
	}
	add(entity){
		this.tab.push(entity);
	}
	setOrigins(origin){
		var entity;
		for(var k = 0; k < this.tab.length; k++){
				entity = this.tab[k];
				entity.origin = origin;
		}
	}
	drawAll(){
		var entity;
		for(var k = 0; k < this.tab.length; k++){
				entity = this.tab[k];
				entity.update();
				entity.draw();
		}
	}

}
