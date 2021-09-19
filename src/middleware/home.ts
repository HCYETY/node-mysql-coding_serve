import { Context } from 'koa';
import { getManager } from "typeorm";
import User from '../entity/User';

module.exports = async (ctx:Context) => {
  const cookie = ctx.cookies.get('session');
  const userRepository = getManager().getRepository(User);
  // 根据 cookie 查看数据库中是否有 session 随机数
  const key = await userRepository.findOne({where:{session:cookie}});
  console.log(cookie);
  console.log(key);
}