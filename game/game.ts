import * as ex from 'excalibur';
import { g } from "./globals";
import TiledResource from '../src';
import { Hero, TriggerCell } from './actors';

/* export class TileMap2 extends ex.TileMap{
   public update(engine, delta) {
      this.emit('preupdate', new ex.Events.PreUpdateEvent(engine, delta, this));
      var worldCoordsUpperLeft = engine.screenToWorldCoordinates(new Algebra_16.Vector(0, 0));
      var worldCoordsLowerRight = engine.screenToWorldCoordinates(new Algebra_16.Vector(engine.canvas.clientWidth, engine.canvas.clientHeight));
      
      this._onScreenXStart = Math.max(Math.floor(worldCoordsUpperLeft.x / this.cellWidth) - 2, 0);
      this._onScreenYStart = Math.max(Math.floor((worldCoordsUpperLeft.y - this.y) / this.cellHeight) - 2, 0);
      this._onScreenXEnd = Math.max(Math.floor(worldCoordsLowerRight.x / this.cellWidth) + 2, 0);
      this._onScreenYEnd = Math.max(Math.floor((worldCoordsLowerRight.y - this.y) / this.cellHeight) + 2, 0);
      this.emit('postupdate', new ex.Events.PostUpdateEvent(engine, delta, this));
  };
} */

export class TileMap2 extends ex.TileMap{
   //this : any;
   public postupdate(engine, delta) {
      //this as any;      
      let castThis = this as any;
      castThis._onScreenXStart = 0;
   }
}

export class game2 extends ex.Engine{ 
  
   /* public screenToWorldCoordinates(point: ex.Vector): ex.Vector {
      
      let newX = point.x;
      let newY = point.y;
        
      // transform back to world space
      newX = (newX / this.canvas.clientWidth) * this.getDrawWidth();
      newY = (newY / this.canvas.clientHeight) * this.getDrawHeight();
     // transform based on zoom
       newX = newX - this.getDrawWidth() / 2;
       newY = newY - this.getDrawHeight() / 2;
        //console.log(this.canvas.clientWidth);
              // shift by focus
      if (this.currentScene && this.currentScene.camera) {
         var focus = this.currentScene.camera.getFocus();
         newX += focus.x;
         newY += focus.y;
      }
        
      return new ex.Vector(Math.floor(newX), Math.floor(newY));
   } */
   
}

export var game = new game2({
   width: 800,
   height: 600,
   canvasElementId: 'game'
});

var resources = {
   map: new TiledResource("./game/angband-town-test.json"),
   textureMap: new ex.Texture("./game/assets/angband32.png"),
   dialogueWin: new TiledResource("./game/parchment-window-tilemap.json"),
   combatWinMap: new TiledResource("./game/battle-gui-windows.json")
}

var graphicsMap = new ex.SpriteSheet(resources.textureMap, 32, 60, 32, 32);

var loader = new ex.Loader();

for(var asset in resources){
   if(resources.hasOwnProperty(asset)){
      loader.addResource(resources[asset]);
   }
}

//globals//
export var tm : TileMap2;
export var diaMap : TileMap2;
var combatWindows : TileMap2;
g.inputMode = g.inputModes.loading;
export var dialogueLabels;
export var activeTrigger;
var activeCamera;
export var hero;

LoadDialogueLabels();

var townTestScene = new ex.Scene();

/* TIMER TEST */
var textTick = new ex.Timer(callThis, 100, false); 
game.add(textTick);
function callThis(){
   console.log("ticked");
}
/* */

game.start(loader).then(function() {
   
   console.log("Game loaded");
   
   resources.map.data.tilesets.forEach(function(ts) {
      console.log(ts.image, ts.imageTexture.isLoaded());
   });
   
   tm = resources.map.getTileMap(); 
   diaMap = resources.dialogueWin.getTileMap();
   diaMap.y = game.getDrawHeight() - 180;
   diaMap.x = -8000;   
   combatWindows = resources.combatWinMap.getTileMap();

   /*Init Hero*/
   hero = new Hero(400, 240, 32, 32);
   var heroSprite = graphicsMap.getSprite(946); //sprite index of avatar
   hero.addDrawing(heroSprite);   
   /* */

   ConfigureCollision();
   TriggerSetup();

   game.add("townTestScene", townTestScene);
   game.goToScene("townTestScene");
   townTestScene.add(tm);
   townTestScene.add(hero);
   townTestScene.add(diaMap);

   dialogueLabels.forEach(ele =>{
      game.add(ele);
   });
   
   console.log("Map and all actors loaded.");

   activeCamera = game.currentScene.camera;   
   UpdateCam();
   g.inputMode = g.inputModes.moving;
});

export function SetActiveTrigger(tgtCell: ex.Cell){
   activeTrigger = tgtCell;
}

function LoadDialogueLabels(){
   var dialogueLabel1 = new ex.Label("", 110, game.getDrawHeight() - 130, "Arial");
   dialogueLabel1.color = new ex.Color(133, 91, 0);
   dialogueLabel1.bold = true;
   dialogueLabel1.scale = new ex.Vector(2, 2);
   var dialogueLabel2 = new ex.Label("", 110, game.getDrawHeight() - 100, "Arial");
   dialogueLabel2.color = new ex.Color(133, 91, 0);
   dialogueLabel2.bold = true;
   dialogueLabel2.scale = new ex.Vector(2, 2);
   var dialogueLabel3 = new ex.Label("", 110, game.getDrawHeight() - 70, "Arial");
   dialogueLabel3.color = new ex.Color(133, 91, 0);
   dialogueLabel3.bold = true;
   dialogueLabel3.scale = new ex.Vector(2, 2);
   var dialogueLabel4 = new ex.Label("", 110, game.getDrawHeight() - 40, "Arial");
   dialogueLabel4.color = new ex.Color(133, 91, 0);
   dialogueLabel4.bold = true;
   dialogueLabel4.scale = new ex.Vector(2, 2);
   
   dialogueLabels = [dialogueLabel1, dialogueLabel2, dialogueLabel3, dialogueLabel4];
}

function ConfigureCollision(){
   tm.data.forEach(tile => {
      //toggle collision for anything that's 830-840 ID (wall sprites)
      tile.sprites.forEach(tilespr => {
         if(tilespr.spriteSheetKey == 4249){
            //UPC terrain
            if(tilespr.spriteId == 634 || tilespr.spriteId == 637){
               //tree base
               tile.solid = true;
            }
            else if(tilespr.spriteId >= 408 && tilespr.spriteId <= 413){
               //tree top
               tile.solid = true;
            }
            else if(tilespr.spriteId >= 440 && tilespr.spriteId <= 445){
               //tree top
               tile.solid = true;
            }
         }
         else if(tilespr.spriteSheetKey == 1){
            //Roguelike set
            if(tilespr.spriteId >= 830 && tilespr.spriteId <= 840){
               //grey stone walls w/ jaggies
               tile.solid = true;
            }
         }
         else if(tilespr.spriteSheetKey == 1081){
            //Angband
            if(tilespr.spriteId == 837){
               //Shopkeep
               tile.solid = true;
            }
         }
         else if(tilespr.spriteSheetKey == 3001){
            //cool angular tileset
         }
         else{
            //console.log(tilespr.spriteSheetKey);
         }
      });
   });
}

function TriggerSetup(){
   var tc1 = new TriggerCell(tm.getCell(8, 4));
   //tc1.isTrigger = true;
   //tc1.triggerType = g.sceneType.dialogue;
   var placement = tc1.index;
   tc1.dialogueText = [
"A crushing pain envelops your chest as you pass through the",
"shattered door frame. A halfling is this run-down shop's",
"only inhabitant. As you draw nearer, the light reflecting",
"from his eyes distracts you, and draws you in. [z]",
"The pain grows more intense now, as the room begins to get",
"hazy and your vision grows dark. You feel like you have",
"never felt pain at all before this moment..."
   ];
   tm.data[tc1.index] = tc1;

   /* COMBAT TEST */
   var combat1 = new TriggerCell(tm.getCell(20, 20));
   combat1.triggerType = g.sceneType.combat;
   var placement = combat1.index;
   tm.data[combat1.index] = combat1;
   /**/
   var combat2 = new TriggerCell(tm.getCell(25, 20));
   combat2.triggerType = g.sceneType.combat;
   var placement = combat2.index;
   tm.data[combat2.index] = combat2;
   
}

export function UpdateCam(){
   var target = hero;
   
   if(g.inCombat){
         //offset down 2, right 4
        activeCamera.x = target.x + (8 * 16);
        activeCamera.y = target.y + (4 * 16); 
      }
   else{
      activeCamera.x = target.x;
      activeCamera.y = target.y;
   }
}

export function LoadWindows(){
   combatWindows.x = hero.x - (8 * 32);//hero.x;//activeCamera.x + (8*16);//64 + (8 * 16);
   combatWindows.y = hero.y - (4 * 32);//hero.y;//activeCamera.y + (4*16);//360 + (4 * 16);
   game.currentScene.add(combatWindows);

   console.log(combatWindows);
}
