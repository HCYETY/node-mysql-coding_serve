import { Context } from 'koa';
import { getRepository, } from "typeorm";
import Test from '../../entity/Test';
import responseClass from '../../config/responseClass';
import TestPaper from '../../entity/TestPaper';

export default async (ctx:Context) => {
  const { paper, cookie, test } = ctx.request.body;
  console.log(paper, cookie, test)
  let show = null;
  if (paper) {
    const paperRepository = getRepository(TestPaper);
    const paperKey = (await paperRepository.findOne({ paper })).key;
    show = await getRepository(Test)
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.paper', 'paper.tests')
      .where('test.paper = :paperKey', { paperKey: paperKey })
      .getMany();
      console.log(show)
  } else if (test) {
    show = await getRepository(Test)
    .createQueryBuilder('test')
    .leftJoinAndSelect('test.paper', 'paper.tests')
    .where('test.test_name = :testName', { testName: test })
    .getOne();
  } else {
    show = await getRepository(Test)
    .createQueryBuilder()
    .getMany();
  }
  ctx.body = new responseClass(200, '获取试题成功', { show });
}