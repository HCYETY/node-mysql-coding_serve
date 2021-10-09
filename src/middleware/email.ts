import { Context } from 'koa';
import nodemail from '../../sendmail.js';
import { createSixNum } from '../config/utils';
import { getManager } from "typeorm";
import User from '../entity/User';

export default async (ctx:Context) => {
  try{
    const email = ctx.request.body.email;
    const userRepository = getManager().getRepository(User);
    const saveUsers = await userRepository.findOne({where: {email: email}});
    if (saveUsers) {
      ctx.body = { data: '该邮箱已注册，可直接登录', status: false }; 
    } else {
      const code = createSixNum();
      const mail = {
        //发件人
        from: '1164939253@qq.com',
        //主题
        subject: '您注册账号的验证码为',
        //收件人
        to: email,
        //邮件内容，HTML 格式
        text:'您的验证码为' + code + ',有效期为五分钟!'
      };
      nodemail(mail);
      const newUser = new User();
      newUser.captcha = code;
      await userRepository.save(newUser);

      ctx.body = { data: '邮箱验证码已发送，请注意在有效期内输入', status: true}
    }
  } catch{(err: any) => ctx.body = {err}}
}