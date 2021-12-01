import { Context } from 'koa';
import { getManager } from "typeorm";
import Interview from '../../entity/Interview';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const { findArr } = ctx.request.body;
  const interviewRepository = getManager().getRepository(Interview);
  if (findArr) {
    const { interviewer, interview_room, interviewer_link } = findArr;
    const findInterviewer = await interviewRepository.findOne({ interviewer, interview_room, interviewer_link });
    if (findInterviewer) {
      ctx.body = new responseClass(200, '属于面试官的面试间已创建完毕', { status: true });
    } else {
      ctx.body = new responseClass(200, '该面试间不存在，请重新输入', { status: false });
    }
  } else {
    const findInterview = await interviewRepository.find();
    ctx.body = new responseClass(200, '面试间信息查询成功', { ret: findInterview });
  }
}