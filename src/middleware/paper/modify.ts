import { Context } from 'koa';
import { getManager, getRepository } from "typeorm";
import Test from '../../entity/Test';
import TestPaper from '../../entity/TestPaper';
import responseClass from '../../config/responseClass';
import Candidate from '../../../src/entity/Candidate';
import nodemail from '../../../sendEmail.js';
import { transTime } from '../../../src/config/utils';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  // 查找试卷
  const paperRepository = getManager().getRepository(TestPaper);
  const testReporitory = getManager().getRepository(Test);
  const candidateReporitory = getManager().getRepository(Candidate);
  const candidatePaper = await candidateReporitory.find({where: {paper: req.oldPaper}});
  const modifyPaper = await paperRepository.findOne({where: {paper: req.oldPaper}});
  const paperKey = modifyPaper.key;
  // 利用 paperKey 查找试题，并将其删除
  const deleteTest = await getRepository(Test)
    .createQueryBuilder('test')
    .leftJoinAndSelect('test.paper', 'paper.tests')
    .where('test.paper = :paperKey', { paperKey: paperKey })
    .getMany();
  await testReporitory.remove(deleteTest);
  await candidateReporitory.remove(candidatePaper);

  // 删除之后，重新添加试题
  let testsArr = [], paperPoint = 0;
  // const timebegin = transTime(req.timeBegin);
  // const timend = transTime(req.timeEnd);
  // console.log(timebegin)
  // console.log(timend)
  // const timeBegin = new Date(timebegin).getTime();
  // const timeEnd = new Date(timend).getTime();
  // console.log(timeBegin)
  // console.log(timeEnd)
  const timeBegin = new Date(req.timeBegin).getTime();
  const timeEnd = new Date(req.timeEnd).getTime();
  const nowtime = new Date().getTime();

  // 标识试题存储，防止出现 在试题库中存储多个相同试题但不同候选人 的情况
  // 试题库只存储唯一试卷唯一试题，即一张试卷多个不同试题
  let len = req.modifyTests.length;
  let i = 0;
  for (let ch of req.candidate) {
    // 考虑到可能新增候选人，所以这里也发送下邮件
    const mail = {
      from: '1164939253@qq.com',
      to: ch,
      subject: '在线编程笔试平台',
      text:'您收到一位面试官的邀请，可进入该网站 http://www.syandeg.com 查看试卷并填写!'
    };
    nodemail(mail);
    

    for (let ar of req.modifyTests) {
      if (i < len) {
        const newTest = new Test();
        newTest.num = ar.num;
        newTest.test_name = ar.testName;
        newTest.test = ar.description;
        newTest.answer = ar.answer;
        newTest.level = ar.level;
        newTest.point = ar.point;
        newTest.tags = ar.tags;
        paperPoint += ar.point;
        testsArr.push(newTest);
        i++;
        await testReporitory.save(newTest);
      }
      const newCandidate = new Candidate();
      newCandidate.email = ch;
      newCandidate.paper = req.oldPaper === req.paper ? req.oldPaper : req.paper;
      newCandidate.test_name = ar.testName;
      newCandidate.watch = req.check;
      newCandidate.time_end = timeEnd;
      newCandidate.test_level = ar.level;
      await candidateReporitory.save(newCandidate);
    }
  }
  
  modifyPaper.remaining_time = (nowtime < timeBegin) ? false : (nowtime > timeEnd) ? false : true;
  modifyPaper.paper = req.oldPaper === req.paper ? req.oldPaper : req.paper;
  modifyPaper.paper_description = req.paperDescription;
  modifyPaper.tests_num = req.modifyTests.length;
  modifyPaper.paper_point = paperPoint;
  modifyPaper.candidate = req.candidate;
  modifyPaper.check = req.check;
  modifyPaper.answer_time = req.answerTime;
  modifyPaper.time_begin = timeBegin;
  modifyPaper.time_end = timeEnd;

  // 绑定关联
  modifyPaper.tests = testsArr;
  await paperRepository.save(modifyPaper);

  ctx.body = new responseClass(200, '修改试卷成功', { status: true });
}