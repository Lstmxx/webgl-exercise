export const randomColor = (): string => {
  const random16 = () => Math.ceil(Math.random() * 256).toString(16);
  return `#${random16()}${random16()}${random16()}`;
};

// 向量长度
export const length = (point: number[]) => Math.hypot(point[0], point[1]);

// 向量点乘
export const dot = (
  aPoint: number[],
  bPoint: number[],
) => aPoint[0] * bPoint[0] + aPoint[1] * bPoint[1];

// 向量叉乘
export const cross = (
  aPoint: number[],
  bPoint: number[],
) => aPoint[0] * bPoint[1] - aPoint[1] * bPoint[0];

// 缩放向量
export const scale = (factor: number, point: number[]) => point.map((val) => val * factor);

// 向量翻转
export const reverse = (point: number[]) => [-point[0], -point[1]];

// 归一化
export const normalize = (point: number[]) => {
  const len = length(point);
  return point.map((val) => val / len);
};

// 给定向量和起点坐标，计算终点坐标
export const getEndPoint = (
  v: number[],
  start: number[],
) => v.map((val, index) => val + start[index]);

export const getVector = (
  aPoint: number[],
  bPoint: number[],
) => bPoint.map((val, index) => val - aPoint[index]);
