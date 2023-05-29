<script lang="ts" setup>
import { onMounted } from 'vue';
import { randomColor } from '@/core/utils';
import Vector2D from '@/core/utils/Vector2D';
import parametric from '@/core/utils/parametric';

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
  if (!ctx) return;
  ctx.translate(width / 2, height / 2);
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

const draw = (points: Vector2D[], edges: number) => {
  points.forEach((point, index) => {
    const nextPoint = points[(index + 1) % edges];
    const color = randomColor();
    drawLine(point, nextPoint, color, []);
    // drawText(`${index + 1}`, point, 10);
  });
};

const drawRegularShape = () => {
  const edges = 8;
  const points = regularShape(edges, 256, 256, 40);
  draw(points, edges);
};

const TAU_SEGMENTS = 60;
const TAU = Math.PI * 2;

const arc = (x0: number, y0: number, radius: number, startAng = 0, endAng = Math.PI * 2) => {
  const ang = Math.min(TAU, endAng - startAng);
  const ret: Vector2D[] = ang === TAU ? [] : [new Vector2D(x0, y0)];
  const segments = Math.round((TAU_SEGMENTS * ang) / TAU);
  for (let i = 0; i <= segments; i += 1) {
    const x = x0 + radius * Math.cos(startAng + (ang * i) / segments);
    const y = y0 + radius * Math.sin(startAng + (ang * i) / segments);
    ret.push(new Vector2D(x, y));
  }
  return ret;
};

const drawArc = () => {
  const points = arc(256, 256, 100);
  draw(points, points.length);
};

const ellipse = (
  x0: number,
  y0: number,
  radiusX: number,
  radiusY: number,
  startAng = 0,
  endAng = Math.PI * 2,
) => {
  const ang = Math.min(TAU, endAng - startAng);
  const ret: Vector2D[] = ang === TAU ? [] : [new Vector2D(x0, y0)];

  const segments = Math.round((TAU_SEGMENTS * ang) / TAU);
  for (let i = 0; i <= segments; i += 1) {
    const x = x0 + radiusX * Math.cos(startAng + (ang * i) / segments);
    const y = y0 + radiusY * Math.sin(startAng + (ang * i) / segments);
    ret.push(new Vector2D(x, y));
  }

  return ret;
};

const drawEllipse = () => {
  const points = ellipse(256, 256, 100, 50);
  draw(points, points.length);
};

const LINE_SEGMENTS = 60;

const parabola = (x0: number, y0: number, p: number, min: number, max: number) => {
  const ret: Vector2D[] = [];
  for (let i = 0; i <= LINE_SEGMENTS; i += 1) {
    const s = i / 60;
    const t = min * (1 - s) + max * s;
    const x = x0 + 2 * p * t ** 2;
    const y = y0 + 2 * p * t;
    ret.push(new Vector2D(x, y));
  }
  return ret;
};

const drawParabola = () => {
  const points = parabola(256, 256, 5.5, -10, 10);
  draw(points, points.length);
};

const drawHelical = () => {
  const helical = parametric(
    (t, l) => Math.cos(t) * t * l!,
    (t, l) => Math.sin(t) * t * l!,
  );
  if (!ctx) return;
  helical(0, 50, 500, 5).draw(ctx, { strokeStyle: 'black' });
};

const drawStar = () => {
  const star = parametric(
    (t, l) => l * Math.cos(t) ** 3,
    (t, l) => l * Math.sin(t) ** 3,
  );
  if (!ctx) return;
  star(0, Math.PI * 2, 50, 150).draw(ctx, { strokeStyle: 'red' });
};

const drawQuadricBezier = () => {
  if (!ctx) return;
  const quadricBezier = parametric(
    (t, [{ x: x0 }, { x: x1 }, { x: x2 }]) => (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t ** 2 * x2,
    (t, [{ y: y0 }, { y: y1 }, { y: y2 }]) => (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t ** 2 * y2,
  );
  const p0 = new Vector2D(0, 0);
  const p1 = new Vector2D(100, 0);
  p1.rotate(0.75);
  const p2 = new Vector2D(200, 0);
  const count = 30;
  const delta = (2 * Math.PI) / count;
  for (let i = 0; i < count; i += 1) {
    p1.rotate(delta);
    p2.rotate(delta);
    quadricBezier(0, 1, 100, [
      p0,
      p1,
      p2,
    ]).draw(ctx, { strokeStyle: randomColor() });
  }
};

const drawCubicBezier = () => {
  if (!ctx) return;
  const cubicBezier = parametric(
    (
      t,
      [{ x: x0 }, { x: x1 }, { x: x2 }, { x: x3 }],
    ) => (1 - t) ** 3 * x0 + 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) ** 2 * x2 + t ** 3 * x3,
    (
      t,
      [{ y: y0 }, { y: y1 }, { y: y2 }, { y: y3 }],
    ) => (1 - t) ** 3 * y0 + 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) ** 2 * y2 + t ** 3 * y3,
  );
  const p0 = new Vector2D(0, 0);
  const p1 = new Vector2D(100, 0);
  p1.rotate(0.75);
  const p2 = new Vector2D(150, 0);
  p2.rotate(-0.75);
  const p3 = new Vector2D(200, 0);
  const count = 30;
  const delta = (2 * Math.PI) / count;
  for (let i = 0; i < count; i += 1) {
    p1.rotate(delta);
    p2.rotate(delta);
    p3.rotate(delta);
    cubicBezier(0, 1, 100, [
      p0,
      p1,
      p2,
      p3,
    ]).draw(ctx, { strokeStyle: randomColor() });
  }
};

const init = () => {
  initCanvas();
  // drawRegularShape();
  // drawArc();
  // drawEllipse();
  // drawParabola();
  drawHelical();
  // drawStar();
  // drawQuadricBezier();
  drawCubicBezier();
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
