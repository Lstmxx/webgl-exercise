<script lang="ts" setup>
import { onMounted } from 'vue';

import RepeatComponent from './components/repeat/index.vue';

let glContext: WebGLRenderingContext | null = null;
let vertexShader: WebGLShader | null = null;
let fragmentShader: WebGLShader | null = null;
let program: WebGLProgram | null = null;

const position = new Float32Array([
  -1, -1,
  0, 1,
  1, -1,
]);

const initGLContext = () => {
  const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
  glContext = canvas.getContext('webgl');
};

const initVertexShader = () => {
  if (!glContext) {
    return;
  }
  const vertex = `
    attribute vec2 a_vertexPosition;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      gl_PointSize = 1.0;
      vUv = uv;
      gl_Position = vec4(a_vertexPosition, 1, 1);
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
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying vec2 vUv;
    uniform float rows;
    void main() {
      vec2 st = fract(vUv * rows);
      float d1 = step(st.x, 0.9);
      float d2 = step(0.1, st.y);
      gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);
      gl_FragColor.a = 1.0;
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

onMounted(() => {
  initGLContext();
  initVertexShader();
  initFragmentShader();
  initProgram();
});
</script>

<template>
  <div class="wrapper">

    <repeat-component />
    <canvas id="glCanvas" width="600" height="600"></canvas>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
}
</style>
