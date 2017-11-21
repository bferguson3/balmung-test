import { ITiledMapLayer, ITiledTileSet } from "../";

/**
 * Tiled Map Interface
 *
 * Represents the interface for the Tiled exported data structure (JSON). Used
 * when loading resources via Resource loader.
 */
export interface ITiledMap {
   width: number;
   height: number;
   layers: ITiledMapLayer[];
   nextobjectid: number;
   
   /**
    * Map orientation (orthogonal)
    */
   orientation: string;
   properties: {[key: string]: string};
   
   /**
    * Render order (right-down)
    */
   renderorder: string;
   tileheight: number;
   tilewidth: number;
   tilesets: ITiledTileSet[];
   version: number;      
}
