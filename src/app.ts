import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import { createConnection } from "typeorm";

const authenticate = require('./middleware/authenticate');
const login = require('./middleware/login');
const register = require('./middleware/register');
const home = require('./middleware/home');

createConnection ()
  .then(() => {
    const app = new Koa();
    const router = new Router(); 

    // 处理cookie跨域
    const corsOptions ={
      origin:'http://localhost:3000', 
      credentials:true,
      optionSuccessStatus:200
    }
    app.use(cors(corsOptions));
    // 处理 post 请求的参数
    app.use(bodyParser());
    // 根据登录状态设置登录拦截
    router.use(authenticate);
    // 匹配接口
    router.post('/login', login);
    router.post('/register', register);
    router.post('/submit', home);
    // 组装匹配好的路由，返回一个合并好的中间件
    app.use(router.routes());
    
    app.listen(3001, () => {
      console.log('网站服务器启动成功，请访问 http://localhost:3001');
    })
  })
  .catch(error => console.log('TypeOrm连接失败', error))