import { Context } from 'koa';
import { getManager, } from "typeorm";
import Test from '../../entity/Test';
import TestPaper from '../../entity/TestPaper';
import Candidate from '../../entity/Candidate';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const request = ctx.request.body;
  // 获取试卷名
  const paperName = request.paper;
  // 获取所有试题
  const req = request.data;
  console.log(request)

  const candidateRepository = getManager().getRepository(Candidate);
  const testRepository = getManager().getRepository(Test);
  // 查找试题所属试卷的 key 和 候选人的邮箱
  const testPaperRepository = getManager().getRepository(TestPaper);
  const testPaper = await testPaperRepository.findOne({ paper: paperName });
  const testPaperKey = testPaper.key;
  const testPaperEmail = testPaper.candidate;
  // 根据 key 查找试卷的试题情况
  const saveTest = await getManager().getRepository(Test)
  .createQueryBuilder('test')
  .leftJoinAndSelect('test.paper', 'papera')
  .where('test.paperKey = :paperKey', { paperKey: testPaperKey })
  .getMany()

  if (saveTest.length === 0) {
    let testsArr = [], paperPoint = 0;
    for (let ch of request.candidateEmail) {
      for (let ar of req) {
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
        newCandidate.test_name = ar.testName;
        newCandidate.paper = request.paper;
        newCandidate.watch = request.watch;
        testsArr.push(newTest);
        console.log(newTest)
        console.log(newCandidate)
        await testRepository.save(newTest);
        await candidateRepository.save(newCandidate);
      }
    }
    testPaper.tests_num = req.length;
    testPaper.paper_point = paperPoint;
    // 绑定关联
    testPaper.tests = testsArr;
    await testPaperRepository.save(testPaper);
  
    ctx.body = new responseClass(200, '试题添加成功', { status: true });
  } else {
    ctx.body = new responseClass(200, '试题已存在，无法添加；若想修改试卷信息，请前往修改页面', { status: false });
  }
}