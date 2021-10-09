import { Context } from 'koa';
import { getManager } from "typeorm";
import testPaper from '../../entity/testPaper';

export default async (ctx:Context) => {
  console.log('删除试卷')
  console.log(ctx.request.body)
  const paperRepository = getManager().getRepository(testPaper);
  for (let num of ctx.request.body) {
    const deletePaper = await paperRepository.find({where: {paper: num}});
    await paperRepository.remove(deletePaper);
    console.log(deletePaper)
    console.log('试卷已删除')
  }

  ctx.body = { msg: '试卷已删除' }
}