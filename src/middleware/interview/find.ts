import { Context } from 'koa';
import { getManager } from "typeorm";
import Interview from '../../entity/Interview';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const interviewRepository = getManager().getRepository(Interview);
  const findInterview = await interviewRepository.find();
  ctx.body = new responseClass(200, '面试间信息查询成功', { ret: findInterview });
}