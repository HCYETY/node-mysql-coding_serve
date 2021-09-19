import { Context } from 'koa';
import { getManager } from "typeorm";
import User from '../entity/User';

module.exports = async (ctx:Context, next:any) => {
  const {account, password, remember, identity, radiogroup} = ctx.request.body;
  const userRepository = getManager().getRepository(User);
  const saveUsers = await userRepository.findOne({where:{account}});

  if (saveUsers === undefined) {
    const newUser = new User();
    newUser.account = account, newUser.password = password;
    await userRepository.save(newUser)
    ctx.body = {status:true, message:'注册成功', data:newUser};
  } else {
    ctx.body = {status:false, message:'用户已存在，请注册新的邮箱'};
  }
}