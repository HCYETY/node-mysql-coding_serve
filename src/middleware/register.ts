import { Context } from 'koa';
import { getManager } from "typeorm";
import User from '../entity/User';

module.exports = async (ctx:Context, next:any) => {
  const { account, password, identity } = ctx.request.body;
  const userRepository = getManager().getRepository(User);
  const saveUsers = await userRepository.findOne({where: {account}});
  const newUser = new User();
  console.log('前端请求', ctx.request.body)
  console.log(identity)

  if (saveUsers === undefined) {
    newUser.account = account, newUser.password = password;
    if (identity && identity === 1) {
      newUser.interviewer = true;
    } else {
      newUser.interviewer = false;
    }
    await userRepository.save(newUser);
    ctx.body = {status:true, message:'注册成功', data:newUser};
  } else {
    ctx.body = {status:false, message:'用户已存在，请注册新的邮箱'};
  }
}