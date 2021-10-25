import { Context } from 'koa';
import { getRepository } from "typeorm";
import Candidate from '../../entity/Candidate';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const candidateRepository = getRepository(Candidate);
  const candidateInform = await candidateRepository.find({ paper: req.paper });
  if (req.paper && req.sign === true) {
    for (let ch of candidateInform) {
      ch.over = true;
      await candidateRepository.save(ch);
    }
  }
  const obj = { status: true, candidateInform };
  ctx.body = new responseClass(200, '试卷已提交，之后不可再编辑', obj);
}