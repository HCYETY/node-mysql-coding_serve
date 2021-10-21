import { Context } from 'koa';
import { getRepository, getManager, } from "typeorm";
import User from '../../../src/entity/User';
import TestPaper from '../../entity/TestPaper';
import Test from '../../entity/Test';
import { PAPER_STATUS, } from '../../config/const';
import { nowTime, getDays, dateCompare, } from '../../config/utils';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const paperRepository = getRepository(TestPaper);
  const userRepository = getRepository(User);
  let show = null;
  const req = ctx.request.body;
  if (req) {
    show = await paperRepository.find();
  } else {
    const findOnePaper = req.paper ? req.paper : undefined;
    const cookie = req.cookie ? req.cookie : undefined;
    
    if (findOnePaper) {
      show = await paperRepository.findOne({where: { paper: findOnePaper }});
    } else if (cookie) {
      const findPaper = await userRepository.findOne({where: { session: cookie }});
      const findEamilPaper = findPaper.email;
      show = await paperRepository.find({where: { candidate: findEamilPaper }});
    }
  }
  
  show.map(async (testPaper) => {
    console.log(testPaper)
    const timeBegin = testPaper.time_begin.slice(0, 10);
    const timeEnd = testPaper.time_end.slice(0, 10);
    // 获取当前时间，yyyy-mm-dd 格式
    const nowtime = nowTime();
    // 比较两个日期的大小
    const result = dateCompare(timeBegin, nowtime);
    // 求出日期之间的天数
    const remaining_time = getDays(timeBegin, timeEnd) - getDays(timeBegin, nowtime);
    testPaper.remaining_time = result === true  ? '还剩' + remaining_time + '天' : PAPER_STATUS ;

    await paperRepository.save(testPaper);
  })
  
  ctx.body = new responseClass(200, '请求成功', show);
}