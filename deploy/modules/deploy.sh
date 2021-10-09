function install() {
  return new Promise((resolve, reject) => {
    ssh.execCommand('npm install', {cwd: '/usr/local/apache-tomcat-8.5.71/Online-programming-platform_service'}
    ).then((result) => {
      if (result.stderr) {
        reject(console.error('命令执行发生错误，无法安装依赖：' + result.stderr));
        process.exit(0);
      } else {
        resolve(console.log('安装依赖成功!'));
      }
    })
  })
}

// 启动 pm2 
function pm2 () {
  ssh.execCommand('pm2 restart app.ts', {cwd: '/usr/local/apache-tomcat-8.5.71/Online-programming-platform_service/src'}
  ).then(function(result) {
    console.log('远程STDOUT输出: ' + result.stdout);
    console.log('远程STDERR输出: ' + result.stderr);
    if (!result.stderr) {
      console.log('pm2重启成功!');
      process.exit(0);
    }
  })
}