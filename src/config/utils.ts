// 生成 20 位数的包含大小写字母、数字的随机数
export function generateMixed (n: number): string {
  let strData = "";
  for (let i = 0; i < 20; i++) {
    const num = Math.floor(Math.random() * 10);
    const az = String.fromCharCode(Math.random() * 26 + 65);
    const AZ = String.fromCharCode(Math.random() * 26 + 97);
    strData += num + az + AZ;
  }
  return strData;
}

// 生成 6 位数字的验证码
export function createSixNum(): string {
  let Num = "";
  for(let i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}

// 获取当前时间，yyyy-mm-dd hh:mm 格式
// 如果某个数字只有一位数，则在前面补 0
// export function nowTime() {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = (now.getMonth() + 1).toString().padStart(2,'0');
//   const day = now.getDate().toString().padStart(2,'0');
//   const hours = now.getHours().toString().padStart(2,'0');
//   const minutes = now.getMinutes().toString().padStart(2,'0');
//   const seconds = now.getSeconds();
//   const nowTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
//   return nowTime;
// }
// 转化日期控件时间值
// export function transTime(time: string) {
//   const timeDate = new Date(time).toJSON();
//   const getTime = new Date(+new Date(timeDate)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
//   return getTime;
// }
export function transTime(time: number) {
  const timeDate = new Date(Number(time));
  const getTime = new Date(+new Date(timeDate)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
  return getTime;
}