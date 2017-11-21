import * as ex from 'excalibur';
import { TiledResource } from '../../src';
import { g } from '../globals';
import * as manager from '../game';
import * as ui from '../ui';

export class TriggerCell extends ex.Cell {

   constructor(conCell: ex.Cell){ 
      super(conCell.x, conCell.y, conCell.width, conCell.height, conCell.index, conCell.solid, conCell.sprites);
   }
   isTrigger: boolean = true
   triggerType: g.sceneType = g.sceneType.dialogue;
   triggerOnce: boolean = true
   fired: boolean = false

   dialogueText: string[] 
   pageOffset: number = 0
   
   enemies: ex.Actor[]
   combatBg: TiledResource

   TurnDialoguePage(){

      ui.dialogueLabels[0].text = this.dialogueText[this.pageOffset] ? this.dialogueText[this.pageOffset] : "";
      ui.dialogueLabels[1].text = this.dialogueText[this.pageOffset+1] ? this.dialogueText[this.pageOffset+1] : "";
      ui.dialogueLabels[2].text = this.dialogueText[this.pageOffset+2] ? this.dialogueText[this.pageOffset+2] : "";
      ui.dialogueLabels[3].text = this.dialogueText[this.pageOffset+3] ? this.dialogueText[this.pageOffset+3] : "";
      this.pageOffset += 4;
   }

   EndDialogue(){
      g.inputMode = g.inputModes.moving;
      return;
   }

   StartCombat(){
      g.inputMode = g.inputModes.loading;
      g.inCombat = true;
      manager.LoadCombat();
      //g.inputMode = g.inputModes.combatMove;
      //manager.LoadMoveLabel();
   }

}