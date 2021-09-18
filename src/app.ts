import Koa from 'koa'
// import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import session from 'koa-session'
import { createConnection } from "typeorm"

createConnection ()
  .then(() => {
    const app = new Koa()
    const login = require('./middleware/login')
    const session_config = require('./session')
    const home = require('./middleware/home')

    const session_signed_key = ["some secret hurr"];  // 这个是配合signed属性的签名key
    const koaSession = session(session_config, app)
    app.keys = session_signed_key;
    
    // 处理跨域
    // 处理cookie跨域
    const corsOptions ={
      origin:'http://localhost:3000', 
      credentials:true,
      optionSuccessStatus:200
    }
    app.use(cors(corsOptions))
    // session中间件
      .use(koaSession)
    // 处理 post 请求的参数
      .use(bodyParser())

      .use(async (ctx, next) => {
        const dontNeedCheck = ['/login', '/register']
        console.log("=================================================")
        console.log("服务端的session：", ctx.session)
        if (dontNeedCheck.indexOf(ctx.url) > -1) {
          await next()
          return
        }else if (ctx.session.isLogin) {
          console.log('您处于登录状态，可继续访问网页')
          ctx.body = {message:'您处于登录状态，可继续访问网页'}
          await next()
          return
        } else { 
          console.log('您还未登录！如果您已注册，请先前往登录；如果还未注册，请先注册。')
          ctx.body = {message:'您还未登录！如果您已注册，请先前往登录；如果还未注册，请先注册。'}
          return
        }
      })
      .use(login)
      .use(home)
    
    app.listen(3001, () => {
      console.log('网站服务器启动成功，请访问 http://localhost:3001')
    })
  })
  .catch(error => console.log('TypeOrm连接失败', error))