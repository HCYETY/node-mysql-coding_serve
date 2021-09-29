import { Context } from 'koa';
import { getManager } from "typeorm";
import testPaper from '../../entity/testPaper';

module.exports = async (ctx:Context) => {
  const paper = getManager().getRepository(testPaper);
  const show = await paper.find()
  console.log(show)
  ctx.body = {show}
  // "scripts": {
  //   "test": "cross-env \"Error: no test specified\" && exit 1",
  //   "start": "tsc && node src/app.ts",
  //   "dev": "DEBUG=koa* NODE_ENV=local nodemon -w src/**/*.ts -e ts --exec 'node -r ts-node/register ./src/app.ts'"
  // },

  // "scripts": {
  //   "test": "cross-env \"Error: no test specified\" && exit 1",
  //   "dev": "babel-node --presets env src/app.ts",

  //   "start": "nodemon src/app.ts",
  //   "prd": "pm2 start src/app.ts  "
  // },
}