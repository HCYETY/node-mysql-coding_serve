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
  var Num = "";
  for(let i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}

// 比较两个日期的大小
export function dateCompare(start: any, end: any) {
  const date1Str = start.split("-");//将日期字符串分隔为数组,数组元素分别为年.月.日
  //根据年 . 月 . 日的值创建Date对象
  const date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
  const date2Str = end.split("-");
  const date2Obj = new Date(date2Str[0],(date2Str[1]-1),date2Str[2]);
  const startDate = date1Obj.getTime();
  const endDate = date2Obj.getTime();
  if (startDate <= endDate) {
    return true;
  } else {
    return false;
  } 
}

// 求出日期之间的天数
export function getDays(start: any, end: any) {
  const date1Str = start.split("-");//将日期字符串分隔为数组,数组元素分别为年.月.日
  //根据年 . 月 . 日的值创建Date对象
  const date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
  const date2Str = end.split("-");
  const date2Obj = new Date(date2Str[0],(date2Str[1]-1),date2Str[2]);
  const t1 = date1Obj.getTime();
  const t2 = date2Obj.getTime();
  const dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
  const minusDays = Math.floor(((t2 - t1) / dateTime));//计算出两个日期的天数差
  const days = Math.abs(minusDays);//取绝对值
  return days;
}

// 获取当前时间，yyyy-mm-dd 格式
// 如果某个数字只有一位数，则在前面补 0
export function nowTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2,'0');
  const day = now.getDate().toString().padStart(2,'0');
  const nowTime = year + '-' + month + '-' + day;
  return nowTime;
}