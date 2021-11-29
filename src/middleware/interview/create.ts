import { Context } from 'koa';
import { createInterviewLink, createSixNum, } from '../../../src/config/utils';
import { getManager } from "typeorm";
import Interview from '../../entity/Interview';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const { inform, } = ctx.request.body;
  const { interviewer, candidate, interview_begin_time, linkPath, } = inform;
  const interviewRepository = getManager().getRepository(Interview);
  const newInterview = new Interview();
  const roomNum = createSixNum();
  newInterview.interviewer = interviewer;
  newInterview.candidate = candidate;
  newInterview.interview_room = roomNum;
  newInterview.candidate_link = createInterviewLink({ interviewer: true, roomNum, linkPath });
  newInterview.interviewer_link = createInterviewLink({ interviewer: false, roomNum, linkPath });
  newInterview.interview_begin_time = new Date(interview_begin_time).getTime();
  console.log(newInterview)
  await interviewRepository.save(newInterview);
  ctx.body = new responseClass(200, '面试间信息创建成功', newInterview);
}