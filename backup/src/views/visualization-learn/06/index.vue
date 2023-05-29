<script lang="ts" setup>
import { onMounted } from 'vue';
import { randomColor } from '@/core/utils';

let canvasDom: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

let height = 0;
let width = 0;

// 向量长度
const length = (point: number[]) => Math.hypot(point[0], point[1]);

// 向量点乘
const dot = (aPoint: number[], bPoint: number[]) => aPoint[0] * bPoint[0] + aPoint[1] * bPoint[1];

// 向量叉乘
const cross = (aPoint: number[], bPoint: number[]) => aPoint[0] * bPoint[1] - aPoint[1] * bPoint[0];

// 缩放向量
const scale = (factor: number, point: number[]) => point.map((val) => val * factor);

// 向量翻转
const reverse = (point: number[]) => [-point[0], -point[1]];

// 归一化
const normalize = (point: number[]) => {
  const len = length(point);
  return point.map((val) => val / len);
};

// 给定向量和起点坐标，计算终点坐标
const getEndPoint = (v: number[], start: number[]) => v.map((val, index) => val + start[index]);

const getVector = (
  aPoint: number[],
  bPoint: number[],
) => bPoint.map((val, index) => val - aPoint[index]);

const drawLine = (aPoint: number[], bPoint: number[], strokeStyle: string, lineDash: number[]) => {
  if (!ctx) return;
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.setLineDash(lineDash);
  ctx.moveTo(aPoint[0], aPoint[1]);
  ctx.lineTo(bPoint[0], bPoint[1]);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

const drawCircle = (point: number[], strokeStyle: string) => {
  if (!ctx) return;
  ctx.save();
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.arc(point[0], point[1], 4, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.closePath();
};

const drawText = (text: string, point: number[], delta: number, fontStyle = '20px', fillStyle = 'red') => {
  if (!ctx) return;
  ctx.save();
  ctx.font = fontStyle;
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, point[0] + delta, point[1] + delta);
  ctx.restore();
};

const initCanvas = () => {
  canvasDom = document.querySelector('canvas');
  if (!canvasDom) return;
  height = canvasDom.height;
  width = canvasDom.width;
  ctx = canvasDom.getContext('2d');
};

const clear = () => ctx?.clearRect(0, 0, width, height);

const getRandomPoint = () => [Math.ceil(Math.random() * 256), Math.ceil(Math.random() * 256)];

const draw = () => {
  clear();
  const P = getRandomPoint();
  const Q = getRandomPoint();
  const R = getRandomPoint();

  const vQR = getVector(Q, R);
  const vRQ = reverse(vQR);
  const vQP = getVector(Q, P);
  const vPR = getVector(P, R);

  const vQRe = scale(5, vQR);
  const vRQe = scale(5, vRQ);

  const R2 = getEndPoint(vQRe, Q);
  const Q2 = getEndPoint(vRQe, Q);

  const lineColor = randomColor();
  drawLine(Q, R, lineColor, []);
  drawLine(R, R2, lineColor, [10, 10]);
  drawLine(Q, Q2, lineColor, [10, 10]);

  drawCircle(P, 'red');
  drawCircle(Q, 'green');
  drawCircle(R, 'blue');

  drawText('P', P, 10, '20px', 'red');
  drawText('Q', Q, 10, '20px', 'green');
  drawText('R', R, 10, '20px', 'blue');

  const nVQR = normalize(vQR);
  const nVQRColor = randomColor();
  drawCircle(nVQR, nVQRColor);
  drawText('nVQR', nVQR, 10, '20px', nVQRColor);

  const dotValue = dot(vQP, nVQR);

  const ret = scale(dotValue / length(vQR), vQR);

  drawCircle(ret, 'yellow');
  drawText('RET', ret, 10, '20px', 'yellow');

  const pnt = getEndPoint(ret, Q);
  drawCircle(pnt, 'purple');
  drawText('PNT', pnt, 10, '20px', 'purple');

  drawLine(P, pnt, 'red', []);

  // 点到线的距离
  const v1 = getVector(Q, pnt);
  const v2 = getVector(R, pnt);

  const value1 = dot(v1, v2);

  if (value1 > 0) {
    const vQPLength = length(vQP);
    const vPRLength = length(vPR);
    if (vQPLength > vPRLength) {
      drawLine(P, R, 'red', []);
    } else {
      drawLine(P, Q, 'red', []);
    }
  }
};

const init = () => {
  initCanvas();
  draw();
  // setInterval(() => draw(), 3000);
};

onMounted(() => {
  init();
});
</script>

<template>
  <canvas id="canvas" height="512" width="512"></canvas>
</template>

<style scoped lang="scss">

</style>
