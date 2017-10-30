export namespace g {
   export enum inputModes { moving, dialogue, loading } 
   export enum sceneType { dialogue, combat }
   export enum directions { up, left, down, right }
   
   export var inputMode: inputModes;
   export var inCombat: boolean;
}