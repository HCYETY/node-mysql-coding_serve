import { Context } from 'koa';
import { getManager } from "typeorm";
import { paperStatus} from '../../config/types';
import testPaper from '../../entity/testPaper';
import nodemail from '../../../sendmail.js';
import { nowTime } from '../../config/utils';

export default async (ctx:Context) => {
  console.log(ctx.request.body);
  const req = ctx.request.body;
  const paperRepository = getManager().getRepository(testPaper);
  const findPaper = await paperRepository.findOne({where: {paper: req.paper}});
  const paperNum = req.names && req.names.length ? req.names.length + 1 : 1;
  const time_begin = req.time[0].slice(0, 10);
  const time_end = req.time[1].slice(0, 10);
  // 获取当前时间；如果有位数为 1 的，则在前面补 0
  const nowtime = nowTime();
  console.log(time_begin, typeof time_begin);
  console.log(time_end, typeof time_end);
  console.log(time_begin === nowtime);
  // 根据候选人邮箱发送邮件通知
  for (let ret of ctx.request.body.candidate) {
    const mail = {
      from: '1164939253@qq.com',
      to: ret,
      subject: '在线编程笔试平台',
      text:'您收到一位面试官的邀请，可进入该网站 http://www.syandeg.com 查看试卷并填写!'
    };
    nodemail(mail);
  }
  
  let res;
  // 查看改试卷是否已经存在于数据库中
  if (!findPaper) {
    const newPaper = new testPaper();
    newPaper.paper = req.paper;
    newPaper.level = req.level;
    newPaper.tags = req.tags;
    newPaper.check = req.check === 1 ? true : false;
    newPaper.candidate = req.candidate;
    newPaper.paperNum = paperNum;
    newPaper.time = time_begin + '~' + time_end;
    newPaper.status = time_begin === nowtime ? paperStatus.ing : paperStatus.nobegin;
    // newPaper.remaining_time = (time_end - time_begin).toString();
    console.log(newPaper.tags)
    await paperRepository.save(newPaper);
    console.log(newPaper.tags)
    console.log(newPaper.check)
    res = { msg: '试卷新建成功，并已通过邮件告知候选人相关信息', status: true};
    console.log(res)
  } else {
    res = { msg: '该试卷已存在，请新建试卷', status: false};
  }

  ctx.body = res;
}