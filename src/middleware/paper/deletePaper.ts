import { Context } from 'koa';
import { getManager } from "typeorm";
import TestPaper from '../../entity/TestPaper';
import Test from '../../entity/Test';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const paperRepository = getManager().getRepository(TestPaper);
  const testReporitory = getManager().getRepository(Test);
  
  for (let ch of ctx.request.body) {
    const paperKey = (await paperRepository.findOne({ paper: ch.paper })).key;
    // 先删除带外键的副表的数据
    const deleteTest = await getManager().getRepository(Test)
    .createQueryBuilder('test')
    .leftJoinAndSelect('test.paper', 'papera')
    .where('test.paper = :paperKey', { paperKey: paperKey })
    .getMany()
    console.log(deleteTest);
    // .delete()
    // .from(Test)
    // .where('paper = :paperKey', { paperKey: paperKey })
    // .execute();
    // console.log(deleteTest)

    // const deletes = await testReporitory.find( {paper: paperKey})
    // console.log(deletes)



    // 然后在删除主表的数据
    // await paperRepository.delete({ paper: ch.paper });

    // const deletePaper = await paperRepository.findOne({where: {paper: ch.paper}});
    // await paperRepository.remove(deletePaper);
    console.log('试卷已删除')
  }
  const resPaper = await paperRepository.find();

  ctx.body = new responseClass(200, '试卷已删除', resPaper);
}