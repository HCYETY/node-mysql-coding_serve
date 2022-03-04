module.exports = [
  {
    type: 'mysql', // 数据库类型
    host: '120.79.193.126', // 连接域名
    port: '3306', // 连接端口
    username: 'root', // 用户名
    password: '1127', // 密码
    database: 'alimydb', // 数据库名
    logging: false, // 是否有日志
    synchronize: false, // 是否自动建表
    entities: [__dirname + '/src/entity/*{.ts,.js}'], // entity/model存放位置
    timezone: 'z', // 以本地时区时间为主
    dateStrings: 'TIMESTAMP'
  }, 
  {
    type: 'mysql', // 数据库类型
    host: '120.79.193.126', // 连接域名
    port: '3306', // 连接端口
    username: 'root', // 用户名
    password: '1127', // 密码
    database: 'examydb', // 数据库名
    logging: false, // 是否有日志
    synchronize: false, // 是否自动建表
    entities: [__dirname + '/src/entity/*{.ts,.js}'], // entity/model存放位置
    timezone: 'z', // 以本地时区时间为主
    dateStrings: 'TIMESTAMP'
  }
]