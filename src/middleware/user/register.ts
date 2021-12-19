import { Context } from 'koa';
import { getManager } from "typeorm";
import User from '../../entity/User';
import responseClass from '../../config/responseClass';
import { nowTime } from '../../config/utils';

export default async (ctx:Context, next:any) => {
  const { email, cypher, captcha, identity } = ctx.request.body;
  const userRepository = getManager().getRepository(User);
  const saveUsers = await userRepository.findOne({where: { email }});
  const doneUser = await userRepository.findOne({where: { email, captcha: +captcha, cypher }});
  const data = { status: false };
  console.log(email, +captcha, cypher)
  console.log(typeof +captcha)
  console.log(saveUsers)
  console.log(doneUser)

  let msg = null;
  if (doneUser) {
    msg = '邮箱已存在，请注册新的邮箱';
  } else if (saveUsers && +captcha !== saveUsers.captcha) {
    msg = '验证码输入错误，请重新输入';
  } else if (!doneUser && saveUsers && +captcha === saveUsers.captcha) {
    const judgeTime = +saveUsers.nowtime_captcha + 5 * 60 * 1000;
    const nowtime = nowTime();
    if (nowtime < judgeTime) {
      saveUsers.cypher = cypher;
      if (identity && identity === 1) {
        saveUsers.interviewer = true;
      } else {
        saveUsers.interviewer = false;
      }
      await userRepository.save(saveUsers);
      
      data.status = true;
      msg = '注册成功';
    } else {
      msg = '验证码有效期已到，请重新获取';
    }
  }
  ctx.body = new responseClass(200, msg, data);
}