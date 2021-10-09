import { Context } from 'koa';
import { getManager } from "typeorm";
import testPaper from '../../entity/testPaper';

export default async (ctx:Context) => {
  console.log('修改试卷');
  console.log(ctx.request.body);
  const req = ctx.request.body;
  const paperRepository = getManager().getRepository(testPaper)
  const modifyPaper = await paperRepository.findOne({where: {paper: req.paper}});
  modifyPaper.pass = req.pass;
  modifyPaper.level = req.level;
  modifyPaper.status = req.status;
  modifyPaper.tags = req.tags;
  modifyPaper.time = req.time;
  const ans = await paperRepository.save(modifyPaper)
  console.log('ans', ans)

  ctx.body = { msg: '修改试卷成功' }
}