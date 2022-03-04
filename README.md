## 后端表设计
1. 用户表

|字段|字段描述|字段类型|
|:--:|:--:|:--:|
|account|账号|varchar|
|password|账号密码|varchar|
|email|邮箱|varchar|
|cypher|邮箱密码|varchar|
|captcha|验证码|varchar|
|session|20位的随机数|varchar|
|interviewer|用户身份|tinyint|
|nowtime_captcha|发送验证码的当前时间|bigint|

2. 试卷表

|字段|字段描述|字段类型|
|:--:|:--:|:--:|
|candidate|候选人邮箱|数组|
|paper|试卷名称|varchar|
|paper_description|试卷描述|longtext|
|tests_num|试题量|int|
|paper_point|试卷分数|int|
|time_begin|试卷开放时间|bigint|
|time_end|试卷截止时间|bigint|
|answer_time|试卷作答时长|varchar|
|remaining_time|试卷剩余作答时间|tinyint|
|check|可否查看试卷|tinyint|
|interviewer|面试官邮箱|varchar|

3. 试题表（单独放在另一个数据库里）

|字段|字段描述|字段类型|
|:--:|:--:|:--:|
|num|试题序号|varchar|
|test_name|试题名称|varchar|
|test|试题内容|longtext|
|answer|试题答案|longtext|
|tags|试题标签|text|
|level|试题难度|varchar|
|point|试题分数|int|
|paperKey|绑定试卷 id|int|

4. 候选人表

|字段|字段描述|字段类型|
|:--:|:--:|:--:|
|email|候选人邮箱|varchar|
|paper|受邀的试卷名称|varchar|
|test_name|试卷中的试题名称|varchar|
|program_answer|填写的试题代码|longtext|
|time_end|试卷截止时间|bigint|
|test_level|试题难度|varchar|
|test_status|试题作答状态|varchar|
|watch|试卷提交后可否查看|tinyint|
|look_over|试卷是否批阅|tinyint|
|score|面试官批阅后给的分数|int|

5. 面试官批阅表

|字段|字段描述|字段类型|
|:--:|:--:|:--:|
|email|候选人邮箱|varchar|
|paper|候选人试卷|varchar|
|total_score|试卷总分|int|
|rank|排名|int|
|look_over|试卷是否批阅|tinyint|
|join|候选人是否参与答卷|tinyint|

6. 留言表【绑定候选人表】

|字段|字段描述|字段类型|
|:--:|:--:|:--:|
|email|用户邮箱|varchar|
|like_num|点赞数|int|
|dislike_num|倒彩数|int|
|comtents|评论|longtext|
|order|回复的评论的key|int|
|tests|绑定试题| |


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