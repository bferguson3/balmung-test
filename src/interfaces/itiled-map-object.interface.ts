export interface ITiledMapObject {
   id: number;
   
   /**
    * Tile object id
    */
   gid: number;
   height: number;
   name: string;
   properties: {[key: string]: string};
   rotation: number;
   type: string;
   visible: boolean;
   width: number;
   x: number;
   y: number;
   
   /**
    * Whether or not object is an ellipse
    */
   ellipse: boolean;
   
   /**
    * Polygon points
    */
   polygon: {x: number, y: number}[];
   
   /**
    * Polyline points
    */
   polyline: {x: number, y: number}[];
}
