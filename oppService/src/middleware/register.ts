import { Context } from 'koa';
import { getManager } from "typeorm";
import User from '../entity/User';
import responseClass from '../config/responseClass';

export default async (ctx:Context, next:any) => {
  const { email, cypher, captcha, identity } = ctx.request.body;
  const userRepository = getManager().getRepository(User);
  const saveUsers = await userRepository.findOne({where: { email }});
  const doneUser = await userRepository.findOne({where: { email, captcha, cypher }});
  const data = { status: false };
  console.log(email, captcha, cypher)
  console.log(saveUsers)
  console.log(doneUser)

  if (doneUser) {
    ctx.body = new responseClass(200, '邮箱已存在，请注册新的邮箱', data);
  } else if (!doneUser && saveUsers && captcha !== saveUsers.captcha) {
    ctx.body = new responseClass(200, '验证码输入错误，请重新输入', data);
  } else if (!doneUser && saveUsers && captcha === saveUsers.captcha) {
    saveUsers.cypher = cypher;
    if (identity && identity === 1) {
      saveUsers.interviewer = true;
    } else {
      saveUsers.interviewer = false;
    }
    await userRepository.save(saveUsers);
    
    data.status = true;
    ctx.body = new responseClass(200, '注册成功', data);
  }
}