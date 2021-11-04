import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import { createConnections } from "typeorm";

import { ORIGINIP } from './config/const';
import authenticate from './middleware/authenticate';
import email from './middleware/email';
import login from './middleware/login';
import register from './middleware/register';
import loginOut from './middleware/loginOut';
import paper from './middleware/paper/showPaper';
import addPaper from './middleware/paper/addPaper';
import deletePaper from './middleware/paper/deletePaper';
import candidateInform from './middleware/paper/candidateInform';
import modifyPaper from './middleware/paper/modify';
import addTest from './middleware/paper/addTest';
import showTest from './middleware/paper/showTest';

createConnections ()
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
  router.post('/email', email);
  router.post('/login', login);
  router.post('/register', register);
  router.post('/login_out', loginOut);
  router.post('/paper', paper);
  router.post('/add_paper', addPaper);
  router.post('/delete_paper', deletePaper);
  router.post('/modify_paper', modifyPaper);
  router.post('/candidate_inform', candidateInform);
  router.post('/add_test', addTest);
  router.post('/show_test', showTest);
  // 组装匹配好的路由，返回一个合并好的中间件
  app.use(router.routes());
  
  app.listen(8080, () => {
    console.log('网站服务器启动成功，请访问 http://120.79.193.126:8080');
  })
})
.catch((error: any) => console.log('TypeOrm连接失败', error))


//   location /api/ {
//     proxy_set_header Host $http_host;
//     proxy_set_header X-Real-IP $remote_addr;
//     proxy_set_header REMOTE-HOST $remote_addr;
//     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//     proxy_pass http://120.79.193.126:8080;
// }
