# 接口文档
|api|描述|响应数据|
|:--:|:--:|:--:|
|/login|登录|若登陆成功：{message:'登录成功', session:{user:{account}, time:new Date(), isLogin:true/false}}<br>若登录信息有误：{message:'用户名或密码错误', session:{}}<br>若未注册先登录：{message:'该用户名不存在', session:{}}
|/register|注册|若注册成功：{status:true, message:'注册成功', data:User { account: '2111111111', password: '000000', id: 35 }}<br>若注册失败：{status:false, message:'用户已存在，请注册新的邮箱'}