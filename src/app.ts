import "reflect-metadata"
import Koa, {Context} from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { createConnection, getConnection, getManager } from "typeorm"
import User from './entity/User'

createConnection ()
  .then(() => {
    const app = new Koa()
    const router = new Router()

    router.get('/', async ctx => {
      ctx.body = {data:"你好！"}
    })
    router.post('/login', async (ctx: Context) => {
      const {account, password} = ctx.request.body
      console.log(ctx.request.body)
      console.log(account)
      console.log(password)
      const userRepository = getManager().getRepository(User)
      const targetUser = await userRepository.findOne({where:{account}})
      let res
      if (targetUser.password === password) {
        res = {data:targetUser, message:'登录成功'}
      } else {
        res = {message:'密码错误'}
      }
      ctx.body = res
    })
    
    app.use(bodyParser())
      .use(router.routes())
    
    app.listen(3001, () => {
    console.log('网站服务器启动成功，请访问 http://localhost:3001')
    })
  })
  .catch(error => console.log('TypeOrm连接失败', error));

  // export class UserController {
  //   @Post("/login")
  //   getAll() {
  //     return getConnection().manager.find(login);
  //   }
  // }

// AppRoutes.forEach(route => router[route.method](route.path, route.action))
// app.use(router.routes())