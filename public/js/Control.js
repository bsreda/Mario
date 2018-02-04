export default class Control{
	constructor(entity, left, up, right, down){
		this.entity = entity;
		this.left = left;
		this.up = up;
		this.right = right;
		this.down = down;
	}
	listen(){
		document.addEventListener('keypress', (event) => {
		const nomTouche = event.key;
		if (nomTouche == this.left){
			this.entity.vel.x = -3;
		}
		if (nomTouche== this.right){
			this.entity.vel.x = +3;
		}
		if (nomTouche== this.up && this.entity.vel.y == 0){

			this.entity.vel.y = -8;
		}
		//alert('Évènement keypress\n\n' + 'touche : ' + nomTouche);
		});

		document.addEventListener('keyup', (event) => {
		const nomTouche = event.key;
		if (nomTouche == this.left){
				this.entity.vel.x = 0;
			}
			if (nomTouche == this.right){
				this.entity.vel.x = 0;
			}
		//alert('Évènement keypress\n\n' + 'touche : ' + nomTouche);
		});
	}
}
