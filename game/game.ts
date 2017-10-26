import * as ex from 'excalibur';
import { g } from "./globals";
import TiledResource from '../src';
import { Hero } from './actors';

export var game = new ex.Engine({ 
   width: 800, 
   height: 600, 
   canvasElementId: 'game'
});

var resources = {
   map: new TiledResource("./game/angband-town-test.json"),
   textureMap: new ex.Texture("./game/assets/angband32.png"),
   dialogueWin: new TiledResource("./game/parchment-window-tilemap.json")
}

var graphicsMap = new ex.SpriteSheet(resources.textureMap, 32, 60, 32, 32);

var loader = new ex.Loader();

for(var asset in resources){
   if(resources.hasOwnProperty(asset)){
      loader.addResource(resources[asset]);
   }
}

//globals//
export var tm;
export var diaMap;
g.inputMode = g.inputModes.loading;
export var dialogueLabels;
export var activeTrigger;
var activeCamera;
export var hero;

LoadDialogueLabels();

var textTick = new ex.Timer(callThis, 100, false); 
game.add(textTick);
function callThis(){
   console.log("ticked");
}

game.start(loader).then(function() {
   
   console.log("Game loaded");
   
   resources.map.data.tilesets.forEach(function(ts) {
      console.log(ts.image, ts.imageTexture.isLoaded());
   });
   
   hero = new Hero(400, 240, 32, 32);
   var heroSprite = graphicsMap.getSprite(946); //sprite index of avatar
   hero.addDrawing(heroSprite);
   

   tm = resources.map.getTileMap();

   diaMap = resources.dialogueWin.getTileMap();
   diaMap.y = game.getDrawHeight() - 180;
   diaMap.x = -8000;

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
               tile.solid = true;
            }
            else if(tilespr.spriteId >= 440 && tilespr.spriteId <= 445){
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
               tile.solid = true;
            }
         }
         else if(tilespr.spriteSheetKey == 3001){
            //cool angular tileset
         }
         else{
            //console.log(tilespr.spriteSheetKey);
         }
         //
         
      });
   });
   
   TriggerSetup();

   game.add(tm);
   game.add(hero);
   game.add(diaMap);

   dialogueLabels.forEach(ele =>{
      game.add(ele);
   });
   activeCamera = game.currentScene.camera;

   console.log("Map and all actors loaded.");

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

function TriggerSetup(){
   var tc1 = new TriggerCell(tm.getCell(8, 4));
   tc1.isTrigger = true;
   tc1.triggerType = g.sceneType.dialogue;
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

}

export function UpdateCam(){
      var target = hero;
      activeCamera.x = target.x;
      activeCamera.y = target.y;
}

class TriggerCell extends ex.Cell {
   constructor(conCell: ex.Cell){ 
      super(conCell.x, conCell.y, conCell.width, conCell.height, conCell.index, conCell.solid, conCell.sprites);
   }
   isTrigger: boolean = true
   triggerType: g.sceneType = g.sceneType.dialogue;
   triggerOnce: boolean = true
   fired: boolean = false
   dialogueText: string[] 
   pageOffset: number = 0

   TurnDialoguePage(){

      dialogueLabels[0].text = this.dialogueText[this.pageOffset] ? this.dialogueText[this.pageOffset] : "";
      dialogueLabels[1].text = this.dialogueText[this.pageOffset+1] ? this.dialogueText[this.pageOffset+1] : "";
      dialogueLabels[2].text = this.dialogueText[this.pageOffset+2] ? this.dialogueText[this.pageOffset+2] : "";
      dialogueLabels[3].text = this.dialogueText[this.pageOffset+3] ? this.dialogueText[this.pageOffset+3] : "";
      this.pageOffset += 4;
   }

   EndDialogue(){
      g.inputMode = g.inputModes.moving;
      return;
   }

}
