import { Context } from 'koa';
import { getManager, getRepository } from "typeorm";
import Test from '../../entity/Test';
import TestPaper from '../../entity/TestPaper';
import { nowTime, getDays, dateCompare, } from '../../config/utils';
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


  // if (modifyPaper.time !== req.time) {
  //   // 获取日期控件的参数，yyyy-mm-dd 格式
  //   const timeBegin = req.time[0].slice(0, 10);
  //   const timeEnd = req.time[1].slice(0, 10);
  //   // 获取当前时间，yyyy-mm-dd 格式
  //   const nowtime = nowTime();
  //   // 比较两个日期的大小
  //   const result = dateCompare(timeBegin, nowtime);
  //   // 求出日期之间的天数
  //   const remaining_time = getDays(timeBegin, timeEnd);
  //   modifyPaper.time = timeBegin + '~' + timeEnd;
  //   modifyPaper.remaining_time = result === true  ? '还剩' + remaining_time + '天' : '试卷未开放';
  // }
  modifyPaper.paper = req.oldPaper === req.paper ? req.oldPaper : req.paper;
  modifyPaper.paper_description = req.paper_description;
  modifyPaper.candidate = req.candidate;
  modifyPaper.check = req.check;
  // await paperRepository.save(modifyPaper);

  ctx.body = new responseClass(200, '修改试卷成功', { status: true });
}