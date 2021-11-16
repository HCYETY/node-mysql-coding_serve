import { Context } from 'koa';
import { getManager } from "typeorm";
import Comment from '../../entity/Comment';
import responseClass from '../../config/responseClass';

export default async (ctx:Context) => {
  const req = ctx.request.body;
  const commentRepository = getManager().getRepository(Comment);
  // if () {

  // } else {
  //   const ret = await commentRepository.find();
  //   ctx.body = new responseClass(200, '单个试题的留言信息获取成功', { ret });
  // }
}