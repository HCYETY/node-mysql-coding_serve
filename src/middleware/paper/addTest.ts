import { Context } from 'koa';
import { getManager, createQueryBuilder, } from "typeorm";
import Test from '../../entity/Test';
import TestPaper from '../../entity/TestPaper';

export default async (ctx:Context) => {
  // 获取试卷名
  const paperName = ctx.request.body.slice(0, 1);
  // 获取剩余的所有试题
  const req = ctx.request.body.slice(1);
  const testRepository = getManager().getRepository(Test);
  const findTest = await testRepository.findOne(
    { test_name: req.testName }, 
    { relations: ["paper"] }
  );
  console.log(findTest)
  const testPaperRepository = getManager().getRepository(TestPaper);
  const testPaper = await testPaperRepository.findOne({ paper: paperName });

  // const paper = await createQueryBuilder('paper')
  // .leftJoinAndSelect("paper.tests", "test")
  // .where("paper.paper = :paper", { paper: "你不懂" })
  // .andWhere("photo.isRemoved = :isRemoved", { isRemoved: false })
  // .getRawMany();

  if (!findTest) {
    for (let ch of req) {
      const newTest = new Test();
      let testsArr = [];
      newTest.num = ch.num;
      newTest.test_name = ch.testName;
      newTest.test = ch.description;
      newTest.answer = ch.answer;
      newTest.level = ch.level;
      newTest.point = ch.point
      newTest.tags = ch.tags;
      await testRepository.save(newTest);
      console.log(testsArr)
      console.log(newTest)
      console.log(testRepository)
      
      // 绑定关联
      testsArr.push(newTest);
      console.log(testsArr)
      testPaper.tests = testsArr;
      // testPaper.paper_num = 
      await testPaperRepository.save(testPaper);
    }

    ctx.body = { msg: '试题添加成功', status: true };
  } else {
    ctx.body = { msg: '试题已存在，无法添加；若想修改试卷信息，请前往修改页面', status: false };
  }
}