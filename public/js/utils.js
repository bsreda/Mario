export function loadImage(url){
	return new Promise(resolve=>{
		const image = new Image();
		image.addEventListener('load',()=>{
			resolve(image);
		});
		image.src = url;
	});

}
export default class Point {
	constructor(x, y){
		this.set(x,y);
	}
	set(x,y){
		this.x = x;
		this.y = y;
	}

}
