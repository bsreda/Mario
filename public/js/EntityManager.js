import {loadJSON} from './utils.js';
import Point from './utils.js'
import Entity from './Entity.js'
import Control from './Control.js'
export default class EntityManager{
	constructor(collision, background, scroll){
		this.tab = [];
		this.players = [];
		this.collision = collision;
		this.env = background;
		this.scroll;
		this.border = new Point(0, 0);
		this.gameover = false;
	}
	add(entity){
		this.tab.push(entity);
	}
	addPlayer(entity){
		this.players.push(entity) ;
	}
	loadEntities(name, spritesheet){
		this.tab = [];
		this.players = [];
		this.scroll.setOrigin(0);

		this.gameover = false;
		return loadJSON( `/levels/${name}.json`)
		.then(levelInfo =>{
			levelInfo.goomba.forEach(goomba => {
				var entity = new Entity("goomba", this.env, this);
				entity.pos.set(goomba.pos[0], goomba.pos[1]);
				entity.addSprite(goomba.spritename, spritesheet,
				goomba.sprite[0],
				goomba.sprite[1],
				goomba.sprite[2],
			goomba.sprite[3]);
				entity.vel.set(1, 0);
			});
			levelInfo.mario.forEach(mario => {
				var entity = new Entity("mario", this.env, this);
				entity.pos.set(mario.pos[0], mario.pos[1]);
				entity.addSprite(mario.spritename, spritesheet,
				mario.sprite[0],
				mario.sprite[1],
				mario.sprite[2],
			mario.sprite[3]);
				entity.vel.set(1, 0);
				entity.vel.set(0, 0);
				this.addPlayer(entity);
				this.scroll.add(entity);
				var control = new Control(entity, mario.control[0],
					mario.control[1],
					mario.control[2],
					mario.control[3]);
				control.listen();
			});
	this.border.set(levelInfo.border.border[0], levelInfo.border.border[1]);
		});
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

				entity.updateY();
				this.onCollisionWithBackGround(entity, this.collision.checkBlockCollison(entity, "Y"), "Y");
				if (entity.type != "mario" && entity.alive == 1){//Regarde si on des joueurs est encollision avec cette entité sur l'axe Y
					this.players.forEach(player => {
this.onCollisionWithEntity(player, entity, this.collision.getCollisionType(player, entity, "Y")) ;
					});
					//
				}

				entity.updateX();

				if (entity.type == "mario"){//Si c'est un joueur on vérifie s'il se cogne contre le bord du niveau
					this.onCollisionWithLimit(entity, this.collision.checkLimitCollision(entity));
				}

				this.onCollisionWithBackGround(entity, this.collision.checkBlockCollison(entity, "X"), "X");
				if (entity.type != "mario" && entity.alive == 1){//Regarde si on des joueurs est encollision avec cette entité sur l'axe X
					this.players.forEach(player => {
						this.onCollisionWithEntity(player, entity, this.collision.getCollisionType(player, entity, "X")) ;
					});

				}
				this.players.forEach(player => {
					if (player.alive == 0){//Mort d'un des joueurs
						this.gameover = true;
					}
					if (player.pos.x + player.width > this.border.x
						|| player.pos.y + player.height > this.border.y){//fin du jeu soit par mort soit par fin de niveau
							this.gameover = true;
							player.alive = 0;
						}
				});
				if (entity.alive == 0){//Suppression d'une entité morte
					this.tab.splice(k, 1);
				}
				if (!this.gameover){//Si le jeu n'est pas fini
					entity.draw();
				}
		}
	}
	onCollisionWithBackGround(entity, block, axis){

		if (block == -1){
			return;
		}
			if (axis == "X"){
				entity.pos.x = block;
				if (entity.type == "mario"){
					entity.vel.x = 0;
				}else{
					entity.vel.x *= -1;
				}
			}else if (axis == "Y"){
				entity.pos.y = block;
				entity.vel.y = 0;
			}
	}
	onCollisionWithEntity(entity1, entity2, type, axis){
		if (type == -1){
			return;
		}
		if (type == 0){
			entity1.vel.y = -3;
			entity2.alive = 0;
		}else{
			entity1.alive = 0;
		}
	}
	onCollisionWithLimit(entity, collision){
		if (!collision){
			return;
		}
		entity.pos.x = entity.env.origin;
		entity.vel.x = 0;

	}

}
