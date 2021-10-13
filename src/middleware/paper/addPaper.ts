import { Context } from 'koa';
import { getManager } from "typeorm";
import { paperStatus} from '../../config/types';
import testPaper from '../../entity/testPaper';
import nodemail from '../../../sendmail.js';
import { nowTime, getDays, dateCompare, } from '../../config/utils';
// import { loginResponse } from '../../config/class';

export default async (ctx:Context) => {
  console.log(ctx.request.body);
  const req = ctx.request.body;
  const paperRepository = getManager().getRepository(testPaper);
  const findPaper = await paperRepository.findOne({where: {paper: req.paper}});
  const paperNum = req.names && req.names.length ? req.names.length + 1 : 1;
  // 获取日期控件的参数，yyyy-mm-dd 格式
  const timeBegin = req.time[0].slice(0, 10);
  const timeEnd = req.time[1].slice(0, 10);
  // 获取当前时间，yyyy-mm-dd 格式
  const nowtime = nowTime();
  // 比较两个日期的大小
  const result = dateCompare(timeBegin, nowtime);
  // 求出日期之间的天数
  const remaining_time = getDays(timeBegin, timeEnd);
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
  
  let res = null;
  // 查看改试卷是否已经存在于数据库中
  if (!findPaper) {
    const newPaper = new testPaper();
    newPaper.paper = req.paper ? req.paper : null;
    newPaper.check = req.check === 1 ? true : false;
    newPaper.candidate = req.candidate ? req.candidate : null;
    newPaper.paperNum = paperNum;
    newPaper.time = timeBegin + '~' + timeEnd;
    newPaper.remaining_time = result === true  ? '还剩' + remaining_time + '天' : '试卷未开放' ;
    await paperRepository.save(newPaper);
    // res = new loginResponse(200)
    res = { msg: '试卷新建成功，并已通过邮件告知候选人相关信息', status: true};
  } else {
    res = { msg: '该试卷已存在，请新建试卷', status: false};
  }

  ctx.body = res;
}