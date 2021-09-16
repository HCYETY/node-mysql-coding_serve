import Koa from 'koa'
// import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import { createConnection } from "typeorm"

createConnection ()
  .then(() => {
    const app = new Koa()

    const login = require('./middleware/login')
    
    // 处理跨域
    app.use(cors())
    // 处理 post 请求的参数
      .use(bodyParser())
    // app.use(ctx => {
    //   if(ctx.path === 'login') {
    //     ctx.body = 
    //   }
    // })
      .use(login)
    
    app.listen(3001, () => {
    console.log('网站服务器启动成功，请访问 http://localhost:3001')
    })
  })
  .catch(error => console.log('TypeOrm连接失败', error));