<script lang="ts" setup>
import { onMounted } from 'vue';
import rough from 'roughjs/bundled/rough.esm';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Options } from 'roughjs/bin/core';
import { Vector2 } from 'three';

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
  const ctx = rc.ctx as CanvasRenderingContext2D;
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
  const dom = document.querySelector('canvas1') as HTMLCanvasElement;
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

const drawBranch = (
  ctx: CanvasRenderingContext2D,
  v0: number[],
  length: number,
  thickness: number,
  dir: number,
  bias: number,
) => {
};

const initCanvas2 = () => {
  initCanvas2Context();
};

onMounted(() => {
  initCanvas1();
  initCanvas2();
});
</script>

<template>
  <div class="wrapper">
    <canvas id="canvas1" width="512" height="256"></canvas>
    <canvas id="canvas2" width="512" height="256"></canvas>
  </div>

</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
}
</style>
