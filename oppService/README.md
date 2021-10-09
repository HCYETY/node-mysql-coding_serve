## 项目模板的目录结构：
```js
├── .gitignore
├── deploy.sh           // 上传到服务器执行的脚本
├── interface.md        // 接口文档
├── ormconfig.js        // mysql 数据库的配置
├── package-lock.json        
├── package.json
├── problem.md          // 记录开发过程遇到的问题
├── README.md           // 项目说明
├── tsconfig.json
│
├─ deploy                // 自动化部署脚本
│  ├── config.js            // 服务器的配置信息
│  ├── index.js
│  │
│  └─ modules    
│          deploy.sh
│          handleCommand.js
│          helper.js
│          ssh.js
│          uploadFile.js
│
├─ img
│  ├── 1.jpg
│
├─ oppService            // 自动化部署要上传的文件夹
│
└─ src
    ├── app.ts           // 项目入口文件
    │
    ├─ config            
    │  ├── const.ts     // 存放各种常量
    │  ├── types.ts     // 存放变量类型、接口响应数据的类型
    │  ├── utils.ts     // 存放公共函数
    │
    ├─ entity            // 数据库中表的实例
    │  ├── testPaper.ts     // 存放试卷数据
    │  ├── User.ts          // 存放用户信息
    │
    └─ middleware        // 中间件，对接口的处理
        ├── authenticate.ts  // 登录逻辑拦截
        ├── login.ts         // 接收登录请求
        ├── register.ts      // 接收注册请求
        │
        └─ paper             // 对试卷的处理
            ├── addPaper.ts     // 新增指定试卷
            ├── deletePaper.ts  // 删除指定试卷
            ├── modifyPaper.ts  // 修改指定试卷信息
            ├── showPaper.ts    // 获取所有试卷信息
```