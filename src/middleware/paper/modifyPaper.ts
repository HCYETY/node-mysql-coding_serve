import { Context } from 'koa';
import { getManager } from "typeorm";
import testPaper from '../../entity/testPaper';

module.exports = async (ctx:Context) => {
  console.log('修改试卷');
  console.log(ctx.request.body);
  const req = ctx.request.body;
  const paperRepository = getManager().getRepository(testPaper)
  const modifyPaper = await paperRepository.find({where: {paper: req.paper}})
  if (req.tags) {
    modifyPaper.tags = req.tags;
  } else if (req.status) {
    modifyPaper.status = req.status;
  } else if (req.time) {
    modifyPaper.time = req.time;
  } else if (req.level) {
    modifyPaper.level = req.level;
  } else if (req.pass) {
    modifyPaper.pass = req.pass
  }
  const ans = await paperRepository.save(modifyPaper)
  console.log('ans', ans)

  ctx.body = { msg: '修改试卷成功' }
}