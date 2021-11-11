import { Context } from 'koa';
import { getManager, getRepository, ILike, Like } from "typeorm";
import Candidate from '../../entity/Candidate';
import User from '../../entity/User';
import TestPaper from '../../entity/TestPaper';
import responseClass from '../../config/responseClass';
import { TEST_LEVEL, TEST_STATUS } from '../../config/const';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const { paper, cookie, testName, filter, test_filter, tag, } = req;
  const candidateRepository = getRepository(Candidate);
  const userRepository = getManager().getRepository(User);
  const userInform = await userRepository.findOne({ where: { session: cookie }});
  const email = userInform ? userInform.email : undefined;
  
  // 候选人模块首页要查询该用户所有的试卷信息，以及搜索试卷时会根据条件筛选试卷
  if (paper && cookie) {
    let candidateInform = null;
    if (paper === '全部试卷') {
      candidateInform = await candidateRepository.find({ email });
    } else {
      candidateInform = await candidateRepository.find({ where: { email, paper }});
    }
    const obj = { status: true, candidateInform };
    ctx.body = new responseClass(200, '所有试卷信息已查找完毕', obj);
  } else if (cookie) {
    let ret = null;

    if (testName) { // 只筛选试题名称，不区分试卷
      ret = await candidateRepository.createQueryBuilder('candidate')
        .where("candidate.test_name LIKE :param", { param: testName })
        .andWhere("candidate.email = :email", { email })
        .getMany()
    } else if (test_filter) { // 包含筛选条件的数组

    } else if (filter) { // 只筛选试题难度和完成状态
      filter === TEST_LEVEL.EASY || filter === TEST_LEVEL.MIDDLE || filter === TEST_LEVEL.HARD ?
      ret = await candidateRepository.find({ test_level: filter, email }) :
      filter === TEST_STATUS.NODO || filter === TEST_STATUS.DOING || filter === TEST_STATUS.DONE ?
      ret = await candidateRepository.find({ test_status: filter, email }) :
      ret = await candidateRepository.find({ email });
    } else if (tag) { // 只筛选试题标签，在 paper 中模糊匹配
      // ret = await candidateRepository.find({ email, })
    } else { // 展示当前用户的所有试卷
      ret = await candidateRepository.find({ email })
    }

    ctx.body = new responseClass(200, '试题获取成功', { ret });
    // } else {
    //   const ret = await candidateRepository.createQueryBuilder('candidate')
    //     .where('candidate.email = :email', { email: findUserEmail })
    //     .getMany()
    //   ctx.body = new responseClass(200, '候选人邮箱获取成功', { ret });
    // }
  } else {  
    // ctx.request.body 没有任何参数，则是查询所有候选人的邮箱，在用户“修改试卷信息”中“邀请候选人”搜索时使用
    const findUser = await candidateRepository.find();
    const candidateInform = [];
    findUser.map(item => {
      // 数组去重
      if (candidateInform.indexOf(item.email) === -1) {
        candidateInform.push(item.email);
      }
    })
    ctx.body = new responseClass(200, '候选人邮箱获取成功', { candidateInform });
  }
}