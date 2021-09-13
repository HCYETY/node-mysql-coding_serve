import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { createConnection } from "typeorm"

createConnection ()
  .then(() => {
    const app = new Koa()

    const login = require('./middleware/login')
    
    app.use(bodyParser())
    app.use(login)
    
    app.listen(3001, () => {
    console.log('网站服务器启动成功，请访问 http://localhost:3001')
    })
  })
  .catch(error => console.log('TypeOrm连接失败', error));