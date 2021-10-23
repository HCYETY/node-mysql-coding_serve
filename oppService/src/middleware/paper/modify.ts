import { Context } from 'koa';
import { getManager, getRepository } from "typeorm";
import Test from '../../entity/Test';
import TestPaper from '../../entity/TestPaper';
import { nowTime, } from '../../config/utils';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  console.log('修改试卷', ctx.request.body);
  const req = ctx.request.body;
  // 查找试卷
  const paperRepository = getManager().getRepository(TestPaper);
  const modifyPaper = await paperRepository.findOne({where: {paper: req.oldPaper}});
  const paperKey = modifyPaper.key;
  // 利用 paperKey 查找试题
  let modifyTest = await getRepository(Test)
  .createQueryBuilder('test')
  .leftJoinAndSelect('test.paper', 'paper.tests')
  .where('test.paper = :paperKey', { paperKey: paperKey })
  .getMany();
  console.log('=====', modifyTest);
  modifyTest.map(item => {
    req.modifyTests.map(flag => {
      if (item.test_name = flag.testName) {
        // item.
      }
    })
  })
  console.log('++++++++', modifyTest)


  //   // 获取日期控件的参数，yyyy-mm-dd 格式
  //   const timeBegin = req.timeBegin.slice(0, 10);
  //   const timeEnd = req.timeEnd.slice(0, 10);
  //   // 获取当前时间，yyyy-mm-dd 格式
  //   const nowtime = nowTime();
  //   modifyPaper.remaining_time = (nowtime < timeBegin) ? false : (nowtime > timeEnd) ? false : true;
  modifyPaper.paper = req.oldPaper === req.paper ? req.oldPaper : req.paper;
  modifyPaper.paper_description = req.paper_description;
  modifyPaper.candidate = req.candidate;
  modifyPaper.check = req.check;
  // await paperRepository.save(modifyPaper);

  ctx.body = new responseClass(200, '修改试卷成功', { status: true });
}