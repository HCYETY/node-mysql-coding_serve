import { Context } from 'koa';
import { getManager, getRepository } from "typeorm";
import Test from '../../entity/Test';
import TestPaper from '../../entity/TestPaper';
import { nowTime, } from '../../config/utils';
import responseClass from '../../config/responseClass';
import Candidate from '../../../src/entity/Candidate';

export default async (ctx:Context) => {
  console.log('修改试卷', ctx.request.body);
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
  for (let ch of req.candidate) {
    for (let ar of req.modifyTests) {
      const newCandidate = new Candidate();
      const newTest = new Test();
      newTest.num = ar.num;
      newTest.test_name = ar.testName;
      newTest.test = ar.description;
      newTest.answer = ar.answer;
      newTest.level = ar.level;
      newTest.point = ar.point;
      newTest.tags = ar.tags;
      paperPoint += ar.point;
      newCandidate.email = ch;
      newCandidate.paper = req.oldPaper === req.paper ? req.oldPaper : req.paper;
      newCandidate.test_name = ar.testName;
      newCandidate.watch = req.check;
      await testReporitory.save(newTest);
      await candidateReporitory.save(newCandidate);
      testsArr.push(newTest);
    }
  }
  
  // 获取日期控件的参数，yyyy-mm-dd 格式
  const timeBegin = req.timeBegin.slice(0, 10);
  const timeEnd = req.timeEnd.slice(0, 10);
  // 获取当前时间，yyyy-mm-dd 格式
  const nowtime = nowTime();
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