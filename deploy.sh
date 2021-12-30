#!/bin/bash
echo "登录服务器成功~~"

cd /usr/local/apache-tomcat-8.5.71/Online-programming-platform_service/

echo "当前路径是" `pwd`

echo "开始执行 npm install 安装依赖"

# 先关闭之前的服务，安装依赖之后再重启
# pm2 stop src/app.ts --interpreter ./node_modules/.bin/ts-node
# npm stop ./src/app.ts

# 查看文件中是否已经包含 node_modules ，如果有则先删除
# file='node_modules'
# if [ -e $file ]; then
#   rm -rf $file
#   npm cache clean --force
# fi
# 重新安装依赖
cnpm install
echo "依赖安装完成~~"

# 查看8080端口是否被占用，有则 kill
# port=9090
# pid=$(netstat -nlp | grep :$port | awk '{print $7}' | awk -F"/" '{ print $1 }')
pid=$(lsof -i:9090)
if [ -n "$pid" ]; then
  kill -9 $pid;
fi
echo `pid`
# 启动 pm2
echo "开始执行 npm start ./src/app.ts 重启服务"
# pm2 start ./src/app.ts --interpreter ./node_modules/.bin/ts-node
# pm2 start ./src/app.ts
npm start ./src/app.ts

echo "服务重启成功~~"
echo "服务部署完成 快去验证看看吧 (*^▽^*)"