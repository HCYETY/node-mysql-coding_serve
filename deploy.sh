#!/bin/bash

# 先关闭之前的服务，安装依赖之后再重启
pm2 stop src/app.ts

# 查看文件中是否已经包含 node_modules ，如果有则先删除
# file='node_modules'
# if [ -e $file ]; then
#   rm -rf $file
#   npm cache clean --force
# fi
# 重新安装依赖
cnpm install

# 查看8080端口是否被占用，有则 kill
port=8080
pid=$(netstat -nlp | grep :$port | awk '{print $7}' | awk -F"/" '{ print $1 }')
if [ -n "$pid" ]; then
  kill -9 $pid;
fi

# 启动 pm2
pm2 start ./src/app.ts