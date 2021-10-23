import { Context } from 'koa';
import { getRepository, getManager, } from "typeorm";
import User from '../../../src/entity/User';
import TestPaper from '../../entity/TestPaper';
import Test from '../../entity/Test';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const paperRepository = getRepository(TestPaper);
  const userRepository = getRepository(User);
  let show = null;
  const req = ctx.request.body;
  // 判断对象为空
  const obj = Object.keys(req);
  if (obj.length === 0) {
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
  
  ctx.body = new responseClass(200, '请求成功', show);
}