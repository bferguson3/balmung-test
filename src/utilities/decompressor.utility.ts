export class Decompressor {
   
      private PLUS = '+'.charCodeAt(0);
      private SLASH = '/'.charCodeAt(0);
      private NUMBER = '0'.charCodeAt(0);
      private LOWER = 'a'.charCodeAt(0);
      private UPPER = 'A'.charCodeAt(0);
      private PLUS_URL_SAFE = '-'.charCodeAt(0);
      private SLASH_URL_SAFE = '_'.charCodeAt(0);
   
      public decompressCsv(
         data: number[]): number[] {
   
         return data;
      }
   
      public decompressBase64(
         b64: string, 
         encoding: string): number[] {
   
         let i: number,
            j: number,
            l: number,
            tmp: number,
            placeHolders: number,
            arr: number[] | Uint8Array;
   
         if (b64.length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4')
         }
   
         let Arr = (typeof Uint8Array !== 'undefined')
            ? Uint8Array
            : Array;
   
         // the number of equal signs (place holders)
         // if there are two placeholders, than the two characters before it
         // represent one byte
         // if there is only one, then the three characters before it represent 2 bytes
         // this is just a cheap hack to not do indexOf twice
         let len = b64.length
         placeHolders = b64.charAt(len - 2) === '=' ? 2 : b64.charAt(len - 1) === '=' ? 1 : 0
   
         // base64 is 4/3 + up to two characters of the original data
         arr = new Arr(b64.length * 3 / 4 - placeHolders)
   
         // if there are placeholders, only get up to the last complete 4 chars
         l = placeHolders > 0 ? b64.length - 4 : b64.length
   
         let L = 0
   
         function push(v) {
            arr[L++] = v
         }
   
         for (i = 0, j = 0; i < l; i += 4, j += 3) {
            tmp = (this.decode(b64.charAt(i)) << 18) | (this.decode(b64.charAt(i + 1)) << 12) | (this.decode(b64.charAt(i + 2)) << 6) | this.decode(b64.charAt(i + 3))
            push((tmp & 0xFF0000) >> 16)
            push((tmp & 0xFF00) >> 8)
            push(tmp & 0xFF)
         }
   
         if (placeHolders === 2) {
            tmp = (this.decode(b64.charAt(i)) << 2) | (this.decode(b64.charAt(i + 1)) >> 4)
            push(tmp & 0xFF)
         } else if (placeHolders === 1) {
            tmp = (this.decode(b64.charAt(i)) << 10) | (this.decode(b64.charAt(i + 1)) << 4) | (this.decode(b64.charAt(i + 2)) >> 2)
            push((tmp >> 8) & 0xFF)
            push(tmp & 0xFF)
         }
   
         let resultLen = arr.length / 4;
         let result = new Array<number>(resultLen);
   
         for (i = 0; i < resultLen; i++) {
            result[i] = this.toNumber(arr.slice(i * 4, i * 4 + 3));
         }
   
         return result;
      }
   
      private decode(elt: any): number {
         var code = elt.charCodeAt(0)
         if (code === this.PLUS || code === this.PLUS_URL_SAFE) return 62 // '+'
         if (code === this.SLASH || code === this.SLASH_URL_SAFE) return 63 // '/'
         if (code < this.NUMBER) return -1 // no match
         if (code < this.NUMBER + 10) return code - this.NUMBER + 26 + 26
         if (code < this.UPPER + 26) return code - this.UPPER
         if (code < this.LOWER + 26) return code - this.LOWER + 26
      }
   
      private toNumber(byteArray: number[] | Uint8Array) {
         var value = 0;
   
         for (var i = byteArray.length - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i] * 1;
         }
   
         return value;
      };
   }