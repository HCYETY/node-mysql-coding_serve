import {Context} from 'koa'
import { getManager } from "typeorm"
import User from '../entity/User'

module.exports = async (ctx:Context, next:any) => {
  const url = ctx.url, method = ctx.method
  const {account, password} = ctx.request.body
  const userRepository = getManager().getRepository(User)
  const saveUsers = await userRepository.findOne({where:{account}})
  let res
  if (method === 'POST') {
    if (url === '/login') {
      try{
        if (saveUsers != null) {
          if (saveUsers.password === password) {
            res = {data:saveUsers, message:'登录成功', status: true}
          } else {
            res = {message:'密码错误', status: false}
          }
        } else {
          res = {message:'该用户不存在，请先注册', status: false}
        }
      } catch (err) { console.log(err) }
    } else if (url === '/register') {
      try{
        if (saveUsers === undefined) {
          const newUser = new User()
          newUser.account = account
          newUser.password = password
          await userRepository.save(newUser)
          // await userRepository.save({account, password})
          res = {status:true, message:'注册成功', data:newUser}
        } else{
          res = {status:false, message:'用户已存在，请注册新的邮箱'}
        }
      } catch(err) { console.log(err) }
    }
  }
  ctx.body = res 
  next()
}