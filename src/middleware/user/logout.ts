import { Context } from 'koa';
import { getManager } from "typeorm";
import User from '../../entity/User';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const cookie = ctx.request.body.cookie;
  const userRepository = getManager().getRepository(User);
  const user = await userRepository.findOne({ session: cookie });
  if (user) {
    // 删除 session 字段即可
    user.session = '';
    await userRepository.save(user);
    ctx.body = new responseClass(200, '已退出登录', { status: true });
  }
}