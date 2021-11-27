import { Context } from 'koa';
import { getManager, getRepository, Like } from "typeorm";
import Candidate from '../../entity/Candidate';
import User from '../../entity/User';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const { paper, cookie, reqEmail } = ctx.request.body;
  const candidateRepository = getRepository(Candidate);
  const userRepository = getManager().getRepository(User);
  const userInform = await userRepository.findOne({ where: { session: cookie }});
  let email = userInform ? userInform.email : undefined;

  // 候选人模块首页要查询该用户所有的试卷信息，以及搜索试卷时会根据条件筛选试卷
  if ((paper && cookie) || (paper && reqEmail)) {
    if (reqEmail) {
      email = reqEmail;
    }
    const ret = await candidateRepository.find({ where: { email, paper }});
    ctx.body = new responseClass(200, '指定试卷信息已查找完毕', { ret });
  } else if (paper) {
    const ret = await candidateRepository.find({ paper });
    ctx.body = new responseClass(200, '试卷获取完毕', { ret });
  } else if (cookie) {
    const ret = await candidateRepository.find({ email });
    ctx.body = new responseClass(200, '该候选人的所有试卷信息获取成功', { ret });
  } else {  
    // 若前端请求不携带任何参数，则是请求获取所有候选人的试卷信息
    const ret = await candidateRepository.find();
    ctx.body = new responseClass(200, '所有候选人的试卷信息获取成功', { ret });
  }
}