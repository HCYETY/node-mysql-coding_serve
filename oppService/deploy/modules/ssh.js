const node_ssh = require('node-ssh').NodeSSH;
const ssh = new node_ssh();

function connectServe (sshInfo) {
  return new Promise((resolve, reject) => {
    ssh.connect({ ...sshInfo })
    .then(() => {
      resolve(
        console.log('2、' + sshInfo.host + '连接成功'),
        ssh.putFile(localFile, config.deployDir)
        .then(async () => {
          resolve(console.log('3、' + '文件已成功上传至服务器'));
        }, (error) => {
          reject(console.log('3、' + '文件上传失败', error));
        })  
      );
    }).catch((err) => {
      reject(console.error('2、' + sshInfo.host + '连接失败', err))
    })
  })
}

module.exports = connectServe

// port: server.port,
// host: server.host,
// username: server.username,
// password: server.password,