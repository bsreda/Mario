const TILE_SIZE = 16
export default class Collision{
	constructor(){

	}
	getFirstIndex(x){
		return Math.floor(x/TILE_SIZE);
	}
	getSecondIndex(x){
		if(x%TILE_SIZE == 0){
			return x/TILE_SIZE - 1;
		}else{
			return Math.floor(x/TILE_SIZE);
		}
	}
	getIndexes(entity){
		var coords = [];
		coords.push(this.getFirstIndex(entity.pos.x));
		coords.push(this.getSecondIndex(entity.pos.x + entity.width));
		coords.push(this.getFirstIndex(entity.pos.y));
		coords.push(this.getSecondIndex(entity.pos.y + entity.height));
		return coords;
	}
	checkBlockCollison(entity, axis){
		const coords = this.getIndexes(entity);
		var i1 = coords[0];
		var i2 = coords[1];
		var j1 = coords[2];
		var j2 = coords[3];
		var blocks = [];
		for(var i = i1;i <= i2;i++){
			for(var j = j1;j <= j2;j++){
				if (entity.env.matrix.get(i, j) == "solid"){
						this.onBlockCollision(entity, i, j, axis);
				}
			}
		}
	}
	checkLimitCollision(entity){
		if (entity.pos.x - entity.env.origin <= 0){
			this.onLimitCollision(entity);
		}
	}
	onBlockCollision(entity, i, j, axis){
		if (axis == "X"){
			if (entity.pos.x>i*TILE_SIZE){//collision à gauche
				//console.log("Collision à gauche");
				entity.pos.x = (i+1)*TILE_SIZE;
				entity.vel.x = 0;
			}else if (entity.pos.x+entity.width>i*TILE_SIZE){//collision à droite
				//console.log("Collision à droite");
				entity.pos.x = (i-entity.width/TILE_SIZE)*TILE_SIZE;
				entity.vel.x = 0;
			}
		} else if (axis == "Y"){
			if (entity.pos.y>j*TILE_SIZE){ //collision en haut
				//console.log("Collision en haut");
				entity.pos.y = (j+1)*TILE_SIZE;
				entity.vel.y = 0;
			}else if (entity.pos.y+entity.height>j*TILE_SIZE){//collision en bas
				//console.log("Collision en bas");
				entity.pos.y = (j-entity.height/TILE_SIZE)*TILE_SIZE;
				entity.vel.y = 0;
			}

		}
	}
	onLimitCollision(entity){
		entity.pos.x = entity.env.origin;
		entity.vel.x = 0;
	}
}
