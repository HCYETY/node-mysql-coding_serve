import { Context } from 'koa';
import { getManager } from "typeorm";
import { generateMixed } from '../config/utils';
import User from '../entity/User';
import responseClass from '../config/responseClass';

export default async (ctx:Context, next:any) => {
  try{
    const { email, cypher } = ctx.request.body; 
    const userRepository = getManager().getRepository(User);
    const saveUsers = await userRepository.findOne({where: {email: email}});
    const data = { isLogin: false, interviewer: null };
  
    if (saveUsers) {
      if (cypher === saveUsers.cypher) {
        // 设置20位数的 session 随机数，同时和查找到的用户信息一并存进数据库中
        const session = generateMixed(20)
        saveUsers.session = session;
        await userRepository.save(saveUsers)
        // 设置cookie
        ctx.cookies.set(
          'session', session, { httpOnly: false, maxAge: 3600000 }
        )
  
        data.isLogin = true;
        data.interviewer = saveUsers.interviewer;
        ctx.body = new responseClass(200, '登录成功', data);
      } else {
        ctx.body = new responseClass(200, '邮箱账号或密码错误', data);
      }
    } else {
      ctx.body = new responseClass(200, '该邮箱不存在', data);
    }
  } catch{(err: any) => ctx.body = {err}}; 
}