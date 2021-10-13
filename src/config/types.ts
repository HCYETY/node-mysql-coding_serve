export const paperStatus = {
  nobegin: '未开始',
  ing: '开放中',
  end: '已过期'
}

export interface loginResponseProps {
  code: number;
  message: string;
  data: object;
}