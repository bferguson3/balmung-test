import * as ex from 'excalibur';
import * as manager from './game';
//import { g } from "./globals";
//import TiledResource from '../src';
//import { Hero, TriggerCell } from './actors';

export var dialogueLabels;
export var partyUILabels = [];
//export var combatWindows;
export var combatFeedbackLabels = [];
export var combatSelections = [];
//combatWindows = resources.combatWinMap.getTileMap();


//combatWindows = manager.resources.combatWinMap.getTileMap();


export function LoadDialogueLabels(){
   var dialogueLabel1 = new ex.Label("", 110, manager.game.getDrawHeight() - 130, "GameFont");
   dialogueLabel1.color = new ex.Color(133, 91, 0);
   dialogueLabel1.bold = true;
   dialogueLabel1.scale = new ex.Vector(2.2, 2.2);
   var dialogueLabel2 = new ex.Label("", 110, manager.game.getDrawHeight() - 100, "GameFont");
   dialogueLabel2.color = new ex.Color(133, 91, 0);
   dialogueLabel2.bold = true;
   dialogueLabel2.scale = new ex.Vector(2.2, 2.2);
   var dialogueLabel3 = new ex.Label("", 110, manager.game.getDrawHeight() - 70, "GameFont");
   dialogueLabel3.color = new ex.Color(133, 91, 0);
   dialogueLabel3.bold = true;
   dialogueLabel3.scale = new ex.Vector(2.2, 2.2);
   var dialogueLabel4 = new ex.Label("", 110, manager.game.getDrawHeight() - 40, "GameFont");
   dialogueLabel4.color = new ex.Color(133, 91, 0);
   dialogueLabel4.bold = true;
   dialogueLabel4.scale = new ex.Vector(2.2, 2.2);
   
   dialogueLabels = [dialogueLabel1, dialogueLabel2, dialogueLabel3, dialogueLabel4];
}


export function LoadCombatGUI(){
   manager.combatWindows.x = manager.hero[0].x - (8 * 32) - 16;//hero.x;//activeCamera.x + (8*16);//64 + (8 * 16);
   manager.combatWindows.y = manager.hero[0].y - (4 * 32) - 92;//hero.y;//activeCamera.y + (4*16);//360 + (4 * 16);
   manager.game.currentScene.add(manager.combatWindows);
   var doubleVec = new ex.Vector(2.5, 2.5);

   for(var c = 0; c < manager.hero.length; c++){
      partyUILabels[c] = new ex.Label(manager.hero[c].myname, manager.activeCamera.x + 165, manager.activeCamera.y - 240, "GameFont");
      partyUILabels[c].color = new ex.Color(255, 255, 255);
      partyUILabels[c].scale = doubleVec;
      partyUILabels[c+1] = new ex.Label("HP: " + manager.hero[c].curHP + " / " + manager.hero[c].maxHP, manager.activeCamera.x + 165, manager.activeCamera.y - 210, "GameFont");
      partyUILabels[c+1].color = new ex.Color(255, 255, 255);
      partyUILabels[c+1].scale = doubleVec;
      partyUILabels[c+2] = new ex.Label("MP: " + manager.hero[c].curMP + " / " + manager.hero[c].maxMP, manager.activeCamera.x + 165, manager.activeCamera.y - 180, "GameFont");
      partyUILabels[c+2].color = new ex.Color(255, 255, 255);
      partyUILabels[c+2].scale = doubleVec;
   }

   combatFeedbackLabels[0] = new ex.Label("Combat!", manager.activeCamera.x - 380, manager.activeCamera.y + 205, "GameFont" );
   combatFeedbackLabels[0].color = ex.Color.White;
   combatFeedbackLabels[0].scale = doubleVec;
   combatFeedbackLabels[1] = new ex.Label("It's " + manager.hero[0].myname + "'s turn.", manager.activeCamera.x - 380, manager.activeCamera.y + 240, "GameFont" );
   combatFeedbackLabels[1].color = ex.Color.White;
   combatFeedbackLabels[1].scale = doubleVec;
   combatFeedbackLabels[2] = new ex.Label("", manager.activeCamera.x - 380, manager.activeCamera.y + 275, "GameFont" );
   combatFeedbackLabels[2].color = ex.Color.White;
   combatFeedbackLabels[2].scale = doubleVec;

   combatSelections[0] = new ex.Label("Moving...", manager.activeCamera.x + 175, manager.activeCamera.y + 175, "GameFont");
   combatSelections[0].color = ex.Color.White;
   combatSelections[0].scale = doubleVec;
   combatSelections[1] = new ex.Label("Press [Z] when", manager.activeCamera.x + 175, manager.activeCamera.y + 205, "GameFont");
   combatSelections[1].color = ex.Color.White;
   combatSelections[1].scale = doubleVec;
   combatSelections[2] = new ex.Label("finished.", manager.activeCamera.x + 175, manager.activeCamera.y + 235, "GameFont");
   combatSelections[2].color = ex.Color.White;
   combatSelections[2].scale = doubleVec;
   combatSelections[3] = new ex.Label("", manager.activeCamera.x + 175, manager.activeCamera.y + 265, "GameFont");
   combatSelections[3].color = ex.Color.White;
   combatSelections[3].scale = doubleVec;


   partyUILabels.forEach(lbl => {
      manager.game.currentScene.add(lbl);
   });
   combatFeedbackLabels.forEach(fbl =>{
      manager.game.currentScene.add(fbl);      
   });
   combatSelections.forEach(csl =>{
      manager.game.currentScene.add(csl);
   });
   //game.currentScene.add(combatFeedbackLabels[0]);

   console.log("Combat GUI loaded.");
   //InitializeCombat();
   //wait one second for fade in to finish
   }