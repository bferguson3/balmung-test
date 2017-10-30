import * as ex from 'excalibur';
import { g } from '../globals';
import * as manager from '../game';

export class Hero extends ex.Actor{
   public update(engine: ex.Engine, delta: number){
      super.update(engine, delta);
      if(g.inputMode == g.inputModes.moving){
        
         if(engine.input.keyboard.wasPressed(ex.Input.Keys.Right)){
             if(this.CheckCollision(g.directions.right)){
               this.x += 32;
               manager.UpdateCam();
           }
        }
        else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Left)){
         if(this.CheckCollision(g.directions.left)) 
              this.x -= 32;
              manager.UpdateCam();
         }
       else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Up)){
          if(this.CheckCollision(g.directions.up))
             this.y -= 32;
             manager.UpdateCam();
       }
         else if(engine.input.keyboard.wasPressed(ex.Input.Keys.Down)){
          if(this.CheckCollision(g.directions.down)) 
             this.y += 32;
             manager.UpdateCam();
         }
      }
      else if(g.inputMode == g.inputModes.dialogue){
         if(engine.input.keyboard.wasPressed(ex.Input.Keys.Z)){
            if(!manager.activeTrigger.dialogueText[manager.activeTrigger.pageOffset]){
               manager.diaMap.x = -8000;
               manager.activeTrigger.EndDialogue();
            }
            manager.activeTrigger.TurnDialoguePage();  //clears text.
         }
      }
   }

  CheckCollision(direction: g.directions){
      var _xoffset = 0;
      var _yoffset = 0;
      if(direction == g.directions.right)
         _xoffset = 32;
      else if(direction == g.directions.left)
         _xoffset = -32;
      else if(direction == g.directions.up)
         _yoffset = -32;
      else if(direction == g.directions.down)
         _yoffset = 32;

         var targetCell = manager.tm.getCellByPoint(this.x + _xoffset, this.y + _yoffset);   
         if(!targetCell){
          return false; //blocked
         }
         if(targetCell.solid){
            return false;
         }
         else{
            if(targetCell.isTrigger && targetCell.fired == false){
               //I encountered a trigger sell that has not fired.
               
               manager.SetActiveTrigger(targetCell);
               switch(targetCell.triggerType){
                  case g.sceneType.dialogue :{
                     g.inputMode = g.inputModes.dialogue;
                     targetCell.TurnDialoguePage();
                     manager.diaMap.y = this.y + 80;
                     manager.diaMap.x = this.x - manager.game.getDrawWidth()/2 + 80;
                     var offsettxt = 50;
                     manager.dialogueLabels.forEach(element => {
                        element.x = manager.diaMap.x + 30;
                        element.y = manager.diaMap.y + offsettxt;
                        offsettxt += 30;
                     });
                     targetCell.fired = true;
                     
                     break;
                  }
                  case g.sceneType.combat: {
                     //g.inputMode = g.inputModes.loading;
                     targetCell.StartCombat();
                     
                     break;
                  }
               }
            }
            return true; //true = can pass through.
         }
  }
}