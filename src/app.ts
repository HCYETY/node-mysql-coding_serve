import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import { createConnections } from "typeorm";

import { ORIGINIP } from './config/const';
import authenticate from './middleware/authenticate';

import email from './middleware/user/email';
import login from './middleware/user/login';
import register from './middleware/user/register';
import logout from './middleware/user/logout';
import searchCandidate from './middleware/user/searchCandidate';

import paper from './middleware/paper/show';
import addPaper from './middleware/paper/add';
import deletePaper from './middleware/paper/delete';
import modifyPaper from './middleware/paper/modify';
import lookOver from './middleware/paper/lookOver';
import communicate from './middleware/candidate/communicate';

import addTest from './middleware/test/add';
import showTest from './middleware/test/show';

import submit from './middleware/candidate/submit';
import search from './middleware/candidate/search';
import comment from './middleware/candidate/comment';

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
  // router.use(communicate);
  // router.post('/api/communicate', communicate);
  // 匹配接口
  router.post('/api/email', email);
  router.post('/api/login', login);
  router.post('/api/register', register);
  router.post('/api/logout', logout);
  
  router.post('/api/search_candidate', searchCandidate);

  // 面试题管理
  router.post('/api/paper', paper);
  router.post('/api/add_paper', addPaper);
  router.post('/api/delete_paper', deletePaper);
  router.post('/api/modify_paper', modifyPaper);
  // 阅卷管理
  router.post('/api/look_over', lookOver);
  // 面试间
  // router.post('/api/communicate', communicate);
  // router.use(communicate);

  router.post('/api/add_test', addTest);
  router.post('/api/show_test', showTest);

  router.post('/api/submit', submit);
  router.post('/api/search', search);
  router.post('/api/comment', comment);
  // 组装匹配好的路由，返回一个合并好的中间件
  app.use(router.routes());
  
  app.listen(8080, () => {
    console.log('网站服务器启动成功，请访问 http://120.79.193.126:8080');
  })
})
.catch((error: any) => console.log('TypeOrm连接失败', error))