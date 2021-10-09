const inquirer = require('inquirer');

function helper() {
  inquirer.prompt([
    {
      type: 'input',
      message: '请输入服务器的主机：',
      name: 'post',
      default: '120.79.193.126',
    },
    {
      type: 'password',
      message: '请输入服务器的密码：',
      name: 'password',
      default: 'YFZety1127'
    }
    // {
    //   type: 'list',
    //   message: '你选择部署的项目是：',
    //   name: 'program',
    //   default: 'A项目',
    //   choices: [
    //     'a',
    //     'c'
    //     config.map(index => {
    //       return index.name;
    //     })
    //   ],
    // }
  ]).then((answer) => {
    console.log(answer);
    return answer;
  }).catch((error) => console.error('无法显示交互', error))
}

module.exports = helper;


// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })
// let config = null;
// const questions = [
//   '请输入项目的发布环境: ', 
//   '请输入服务器的主机: ', 
//   '请输入服务器的密码: '
// ]
// const linelimit = 3; // 用户输入的行数
// let inputArr = [];
// let index = 0;
 
// function helper() {
//   if (index === linelimit) {
//     config = config.find(i => i.name == inputArr[0]);
//     config.host = inputArr[1];
//     config.password = inputArr[2];
//     return;
//   }
 
//   rl.question(questions[index], (ans) => {
//     inputArr[index] = ans;
//     index++;
//     helper();
//   })
// }
// rl.on('close',  () => { process.exit(0); })
// helper();

// module.exports = helper;