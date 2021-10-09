import { Context } from 'koa';
import { getManager } from "typeorm";
import testPaper from '../../entity/testPaper';

export default async (ctx:Context) => {
  const paper = getManager().getRepository(testPaper);
  const show = await paper.find();

  ctx.body = {show}
}