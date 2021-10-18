import { Context } from 'koa';
import { getRepository, } from "typeorm";
import Test from '../../entity/Test';
import responseClass from '../../config/responseClass';
import TestPaper from '../../entity/TestPaper';

export default async (ctx:Context) => {
  const findPaper = ctx.request.body.paper;
  const paperRepository = getRepository(TestPaper);
  const paperKey = (await paperRepository.findOne({ paper: findPaper })).key;
  
  const show = await getRepository(Test)
  .createQueryBuilder('test')
  .leftJoinAndSelect('test.paper', 'paper.tests')
  .where('test.paper = :paperKey', { paperKey: paperKey })
  .getMany();
  
  ctx.body = new responseClass(200, '获取试题成功', show);
}