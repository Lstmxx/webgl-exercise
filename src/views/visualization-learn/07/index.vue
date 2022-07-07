<script lang="ts" setup>
import { onMounted } from 'vue';
import { randomColor } from '@/utils';
import Vector2D from '@/utils/Vector2D';

let canvasDom: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

let height = 0;
let width = 0;

const drawLine = (aPoint: Vector2D, bPoint: Vector2D, strokeStyle: string, lineDash: number[]) => {
  if (!ctx) return;
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.setLineDash(lineDash);
  ctx.moveTo(aPoint.x, aPoint.y);
  ctx.lineTo(bPoint.x, bPoint.y);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

const drawCircle = (point: Vector2D, strokeStyle: string) => {
  if (!ctx) return;
  ctx.save();
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 4, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.closePath();
};

const drawText = (text: string, point: Vector2D, delta: number, fontStyle = '20px', fillStyle = 'red') => {
  if (!ctx) return;
  ctx.save();
  ctx.font = fontStyle;
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, point.x + delta, point.y + delta);
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

const regularShape = (edges = 3, x: number, y: number, step: number) => {
  const ret: Vector2D[] = [];
  const delta = Math.PI - Math.PI * ((edges - 2) / edges);
  console.log('弧度： ', delta);
  console.log('角度：', delta * (180 / Math.PI));
  let p = new Vector2D(x, y);
  const dir = new Vector2D(step, 0);
  ret.push(p);
  for (let i = 0; i < edges - 1; i += 1) {
    p = p.copy().add(dir.rotate(delta));
    ret.push(p);
  }
  return ret;
};

const init = () => {
  initCanvas();
  const edges = 8;
  const points = regularShape(edges, 200, 200, 40);
  points.forEach((point, index) => {
    const nextPoint = points[(index + 1) % edges];
    const color = randomColor();
    drawLine(point, nextPoint, color, []);
    drawText(`${index + 1}`, point, 10);
  });
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
