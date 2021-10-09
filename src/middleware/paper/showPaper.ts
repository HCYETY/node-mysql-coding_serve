import { Context } from 'koa';
import { getManager } from "typeorm";
import testPaper from '../../entity/testPaper';

export default async (ctx:Context) => {
  const paper = getManager().getRepository(testPaper);
  let show;
  if (ctx.request.body.paper) {
    show = await paper.findOne({where: {paper: ctx.request.body.paper}});
    // show.remaining_time = timeBegin - timeEnd;
    console.log(show)
  } else {
    show = await paper.find();
    show.map((x: { time: string | any[]; remaining_time: any; }) => {
      const timeBegin = x.time.slice(0, 10);
      const timeEnd = x.time.slice(11);
      x.remaining_time = timeEnd
      console.log(timeBegin, typeof timeBegin);
      console.log(timeEnd, typeof timeEnd);
    })
  }

  ctx.body = {show}
}