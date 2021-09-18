import {Context} from 'koa'
import { getManager } from "typeorm"

module.exports = async (ctx:Context) => {
  if (ctx.url === '/submit' && ctx.method === 'POST') {
    console.log('服务端跳转home页面，发送带有cookie的请求？')
    console.log("查看服务端的session：", ctx.session)
    console.log(ctx.session.user)
    // console.log('查看请求头的cookies：', ctx.cookies)
    console.log("查看请求头中的cookie：", ctx.cookies.get('account'))
    if (ctx.session.user.account === ctx.cookies.get('account')) {
      console.log("true")
    } else {
      console.log("false")
    }
  }
}