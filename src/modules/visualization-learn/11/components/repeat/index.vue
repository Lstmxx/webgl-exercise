<script lang="ts" setup>
import { onMounted } from 'vue';
import Vertex from './vertex.glsl';
import Fragment from './fragment.glsl';

let glContext: WebGLRenderingContext | null = null;
let vertexShader: WebGLShader | null = null;
let fragmentShader: WebGLShader | null = null;
let program: WebGLProgram | null = null;

const initGLContext = () => {
  const canvas = document.getElementById('repeat-canvas') as HTMLCanvasElement;
  glContext = canvas.getContext('webgl');
};

const initVertexShader = () => {
  if (!glContext) {
    return;
  }
  vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
  if (!vertexShader) {
    return;
  }
  glContext.shaderSource(vertexShader, Vertex);
  glContext.compileShader(vertexShader);
};

const initFragmentShader = () => {
  if (!glContext) {
    return;
  }

  fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER);
  if (!fragmentShader) {
    return;
  }

  glContext.shaderSource(fragmentShader, Fragment);
  glContext.compileShader(fragmentShader);
};

const initProgram = () => {
  if (!glContext) {
    return;
  }
  program = glContext.createProgram();
  if (!program || !vertexShader || !fragmentShader) {
    return;
  }
  glContext.attachShader(program, vertexShader);
  glContext.attachShader(program, fragmentShader);
  glContext.linkProgram(program);
  glContext.useProgram(program);
};

const setUniforms = () => {
  if (!glContext || !program) return;
  const loc = glContext.getUniformLocation(program, 'rows');
  glContext.uniform1f(loc, 40);
};

const drawBuffer = () => {
  if (!glContext || !program) return;
  const position = [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ];
  const positionData = new Float32Array(position.flat());

  const positionBuffer = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
  glContext.bufferData(glContext.ARRAY_BUFFER, positionData, glContext.STATIC_DRAW);

  const vPosition = glContext.getAttribLocation(program, 'a_vertex_position');
  glContext.vertexAttribPointer(vPosition, 2, glContext.FLOAT, false, 0, 0);
  glContext.enableVertexAttribArray(vPosition);

  glContext.bindBuffer(glContext.ARRAY_BUFFER, glContext.createBuffer());
  const vuvData = [[0, 0],
    [0, 1],
    [1, 1],
    [1, 0]];
  glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vuvData.flat()), glContext.STATIC_DRAW);

  const uv = glContext.getAttribLocation(program, 'uv');
  glContext.vertexAttribPointer(uv, 2, glContext.FLOAT, false, 0, 0);
  glContext.enableVertexAttribArray(uv);

  const cells = [[0, 1, 2], [2, 0, 3]];
  const cellsData = new Uint16Array(cells.flat());

  const cellsBuffer = glContext.createBuffer();

  glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, cellsBuffer);
  glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, cellsData, glContext.STATIC_DRAW);

  glContext.clear(glContext.COLOR_BUFFER_BIT);
  glContext.drawElements(glContext.TRIANGLES, cellsData.length, glContext.UNSIGNED_SHORT, 0);
};

onMounted(() => {
  initGLContext();
  initVertexShader();
  initFragmentShader();
  initProgram();
  setUniforms();
  drawBuffer();
});

</script>

<template>
  <div class="repeat">
    <h1>重复格子</h1>
    <canvas id="repeat-canvas" width="600" height="600"></canvas>
  </div>
</template>

<style scoped lang="scss">
.repeat {
}
</style>
