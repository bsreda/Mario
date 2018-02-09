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
  function start(){
    const BE = new BackgroundElements(tiles, context);
    const collision = new Collision();
    const EM = new EntityManager(collision, BE);
    const scroll = new Scroll([], BE, EM);
  BE.loadSprites("overworld").then(function(){
	BE.loadLevel("1-2").then(function(levelInfo){
  EM.loadEntities("1-2", characters).then(function (){

      function update() {
        scroll.adjust();
        BE.drawAll();
        EM.drawAll();
        if (EM.gameover){
          start();
          return;
        }
        requestAnimationFrame(update);
      }

        update();
    });
});

});
}
start();
});
