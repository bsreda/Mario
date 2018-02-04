export default class Grid {
	constructor() {
		this.grid = [];
	}

	forEach(callback) {
		this.grid.forEach((column, x) => {
			column.forEach((value, y) => {
				callback(value, x, y);
			});
		});
	}


	get(x, y) {
		const col = this.grid[x];
		if (col) {
			return col[y];
		}
		return undefined;
	}

	set(x, y, value) {
		if(!this.grid[x]) {
			this.grid[x] = [];
		}

		this.grid[x][y] = value;
	}
	sets(x, y, width, height, value){
		for (var i=x;i<=x+width;i++){
			for (var j=y;j<=y+width;j++){
				this.grid.set(i, j, value);
			}
		}
	}
	merge(matrix, posx, posy){
		for (var x=0;x<=500;x++){
			for (var y=0;y<=500;y++){
				if (matrix.get(posx + x, posy + y) != "undefined"){
					this.set(x, y, matrix.get(posx + x, posy + y));
				}
			}
		}
	}

}
