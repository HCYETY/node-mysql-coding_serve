import { Context } from 'koa';
import { getManager } from "typeorm";

import LookOver from '../../entity/LookOver';
import responseClass from '../../config/responseClass';
import User from '../../../src/entity/User';
import Candidate from '../../../src/entity/Candidate';
import TestPaper from '../../../src/entity/TestPaper';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const { paper, cookie, rate, reqEmail, } = req;
  const userRepository = getManager().getRepository(User);
  const candidateRepository = getManager().getRepository(Candidate);
  const lookOverRepository = getManager().getRepository(LookOver);
  const testPaperRepository = getManager().getRepository(TestPaper);
  const userInform = await userRepository.findOne({ where: { session: cookie }});
  const email = userInform ? userInform.email : reqEmail;
  if (Array.isArray(req)) {
    const findCandidate = await candidateRepository.find({ paper, email });
    const findLookOver = await lookOverRepository.findOne({ paper, email });
    const findTestPaper = await testPaperRepository.findOne({ paper, candidate: email });
    let totalScore = 0;
    req.map(async item => {
      const saveCandidate = findCandidate.find(tmp => tmp.test_name === item.testName);
      totalScore += item.score;
      saveCandidate.score = item.score;
      await candidateRepository.save(saveCandidate);
    })
    findTestPaper.look_over = true;
    findLookOver.total_score = totalScore;
    findLookOver.look_over = true;
    await lookOverRepository.save(findLookOver);
    await testPaperRepository.save(findTestPaper);
    ctx.body = new responseClass(200, '试卷批阅成功', { status: true });
  } else if (paper) {
    const ret = await lookOverRepository.find({ paper, join: true });
    ctx.body = new responseClass(200, '试卷批阅信息查询成功', { ret });
  }
}