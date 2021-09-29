import { Context } from 'koa';
import { getManager } from "typeorm";
import testPaper from '../../entity/testPaper';

module.exports = async (ctx:Context) => {
  console.log('新建试卷');
  console.log(ctx.request.body);
  const req = ctx.request.body;
  const paperRepository = getManager().getRepository(testPaper)
  const newPaper = new testPaper();
  newPaper.paper = req.paper;
  newPaper.pass = req.pass;
  newPaper.level = req.level;
  newPaper.status = req.status;
  newPaper.tags = req.tags;
  newPaper.time = req.time;
  const res = await paperRepository.save(newPaper)
  console.log('res', res)

  ctx.body = { msg: '试卷新建成功' }
}