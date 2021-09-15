import {Context} from 'koa'
import { getManager } from "typeorm"
import User from '../entity/User'

module.exports = async (ctx:Context, next:any) => {
  const url = ctx.url
  const method = ctx.method
  if (method === 'POST' && url === '/login') {
    const {account, password} = ctx.request.body
    console.log('@登录账号', account, typeof account)
    console.log('@登录密码', password, typeof password)

    const userRepository = getManager().getRepository(User)
    let saveUsers = await userRepository.findOne({where:{account}})
    console.log('$用户信息', saveUsers)
    // console.log(saveUsers.account, typeof saveUsers.account)
    // console.log(saveUsers.password, typeof saveUsers.password)
    let res
    if (saveUsers != null) {
      if (saveUsers.password == password) {
        res = {data:saveUsers, message:'登录成功', status: true, code:200}
      } else {
        res = {message:'密码错误', status: false, code:401}
      }
    } else {
      res = {message:'该用户不存在，请先注册', status: false, code:422}
    }
    console.log(res)
    ctx.body = res
  }
  next()
}