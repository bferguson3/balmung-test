import * as ex from 'excalibur';
import TiledResource from '../src';

var game = new ex.Engine({ 
   width: 800, 
   height: 600, 
   canvasElementId: 'game'
});

enum inputModes { moving, dialogue, loading }
enum sceneType { dialogue }
enum directions { up, left, down, right }
//var scene1 = new ex.Scene;
//ar rootScene = ex.Scene;
//var cam = ex.BaseCamera;


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
var tm;
var diaMap;
var inputMode = inputModes.loading;
var dialogueLabels;
var activeTrigger;
var activeCamera;
var hero;
//var inputTypes = [ "movement", "dialogue" ]

LoadDialogueLabels();

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
         if(tilespr.spriteId >= 830 && tilespr.spriteId <= 840){
            tile.solid = true;
         }
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
   inputMode = inputModes.moving;
});

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
   //dialogueLabel.maxWidth = 640;
   dialogueLabels = [dialogueLabel1, dialogueLabel2, dialogueLabel3, dialogueLabel4];
   
}

function TriggerSetup(){
   var tc1 = new TriggerCell(tm.getCell(8, 4));
   tc1.isTrigger = true;
   tc1.triggerType = sceneType.dialogue;
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
    //"shattered door frame. A halfling is this run-down shop's only inhabitant,"
   tm.data[tc1.index] = tc1;

}

function UpdateCam(){
      var target = hero;
      //console.log("update");
      //activeCamera.actions.clearActions();
      activeCamera.x = target.x;
      activeCamera.y = target.y;
}

class Hero extends ex.Actor{
   public update(engine: ex.Engine, delta: number){
      super.update(engine, delta);
      if(inputMode == inputModes.moving){
         //var tick = new ex.Timer(UpdateCam, 0.5, false);
         //tick.update(engine, delta);
         //UpdateCam();
         if(engine.input.keyboard.wasPressed(ex.Input.Keys.Right)){//} isKeyDown(ex.Input.Keys.Right)) {
             if(this.CheckCollision(directions.right)){
              
               
               this.x += 32;
               UpdateCam();
           }
        }
        else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Left)){
         if(this.CheckCollision(directions.left)) 
         
         
         this.x -= 32;
         UpdateCam();
             }
       else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Up)){
          if(this.CheckCollision(directions.up))
             this.y -= 32;
             UpdateCam();
       }
         else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Down)){
          if(this.CheckCollision(directions.down)) 
             this.y += 32;
             UpdateCam();
         }
         
      }
      else if(inputMode == inputModes.dialogue){
         if(engine.input.keyboard.wasPressed(ex.Input.Keys.Z)){
            if(!activeTrigger.dialogueText[activeTrigger.pageOffset]){
               diaMap.x = -8000;
               activeTrigger.EndDialogue();
            }
            activeTrigger.TurnDialoguePage();  //clears text.
         }
      }
      
   }

  

  CheckCollision(direction: directions){
      var _xoffset = 0;
      var _yoffset = 0;
      if(direction == directions.right)
         _xoffset = 32;
      else if(direction == directions.left)
         _xoffset = -32;
      else if(direction == directions.up)
         _yoffset = -32;
      else if(direction == directions.down)
         _yoffset = 32;

         var targetCell = tm.getCellByPoint(this.x + _xoffset, this.y + _yoffset);   
         if(!targetCell){
          return false; //blocked
         }
         if(targetCell.solid){
            return false;
         }
         else{
            if(targetCell.isTrigger && targetCell.fired == false){
               activeTrigger = targetCell;
               switch(targetCell.triggerType){
                  case sceneType.dialogue :{
                     inputMode = inputModes.dialogue;
                     targetCell.TurnDialoguePage();
                     //targetCell.pageOffset += 4;
                     diaMap.y = hero.y + 80;
                     diaMap.x = hero.x - game.getDrawWidth()/2 + 80;
                     var offsettxt = 50;
                     dialogueLabels.forEach(element => {
                        element.x = diaMap.x + 30;
                        element.y = diaMap.y + offsettxt;
                        offsettxt += 30;
                     });
                     targetCell.fired = true;
                     
                     break;
                  }
               }
            }
            return true; //true = can pass through.
         }
  }
}


class TriggerCell extends ex.Cell {
   constructor(conCell: ex.Cell){ 
      super(conCell.x, conCell.y, conCell.width, conCell.height, conCell.index, conCell.solid, conCell.sprites);
   }
   isTrigger: boolean = true
   triggerType: sceneType = sceneType.dialogue;
   triggerOnce: boolean = true
   fired: boolean = false
   //tempText: string = "FILL ME IN"
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
      //diaMap.visible = false;
      inputMode = inputModes.moving;
      return;
   }

}
