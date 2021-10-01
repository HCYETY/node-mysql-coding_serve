import { Context } from 'koa'
import { getManager } from "typeorm"
import User from '../entity/User';

module.exports = async (ctx:Context, next:any) => {
  // 前端传过来的 cookie
  const cookie = ctx.cookies.get('session');
  // 如果 cookie 存在，则根据此依据查找数据库中是否有用户的 session 与该 cookie 相等，若查找成功则说明该用户已登录，可以访问非登录页之外的其他页面；否则。。。。。。。。。。。。。。。。。（带补充）
  if (cookie) {
    const userRepository = getManager().getRepository(User);
    // 根据 cookie 查看数据库中是否有 session 随机数
    const saveUser = await userRepository.findOne({where: {session: cookie}});
    var key = saveUser.session
    console.log(key === cookie);
  }

  // 若用户请求登录或注册，则可以通过
  const dontNeedCheck = ['/api/login', '/api/register'];
  if (dontNeedCheck.indexOf(ctx.url) > -1) {
    await next();
    return;
  } else if (key) {
    ctx.body = {message:'您处于登录状态，可继续访问网页'};
    await next();
    return;
  } else { 
    ctx.body = {message:'您还未登录！如果您已注册，请先前往登录；如果还未注册，请先注册。'};
    return;
  }
}