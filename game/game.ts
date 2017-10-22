import * as ex from 'excalibur';
//import Hero from 'hero';
import TiledResource from '../src';


//require './actors/hero.ts';

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

game.start(loader).then(function() {
   
   console.log("Game loaded");
   
   resources.map.data.tilesets.forEach(function(ts) {
      console.log(ts.image, ts.imageTexture.isLoaded());
   });
   
   var hero = new Hero(240, 240, 32, 32);
   var heroSprite = graphicsMap.getSprite(946); //sprite index
   hero.addDrawing(heroSprite);

   var tm = resources.map.getTileMap();
   
   game.add(tm);
   game.add(hero);
});

class Hero extends ex.Actor{
   public update(engine: ex.Engine, delta: number){
      super.update(engine, delta);
      if(engine.input.keyboard.wasPressed(ex.Input.Keys.Right)){//} isKeyDown(ex.Input.Keys.Right)) {
          this.x += 32;
      }
      else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Left)){
          this.x -= 32;
      }
      else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Up)){
          this.y -= 32;
      }
      else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Down)){
          this.y += 32;
      }
  }

}