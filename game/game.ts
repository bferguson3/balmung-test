import * as ex from 'excalibur';
import { g } from "./globals";
import TiledResource from '../src';
import { Hero, TriggerCell } from './actors';

export var game = new ex.Engine({
   width: 800,
   height: 600,
   canvasElementId: 'game'
});

var resources = {
   map: new TiledResource("./game/angband-town-test.json"),
   textureMap: new ex.Texture("./game/assets/angband32.png"),
   dialogueWin: new TiledResource("./game/parchment-window-tilemap.json"),
   combatWinMap: new TiledResource("./game/battle-gui-windows.json"),
   greenSqImg: new ex.Texture("./game/assets/greensquare.gif")
}

var graphicsMap = new ex.SpriteSheet(resources.textureMap, 32, 60, 32, 32);

var loader = new ex.Loader();

for(var asset in resources){
   if(resources.hasOwnProperty(asset)){
      loader.addResource(resources[asset]);
   }
}

export var tm;// : TileMap2;
export var diaMap;// : TileMap2;
var combatWindows;// : TileMap2;

export var dialogueLabels;
var moveSqLeftLabel;
export var activeTrigger;
var activeCamera;
export var hero;

export function UpdateCombatUI(){
   moveSqLeftLabel.text = "Moves: " + hero.moveLeft;
}

export function FixOffset(){
   combatWindows._onScreenXStart = 0;
}

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
   hero.z = 1;
   townTestScene.add(diaMap);

   dialogueLabels.forEach(ele =>{
      game.add(ele);
   });
   
   console.log("Map and all actors loaded.");

   activeCamera = game.currentScene.camera;   
   UpdateCam();
   g.inputMode = g.inputModes.moving;
   
   //if(combatWindows)
   combatWindows.on("postupdate", function (evt: ex.Events.PostUpdateEvent){
         FixOffset();
   });
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

function CombatFadeOut(){
   console.log("Fading out...");
   //fade out ainimation
   var secondTimer = new ex.Timer(function AddSecond() {
      console.log("Fading in...");
      //fade in animation
      //activate GUI windows
      
      LoadCombatGUI();

   }, 1000, false);
   game.currentScene.add(secondTimer);
   var oneSecond = new ex.Timer(InitializeCombat, 2000, false);
   game.currentScene.add(oneSecond);

}

function InitializeCombat(){
   console.log("Initilizing combat...");
   //Determine action order
   //Start action
   //temp: player 1 go
   g.inputMode = g.inputModes.combatMove;
   //color grid
   HighlightMoveRange(hero);
}

function HighlightMoveRange(npc: Hero){
   var moveableZone = new ex.Sprite(resources.greenSqImg, 0, 0, 32, 32);
   moveableZone.opacity(0.3);
   g.activeMoveZone = [];
   for(var j = -npc.moveLeft; j <= npc.moveLeft; j++){
      for(var c = -npc.moveLeft; c <= npc.moveLeft; c++){
         if(Math.abs(j) + Math.abs(c) <= npc.moveLeft){
            g.activeMoveZone.push(new ex.Actor(npc.x + (j*32), npc.y + (c*32), 32, 32));
         }
      }
   }
   g.activeMoveZone.forEach(piece => {
      piece.addDrawing(moveableZone);
      game.currentScene.add(piece);
   });
}


function LoadCombatGUI(){
   combatWindows.x = hero.x - (8 * 32) - 16;//hero.x;//activeCamera.x + (8*16);//64 + (8 * 16);
   combatWindows.y = hero.y - (4 * 32) - 92;//hero.y;//activeCamera.y + (4*16);//360 + (4 * 16);
   game.currentScene.add(combatWindows);
   moveSqLeftLabel = new ex.Label("Moves: 2", hero.x+300, hero.y-160, "Arial");
   moveSqLeftLabel.color = new ex.Color(255, 255, 255);
   moveSqLeftLabel.bold = true;
   moveSqLeftLabel.scale = new ex.Vector(2,2);
   game.currentScene.add(moveSqLeftLabel);
   console.log("Combat GUI loaded.");
   //InitializeCombat();
   //wait one second for fade in to finish
   }

export function LoadCombat(){
   //fade out, 
   CombatFadeOut();
   //wait 1s then fade in w/ gui,
   //wait 1s then enable input

   //DISPLAY GUI CODE:
}
