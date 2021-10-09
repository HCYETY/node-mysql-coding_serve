import { Context } from 'koa';
import { getManager } from "typeorm";
import { paperStatus} from '../../config/types';
import testPaper from '../../entity/testPaper';

export default async (ctx:Context) => {
  console.log(ctx.request.body);
  const req = ctx.request.body;
  const paperRepository = getManager().getRepository(testPaper);
  const findPaper = await paperRepository.findOne({where: {paper: req.paper}});
  const time_begin = req.time[0].slice(0, 10);
  const time_end = req.time[1].slice(0, 10);
  // 获取当前时间；如果有位数为 1 的，则在前面补 0
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2,'0');
  const day = now.getDate().toString().padStart(2,'0');
  const nowTime = year + '-' + month + '-' + day;
  console.log(time_begin, nowTime)
  console.log(time_begin === nowTime)
  
  let res;
  // 查看改试卷是否已经存在于数据库中
  if (!findPaper) {
    const newPaper = new testPaper();
    const paperNum = req.names && req.names.length ? req.names.length + 1 : 1;
    newPaper.paper = req.paper;
    newPaper.level = req.level;
    newPaper.tags = req.tags;
    newPaper.time = time_begin + '~' + time_end;
    newPaper.paperNum = paperNum;
    newPaper.status = time_begin === nowTime ? paperStatus.ing : paperStatus.nobegin;
    await paperRepository.save(newPaper);
    res = { msg: '试卷新建成功', status: true};
  } else {
    res = { msg: '该试卷已存在，请新建试卷', status: false};
  }

  ctx.body = res;
}