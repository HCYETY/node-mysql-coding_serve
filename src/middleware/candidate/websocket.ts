import { Context } from 'koa';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { nowTime } from '../../config/utils';

export default (ctx: Context) => {
  const wss = new WebSocket.Server({ port: 8888 });
  let saveMsg = [];
  if (wss.readyState === WebSocket.CONNECTING) {
    wss.send('正在连接服务器...');
  }
  if (wss.readyState === WebSocket.OPEN) {
    wss.send('您已连接到服务器');
  }

  wss.on('connection', function connection(ws, req) {
    const nowtime = nowTime({ click: true });
    const id = uuidv4();
    const retMsg = { 
      time: nowtime, 
      identity: '系统', 
      msg: '已进入xxx号房间', 
      // client_uuid: id 
    };
    saveMsg.push(retMsg);
    console.log(saveMsg)
    ws.send(JSON.stringify(saveMsg));
    ws.on('message', function incoming(message) {
      // 广播消息给所有客户端
      wss.clients.forEach(function each(client) {
        console.log(message)
        const msg = { time: nowtime, msg: message };
        retMsg.identity = null;
        retMsg.msg = message.inputInform;
        saveMsg.push(retMsg)
        client.send(JSON.stringify(saveMsg));
      });
  
    });
  
  });
}