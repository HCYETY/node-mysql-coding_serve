import { Context } from 'koa';
import { getRepository, } from "typeorm";
import Test from '../../entity/Test';
import responseClass from '../../config/responseClass';
import TestPaper from '../../entity/TestPaper';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const findPaper = req.paper;
  const findTest = req.test;
  let show = null;
  if (findPaper) {
    const paperRepository = getRepository(TestPaper);
    const paperKey = (await paperRepository.findOne({ paper: findPaper })).key;
    show = await getRepository(Test)
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.paper', 'paper.tests')
      .where('test.paper = :paperKey', { paperKey: paperKey })
      .getMany();
  } else if (findTest) {
    show = await getRepository(Test)
    .createQueryBuilder('test')
    .leftJoinAndSelect('test.paper', 'paper.tests')
    .where('test.test_name = :testName', { testName: findTest })
    .getOne();
  }
  ctx.body = new responseClass(200, '获取试题成功', { show });
}