const node_ssh = require('node-ssh').NodeSSH;
const ssh = new node_ssh();
const runCommand = require ('./handleCommand');

async function uploadFile (localFile, config) {
  return new Promise((resolve, reject) => {
    ssh.putFile(localFile, config.deployDir)
    .then(async () => {
      resolve(console.log('3、' + '文件已成功上传至服务器'));
    }, (error) => {
      reject(console.log('3、' + '文件上传失败', error));
    })
  })
}

module.exports = uploadFile;