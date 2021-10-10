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

export function createSixNum(): string {
  var Num = "";
  for(let i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}

export function dateDiff(start: string, end: string) {
  let startDate = Date.parse(start);
  let endDate = Date.parse(end);
  if (startDate > endDate) {
    return 0;
  } else if (startDate === endDate) {
    return 1;
  } else {
    let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
  }
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