<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import earcut from 'earcut';
import Vector2D from '@/utils/Vector2D';

let canvasDom: HTMLCanvasElement | null = null;
let ctx: WebGLRenderingContext | null = null;
let vertexShader: WebGLShader | null = null;
let fragmentShader: WebGLShader | null = null;
let program: WebGLProgram | null = null;
let height = 0;
let width = 0;

const initCanvas = () => {
  canvasDom = document.querySelector('canvas');
  if (!canvasDom) return;
  height = canvasDom.height;
  width = canvasDom.width;
  ctx = canvasDom.getContext('webgl');
  // if (!ctx) return;
  // ctx.translate(width / 2, height / 2);
};

const initVertexShader = () => {
  if (!ctx) {
    return;
  }
  const vertex = `
    attribute vec2 position;
    varying vec3 color;
    void main() {
      gl_PointSize = 1.0;
      color = vec3(0.5 + position * 0.5, 0.0);
      gl_Position = vec4(position * 0.5, 1.0, 1.0);
    }`;
  vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
  console.log('vertexShader: ', vertexShader);
  if (!vertexShader) {
    return;
  }
  ctx.shaderSource(vertexShader, vertex);
  ctx.compileShader(vertexShader);
};

const initFragmentShader = () => {
  if (!ctx) {
    return;
  }
  const fragment = `
    precision mediump float;
    varying vec3 color;
    void main() {
      gl_FragColor = vec4(color, 1.0);
    }`;
  fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);
  console.log('fragmentShader: ', fragmentShader);
  if (!fragmentShader) {
    return;
  }
  ctx.shaderSource(fragmentShader, fragment);
  ctx.compileShader(fragmentShader);
};

const initProgram = () => {
  if (!ctx) {
    return;
  }
  program = ctx.createProgram();
  console.log('program: ', program);
  if (!program) {
    return;
  }
  if (!vertexShader) {
    return;
  }
  ctx.attachShader(program, vertexShader);
  if (!fragmentShader) {
    return;
  }
  ctx.attachShader(program, fragmentShader);
  ctx.linkProgram(program);
  ctx.useProgram(program);
};

const drawTriangles = () => {
  if (!ctx) return;
  if (!program) return;
  const vertices = [
    [-0.7, 0.5], [-0.4, 0.3], [-0.25, 0.71],
    [-0.1, 0.56], [-0.1, 0.13], [0.4, 0.21],
    [0, -0.6], [-0.3, -0.3], [-0.6, -0.3], [-0.45, 0.0],
  ];
  const points = vertices.flat();
  const triangles = earcut(points);
  const position = new Float32Array(points);
  const cells = new Uint16Array(triangles);

  const pointBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, pointBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, position, ctx.STATIC_DRAW);

  const vPosition = ctx.getAttribLocation(program, 'position');
  ctx.vertexAttribPointer(vPosition, 2, ctx.FLOAT, false, 0, 0);
  ctx.enableVertexAttribArray(vPosition);

  const cellsBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, cellsBuffer);
  ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, cells, ctx.STATIC_DRAW);

  ctx.clear(ctx.COLOR_BUFFER_BIT);
  ctx.drawElements(ctx.TRIANGLES, cells.length, ctx.UNSIGNED_SHORT, 0);
};

const s = '比如把下面一句代码直接复制到地址栏，回车运行就可以看到效果了;';
const s2 = ref('');
let i = 0;
while (i < s.length) { s2.value += String.fromCharCode(1161) + s.charAt(i); i += 1; }

onMounted(() => {
  initCanvas();
  initProgram();
  drawTriangles();
});

</script>

<template>
  <div class="wrapper">
    {{ s2 }}
    <canvas class="canvas"></canvas>
  </div>
</template>

<style scoped lang="scss">

</style>
