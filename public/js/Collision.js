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
						return this.onBlockCollision(entity, i, j, axis);
				}
			}
		}
		return -1;
	}
	checkLimitCollision(entity){
		if (entity.pos.x - entity.env.origin <= 0){
			return true;
		}else{
			return false;
		}
	}
	onBlockCollision(entity, i, j, axis){
		if (axis == "X"){
			if (entity.pos.x>i*TILE_SIZE){//collision à gauche
				//console.log("Collision à gauche");
					return (i+1)*TILE_SIZE;
			}else if (entity.pos.x+entity.width>i*TILE_SIZE){//collision à droite
				//console.log("Collision à droite");
					return (i-entity.width/TILE_SIZE)*TILE_SIZE;
			}
		} else if (axis == "Y"){
			if (entity.pos.y>j*TILE_SIZE){ //collision en haut
				//console.log("Collision en haut");
				return (j+1)*TILE_SIZE;
			}else if (entity.pos.y+entity.height>j*TILE_SIZE){//collision en bas
				//console.log("Collision en bas");
				return (j-entity.height/TILE_SIZE)*TILE_SIZE;
			}

		}
	}
	checkEntitiesCollision(entity1, entity2){
		var [left1, right1, top1, bottom1] = [entity1.pos.x,
			entity1.pos.x + entity1.width,
			entity1.pos.y,
			entity1.pos.y + entity1.height];
		var [left2, right2, top2, bottom2] = [entity2.pos.x,
				entity2.pos.x + entity2.width,
				entity2.pos.y,
				entity2.pos.y + entity2.height];
		return !(left2 > right1 ||
					 right2 < left1 ||
					 top2 > bottom1 ||
					 bottom2 < top1);
	}
	getCollisionType(entity1, entity2, axis){
		var [left1, right1, top1, bottom1] = [entity1.pos.x,
			entity1.pos.x + entity1.width,
			entity1.pos.y,
			entity1.pos.y + entity1.height];
		var [left2, right2, top2, bottom2] = [entity2.pos.x,
				entity2.pos.x + entity2.width,
				entity2.pos.y,
				entity2.pos.y + entity2.height];
		if (this.checkEntitiesCollision(entity1, entity2)){
			if (axis == "X"){
				if (right1 > left2 && right1 < right2){//Collision par la gauche
					return 1;
				}else if (left1 < right2 && left1 > left2){//Collision par la droite
					return 3;
				}else {
					return -1;
				}
			}
			if (axis == "Y"){
				if (bottom1 > top2 && bottom1 < bottom2){//Collision par le haut
					return 0;
				}else if (top1 > top2 && top1 < bottom2){//Collision par le bas
					return 2;
				}else {
					return -1;
				}
			}
	}
	else{
		return -1;
	}
}
}
