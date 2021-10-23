import { Context } from 'koa';
import { getRepository } from "typeorm";
import TestPaper from '../../entity/TestPaper';
import Test from '../../entity/Test';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const paperRepository = getRepository(TestPaper);
  const testReporitory = getRepository(Test);
  
  for (let paper of ctx.request.body) {
      const paperKey = (await paperRepository.findOne({ paper: paper })).key;
      // 先删除带外键的副表的数据
      const deleteTest = await getRepository(Test)
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.paper', 'paper.tests')
      .where('test.paper = :paperKey', { paperKey: paperKey })
      .getMany();
      console.log(deleteTest)
      await testReporitory.remove(deleteTest);
  
      // 然后再删除主表的数据
      await paperRepository.delete({ paper: paper });
    
  }
  const resPaper = await paperRepository.find();
  ctx.body = new responseClass(200, '试卷已删除', resPaper);
}