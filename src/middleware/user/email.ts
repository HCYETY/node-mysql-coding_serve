import { Context } from 'koa';
import nodemail from '../../../sendEmail.js';
import { createSixNum } from '../../config/utils';
import { getManager } from "typeorm";
import User from '../../entity/User';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  try{
    const { email, cypher } = ctx.request.body;
    const userRepository = getManager().getRepository(User);
    const saveUsers = await userRepository.findOne({where: { email, cypher }});
    // const nowtime = nowTime();
    if (saveUsers) {
      ctx.body = new responseClass(200, '该邮箱已注册，可直接登录', { status: false });
    } else {
      const code = createSixNum();
      const saveUser = await userRepository.findOne({ where: { email }});
      const nowtime = new Date().getTime();
      console.log(nowtime, code)
      const mail = {
        from: '1164939253@qq.com',
        to: email,
        subject: '您注册账号的验证码为',
        text:'您的验证码为' + code + ',有效期为五分钟!'
      };
      nodemail(mail);
      if (saveUser) {
        saveUser.captcha = code;
        saveUser.nowtime_captcha = nowtime;
        await userRepository.save(saveUser);
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.captcha = code;
        newUser.nowtime_captcha = nowtime;
        await userRepository.save(newUser);
      }

      ctx.body = new responseClass(200, '邮箱验证码已发送，请注意在有效期内输入', { status: true, captchaTime: nowtime });
    }
  } catch{(err: any) => ctx.body = {err}}
}