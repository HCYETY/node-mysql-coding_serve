import { Context } from 'koa';
import { getManager, } from "typeorm";

import User from '../../entity/User';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const { cookie } = ctx.request.body;
  const userRepository = getManager().getRepository(User);
  if (cookie) {
    const ret = userRepository.findOne({ session: cookie });
    ctx.body = new responseClass(200, '当前用户信息获取成功', ret);
  } else {
    const ret = await userRepository.find({where: { interviewer: 0 }});
    ctx.body = new responseClass(200, '候选人邮箱获取成功', { ret });
  }
}