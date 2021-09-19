import Koa from 'koa'
// import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import { createConnection, getManager } from "typeorm"

createConnection ()
  .then(() => {
    const app = new Koa()
    const login = require('./middleware/login')
    const home = require('./middleware/home')
    // const User = require('./entity/User')
    const authenticate = require('./middleware/authenticate')

    // 处理跨域
    // 处理cookie跨域
    const corsOptions ={
      origin:'http://localhost:3000', 
      credentials:true,
      optionSuccessStatus:200
    }
    app.use(cors(corsOptions))
    // 处理 post 请求的参数
      .use(bodyParser())

      .use(authenticate)
      .use(login)
      .use(home)
    
    app.listen(3001, () => {
      console.log('网站服务器启动成功，请访问 http://localhost:3001')
    })
  })
  .catch(error => console.log('TypeOrm连接失败', error))