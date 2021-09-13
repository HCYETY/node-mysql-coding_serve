import {Context} from 'koa'
import { getManager } from "typeorm"
import User from '../entity/User'

module.exports = async (ctx:Context) => {
  const url = ctx.url
  const method = ctx.method
  if (method === 'POST' && url === '/login') {
    console.log('@',ctx.request.body)
    const {account, password} = ctx.request.body
    console.log('@账号', account)
    console.log('@密码', password)

    const userRepository = getManager().getRepository(User)
    let saveUsers = await userRepository.findOne(1)
    console.log('$用户信息', saveUsers)
    // const userRepository = getManager().getRepository(User)
    // const targetUser = await userRepository.findOne({where:{account}})
    let res
    if (saveUsers != null) {
      if (saveUsers.password === password) {
        res = {data:saveUsers, message:'登录成功', status: true, code:200}
      } else {
        res = {message:'密码错误', status: false, code:401}
      }
    } else {
      res = {message:'该用户不存在', status: false, code:422}
    }
    console.log(res)
    ctx.body = res
  }
}