import * as ex from 'excalibur';
import TiledResource from '../src';

var game = new ex.Engine({ 
   width: 800, 
   height: 600, 
   canvasElementId: 'game'
});

var resources = {
   map: new TiledResource("./game/angband-town-test.json"),
   textureMap: new ex.Texture("./game/assets/angband32.png")
   
}

var graphicsMap = new ex.SpriteSheet(resources.textureMap, 32, 60, 32, 32);

var loader = new ex.Loader();

for(var asset in resources){
   if(resources.hasOwnProperty(asset)){
      loader.addResource(resources[asset]);
   }
}

var tm;

game.start(loader).then(function() {
   
   console.log("Game loaded");
   
   resources.map.data.tilesets.forEach(function(ts) {
      console.log(ts.image, ts.imageTexture.isLoaded());
   });
   
   var hero = new Hero(240, 240, 32, 32);
   var heroSprite = graphicsMap.getSprite(946); //sprite index of avatar
   hero.addDrawing(heroSprite);

   tm = resources.map.getTileMap();
   
   tm.data.forEach(tile => {
      //toggle collision for anything that's 830-840 ID (wall sprites)
      tile.sprites.forEach(tilespr => {
         if(tilespr.spriteId >= 830 && tilespr.spriteId <= 840){
            tile.solid = true;
         }
      });
   });
   
   var tc1 = new TriggerCell(tm.getCell(8, 4));
   tc1.isTrigger = true;
   var placement = tc1.index;
   tm.data[tc1.index] = tc1;

   game.add(tm);
   game.add(hero);
});

class Hero extends ex.Actor{
   public update(engine: ex.Engine, delta: number){
      super.update(engine, delta);
      if(engine.input.keyboard.wasPressed(ex.Input.Keys.Right)){//} isKeyDown(ex.Input.Keys.Right)) {
         if(this.CheckCollision("right")){
            this.x += 32;
         }
      }
      else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Left)){
         if(this.CheckCollision("left")) 
            this.x -= 32;
      }
      else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Up)){
         if(this.CheckCollision("up"))
            this.y -= 32;
      }
      else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Down)){
         if(this.CheckCollision("down")) 
            this.y += 32;
      }
  }

  CheckCollision(direction: string){
      var _xoffset = 0;
      var _yoffset = 0;
      if(direction == "right")
         _xoffset = 32;
      else if(direction == "left")
         _xoffset = -32;
      else if(direction == "up")
         _yoffset = -32;
      else if(direction == "down")
         _yoffset = 32;
      if(!tm.getCellByPoint(this.x + _xoffset, this.y + _yoffset)){
         return false; //blocked
         
      }
         if(tm.getCellByPoint(this.x + _xoffset, this.y + _yoffset).solid){
            return false;
         }
         else{
            if(tm.getCellByPoint(this.x + _xoffset, this.y + _yoffset).isTrigger == true){
               console.log("The Hero Actor collided with a TriggerCell!");
            }
            return true;
         }
  }
}


class TriggerCell extends ex.Cell {
   constructor(conCell: ex.Cell){ 
      super(conCell.x, conCell.y, conCell.width, conCell.height, conCell.index, conCell.solid, conCell.sprites);
   }
   isTrigger: boolean
}
