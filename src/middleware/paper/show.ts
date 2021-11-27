import { Context } from 'koa';
import { getRepository, getManager, Like} from "typeorm";
import User from '../../../src/entity/User';
import TestPaper from '../../entity/TestPaper';
import responseClass from '../../config/responseClass';
import { transTime } from '../../../src/config/utils';
import LookOver from '../../../src/entity/LookOver';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  let show = null;
  const paperRepository = getRepository(TestPaper);
  const userRepository = getRepository(User);
  const findOnePaper = req.paper ? req.paper : undefined;
  const cookie = req.cookie ? req.cookie : undefined;
  if (findOnePaper) {
    show = await paperRepository.findOne({where: { paper: findOnePaper }});
    ctx.body = new responseClass(200, '单独的试卷信息获取成功', show);
    return;
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
  } else {
    const lookOverRepository = getManager().getRepository(LookOver);
    const findLookOver = await lookOverRepository.find();
    show = await paperRepository.find();
  }
  
  show.map(async (item) => {
    const nowtime = new Date().getTime();
    // const timeBegin = Number(item.time_begin);
    // const timeEnd = Number(item.time_end);
    // item.time_begin = transTime(item.time_begin);
    // item.time_end = transTime(item.time_end);
    item.remaining_time = (nowtime < item.time_begin) ? false : (nowtime > item.time_end) ? false : true;
    await paperRepository.save(item);
  })
  ctx.body = new responseClass(200, '请求成功', { show });
}