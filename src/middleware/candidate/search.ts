import { Context } from 'koa';
import { getManager, getRepository, ILike, Like } from "typeorm";
import Candidate from '../../entity/Candidate';
import User from '../../entity/User';
import TestPaper from '../../entity/TestPaper';
import responseClass from '../../config/responseClass';
import { TEST_LEVEL, TEST_STATUS } from '../../config/const';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const { paper, cookie, testName, filterObj, filter, test_filter, tag, reqEmail, reqPaper } = req;
  const candidateRepository = getRepository(Candidate);
  const userRepository = getManager().getRepository(User);
  const userInform = await userRepository.findOne({ where: { session: cookie }});
  const email = userInform ? userInform.email : undefined;

  // 候选人模块首页要查询该用户所有的试卷信息，以及搜索试卷时会根据条件筛选试卷
  if (reqEmail && reqPaper) {
    const ret = await candidateRepository.find({ email: reqEmail, paper: reqPaper });
    console.log('单个候选人的试卷信息获取成功')
    ctx.body = new responseClass(200, '单个候选人的试卷信息获取成功', { ret });
  } else if (paper && cookie) {
    let ret = null;
    if (paper === '全部试卷') {
      ret = await candidateRepository.find({ email });
    } else {
      ret = await candidateRepository.find({ where: { email, paper }});
    }
    const obj = { status: true, ret };
    ctx.body = new responseClass(200, '所有试卷信息已查找完毕', obj);
  } else if (paper) {
    const ret = await candidateRepository.find({ paper });
    ctx.body = new responseClass(200, '试卷获取完毕', { ret });
  } else if (cookie) {
    let ret = await candidateRepository.find({ email });
    // 如果 filterObj ，则根据其条件筛选信息；否则返回该用户全部试卷
    if (filterObj) {
      let { paper, test_name, test_level, test_status, tags } = filterObj;
      if (paper.length === 0) {
        ret.map(item => {
          if (paper.indexOf(item.paper) === -1) {
            paper.push(item.paper);
          }
        })
      }
      if (test_name.length === 0) {
        ret.map(item => {
          if (test_name.indexOf(item.test_name) === -1) {
            test_name.push(item.test_name);
          }
        })
      }
      if (test_level.length === 0) {
        ret.map(item => {
          if (test_level.indexOf(item.test_level) === -1) {
            test_level.push(item.test_level);
          }
        })
      }
      if (test_status.length === 0) {
        ret.map(item => {
          if (test_status.indexOf(item.test_status) === -1) {
            test_status.push(item.test_status);
          }
        })
      }
      if (tags.length.length === 0) {
        ret.map(item => {
          if (tags.indexOf(item.tags) === -1) {
            tags.push(item.tags);
          }
        })
      }
      ret = await candidateRepository.find({ email, paper, test_name, test_level, test_status, tags });
      ret = await candidateRepository
        .createQueryBuilder('candidate')
        .where('candidate.email = :email', { email: email })
        .andWhere('candidate.paper @> :paper', { paper: paper })
        .andWhere('candidate.test_name @> :test_name', { test_name: test_name })
        .andWhere('candidate.test_level @> :test_level', { test_level: test_level })
        .andWhere('candidate.test_status @> :test_status', { test_status: test_status })
        .andWhere('candidate.tags @> :tags', { tags: tags })
        .getMany()
    } 
    console.log(ret)
    ctx.body = new responseClass(200, '试题获取成功', { ret });
    //   if (testName) { // 只筛选试题名称，不区分试卷
    //     ret = await candidateRepository.createQueryBuilder('candidate')
    //       .where("candidate.test_name LIKE :param", { param: testName })
    //       .andWhere("candidate.email = :email", { email })
    //       .getMany()
    //   } else if (test_filter) { // 包含筛选条件的数组
  
    //   } else if (filter) { // 只筛选试题难度和完成状态
    //     filter === TEST_LEVEL.EASY || filter === TEST_LEVEL.MIDDLE || filter === TEST_LEVEL.HARD ?
    //     ret = await candidateRepository.find({ test_level: filter, email }) :
    //     filter === TEST_STATUS.NODO || filter === TEST_STATUS.DOING || filter === TEST_STATUS.DONE ?
    //     ret = await candidateRepository.find({ test_status: filter, email }) :
    //     ret = await candidateRepository.find({ email });
    //   } else if (tag) { // 只筛选试题标签，在 paper 中模糊匹配
    //     // ret = await candidateRepository.find({ email, })
    //   } else { // 展示当前用户的所有试卷
    //     ret = await candidateRepository.find({ email })
    //   }
  
    //   ctx.body = new responseClass(200, '试题获取成功', { ret });
    //   // } else {
    //   //   const ret = await candidateRepository.createQueryBuilder('candidate')
    //   //     .where('candidate.email = :email', { email: findUserEmail })
    //   //     .getMany()
    //   //   ctx.body = new responseClass(200, '候选人邮箱获取成功', { ret });
    //   // }
  } else {  
    // 若前端请求不携带任何参数，则是请求获取所有候选人的试卷信息
    const ret = await candidateRepository.find();
    ctx.body = new responseClass(200, '所有候选人的试卷信息获取成功', { ret });
  }
}