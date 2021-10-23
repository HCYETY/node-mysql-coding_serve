import { Context } from 'koa';
import { getManager } from "typeorm";
import { paperStatus } from '../../config/types';
import TestPaper from '../../entity/TestPaper';
import nodemail from '../../../sendmail.js';
import { nowTime, } from '../../config/utils';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  console.log(req)
  const paperRepository = getManager().getRepository(TestPaper);
  const findPaper = await paperRepository.findOne({where: {paper: req.paper}});
  // 获取日期控件的参数，yyyy-mm-dd 格式
  const timeBegin = req.timeBegin.slice(0, 10);
  const timeEnd = req.timeEnd.slice(0, 10);
  // 获取当前时间，yyyy-mm-dd 格式
  const nowtime = nowTime();

  // 根据候选人邮箱发送邮件通知
  if (ctx.request.body.candidate) {
    for (let ret of ctx.request.body.candidate) {
      const mail = {
        from: '1164939253@qq.com',
        to: ret,
        subject: '在线编程笔试平台',
        text:'您收到一位面试官的邀请，可进入该网站 http://www.syandeg.com 查看试卷并填写!'
      };
      nodemail(mail);
    }
  }
  

  // 查看改试卷是否已经存在于数据库中
  if (!findPaper) {
    const newPaper = new TestPaper();
    newPaper.paper = req.paper ? req.paper : null;
    newPaper.paper_description = req.paperDescription;
    newPaper.candidate = req.candidate ? req.candidate : null;
    newPaper.check = req.check;
    newPaper.remaining_time = (nowtime < timeBegin) ? false : (nowtime > timeEnd) ? false : true;

    newPaper.time_begin = timeBegin;
    newPaper.time_end = timeEnd;
    newPaper.answer_time = req.answerTime;
    await paperRepository.save(newPaper);
    ctx.body = new responseClass(200, '试卷新建成功，并已通过邮件告知候选人相关信息', { status: true });
  } else {
    ctx.body = new responseClass(200, '该试卷已存在，请新建试卷', { status: false });
  }
}