const nodemailer = require('nodemailer');

const config = {
  service: 'qq',
  host: 'smtp.qq.com',
  port: 465,
  auth: {
    user: '1164939253@qq.com',
    pass: 'xatmepzzhcxejcee'
  }
};

const transporter = nodemailer.createTransport(config);

module.exports = function nodemail(email) {
  transporter.sendMail(email, (error, info) => {
    if (error) {
      return console.log(error);
    } else {
      console.log('email 已经发送成功：', info.response)
    }
  })
  return 
}