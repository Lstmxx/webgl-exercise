import Vector2D from './Vector2D';

type IOption = {
  strokeStyle?: string;
  fillStyle?: string;
  close?: boolean;
}

const draw = (
  points: Vector2D[],
  context: CanvasRenderingContext2D,
  option: IOption,
) => {
  const {
    close = false,
    fillStyle = '',
    strokeStyle = '',
  } = option;
  context.strokeStyle = strokeStyle;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    const point = points[i];
    context.lineTo(point.x, point.y);
  }
  if (close) context.closePath();
  if (fillStyle) {
    context.fillStyle = fillStyle;
    context.fill();
  }
  context.stroke();
};

type IPointFunc = (t: number, ...args: any) => number;

const parametric = (
  xFunc: IPointFunc,
  yFunc: IPointFunc,
) => (start: number, end: number, seg = 100, ...args: any) => {
  const points: Vector2D[] = [];
  for (let i = 0; i <= seg; i += 1) {
    const p = i / seg;
    const t = start * (1 - p) + end * p;
    const x = xFunc(t, ...args);
    const y = yFunc(t, ...args);
    points.push(new Vector2D(x, y));
  }
  return {
    draw: (context: CanvasRenderingContext2D, option: IOption) => draw(points, context, option),
    points,
  };
};

export default parametric;
