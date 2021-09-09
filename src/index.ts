import Koa from 'koa'
import Router from 'koa-router'

// import { AppRoutes } from './routers'

const app = new Koa()
const router = new Router()

router.get('/', async ctx => {
  ctx.body = {data:"你好！"}
})
router.get('/login', async (ctx) => {
  ctx.body = "你好siyang"
})

app.use(router.routes());
// app.use(router.allowedMethods({ 
//   throw: true, // 抛出错误，代替设置响应头状态
//   // notImplemented: () => '不支持当前请求所需要的功能',
//   // methodNotAllowed: () => '不支持的请求方式'
// }));

// AppRoutes.forEach(route => router[route.method](route.path, route.action))
// app.use(router.routes())

app.listen(3001, () => {
  console.log('网站服务器启动成功，请访问 http://localhost:3001')
})