import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import { createConnection } from "typeorm";

import { ORIGINIP } from './config/const';
import authenticate from './middleware/authenticate';
import login from './middleware/login';
import register from './middleware/register';
import paper from './middleware/paper/showPaper';
import addPaper from './middleware/paper/addPaper';
import deletePaper from './middleware/paper/deletePaper';
import modifyPaper from './middleware/paper/modifyPaper';

createConnection ()
  .then(() => {
    const app = new Koa();
    const router = new Router(); 

    // 处理cookie跨域
    const corsOptions ={
      origin: ORIGINIP, 
      credentials: true,
      optionSuccessStatus: 200
    }
    app.use(cors(corsOptions));
    // 处理 post 请求的参数
    app.use(bodyParser());
    // 根据登录状态设置登录拦截
    router.use(authenticate);
    // 匹配接口
    router.post('/api/login', login);
    router.post('/api/register', register);
    router.post('/api/paper', paper);
    router.post('/api/add_paper', addPaper);
    router.post('/api/delete_paper', deletePaper);
    router.post('/api/modify_paper', modifyPaper);
    // 组装匹配好的路由，返回一个合并好的中间件
    app.use(router.routes());
    
    app.listen(8080, () => {
      console.log('网站服务器启动成功，请访问 http://120.79.193.126:8080');
    })
  })
  .catch((error: any) => console.log('TypeOrm连接失败', error))