import { Context } from 'koa';
import { getManager } from "typeorm";
import Interview from '../../entity/Interview';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const { submitArr } = ctx.request.body;
  const { evaluation, comment, interviewer_link } = submitArr;
  const interviewRepository = getManager().getRepository(Interview);
  const saveInterview = await interviewRepository.findOne({ interviewer_link });
  saveInterview.evaluation = evaluation;
  saveInterview.comment = comment;
  await interviewRepository.save(saveInterview);
  ctx.body = new responseClass(200, '面试结果保存成功', { status: true });
}