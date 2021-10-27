import { Context } from 'koa';
import { getRepository } from "typeorm";
import Candidate from '../../entity/Candidate';
import TestPaper from '../../../src/entity/TestPaper';
import responseClass from '../../config/responseClass';
import nodemail from '../../../sendEmail.js';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const paperName = req.paper;
  const testName = req.test;
  const candidateRepository = getRepository(Candidate);
  console.log(req)
  
  if (paperName) {
    const candidateInform = await candidateRepository.find({ paper: paperName });
    if (req.sign === true) {
      const candidateEmail = candidateInform[0].email;
      const testPaperRepository = getRepository(TestPaper);
      const interviewerInform = await testPaperRepository.findOne({ paper: paperName });
      const interviewerEmail = interviewerInform.interviewer;

      for (let ch of candidateInform) {
        ch.over = true;
        await candidateRepository.save(ch);
      }
      
      const mail = {
        from: '1164939253@qq.com',
        to: interviewerEmail,
        subject: '在线编程笔试平台',
        text:`候选人${ candidateEmail }的试卷：${ paperName } 已提交，您可登录该网站 http://www.syandeg.com 查看试卷并批阅!`
      };
      nodemail(mail);
    } 
    const obj = { status: true, candidateInform };
    ctx.body = new responseClass(200, '试卷已提交，之后不可再编辑', obj);
  } else if (testName) {
    const candidateInform = await candidateRepository.findOne({ test_name: testName});
    const candidateEmail = candidateInform.email;
    const paperName = candidateInform.paper;
    const candidateTest = await candidateRepository.findOne({ where: {email: candidateEmail, paper:paperName, test_name: testName }});
    candidateTest.program_answer = req.code;
    await candidateRepository.save(candidateTest);
    ctx.body = new responseClass(200, '试题答案提交成功', );
  }
}