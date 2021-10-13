import { loginResponseProps } from "./types";

const defaultRes = {
  code: 0,
  msg: '',
  data: {},
}

export class loginResponse {
  res: loginResponseProps = {}
  // res = null;

  constructor(params) {
    this.res = Object.assign({}, defaultRes, params);
  }

  toJSON() {
    return this.res;
  }
}