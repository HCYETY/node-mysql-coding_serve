export const ORIGINIP: string = 'http://localhost:3000';

// 试题状态
export enum TEST_STATUS {
  NODO = '未做',
  NODO_KEY = 0,
  DONE = '已解答',
  DONE_KEY = -1,
  DOING = '尝试过',
  DOING_KEY = 1,
};
// 试题难度
export enum TEST_LEVEL {
  EASY = '简单',
  MIDDLE = '中等',
  HARD = '困难',
}

// 准备列出业务所需的状态码和响应信息，但目前貌似没有这个必要
export const STATUS_CODE = {

}