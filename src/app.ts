import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import websockify from 'koa-websocket';
import { createConnections } from "typeorm";

import { ORIGINIP } from './config/const';
import authenticate from './middleware/authenticate';

import email from './middleware/user/email';
import login from './middleware/user/login';
import register from './middleware/user/register';
import logout from './middleware/user/logout';
import searchEmail from './middleware/user/searchEmail';

import paper from './middleware/paper/show';
import addPaper from './middleware/paper/add';
import deletePaper from './middleware/paper/delete';
import modifyPaper from './middleware/paper/modify';
import lookOver from './middleware/paper/lookOver';

import addTest from './middleware/test/add';
import showTest from './middleware/test/show';

import submit from './middleware/candidate/submit';
import search from './middleware/candidate/search';
import comment from './middleware/candidate/comment';

import createInterview from './middleware/interview/create';
import findInterview from './middleware/interview/find';
import submitInterview from './middleware/interview/submit';
import WebSocketApi from './middleware/candidate/websocket';
import http from 'http';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { nowTime } from './config/utils';
import { getManager, } from "typeorm";
import User from './entity/User';

interface msgObj {
  time: string;
  identity: string;
  msg: string;
  name: string;
}

createConnections ()
.then(async () => {
  const app = new Koa();
  const router = new Router(); 

  const wss = new WebSocket.Server({ port: 8888 });
  let clients = [];
  let talkMsg = [], codeMsg = [];

  function wsSend(data: { code?: string, isEditor?: boolean, time?: any, identity?: string, msg?: string, id?: string, name?: string }) {
    const { time, identity, msg, id, name, code, isEditor } = data;
    let retMsg = null;
    if (code !== undefined && isEditor !== undefined) {
      codeMsg.push({ code, isEditor });
      retMsg = codeMsg;
    } else {
      talkMsg.push({ time, identity, msg, id, name });
      retMsg = talkMsg;
    }  
    //遍历客户端
    for (var i = 0; i < clients.length; i++) {
      //声明客户端
      var clientSocket = clients[i].ws;
      if(clientSocket.readyState === WebSocket.OPEN) {
        //客户端发送处理过的信息
        clientSocket.send(JSON.stringify(retMsg));
      }
    }
  }
  
  wss.on('connection', async function connection(ws, req) {
    if (ws.readyState === WebSocket.OPEN) {
      const obj = {
        time: nowTime({ click: true }),
        identity: '系统',
        msg: '您已连接到服务器',
      }
      ws.send(JSON.stringify([obj]));
    }

    ws.on('message', function incoming(message) {
      const { inputInform, id, interviewIdentity, cookie, code, isEditor } = JSON.parse(message);
      if (inputInform && id) {
        const time = nowTime({ click: true });
        const identity = interviewIdentity;
        const msg = inputInform;
        wsSend({ time, identity, msg, id });
      } else if (cookie) {
        const time = nowTime({ click: true });
        const identity = '系统';
        const msg = `已进入xxx号房间`;
        const id = cookie;
        const name = interviewIdentity;
        clients.push({ id: cookie, ws });
        wsSend({ time, identity, msg, id, name });
      } else if (code) {
        wsSend({ code, isEditor });
      }
    });
  });

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
  // router.use(WebSocketApi);
  // 匹配接口
  router.post('/api/email', email);
  router.post('/api/login', login);
  router.post('/api/register', register);
  router.post('/api/logout', logout);
  
  router.post('/api/search_email', searchEmail);

  // 试题管理
  router.post('/api/paper', paper);
  router.post('/api/add_paper', addPaper);
  router.post('/api/delete_paper', deletePaper);
  router.post('/api/modify_paper', modifyPaper);
  // 阅卷管理
  router.post('/api/look_over', lookOver);
  // 面试间
  // router.all('/koa/ws', WebSocketApi);
  router.post('/api/create_interview', createInterview);
  router.post('/api/find_interview', findInterview);
  router.post('/api/submit_interview', submitInterview);

  router.post('/api/add_test', addTest);
  router.post('/api/show_test', showTest);

  router.post('/api/submit', submit);
  router.post('/api/search', search);
  router.post('/api/comment', comment);
  // 组装匹配好的路由，返回一个合并好的中间件
  app.use(router.routes());
  // app.use(WebSocketApi);
  
  app.listen(8080, () => {
    console.log('网站服务器启动成功，请访问 http://120.79.193.126:8080');
  })
})
.catch((error: any) => console.log('TypeOrm连接失败', error))