import {
   Resource,
   Promise,
   Texture,
   TileMap,
   TileSprite,
   SpriteSheet,
   Logger
} from 'excalibur';

import { 
   Decompressor,
   ITiledMap,
   ITiledTileSet,
   TiledMapFormat
} from "../";


export class TiledResource extends Resource<ITiledMap> {

   protected mapFormat: TiledMapFormat;
   private decompressor: Decompressor;

   public imagePathAccessor: (path: string, ts: ITiledTileSet) => string;

   constructor(path: string, mapFormat = TiledMapFormat.JSON) {
      switch (mapFormat) {
         case TiledMapFormat.JSON:
            super(path, "application/json");
            break;
         default:
            throw `The format ${mapFormat} is not currently supported. Please export Tiled map as JSON.`;
      }

      this.decompressor = new Decompressor();

      this.mapFormat = mapFormat;
      this.imagePathAccessor = (p) => {

         // Use absolute path if specified
         if (p.indexOf('/') === 0) {
            return p;
         }

         // Load relative to map path
         let pp = path.split('/');
         let relPath = pp.concat([]);

         if (pp.length > 0) {
            // remove file part of path
            relPath.splice(-1);
         }
         relPath.push(p);
         return relPath.join('/');
      };
   }

   public load(): Promise<ITiledMap> {
      var p = new Promise<ITiledMap>();

      super.load().then(map => {

         var promises: Promise<HTMLImageElement>[] = [];

         // retrieve images from tilesets and create textures
         this.data.tilesets.forEach(ts => {
            var tx = new Texture(this.imagePathAccessor(ts.image, ts));
            ts.imageTexture = tx;
            promises.push(tx.load());

            Logger.getInstance().debug("[Tiled] Loading associated tileset: " + ts.image);
         });

         Promise.join.apply(this, promises).then(() => {
            p.resolve(map);
         }, (value?: any) => {
            p.reject(value);
         });
      });

      return p;
   }

   public processData(data: any): ITiledMap {
      if (typeof data !== "string") {
         throw `Tiled map resource ${this.path} is not the correct content type`;
      }
      if (data === void 0) {
         throw `Tiled map resource ${this.path} is empty`;
      }

      switch (this.mapFormat) {
         case TiledMapFormat.JSON:
            return this.parseJsonMap(data);
      }
   }

   public getTilesetForTile(gid: number): ITiledTileSet {
      for (var i = this.data.tilesets.length - 1; i >= 0; i--) {
         var ts = this.data.tilesets[i];

         if (ts.firstgid <= gid) {
            return ts;
         }
      }

      return null;
   }

   public getTileMap(): TileMap {
      var map = new TileMap(0, 0, this.data.tilewidth, this.data.tileheight, this.data.height, this.data.width);

      // register sprite sheets for each tileset in map
      for (var ts of this.data.tilesets) {
         var cols = Math.floor(ts.imagewidth / ts.tilewidth);
         var rows = Math.floor(ts.imageheight / ts.tileheight);
         var ss = new SpriteSheet(ts.imageTexture, cols, rows, ts.tilewidth, ts.tileheight);

         map.registerSpriteSheet(ts.firstgid.toString(), ss);
      }

      for (var layer of this.data.layers) {

         if (layer.type === "tilelayer") {
            for (var i = 0; i < layer.data.length; i++) {
               let gid = <number>layer.data[i];

               if (gid !== 0) {
                  var ts = this.getTilesetForTile(gid);

                  map.data[i].sprites.push(new TileSprite(ts.firstgid.toString(), gid - ts.firstgid))
               }
            }
         }
      }

      return map;
   }

   private parseJsonMap(data: string): ITiledMap {
      
      let json = <ITiledMap>JSON.parse(data);

      // Decompress layers
      if (json.layers) {
         for (var layer of json.layers) {

            if (typeof layer.data === "string") {

               if (layer.encoding === "base64") {
                  layer.data = this
                     .decompressor
                     .decompressBase64(<string>layer.data, layer.encoding);
               }

            } else {
               layer.data = this
                  .decompressor
                  .decompressCsv(<number[]>layer.data);
            }

         }
      }

      return json;
   }
}
