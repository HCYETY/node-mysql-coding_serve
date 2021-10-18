import { Context } from 'koa';
import { getRepository, getManager, } from "typeorm";
import TestPaper from '../../entity/TestPaper';
import Test from '../../entity/Test';
import { PAPER_STATUS, } from '../../config/const';
import { nowTime, getDays, dateCompare, } from '../../config/utils';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const paperRepository = await getRepository(TestPaper);
  const testReporitory = await getRepository(Test)
  // const res = await testReporitory.find({ relations: ['paper'] })
  // .createQueryBuilder("test")
  // // .leftJoinAndSelect('test.paper', 'tests.paper')
  // .where("test.key = :key", { key: 19 })
  // .getMany();
  // console.log(testReporitory)

  const findPaper = ctx.request.body.paper;
  let show;
  if (findPaper) {
    show = await paperRepository.findOne({where: {paper: findPaper}});
  } else {
    show = await paperRepository.find();
    show.map(async (testPaper) => {
      const timeBegin = testPaper.time.slice(0, 10);
      const timeEnd = testPaper.time.slice(11);
      // 获取当前时间，yyyy-mm-dd 格式
      const nowtime = nowTime();
      // 比较两个日期的大小
      const result = dateCompare(timeBegin, nowtime);
      // 求出日期之间的天数
      const remaining_time = getDays(timeBegin, timeEnd) - getDays(timeBegin, nowtime);
      testPaper.remaining_time = result === true  ? '还剩' + remaining_time + '天' : PAPER_STATUS ;
      await paperRepository.save(testPaper);
    })
  }

  ctx.body = new responseClass(200, '请求成功', show);
}