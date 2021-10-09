import { Context } from 'koa';
import { getManager } from "typeorm";
import User from '../entity/User';

export default async (ctx:Context, next:any) => {
  const { email, cypher, captcha, identity } = ctx.request.body;
  const userRepository = getManager().getRepository(User);
  const saveUsers = await userRepository.findOne({where: {captcha: captcha}});

  if (saveUsers === undefined) {
    ctx.body = { status: false, message: '验证码输入错误，请重新输入' };
  } else if (saveUsers.captcha !== undefined && !saveUsers.email) {
    saveUsers.email = email, saveUsers.cypher = cypher;
    if (identity && identity === 1) {
      saveUsers.interviewer = true;
    } else {
      saveUsers.interviewer = false;
    }
    await userRepository.save(saveUsers);
    ctx.body = { status: true, message: '注册成功' };
  } else if (saveUsers.email) {
    ctx.body = { status: false, message: '邮箱已存在，请注册新的邮箱' };
  }
}