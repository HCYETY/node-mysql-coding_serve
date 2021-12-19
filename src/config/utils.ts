// 生成 n 位数的包含大小写字母、数字的随机数
export function generateMixed (n: number): string {
  let strData = "";
  for (let i = 0; i < n; i++) {
    const num = Math.floor(Math.random() * 10);
    const az = String.fromCharCode(Math.random() * 26 + 65);
    const AZ = String.fromCharCode(Math.random() * 26 + 97);
    strData += num + az + AZ;
  }
  return strData;
}

// 生成 6 位数字的验证码 或者 面试间号码
export function createSixNum(): number {
  let num = "";
  for(let i = 0; i < 6; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return +num;
}

// 根据不同身份（面试官和候选人）生成不同的面试间的链接
export function createInterviewLink(data: { interviewer: boolean, roomNum: number }): string {
  const { interviewer, roomNum } = data;
  let link: string = null;
  if (interviewer === true) {
    link = `/interview/${ roomNum }/interviewer?code=${ generateMixed(3) }`;
  } else {
    link = `/interview/${ roomNum }/candidate?code=${ generateMixed(3) }`;
  }
  return link;
}

// 获取当前时间戳：毫秒格式 或者 hh:mm:ss格式
// 不带参数是毫秒格式，否则为 hh:mm:ss 格式
export function nowTime(data?: { click: boolean }): number | string {
  if (data && data.click && data.click === true) {
    const time = new Date();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const timer = hour + ':' + minute + ':' + second + ' ';
    return timer;
  }
  const time = new Date().getTime();
  return time;
}

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