import { Context } from 'koa';
import { getRepository, getManager, Like} from "typeorm";
import User from '../../../src/entity/User';
import TestPaper from '../../entity/TestPaper';
import responseClass from '../../config/responseClass';

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
    } else {
      show = await paperRepository.find();
    }
  // }
  
  show.map(async (item) => {
    const nowtime = new Date().getTime();
    item.remaining_time = (nowtime < item.time_begin) ? false : (nowtime > item.time_end) ? false : true;
    await paperRepository.save(item);
  })
  ctx.body = new responseClass(200, '请求成功', { show });
}