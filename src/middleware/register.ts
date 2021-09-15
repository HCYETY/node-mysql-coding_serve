import {Context} from 'koa'
import { getManager } from "typeorm"
import User from '../entity/User'

module.exports = async (ctx:Context, next:any) => {
  const url = ctx.url
  const method = ctx.method
  if (method === 'POST' && url === '/register') {
    const {account, password} = ctx.request.body
    console.log('@注册账号：', account, typeof account)
    console.log('@注册密码：', password, typeof password)
    
    const userRepository = getManager().getRepository(User)
    let saveUsers = await userRepository.findOne({where:{account}})
    console.log('$用户信息', saveUsers)
    let res
    if (saveUsers == undefined) {
      await userRepository.save({account, password})
      res = {status:true, message:'注册成功', data:saveUsers}
    } else{
      res = {status:false, message:'用户已存在，请注册新的邮箱'}
    }
    console.log(res)
    ctx.body = res 
  }
  next()
}