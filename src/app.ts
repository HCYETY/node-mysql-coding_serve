import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import websockify from 'koa-websocket';
import { createConnections } from "typeorm";

import { ORIGINIP, WS_TYPE } from './config/const';
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
import deleteInterview from './middleware/interview/delete';

import { nowTime } from './config/utils';
import WebSocketApi from './middleware/candidate/websocket';
import WebSocket from 'ws';
import { TextOperation, Server, } from 'ot';
import ot from 'ot';
// import EditorSocketIOServer from 'ot.js/socketio-server.js';

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



  const wss = new WebSocket.Server({ port: 9090 });
  let clients = [];
  let codeMsg = [];

  function wsSend(data: any) {
  // function wsSend(data: { showVideo?: boolean, canVideo?: boolean, code?: string, cookie?: string, time?: any, identity?: string, msg?: string, id?: string, name?: string }) {
    let retMsg = null;
    switch(data.type) {
      // case WS_TYPE.CONNECT:
      // case WS_TYPE.TALK:
        // talkMsg.push(data);
        // retMsg = talkMsg;
        // retMsg = data;
        // break;
      case WS_TYPE.CODE:
        codeMsg.push(data);
        retMsg = codeMsg;
        codeMsg = [];
        break;
      case WS_TYPE.CONNECT:
      case WS_TYPE.TALK:
      case WS_TYPE.REQ_VIDEO:
      case WS_TYPE.RES_VIDEO:
      case WS_TYPE.VIDEO_OFFER:
      case WS_TYPE.VIDEO_ANSWER:
      case WS_TYPE.NEW_ICE_CANDIDATE:
        retMsg = data;
        break;
      default:
        return;
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
        type: WS_TYPE.CONNECT
      }
      ws.send(JSON.stringify(obj));
    }

    ws.on('message', function incoming(messages: any) {
      const { type, operation, cookie, time } = JSON.parse(messages);
      const message = JSON.parse(messages);
      switch (type) {
        case WS_TYPE.CONNECT:
          {
            message.time = nowTime({ click: true });
            message.name = message.identity;
            message.identity = '系统';
            message.msg = `已进入xxx号房间`;
            message.id = cookie;
            clients.push({ id: cookie, ws });
            wsSend(message);
            break;
          }
        case WS_TYPE.TALK:
          {
            message.time = nowTime({ click: true });
            wsSend(message);
            break;
          }
        case WS_TYPE.REQ_VIDEO:
        case WS_TYPE.RES_VIDEO:
        case WS_TYPE.VIDEO_OFFER:
        case WS_TYPE.VIDEO_ANSWER:
        case WS_TYPE.NEW_ICE_CANDIDATE:
          {
            wsSend(message);
            break;
          }
        case WS_TYPE.CODE:
          // // Both users start with the same document
          // var str = "lorem ipsum";

          // // User A appends the string " dolor"
          // var operationA = new TextOperation()
          //   .retain(11)
          //   .insert(" dolor");
          // var strA = operationA.apply(str); // "lorem ipsum dolor"

          // // User B deletes the string "lorem " at the beginning
          // var operationB = new TextOperation()
          //   .delete("lorem ")
          //   .retain(5);
          // var strB = operationB.apply(str); // "ipsum";

          // var transformedPair = TextOperation.transform(operationA, operationB);
          // var operationAPrime = transformedPair[0];
          // var operationBPrime = transformedPair[1];

          // var strABPrime = operationAPrime.apply(strB); // "ipsum dolor"
          // var strBAPrime = operationBPrime.apply(strA); // "ipsum dolor"
          // // console.log('operationBPrime', operationBPrime)
          // // console.log('operationBPrime', operationBPrime)


          // const retCode = operationA.apply(code);
          console.log(operation, cookie, time)
          // const sss = operation.fromJSON()
          // console.log('sss', sss)
          // wsSend({ code, cookie, time });
        default:
          return;
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
  router.post('/api/delete_interview', deleteInterview);

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