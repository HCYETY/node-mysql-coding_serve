import { Context } from 'koa';
import { getManager, } from "typeorm";

import User from '../../entity/User';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const userRepository = getManager().getRepository(User);
  const ret = await userRepository.find({where: { interviewer: 0 }});
  console.log(ret)
  ctx.body = new responseClass(200, '候选人邮箱获取成功', { ret });
}