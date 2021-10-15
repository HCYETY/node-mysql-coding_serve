import { Context } from 'koa';
import { getManager } from "typeorm";
import TestPaper from '../../entity/TestPaper';
import { nowTime, getDays, dateCompare, } from '../../config/utils';

export default async (ctx:Context) => {
  console.log(ctx.request.body);
  const req = ctx.request.body;
  const paperRepository = getManager().getRepository(TestPaper)
  const modifyPaper = await paperRepository.findOne({where: {paper: req.oldPaper}});
  if (modifyPaper.time !== req.time) {
    // 获取日期控件的参数，yyyy-mm-dd 格式
    const timeBegin = req.time[0].slice(0, 10);
    const timeEnd = req.time[1].slice(0, 10);
    // 获取当前时间，yyyy-mm-dd 格式
    const nowtime = nowTime();
    // 比较两个日期的大小
    const result = dateCompare(timeBegin, nowtime);
    // 求出日期之间的天数
    const remaining_time = getDays(timeBegin, timeEnd);
    modifyPaper.time = timeBegin + '~' + timeEnd;
    modifyPaper.remaining_time = result === true  ? '还剩' + remaining_time + '天' : '试卷未开放';
  }

  modifyPaper.paper = req.oldPaper === req.paper ? req.oldPaper : req.paper;
  // modifyPaper.tests_num = paperNum;
  modifyPaper.check = req.check;
  modifyPaper.candidate = req.candidate;
  await paperRepository.save(modifyPaper);

  ctx.body = { msg: '修改试卷成功', status: true }
}