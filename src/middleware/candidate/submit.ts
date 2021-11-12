import { Context } from 'koa';
import { getManager, getRepository } from "typeorm";
import Candidate from '../../entity/Candidate';
import User from '../../entity/User';
import TestPaper from '../../entity/TestPaper';
import responseClass from '../../config/responseClass';
import nodemail from '../../../sendEmail.js';
import { TEST_STATUS } from '../../config/const';

export default async (ctx:Context) => {
  const { paper, cookie, testName, status, code } = ctx.request.body;
  const candidateRepository = getManager().getRepository(Candidate);
  
  // 提交试卷
  if (paper && cookie) {
    const userRepository = getManager().getRepository(User);
    const userInform = await userRepository.findOne({ where: { session: cookie }});
    const email = userInform.email;
    const candidateInform = await candidateRepository.find({ where: { email, paper }});
    // 提交试卷后，发送邮箱给面试官告知
    const testPaperRepository = getRepository(TestPaper);
    const interviewerInform = await testPaperRepository.findOne({ paper });
    const interviewerEmail = interviewerInform.interviewer;
    const mail = {
      from: '1164939253@qq.com',
      to: interviewerEmail,
      subject: '在线编程笔试平台',
      text:`候选人${ email }的试卷：${ paper } 已提交，您可登录该网站 http://www.syandeg.com 查看试卷并批阅!`
    };

    for (let ch of candidateInform) {
      ch.test_status = TEST_STATUS.DONE;
      await candidateRepository.save(ch);
    }
    nodemail(mail);
    
    ctx.body = new responseClass(200, '试卷已提交，之后不可再编辑', { status: true });
  } else if (testName) {  // 提交试题
    // 查找候选人信息中的试题名、邮箱、试卷名，根据这三者确定提交试题的所在
    const candidateInform = await candidateRepository.findOne({ test_name: testName});
    const email = candidateInform.email;
    const paper = candidateInform.paper;
    const candidateTest = await candidateRepository.findOne(
      { where: { email, paper, test_name: testName }}
    );
    candidateTest.program_answer = code;
    candidateTest.test_status = status === true ? TEST_STATUS.DONE : TEST_STATUS.DOING;
    await candidateRepository.save(candidateTest);
    ctx.body = new responseClass(200, '试题答案提交成功', { status: true });
  }
}