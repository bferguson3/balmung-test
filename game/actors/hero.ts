import * as ex from 'excalibur';

class Hero extends ex.Actor{
   
   
   public update(engine: ex.Engine, timeDelta: number){
        super.update(engine, timeDelta);
        
        //MoveMe!
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