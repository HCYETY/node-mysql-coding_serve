const node_ssh = require('node-ssh').NodeSSH;
const ssh = new node_ssh();
const [ , , host, password] = process.argv;
const config = {
  path: {
    localPath: 'oppService/',
    romotePath: '/usr/local/apache-tomcat-8.5.71/Online-programming-platform_service',
  },
  romote: {
    host: host,
    port: 22,
    username: 'root',
    password: password
  }
}

function uploadFile() {
  console.log('你输入的服务器主机是：', host);
  console.log('你输入的服务器密码是：', password);
  ssh.connect(config.romote)
  .then(() => {
    console.log('----------------------------- 连接成功,文件上传中... -----------------------------');
    ssh.putDirectory(config.path.localPath, config.path.romotePath)
    .then(() => {
      console.log('----------------------------- 文件上传完成 ----------------------------');
      console.log('----------------------------- 开始执行远程脚本 ----------------------------');
      ssh.execCommand('sh deploy.sh', { cwd: config.path.romotePath })
      .then((res) => {
        console.log('远程STDOUT输出: ' + res.stdout);
        console.log('远程STDERR输出: ' + res.stderr);
        if (!res.stderr) {
          console.log(res.stderr);
          console.log('----------------------------- 远程脚本执行成功 ----------------------------');
          process.exit(0);
        }
      })
    }).catch(err => {
      console.log('----------------------------- 文件上传失败！！ -----------------------------')
      console.log(err)
    })
  }).catch(err => {
    console.log('----------------------------- 服务器连接失败！！ -----------------------------')
  })
}

uploadFile();
















// const config = require('./config');
// const helper = require('./modules/helper');
// const sshServer = require('./modules/ssh');
// const uploadFile = require('./modules/uploadFile');
// const handleCommand = require('./modules/handleCommand');
// const script = require('./modules/deploy.sh');

// async function main () {
//   try{
//     console.log('===========================开始自动化部署后端项目===========================');
//     // 选择需要部署的服务器、文件及上传至服务器的位置目录
//     // const selectConfig = helper();

//     // 连接服务器
//     await sshServer(config);

//     // 选择需要上传的文件
//     const localFile = 'deploy/';
//     // const localFile = __dirname + '/' + selectConfig.targetFile;

//     // 上传项目文件
//     await uploadFile(localFile, config);

//     // // 上传服务器脚本
//     // await uploadFile(ssh, selectConfig, localFile);

//     // // 安装依赖
//     // await handleCommand(ssh, 'npm install', selectConfig.deployDir + selectConfig.targetFile);

//     // // 重启 pm2
//     // await handleCommand(ssh, 'pm2 restart src/app.ts', selectConfig.deployDir + selectConfig.targetFile);

//   } catch (err) {
//     console.log('自动化部署过程出现错误', err);
//   } finally {
//     process.exit();
//   }
// }

// main();