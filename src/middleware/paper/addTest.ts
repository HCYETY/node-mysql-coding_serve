import { Context } from 'koa';
import { getManager, createQueryBuilder, } from "typeorm";
import Test from '../../entity/Test';
import TestPaper from '../../entity/TestPaper';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  // 获取试卷名
  const paperName = ctx.request.body.slice(0, 1);
  // 获取剩余的所有试题
  const req = ctx.request.body.slice(1);
  console.log(req)

  const testRepository = getManager().getRepository(Test);
  // 查找试题所属试卷的 key
  const testPaperRepository = getManager().getRepository(TestPaper);
  const testPaper = await testPaperRepository.findOne({ paper: paperName });
  // 根据 key 查找试卷的试题情况
  const saveTest = await getManager().getRepository(Test)
  .createQueryBuilder('test')
  .leftJoinAndSelect('test.paper', 'papera')
  .where('test.paperKey = :paperKey', { paperKey: testPaper.key })
  .getMany()
  console.log(saveTest);

  if (saveTest.length === 0) {
    let testsArr = [], paperPoint = 0;
    for (let ch of req) {
      const newTest = new Test();
      // newTest.num = obj.num;
      newTest.test_name = ch.testName;
      newTest.test = ch.description;
      newTest.answer = ch.answer;
      newTest.level = ch.level;
      newTest.point = ch.point;
      newTest.tags = ch.tags;
      paperPoint += ch.point;
      await testRepository.save(newTest);
      testsArr.push(newTest);
    }
    console.log('全部的试题', testsArr)
    testPaper.tests_num = req.length;
    testPaper.paper_point = paperPoint;
    // 绑定关联
    testPaper.tests = testsArr;
    console.log(testPaper)
    await testPaperRepository.save(testPaper);
  
    ctx.body = new responseClass(200, '试题添加成功', { status: true });
  } else {
    ctx.body = new responseClass(200, '试题已存在，无法添加；若想修改试卷信息，请前往修改页面', { status: false });
  }
}