<script lang="ts" setup>
import { onMounted } from 'vue';
import { IUniformData } from './type';

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
    attribute vec2 position;
    uniform float uRotation;
    uniform float uTime;
    uniform float uDuration;
    uniform float uScale;
    uniform vec2 uDir;
    varying float vP;
    void main() {
      float p = min(1.0, uTime / uDuration);
      float rad = uRotation + 3.14 * 10.0 * p;
      float scale = uScale * p * (2.0 - p);
      vec2 offset = 2.0 * uDir * p * p;
      mat3 translateMatrix = mat3(
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        offset.x, offset.y, 1.0
      );
      mat3 rotateMatrix = mat3(
        cos(rad), sin(rad), 0.0,
        -sin(rad), cos(rad), 0.0,
        0.0, 0.0, 1.0
      );
      mat3 scaleMatrix = mat3(
        scale, 0.0, 0.0,
        0.0, scale, 0.0,
        0.0, 0.0, 1.0
      );
      gl_PointSize = 1.0;
      vec3 pos = translateMatrix * rotateMatrix * scaleMatrix * vec3(position, 1.0);
      gl_Position = vec4(pos, 1.0);
      vP = p;
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
    
    uniform vec4 uColor;
    varying float vP;
    void main()
    {
      gl_FragColor.xyz = uColor.xyz;
      gl_FragColor.a = (1.0 - vP) * uColor.a;
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

const randomTriangles = (): IUniformData => {
  const uColor = [Math.random(), Math.random(), Math.random(), 1.0];
  const uRotation = Math.random() * Math.PI;
  const uScale = Math.random() * 0.05 + 0.03;
  const uTime = 0;
  const uDuration = 3.0;

  const rad = Math.random() * Math.PI * 2;
  const uDir = [Math.cos(rad), Math.sin(rad)];
  const startTime = performance.now();

  return {
    uColor,
    uRotation,
    uScale,
    uTime,
    uDuration,
    uDir,
    startTime,
  };
};

const setUniforms = (uniformData: IUniformData) => {
  if (!glContext || !program) return;
  const {
    uColor,
    uRotation,
    uScale,
    uTime,
    uDuration,
    uDir,
  } = uniformData;
  let loc = glContext.getUniformLocation(program, 'uColor');
  glContext.uniform4fv(loc, uColor);

  loc = glContext.getUniformLocation(program, 'uRotation');
  glContext.uniform1f(loc, uRotation);

  loc = glContext.getUniformLocation(program, 'uScale');
  glContext.uniform1f(loc, uScale);

  loc = glContext.getUniformLocation(program, 'uTime');
  glContext.uniform1f(loc, uTime);

  loc = glContext.getUniformLocation(program, 'uDuration');
  glContext.uniform1f(loc, uDuration);

  loc = glContext.getUniformLocation(program, 'uDir');
  glContext.uniform2fv(loc, uDir);
};

let triangles: IUniformData[] = [];
const update = () => {
  if (!glContext) return;
  const triangleCount = 5 * Math.random();
  for (let i = 0; i < triangleCount; i += 1) {
    triangles.push(randomTriangles());
  }
  glContext.clear(glContext.COLOR_BUFFER_BIT);
  triangles.forEach((triangle) => {
    triangle.uTime = (performance.now() - triangle.startTime) / 1000;
    setUniforms(triangle);
    glContext!.drawArrays(glContext!.TRIANGLES, 0, position.length / 2);
  });
  triangles = triangles.filter((triangle) => triangle.uTime <= triangle.uDuration);
  requestAnimationFrame(update);
};

const createRandomTriangle = () => {
  if (!glContext) {
    return;
  }
  const bufferId = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, bufferId);
  glContext.bufferData(glContext.ARRAY_BUFFER, position, glContext.STATIC_DRAW);

  if (!program) {
    return;
  }
  const vPosition = glContext.getAttribLocation(program, 'position');
  glContext.vertexAttribPointer(vPosition, 2, glContext.FLOAT, false, 0, 0);
  glContext.enableVertexAttribArray(vPosition);

  // 绘制
  requestAnimationFrame(update);
};

onMounted(() => {
  initGLContext();
  initVertexShader();
  initFragmentShader();
  initProgram();
  createRandomTriangle();
});
</script>

<template>
  <canvas id="glCanvas" width="600" height="600"></canvas>
</template>

<style scoped lang="scss">

</style>
