<script lang="ts" setup>
import { onMounted } from 'vue';

let glContext: WebGLRenderingContext | null = null;
let vertexShader: WebGLShader | null = null;
let fragmentShader: WebGLShader | null = null;
let program: WebGLProgram | null = null;

const initGlContext = () => {
  const canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
  glContext = canvas.getContext('webgl');
  console.log('glContext: ', glContext);
};

const initVertexShader = () => {
  if (!glContext) {
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
  vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
  console.log('vertexShader: ', vertexShader);
  if (!vertexShader) {
    return;
  }
  glContext.shaderSource(vertexShader, vertex);
  glContext.compileShader(vertexShader);
};

const initFragmentShader = () => {
  if (!glContext) {
    return;
  }
  const fragment = `
    precision mediump float;
    varying vec3 color;
    void main() {
      gl_FragColor = vec4(color, 1.0);
    }`;
  fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER);
  console.log('fragmentShader: ', fragmentShader);
  if (!fragmentShader) {
    return;
  }
  glContext.shaderSource(fragmentShader, fragment);
  glContext.compileShader(fragmentShader);
};

const initProgram = () => {
  if (!glContext) {
    return;
  }
  program = glContext.createProgram();
  console.log('program: ', program);
  if (!program) {
    return;
  }
  if (!vertexShader) {
    return;
  }
  glContext.attachShader(program, vertexShader);
  if (!fragmentShader) {
    return;
  }
  glContext.attachShader(program, fragmentShader);
  glContext.linkProgram(program);
  glContext.useProgram(program);
};

const createTriangle = () => {
  if (!glContext) {
    return;
  }
  const points = new Float32Array([
    -1, -1,
    0, 1,
    1, -1,
  ]);
  const bufferId = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, bufferId);
  glContext.bufferData(glContext.ARRAY_BUFFER, points, glContext.STATIC_DRAW);

  if (!program) {
    return;
  }
  const vPosition = glContext.getAttribLocation(program, 'position');
  glContext.vertexAttribPointer(vPosition, 2, glContext.FLOAT, false, 0, 0);
  glContext.enableVertexAttribArray(vPosition);

  // 绘制
  glContext.clear(glContext.COLOR_BUFFER_BIT);
  glContext.drawArrays(glContext.LINE_STRIP, 0, points.length / 2);
};

onMounted(() => {
  initGlContext();
  initVertexShader();
  initFragmentShader();
  initProgram();
  createTriangle();
});
</script>

<template>
  <canvas id="glcanvas" width="250" height="250"></canvas>
</template>

<style scoped lang="scss">

</style>
