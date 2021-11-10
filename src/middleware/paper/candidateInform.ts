import { Context } from 'koa';
import { getManager, getRepository } from "typeorm";
import Candidate from '../../entity/Candidate';
import User from '../../entity/User';
import TestPaper from '../../../src/entity/TestPaper';
import responseClass from '../../config/responseClass';
import nodemail from '../../../sendEmail.js';
import { TEST_LEVEL, TEST_STATUS } from '../../../src/config/const';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const { paper, testName, cookie, status,  } = req;
  let filter = req.filter;
  const candidateRepository = getRepository(Candidate);
  const userRepository = getManager().getRepository(User);
  
  // 如果 paperName 存在，要么提交试卷，要么查找试卷
  // req.sign = true 说明要提交试卷，那么先找到提交者邮箱以及提交的试卷：更改试卷的 remaining_time 字段为 false 表明试卷已提交；更改提交者的 over 字段为 true 表明试卷已提交（由于一张试卷不止一道试题，所以每道试题都要更改 over 字段
  if (paper) {
    const userInform = await userRepository.findOne({ where: { session: req.cookie }});
    const userEmail = userInform.email;
    const candidateInform = await candidateRepository.find({ where: { email: userEmail, paper: paper }});

    if (req.sign === true && req.cookie) {
      for (let ch of candidateInform) {
        ch.test_status = TEST_STATUS.DONE;
        await candidateRepository.save(ch);
      }
      
      // 更改完毕，此时试卷已提交，发送邮箱给面试官告知
      const testPaperRepository = getRepository(TestPaper);
      const interviewerInform = await testPaperRepository.findOne({ paper: paper });
      const interviewerEmail = interviewerInform.interviewer;
      const mail = {
        from: '1164939253@qq.com',
        to: interviewerEmail,
        subject: '在线编程笔试平台',
        text:`候选人${ userEmail }的试卷：${ paper } 已提交，您可登录该网站 http://www.syandeg.com 查看试卷并批阅!`
      };
      nodemail(mail);
      const obj = { status: true, candidateInform };
      ctx.body = new responseClass(200, '试卷已提交，之后不可再编辑', obj);
    } else {
      const obj = { status: true, candidateInform };
      ctx.body = new responseClass(200, '试卷信息已查找完毕', obj);
    }
  } else if (testName) {  // 如果 testName 存在，说明要提交的是一道试题
    // 查找候选人信息中的试题名、邮箱、试卷名，根据这三者确定提交试题的所在
    const candidateInform = await candidateRepository.findOne({ test_name: testName});
    const candidateEmail = candidateInform.email;
    const paperName = candidateInform.paper;
    const candidateTest = await candidateRepository.findOne(
      { where: { email: candidateEmail, paper:paperName, test_name: testName }}
    );
    candidateTest.program_answer = req.code;
    status === true ? candidateTest.test_status = TEST_STATUS.DONE : candidateTest.test_status === TEST_STATUS.DOING;
    await candidateRepository.save(candidateTest);
    ctx.body = new responseClass(200, '试题答案提交成功', { status: true });
  } else if (cookie) {
    const findUserEmail = (await userRepository.findOne({where: { session: cookie }})).email;
    if (filter) {
      let ret = null;
      filter === TEST_LEVEL.EASY || filter === TEST_LEVEL.MIDDLE || filter === TEST_LEVEL.HARD ?
      ret = await candidateRepository.find({ test_level: filter, email: findUserEmail }) :
      filter === TEST_STATUS.NODO || filter === TEST_STATUS.DOING || filter === TEST_STATUS.DONE ?
      ret = await candidateRepository.find({ test_status: filter, email: findUserEmail }) :
      ret = await candidateRepository.find({ email: findUserEmail });
      ctx.body = new responseClass(200, '全部试题筛选完成', { ret });
    } else {
      const ret = await candidateRepository.createQueryBuilder('candidate')
        .where('candidate.email = :email', { email: findUserEmail })
        .getMany()
      ctx.body = new responseClass(200, '候选人邮箱获取成功', { ret });
    }
  } else {  
    // ctx.request.body 没有任何参数，则是查询所有候选人的邮箱，在用户“修改试卷信息”中“邀请候选人”搜索时使用
    const findUser = await candidateRepository.find();
    const ret = [];
    findUser.map(item => {
      // 数组去重
      if (ret.indexOf(item.email) === -1) {
        ret.push(item.email);
      }
    })
    ctx.body = new responseClass(200, '候选人邮箱获取成功', { ret });
  }
}