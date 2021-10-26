import { Context } from 'koa';
import { getRepository } from "typeorm";
import Candidate from '../../entity/Candidate';
import TestPaper from '../../../src/entity/TestPaper';
import responseClass from '../../config/responseClass';
import nodemail from '../../../sendEmail.js';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const paperName = req.paper;
  const candidateRepository = getRepository(Candidate);
  const candidateInform = await candidateRepository.find({ paper: paperName });
  const candidateEmail = candidateInform[0].email;
  const testPaperRepository = getRepository(TestPaper);
  const interviewerEmail = (await testPaperRepository.findOne({ paper: paperName })).interviewer;
  
  if (paperName && req.sign === true) {
    for (let ch of candidateInform) {
      ch.over = true;
      await candidateRepository.save(ch);
    }
    
    const mail = {
      from: '1164939253@qq.com',
      to: interviewerEmail,
      subject: '在线编程笔试平台',
      text:`候选人${ candidateEmail }的试卷：${ paperName }已提交，您可进入该网站 http://www.syandeg.com 查看试卷并批阅!`
    };
    nodemail(mail);
  }
  const obj = { status: true, candidateInform };
  ctx.body = new responseClass(200, '试卷已提交，之后不可再编辑', obj);
}