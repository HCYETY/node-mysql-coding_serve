import { Context } from 'koa';
import nodemail from '../../sendEmail.js';
import { createSixNum } from '../config/utils';
import { getManager } from "typeorm";
import User from '../entity/User';
import responseClass from '../config/responseClass';

export default async (ctx:Context) => {
  try{
    const email = ctx.request.body.email;
    const data = { status: false };
    if (email) {
      const userRepository = getManager().getRepository(User);
      const saveUsers = await userRepository.findOne({where: {email: email}});
      if (saveUsers) {
        ctx.body = new responseClass(200, '该邮箱已注册，可直接登录', data);
      } else {
        const code = createSixNum();
        const mail = {
          from: '1164939253@qq.com',
          to: email,
          subject: '您注册账号的验证码为',
          text:'您的验证码为' + code + ',有效期为五分钟!'
        };
        nodemail(mail);
        const newUser = new User();
        newUser.captcha = code;
        await userRepository.save(newUser);
  
        data.status = true;
        ctx.body = new responseClass(200, '邮箱验证码已发送，请注意在有效期内输入', data);
      }
    } else {
      ctx.body = new responseClass(200, '请填写邮箱账号', data);
    }
  } catch{(err: any) => ctx.body = {err}}
}