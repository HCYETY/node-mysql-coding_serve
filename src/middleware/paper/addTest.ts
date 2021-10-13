import { equal } from 'assert';
import { Context } from 'koa';
import { getManager } from "typeorm";
import test from '../../entity/test';

export default async (ctx:Context) => {
  console.log(ctx.request.body);
  const req = ctx.request.body;
  const testRepository = getManager().getRepository(test);
  const findTest = await testRepository.findOne({where: {testName: req.testName}});
  if (!findTest) {
    for (let ch of req) {
      const newTest = new test();
      newTest.num = ch.num;
      newTest.testName = ch.testName;
      newTest.test = ch.description;
      // newTest.paper = 
      newTest.answer = ch.answer;
      newTest.level = ch.level;
      newTest.point = ch.point;
      // newTest.tags = ch.tags;
      // newTest.paper = ch.paper;
      const res = await testRepository.save(newTest);
      console.log(res)
    }

    ctx.body = { msg: '试题添加成功', status: true };
  } else {
    ctx.body = { msg: '试题已存在，无法添加', status: false };
  }
}