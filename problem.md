## 
1. POST http://localhost:3000/login 404 (Not Found)?
> 有多种原因：①前端调用后端接口失败，通常是因为接口的路径匹配错误；②后端没有响应数据给前端；前端接收数据的格式与后端返回数据的格式不相符。
> 
> 参考：[vue项目 前端 POST(GET) http://127.0.0.1xxx 404(Not Found)错误 （多种误区解决）](https://blog.csdn.net/qq_44163269/article/details/105442612)
2. RepositoryNotFoundError: No repository for "User" was found?
> [解决方法](https://www.cnblogs.com/yyh28/p/14241023.html)