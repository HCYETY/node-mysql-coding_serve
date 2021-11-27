import { Context } from 'koa';
import { getManager, getRepository } from "typeorm";
import Candidate from '../../entity/Candidate';
import User from '../../entity/User';
import TestPaper from '../../entity/TestPaper';
import responseClass from '../../config/responseClass';
import nodemail from '../../../sendEmail.js';
import { TEST_STATUS } from '../../config/const';
import LookOver from '../../../src/entity/LookOver';

export default async (ctx:Context) => {
  const { paper, cookie, submit, testName, status, code, language, } = ctx.request.body;
  const candidateRepository = getManager().getRepository(Candidate);
  const userRepository = getManager().getRepository(User);
  const userInform = await userRepository.findOne({ where: { session: cookie }});
  const email = userInform.email;
  
  // 提交试卷
  if (paper && email && !testName) {
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
  } else if (paper && email && testName) {  // 提交试题
    // 查找候选人信息中的试题名、邮箱、试卷名，根据这三者确定提交试题的所在
    const candidateTest = await candidateRepository.findOne(
      { where: { email, paper, test_name: testName }}
    );
    const lookOverRepository = getManager().getRepository(LookOver);
    const nowtime = new Date().getTime();

    // submit 为 true 说明候选人提交了代码，否则则说明候选人刚开始参与答题
    if (submit === true) {
      candidateTest.program_answer = code;
      candidateTest.program_language = language;
      candidateTest.submit_num++;
      candidateTest.answer_end = nowtime;
      candidateTest.test_status = status === true ? TEST_STATUS.DONE : TEST_STATUS.DOING;
      await candidateRepository.save(candidateTest);
      ctx.body = new responseClass(200, '试题答案提交成功', { status: true });
    } else {
      const paperRepository = getManager().getRepository(TestPaper);
      const findPaper = await paperRepository.findOne({ paper });
      const newLookOver = new LookOver();
      newLookOver.email = email;
      newLookOver.paper = paper;
      newLookOver.join = true;
      candidateTest.answer_begin = nowtime;
      findPaper.join_num++; 
      await lookOverRepository.save(newLookOver);
      await candidateRepository.save(candidateTest);
      await paperRepository.save(findPaper);
      ctx.body = new responseClass(200, '阅卷的试题信息初始化完毕', { status: true });
    }
  }
}