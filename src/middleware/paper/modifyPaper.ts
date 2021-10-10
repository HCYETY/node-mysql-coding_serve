import { Context } from 'koa';
import { getManager } from "typeorm";
import testPaper from '../../entity/testPaper';

export default async (ctx:Context) => {
  console.log('修改试卷');
  console.log(ctx.request.body);
  const req = ctx.request.body;
  const paperRepository = getManager().getRepository(testPaper)
  const modifyPaper = await paperRepository.findOne({where: {paper: req.oldPaper}});
  const paperNum = req.names && req.names.length ? req.names.length + 1 : 1;
  const time_begin = req.time[0].slice(0, 10);
  const time_end = req.time[1].slice(0, 10);

  modifyPaper.paper = req.oldPaper === req.paper ? req.oldPaper : req.paper;
  modifyPaper.level = req.level;
  modifyPaper.paperNum = paperNum;
  modifyPaper.tags = req.tags;
  modifyPaper.time = time_begin + '~' + time_end;
  // newPaper.remaining_time = (time_end - time_begin).toString();
  modifyPaper.check = req.check === 1 ? true : false;
  modifyPaper.candidate = req.candidate;
  const ans = await paperRepository.save(modifyPaper);
  console.log('ans', ans)

  ctx.body = { msg: '修改试卷成功', status: true }
}