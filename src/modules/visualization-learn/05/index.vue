/* eslint-disable no-param-reassign */
<script lang="ts" setup>
import { onMounted } from 'vue';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Options } from 'roughjs/bin/core';
import Vector2D from '@/core/utils/Vector2D';

let rc: RoughCanvas | null = null;

const initRoughContext = () => {
  const dom = document.querySelector('canvas1') as HTMLCanvasElement;
  if (!dom) {
    return;
  }
  rc = rough.canvas(dom);
};

const draw = () => {
  if (!rc) {
    return;
  }
  const ctx = (rc as any).ctx;
  ctx.translate(256, 256);
  ctx.scale(1, -1);
  const hillOpts: Options = { roughness: 2.8, strokeWidth: 2, fill: 'blue' };
  rc.path('M-180 0L-80 100L20 0', hillOpts);
  rc.path('M-20 0L80 100L180 0', hillOpts);
  rc.circle(0, 150, 105, {
    stroke: 'red',
    strokeWidth: 4,
    fill: 'rgba(255, 255, 0, 0.4)',
    fillStyle: 'solid',
  });
};

const initCanvas1 = () => {
  initRoughContext();
  draw();
};

let canvas2Ctx: CanvasRenderingContext2D | null = null;

const initCanvas2Context = () => {
  const dom = document.getElementById('canvas2') as HTMLCanvasElement;
  canvas2Ctx = dom.getContext('2d');
  if (!canvas2Ctx) {
    return;
  }
  /**
   * 将坐标原点从左上角移动到左下角，并且让 y 轴翻转为向上
   */
  canvas2Ctx.translate(0, dom.height);
  canvas2Ctx.scale(1, -1);
  canvas2Ctx.lineCap = 'round';
};

const randomColor = () => {
  const random16 = () => Math.ceil(Math.random() * 256).toString(16);
  return `#${random16()}${random16()}${random16()}`;
};

const drawBranch = (
  ctx: CanvasRenderingContext2D,
  v0: Vector2D,
  length: number,
  thickness: number,
  dir: number,
  bias: number,
) => {
  const v = new Vector2D(1, 0).rotate(dir).scale(length);
  const v1 = v0.copy().add(v);

  // eslint-disable-next-line no-param-reassign
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(v0.x, v0.y);
  ctx.lineTo(v1.x, v1.y);
  ctx.stroke();

  if (thickness > 2) {
    const left = Math.PI / 4 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5);
    drawBranch(ctx, v1, length * 0.9, thickness * 0.8, left, bias * 0.9);
    const right = Math.PI / 4 + 0.5 * (dir - 0.2) + bias * (Math.random() - 0.5);
    drawBranch(ctx, v1, length * 0.9, thickness * 0.8, right, bias * 0.9);
  }

  if (thickness < 5 && Math.random() < 0.3) {
    ctx.save();
    // eslint-disable-next-line no-param-reassign
    ctx.strokeStyle = randomColor();
    const th = Math.random() * 6 + 3;
    // eslint-disable-next-line no-param-reassign
    ctx.lineWidth = th;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v1.x, v1.y - 2);
    ctx.stroke();
    ctx.restore();
  }
};

const initCanvas2 = () => {
  initCanvas2Context();
  if (!canvas2Ctx) return;
  const v0 = new Vector2D(256, 0);
  drawBranch(canvas2Ctx, v0, 50, 10, (Math.PI / 180) * 90, 3);
};

onMounted(() => {
  initCanvas1();
  initCanvas2();
});
</script>

<template>
  <div class="wrapper">
    <canvas id="canvas1" width="512" height="256"></canvas>
    <canvas id="canvas2" width="512" height="1024"></canvas>
  </div>

</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
}
</style>
