## 项目模板的目录结构：
```js
├── README.md // 项目说明
├── problem.md // 
├── documents.md
├── package.json
├── tsconfig.json
├── ormconfig.js // mysql数据库的相关配置
├── img // 存放图片资源
├── .gitignore
└── src
    ├── App.tsx // 根组件
    ├── index.tsx // 项目入口文件
    ├── style.less // 根组件样式
    ├── index.html // 打包时的 HTML 模板
    ├── api 
    │   ├── index.ts  // 封装了 get 和 post 方法
    │   ├── modules // 后续根据项目模块的划分，在这里添加接口
    ├── pages // 项目业务组件
```
|序号|文件夹|描述|
|:--:|:--:|:--:|
|1|controllers|用于存放各种业务逻辑函数，如：处理接口请求|
|2|middleware|存放了各种中间件、全局 or 自定义的中间件|
|3|config|各种配置项的位置，包括端口、log路径、各种巴拉巴拉的常量定义|
|4|entity|这里存放的是所有的实体定义|
|5|models|使用来自entity中的实体进行sequelize来完成初始化的操作，并将sequelize对象抛出|
|6|utils|存放的各种日常开发中提炼出来的公共函数|
|7|types|存放了各种客制化的复合类型的定义，各种结构、属性、方法返回值的定义（目前包括常用的Promise版redis与qconf）|