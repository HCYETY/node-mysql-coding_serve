// module.exports = wss => {
//   wss.on('connection', function connection(ws) {
//     ws.on('message', function incoming(message) {
//       console.log('received: %s', message);
//     });
//     ws.send('something');
//   });
// }

import { Context } from 'koa';
import { nowTime, } from '../../config/utils';
import Ws from 'ws';

export default async (ctx: Context) => {
  const host = '120.79.193.126:9090';
  const server = new Ws.Server({ port: 9090 });
  
  server.on('connection', function connection(ws, req) {
    console.log('connection')
    if (ws.readyState == Ws.CONNECTING) {
      console.log('ws.readyState == Ws.CONNECTING',ws.readyState)
      console.log('ws.readyState == Ws.CONNECTING',Ws.CONNECTING)
      ws.send('正在连接服务器');
    }
    // const ip = req.connection.remoteAddress;
    // const port = req.connection.remotePort;
    // const clientName = ip + port;
  
    // 接收客户端发来的消息
    ws.on('message', function incoming(message) {
      const nowtime = nowTime({ click: true });
      // 广播消息给所有客户端
      server.clients.forEach(function each(client) {
        if (client.readyState === Ws.OPEN) {
          client.send(nowtime + message);
          // client.send( clientName + " -> " + message);
        }
      });
  
    });
  
  });
  
  
  // server.on('error', function error(event) {
  //   server.send('服务器出错了', event);
  // });
}