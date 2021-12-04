import { Context } from 'koa';
import WebSocket from 'ws';
import { nowTime } from "../../config/utils";

export default (ctx:Context, next) => {

const wss = new WebSocket.Server({ port: 8888 });
  let clients = [];
  let retMsg = [];

  function wsSend(data: { time: any, identity: string, msg: string, id?: string, name?: string }) {
    let { time, identity, msg, id, name } = data;
    retMsg.push({ time, identity, msg, id, name });
    const len = retMsg.length;
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
      const time = nowTime({ click: true });
      const identity = '系统';
      const msg = '您已连接到服务器';
      retMsg.push({ time, identity, msg })
      ws.send(JSON.stringify(retMsg));
    }

    ws.on('message', function incoming(message) {
      const { inputInform, id, interviewIdentity, cookie } = JSON.parse(message);
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
        console.log('name', interviewIdentity)
        clients.push({ id: cookie, ws });
        wsSend({ time, identity, msg, id, name });
      }
    });
  });
}