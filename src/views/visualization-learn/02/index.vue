<script lang="ts" setup>
import { onMounted } from 'vue';

let canvas: HTMLCanvasElement | null = null;

const drawRect = (height: number, width: number) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.rect(0.5 * canvas.width, 0.5 * canvas.height, width, height);
  ctx.fill();
  ctx.closePath();
};

const moveCanvas = (x: number, y: number) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.translate(x, y);
};

const init = () => {
  canvas = document.querySelector('canvas');
  moveCanvas(-0.5 * 100, -0.5 * 50);
  drawRect(50, 100);
  moveCanvas(0.5 * 100, 0.5 * 50);
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="wrapper">
    <canvas class="canvas"></canvas>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  .canvas {
    width: 512px;
    height: 512px;
    border: 1px solid blue;
  }
}
</style>
