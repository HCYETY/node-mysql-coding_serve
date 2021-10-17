import { Context } from 'koa';
import { getManager, createQueryBuilder, } from "typeorm";
import Test from '../../entity/Test';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  console.log(req)
  // const showTestRepository = getManager().getRepository(Test)
  // .createQueryBuilder("tests")
  // .innerJoinAndSelect("tests.paper", "paper", "paper.tests = :tests", { tests: false })
  // .where("tests.paperKey = :paperKey", { paperKey: 59 })
  // .getOne()
  // const showTest = await showTestRepository.findOne({where: {paper: req.paper}});
  // console.log(showTest)

  // ctx.body = new responseClass(200, '获取试题成功', showTest);
}