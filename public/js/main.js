const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

import Point from './utils.js'
import Grid from './Grid.js'
import BackgroundElements from './BackgroundElements.js'
import Entity from './Entity.js'
import Collision from './Collision.js'
import EntityManager from './EntityManager.js'
import Control from './Control.js'
import Scroll from './Scroll.js'
import {loadImage} from './utils.js'



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


Promise.all([  //Parallel loads
	loadImage("/img/characters.gif"),
	loadImage("/img/tiles.png"),
])
.then(([characters, tiles]) =>{
	const BE = new BackgroundElements(tiles, context);
	const EM = new EntityManager();
	const mario = new Entity(BE, EM);
	//const mario2 = new Entity(BE, EM);
	const control = new Control(mario, "q", "z", "d", "s");
	//const control2 = new Control(mario2, "j", "i", "l", "k");
	const scroll = new Scroll(mario, BE, EM);

  BE.addSprite("cloud-1-1", "cloud", 0, 20);
  BE.addSprite("cloud-1-2", "cloud", 1, 20);
  BE.addSprite("cloud-1-3", "cloud", 2, 20);
  BE.addSprite("cloud-2-1", "cloud", 0, 21);
  BE.addSprite("cloud-2-2", "cloud", 1, 21);
  BE.addSprite("cloud-2-3", "cloud", 2, 21);
	BE.addSprite("ground", "solid", 0, 0);
	BE.addSprite("sky", "sky", 3, 23);
	BE.addSprite("bricks", "solid", 1, 0);
	BE.addSprite("chance", "solid", 24, 0);
	BE.addSprite("chocolate", "solid", 0, 1);
  BE.addSprite("chance-1", "solid", 24, 0);
  BE.addSprite("chance-2", "solid", 25, 0);
  BE.addSprite("chance-3", "solid", 26, 0);
  BE.addSprite("pipe-insert-vert-left", "solid", 0, 8);
	BE.addSprite("pipe-insert-vert-right", "solid", 1, 8);
  BE.addSprite("pipe-vert-left", "solid", 0, 9);
  BE.addSprite("pipe-vert-right", "solid", 1, 9);




  //BE.addComponent("sky", 0, 0, 70, 24);
	//BE.addComponent("ground", 0, 20, 70, 4);
	//BE.addComponent("ground", 0, 19, 1, 1);
	//BE.addComponent("block", 20, 8, 5, 1);
	//BE.addComponent("ground", 15, 13, 10, 1);
	//BE.addComponent("ground", 30, 19, 1, 1);
//  var pattern = new Map();
  //var pattern2 = new Map();
  //var pattern3 = new Map();
  //var pattern4 = new Map();

  //pattern.set("pattern", "");
  //pattern.set("ranges", [[0, 0]]);
  //pattern.set("type", "element");
  //pattern.set("name", "pipe-vert-left");

  //pattern2.set("pattern", "");
  //pattern2.set("ranges", [[1, 0]]);
  //pattern2.set("type", "element");
  //pattern2.set("name", "pipe-vert-right");

  //pattern3.set("pattern", "");
  //pattern3.set("ranges", [[0, 0]]);
  //pattern3.set("type", "element");
  //pattern3.set("name", "pipe-insert-vert-left");

  //pattern4.set("pattern", "");
  //pattern4.set("ranges", [[1, 0]]);
  //pattern4.set("type", "element");
  //pattern4.set("name", "pipe-insert-vert-right");




  //BE.createPattern("pipe-section-vert", [pattern, pattern2]);
  //BE.createPattern("pipe-cap-vert", [pattern3, pattern4]);
  //var pattern5 = new Map();
  //var pattern6 = new Map();
  //pattern5.set("pattern", "pipe-cap-vert");
  //pattern5.set("ranges", [[0, 0]]);
  //pattern5.set("type", "pattern");
  //pattern5.set("name", "");

  //pattern6.set("pattern", "pipe-section-vert");
  //pattern6.set("ranges", [[0, 1, 1, 4]]);
//  pattern6.set("type", "pattern");
  //pattern6.set("name", "");

  //BE.createPattern("pipe-3h", [pattern5, pattern6]);
  //BE.addPattern("pipe-3h", 1, 15);
	//mario.addSprite("normal", tiles, 0, 0, 128, 128);
	mario.addSprite("normal", characters, 276, 44, 16, 16);
	//mario2.addSprite("normal", characters, 276, 44, 16, 16);

	//mario.vel.set(6, 0);
	control.listen();
	//control2.listen();
	BE.loadLevel("1-2").then(function(){
		function update() {
			scroll.adjust();
			BE.drawAll();
			EM.drawAll();
			requestAnimationFrame(update);
		}
    update();
		});

});
