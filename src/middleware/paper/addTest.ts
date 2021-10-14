import { Context } from 'koa';
import { getManager } from "typeorm";
import test from '../../entity/test';
import test_paper from '../../../src/entity/testPaper';
import { Console } from 'console';

export default async (ctx:Context) => {
  console.log('req is：', ctx.request.body);
  const request = ctx.request.body;
  // 获取试卷名
  const paper = request.slice(0, 1);
  // 获取剩余的所有试题
  const req = request.slice(1);
  console.log('req1', request)
  console.log('req2', req)
  const testRepository = getManager().getRepository(test);
  const findTest = await testRepository.findOne(
    { testName: req.testName }, 
    { relations: ["paper"] }
  );
  const testPaperRepository = getManager().getRepository(test_paper);
  const testPaper = await testPaperRepository.findOne({ paper: paper });
  if (!findTest) {
    for (let ch of req) {
      const newTest = new test();
      let testsArr = [];
      newTest.num = ch.num;
      newTest.testName = ch.testName;
      newTest.test = ch.description;
      newTest.answer = ch.answer;
      newTest.level = ch.level;
      newTest.point = ch.point
      newTest.tags = ch.tags;
      await testRepository.save(newTest);
      
      // 绑定关联
      testsArr.push(newTest);
      testPaper.tests = testsArr;
      await testPaperRepository.save(testPaper);
    }

    ctx.body = { msg: '试题添加成功', status: true };
  } else {
    ctx.body = { msg: '试题已存在，无法添加；若想修改试卷信息，请前往修改页面', status: false };
  }
}