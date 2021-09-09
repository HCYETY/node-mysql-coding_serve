import {Context} from 'koa'

class TestController {
  async test(ctx: Context) {
    ctx.body = {data:"你好！"}
  }
}

export default TestController