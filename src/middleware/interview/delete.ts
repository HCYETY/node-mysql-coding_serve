import { Context } from 'koa';
import { getManager } from "typeorm";
import Interview from '../../entity/Interview';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const { inform, } = ctx.request.body;
  const interviewRepository = getManager().getRepository(Interview);
  let msg: string = '';
  let status: boolean = false;
  let findInterview = null;
  
  if (inform) {
    try{
      inform.map(async item => {
        await interviewRepository.delete({ interview_room: item });
      })
      msg = '面试间删除成功';
      status = true;
      findInterview = await interviewRepository.find();
    } catch(err) {
      msg = '面试间删除失败';
    }
  }

  ctx.body = new responseClass(200, msg, { status, findInterview });
}