import { Context } from 'koa';
import { getManager, } from "typeorm";
import TestPaper from '../../entity/TestPaper';
import { PAPER_STATUS, } from '../../config/const';
import { nowTime, getDays, dateCompare, } from '../../config/utils';

export default async (ctx:Context) => {
  const paperRepository = getManager().getRepository(TestPaper)
  let show;
  if (ctx.request.body.paper) {
    show = await paperRepository.findOne({where: {paper: ctx.request.body.paper}});
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

  ctx.body = { show }
}