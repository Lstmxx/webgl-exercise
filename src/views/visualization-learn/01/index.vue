<script lang="ts" setup>
import { onMounted } from 'vue';

let canvas: HTMLCanvasElement | null = null;

const pie = (start: number, end: number, color: string, radius = 125) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.beginPath();
  ctx.arc(radius, radius, radius, (Math.PI / 180) * start, (Math.PI / 180) * end, false);
  ctx.lineTo(radius, radius);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

const init = () => {
  canvas = document.getElementById('canvas') as HTMLCanvasElement;
  pie(-90, -60, '#37c');
  pie(-60, -25, '#3c7');
  pie(-25, 20, 'orange');
  pie(20, 110, '#f73');
  pie(110, -90, '#ccc');
};

onMounted(() => {
  init();
});

</script>

<template>
  <div>
    <h1>饼图（HTML+CSS vs SVG vs Canvas）</h1>
    <table>
      <tr>
        <td>
          <div class="pie-graph"></div>
        </td>
        <td>
          <svg xmlns="http://www.w3.org/2000/svg" width="250px" height="250px" viewBox="0 0 250 250">
            <defs>
              <circle id="pie" cx="125" cy="125" r="62.5" fill-opacity="0" stroke-width="125" />
            </defs>
            <use xlink:href="#pie" stroke="orange" stroke-dasharray="392.7 392.7" />
            <use xlink:href="#pie" stroke="#3c7" stroke-dasharray="365.43 392.7" />
            <use xlink:href="#pie" stroke="#37c" stroke-dasharray="327.25 392.7" />
            <use xlink:href="#pie" stroke="#ccc" stroke-dasharray="294.53 392.7" />
            <use xlink:href="#pie" stroke="#f73" stroke-dasharray="119.99 392.7" />
            <use xlink:href="#pie" stroke="orange" stroke-dasharray="21.82 392.7" />
          </svg>
        </td>
        <td>
          <canvas id="canvas" width="250" height="250"></canvas>
        </td>
      </tr>
      <tr>
        <td>CSS + HTML</td>
        <td>SVG</td>
        <td>CANVAS</td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">
.pie-graph {
  display: inline-block;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background-image: conic-gradient(
    #37c 30deg,
    #3c7 30deg,
    #3c7 65deg,
    orange 65deg,
    orange 110deg,
    #f73 110deg,
    #f73 200deg,
    #ccc 200deg,
  );
}
</style>
