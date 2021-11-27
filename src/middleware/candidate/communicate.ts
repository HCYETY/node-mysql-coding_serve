import { Context } from 'koa';
import { transTime } from 'src/config/utils';
import Ws from 'ws';

export default async (ctx:Context) => {
  const server = new Ws.Server({ port: 9090 });
  server.on('open', function open() {
    server.send('您已连接到服务器');
  });

  server.on('close', function close() {
    server.send('您已断开服务器');
  });
  
  server.on('connection', function connection(ws, req) {
    if (ws.readyState == Ws.CONNECTING) {
      console.log(ws.readyState)
      console.log(Ws.CONNECTING)
      ws.send('正在连接服务器');
    }
    // const ip = req.connection.remoteAddress;
    // const port = req.connection.remotePort;
    // const clientName = ip + port;
  
    // 接收客户端发来的消息
    ws.on('message', function incoming(message) {
      const time = new Date();
      const hour = time.getHours();
      const minute = time.getMinutes();
      const second = time.getSeconds();
      const nowtime = hour + ':' + minute + ':' + second + ' ';
      console.log(nowtime + '系统：' + message);
      
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