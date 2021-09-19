import {Context} from 'koa'
import { getManager } from "typeorm"

import User from '../entity/User'

module.exports = async (ctx:Context, next:any) => {
  const {account, password} = ctx.request.body
  const userRepository = getManager().getRepository(User)
  const saveUsers = await userRepository.findOne({where:{account}})
  if (ctx.method === 'POST' && ctx.url === '/login') {
    if (saveUsers && account === saveUsers.account) {
      if (password === saveUsers.password) {
        
        // 设置session
        ctx.session.user = {account}
        ctx.session.time = new Date()
        ctx.session.isLogin = true
        console.log(ctx.session.time)
        // 设置cookie
        ctx.cookies.set(
          'account', account, {httpOnly: false, maxAge:3600000}
          )

        // console.log('响应头中的sessionid',ctx.response.header['set-cookie'])
        // console.log("更新后的session：", ctx.session.user)
        console.log('请求头中的cookie：',ctx.request.header.cookie)

        ctx.body = {message:'登录成功', session:ctx.session}
      } else {
        ctx.body = {message:'用户名或密码错误', session:ctx.session}
        return
      }
    } else {
      ctx.body = {message:'该用户名不存在', session:ctx.session}
      return
    }
  }
  else if (ctx.method === 'POST' && ctx.url === '/register') {
    console.log(saveUsers)
    if (saveUsers === undefined) {
      const newUser = new User()
      newUser.account = account, newUser.password = password
      await userRepository.save(newUser)
      console.log(newUser)
      ctx.body = {status:true, message:'注册成功', data:newUser}
    } else{
      ctx.body = {status:false, message:'用户已存在，请注册新的邮箱'}
    }
  }
  next()
}