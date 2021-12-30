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

// 面试间的状态
export enum INTERVIEW_STATUS {
  NO = '未开始',
  ING = '进行中',
  ON = '已结束'
}

// websocket 收到信息时的 type
export enum WS_TYPE {
  CONNECT = 'connect',
  TALK = 'talk',
  CODE = 'code',
  REQ_VIDEO = 'req-video',
  RES_VIDEO = 'res-video',
  VIDEO_OFFER = 'video-offer',
  VIDEO_ANSWER = 'video-answer',
  NEW_ICE_CANDIDATE = 'new-ice-candidate',
  HANG_UP = 'hang-up',
}

// 准备列出业务所需的状态码和响应信息，但目前貌似没有这个必要
export const STATUS_CODE = {

}