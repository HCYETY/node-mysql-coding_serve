import { Context } from 'koa';
import { getManager } from "typeorm";

import LookOver from '../../entity/LookOver';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const { req } = ctx.request.body;
  const lookOverRepository = await getManager().getRepository(LookOver);
  if (req) {
    const newLookOver = new LookOver();
    newLookOver.email = req.email;
    newLookOver.paper = req.paper;
    newLookOver.total_score = req.total_score;
    newLookOver.rank = req.rank;
    newLookOver.use_time = req.use_time;
    newLookOver.look_over = req.look_over;
    newLookOver.join = req.join;
    ctx.body = new responseClass(200, '试卷批阅信息提交成功', { status: true });
  } else {
    const ret = await lookOverRepository.find();
    ctx.body = new responseClass(200, '试卷批阅信息查询成功', { status: true, ret });
  }
}