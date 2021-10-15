import { Context } from 'koa';
import { getManager } from "typeorm";
import TestPaper from '../../entity/TestPaper';

export default async (ctx:Context) => {
  console.log('删除试卷')
  console.log(ctx.request.body)
  const paperRepository = getManager().getRepository(TestPaper);
  for (let num of ctx.request.body) {
    const deletePaper = await paperRepository.find({where: {paper: num}});
    await paperRepository.remove(deletePaper);
    console.log(deletePaper)
    console.log('试卷已删除')
  }
  const resPaper = await paperRepository.find();
  console.log(resPaper)

  ctx.body = { msg: '试卷已删除', data: resPaper }
}