import {Context} from 'koa'
import { getManager } from "typeorm"
import User from '../entity/User'

module.exports = async (ctx:Context, next:any) => {
  const dontNeedCheck = ['/login', '/register']
  console.log("=================================================")
  // 前端传过来的 cookie
  const cookie = ctx.cookies.get('session')
  console.log("cookie:", cookie)

  if (cookie) {
    // 查找数据库
    const userRepository = getManager().getRepository(User)
    // 根据 cookie 查看数据库中是否有 session 随机数
    const saveUser = await userRepository.findOne({where:{session:cookie}})
    var key = saveUser.session
    console.log(key === cookie)
  }
  if (dontNeedCheck.indexOf(ctx.url) > -1) {
    await next()
    return
  } else if (key) {
    ctx.body = {message:'您处于登录状态，可继续访问网页'}
    await next()
    return
  } else { 
    ctx.body = {message:'您还未登录！如果您已注册，请先前往登录；如果还未注册，请先注册。'}
    return
  }
}