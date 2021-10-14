1. POST http://localhost:3000/login 404 (Not Found)?
> 有多种原因：①前端调用后端接口失败，通常是因为接口的路径匹配错误；②后端没有响应数据给前端；前端接收数据的格式与后端返回数据的格式不相符。
> 
> 参考：[vue项目 前端 POST(GET) http://127.0.0.1xxx 404(Not Found)错误 （多种误区解决）](https://blog.csdn.net/qq_44163269/article/details/105442612)


2. RepositoryNotFoundError: No repository for "User" was found?
> [解决方法](https://www.cnblogs.com/yyh28/p/14241023.html)

3. 在服务器运行`npm run dev`报错：SyntaxError: Cannot use import statement outside a module？
> [解决方法](https://blog.csdn.net/weixin_43094085/article/details/114832738)

4. pm2学习：[Linux CentOS + Nodejs + Koa部署vue项目](https://blog.csdn.net/lihefei_coder/article/details/102469510)
5. 启动 nodejs 项目报错？
```
import Koa from 'koa';
^^^^^^

SyntaxError: Cannot use import statement outside a module
```
据说方法是在 package.json 中加入 "type": "module" ，然而我这样做之后又报了另一个错误：Unknown file extension ".ts" ？这时搜了下文章，解决方法是 删除 "type": "module" 。我懵了？？？？？

6. 引入文件报错：Could not find a declaration file for module '../../sendmail.js'？

7. ts 项目中使用 antd4 Table 组件报错：类型“IntrinsicAttributes & DrawerProps & { children?: ReactNode; }”上不存在属性“extra”？
```

```

8. 使用 typeorm 设计跨数据库的表约束，报错：外键约束错误？
```
QueryFailedError: ER_NO_REFERENCED_ROW_2: Cannot add or update a child row: a foreign key constraint fails (`itembank`.`test`, CONSTRAINT `FK_cf178041db2d954f037ccb0c1ec` FOREIGN KEY (`test_to_paper`) REFERENCES `fieldwork`.`test_paper` (`key`) ON DELETE NO ACTION ON UPDATE NO ACTION)
```