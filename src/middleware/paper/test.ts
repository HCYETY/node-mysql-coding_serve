import { Context } from 'koa';
import { getManager } from "typeorm";
import testPaper from '../../entity/testPaper';
import nodemail from '../../../sendmail.js';
import { nowTime, getDays, dateCompare, } from '../../config/utils';

export default async (ctx:Context) => {

}