import { Context } from 'koa';
import { getManager } from "typeorm";
import User from '../entity/User';

function generateMixed(n:number):string {
  let strData = "";
  for (let i = 0; i < 20; i++) {
    const num = Math.floor(Math.random() * 10);
    const az = String.fromCharCode(Math.random() * 26 + 65);
    const AZ = String.fromCharCode(Math.random() * 26 + 97);
    strData += num + az + AZ;
  }
  return strData;
}

module.exports = async (ctx:Context, next:any) => {
  const {account, password, remember, identity, radiogroup} = ctx.request.body;
  const userRepository = getManager().getRepository(User);
  const saveUsers = await userRepository.findOne({where:{account}});

  if (saveUsers) {
    if (account === saveUsers.account && password === saveUsers.password) {
      // 设置20位数的 session 随机数，同时和查找到的用户信息一并存进数据库中
      const session = generateMixed(20)
      saveUsers.session = session;
      await userRepository.save(saveUsers)
      console.log(session);
      // 设置cookie
      ctx.cookies.set(
        'session', session, {httpOnly: false, maxAge:3600000}
      )

      ctx.body = {message:'登录成功', isLogin: true};
    } else {
      ctx.body = {message:'用户名或密码错误', isLogin: false};
      return;
    }
  } else {
    ctx.body = {message:'该用户名不存在', isLogin: false};
    return;
  }
}