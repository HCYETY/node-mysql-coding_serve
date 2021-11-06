// import { loginResponseProps } from "./types";

// const defaultRes = {
//   code: 0,
//   msg: '',
//   data: {},
// }

export default class loginResponse {
  res = {}

  constructor(code: number, msg: string, data?: any) {
    this.res = {
      code: code,
      msg: msg,
      data: data,
    }
    // this.res = Object.assign({}, defaultRes, params);
  }

  toJSON() {
    return this.res;
  }
}