import { Context } from 'koa';
import { getManager } from "typeorm";

import LookOver from '../../entity/LookOver';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const { paper, email, } = req;
  const lookOverRepository = await getManager().getRepository(LookOver);
  // if (req) {
    const findLookOver = await lookOverRepository.find({where: { email, paper }});
  //   findLookOver.total_score = req.total_score;
  //   findLookOver.rank = req.rank;
  //   findLookOver.use_time = req.use_time;
    // findLookOver.look_over = true;
  //   ctx.body = new responseClass(200, '试卷批阅信息提交成功', { status: true });
  // } else if (paper) {
   if (paper) {
    const ret = await lookOverRepository.find({ paper, join: true });
    ctx.body = new responseClass(200, '试卷批阅信息查询成功', { status: true, ret });
  }
}