module.exports = {
 entry: './game/game.ts',
 module: {
   rules: [
     {
       test: /\.tsx?$/,
       use: 'ts-loader',
       exclude: /node_modules/,
       //include: /node_modules/excalibur/
     }
   ]
 },
 resolve: {
   extensions: [".tsx", ".ts", ".js"]
 },
 output: {
   filename: 'game/game.js',
   path: __dirname,
   libraryTarget: "umd"
 },
 externals: {
   "excalibur": {
       commonjs: "excalibur",
       commonjs2: "excalibur",
       amd: "excalibur",
       root: "ex"
    }
 }
};