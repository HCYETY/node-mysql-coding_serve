import { Context } from 'koa';
import { getRepository, getManager, Like} from "typeorm";
import User from '../../../src/entity/User';
import TestPaper from '../../entity/TestPaper';
import Test from '../../entity/Test';
import responseClass from '../../config/responseClass';
import { nowTime, transTime } from '../../../src/config/utils';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  let show = null;
  const paperRepository = getRepository(TestPaper);
  const userRepository = getRepository(User);
  // // 判断对象为空
  // const obj = Object.keys(req);
  // if (obj.length === 0) {
  //   show = await paperRepository.find();
  // } else {
    const findOnePaper = req.paper ? req.paper : undefined;
    const cookie = req.cookie ? req.cookie : undefined;
    if (findOnePaper) {
      show = await paperRepository.findOne({where: { paper: findOnePaper }});
    } else if (cookie) {
      const findPaper = await userRepository.findOne({where: { session: cookie }});
      const findEamilPaper = findPaper.email;
      if (req.interviewer) {
        show = await paperRepository.createQueryBuilder('paper')
          .where('paper.interviewer LIKE :email')
          .where('paper.interviewer = :interviewer', { interviewer: findEamilPaper })
          .getMany()
      } else {
        show = await paperRepository.createQueryBuilder('paper')
          .where('paper.candidate LIKE :email')
          .setParameters({
            email: '%' + findEamilPaper + '%'
          })
          .getMany()
      }
    }
  // }
  
  show.map(async (item) => {
    // 获取日期控件的参数，并调用函数转换成 yyyy-mm-dd hh:mm 格式
    const time1 = item.time_begin;
    const timeBegin = transTime(time1);
    const time2 = item.time_end;
    const timeEnd = transTime(time2);
    // 获取当前时间，yyyy-mm-dd hh:mm 格式
    const nowtime = nowTime();
    item.remaining_time = (nowtime < timeBegin) ? false : (nowtime > timeEnd) ? false : true;
    await paperRepository.save(item);
  })
  ctx.body = new responseClass(200, '请求成功', { show });
}