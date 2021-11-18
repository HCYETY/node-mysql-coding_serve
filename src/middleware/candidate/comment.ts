import { Context } from 'koa';
import { getManager, getRepository } from "typeorm";
import Test from '../../entity/Test';
import User from '../../entity/User';
import Comment from '../../entity/Comment';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const { status, cookie, like_num, dislike_num, comments, test, reqEmail, } = req;
  const commentRepository = getManager().getRepository(Comment);
  const testRepository = getManager().getRepository(Test);
  const userRepository = getManager().getRepository(User);
  const saveTest = await testRepository.findOne({ test_name: test });
  const testKey = saveTest ? saveTest.key : undefined;
  if (status) {
    const email = (await userRepository.findOne({ session: cookie })).email;
    // status 为 false 说明是在评论，否则是在回复
    if (status === false || (status === true && comments)) {
      const addComment = new Comment();
      addComment.like_num = 0;
      addComment.dislike_num = 0;
      addComment.comments = comments;
      addComment.email = email;
      if (status === false) {
        addComment.order = 0;
      } else {
        const saveComment = await getRepository(Comment)
          .createQueryBuilder('comment')
          .leftJoinAndSelect('comment.tests', 'test.comments')
          .where('comment.tests = :testsKey', { testsKey: testKey })
          .andWhere({ email: reqEmail, order: 0 })
          .getOne();
        const key = saveComment.key;
        addComment.order = key;
      }
      saveTest.comments = [addComment];
      await testRepository.save(saveTest);
      await commentRepository.save(addComment);
      ctx.body = new responseClass(200, '评论信息获取成功', addComment);
    } else {
      // 要区分“点赞”或“踩”的是用户的评论还是回复
      const saveComment = await getRepository(Comment)
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.tests', 'test.comments')
        .where('comment.tests = :testsKey', { testsKey: testKey })
        .andWhere({ email: reqEmail, order: 0 })
        .getOne();
      if (like_num !== 0) {
        saveComment.like_num = like_num;
      } else if (dislike_num !== 0) {
        saveComment.dislike_num = dislike_num;
      }
      await commentRepository.save(saveComment);
      ctx.body = new responseClass(200, '用户“点赞”或“踩”有效', saveComment);
    }
  } else if (!status) {
    const findComment = await getRepository(Comment)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.tests', 'test.comments')
      .where('comment.tests = :testsKey', { testsKey: testKey })
      .orderBy({
        "comment.order": "ASC",
      })
      .getMany();
    ctx.body = new responseClass(200, '单个试题的所有留言信息获取成功', { findComment });
  }
}