<template>
  <div class="webgl">
    <canvas id="glcanvas" class="canvas"></canvas>
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref, onMounted } from 'vue';
import { mat4 } from 'gl-matrix';

type ProgramInfo = {
  program: WebGLProgram | null;
  attribLocations: {
    vertexPosition: number,
    vertexColorAttribute: number,
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null;
    modelViewMatrix: WebGLUniformLocation | null;
  };
};
export default defineComponent({
  name: 'Example',
  setup() {
    const glContext = ref<WebGLRenderingContext | null>(null);
    const programInfo = ref<ProgramInfo>({
      program: null,
      attribLocations: {
        vertexPosition: 0,
        vertexColorAttribute: 0,
      },
      uniformLocations: {
        projectionMatrix: null,
        modelViewMatrix: null,
      },
    });
    const loadShader = (context: WebGLRenderingContext, type: number, source: string) => {
      if (context === null) return null;
      const shader = context.createShader(type);
      if (shader === null) return null;
      context.shaderSource(shader, source);
      context.compileShader(shader);
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        alert(`焯！${context.getShaderInfoLog(shader)}`);
        context.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const initShader = (context: WebGLRenderingContext, vsSource: string, fsSource: string) => {
      if (context === null) return null;
      const vertexShader = loadShader(context, context.VERTEX_SHADER, vsSource);
      if (!vertexShader) return null;
      const fragmentShader = loadShader(context, context.FRAGMENT_SHADER, fsSource);
      if (!fragmentShader) return null;

      const shaderProgram = context.createProgram();
      if (shaderProgram === null) return null;
      context.attachShader(shaderProgram, vertexShader);
      context.attachShader(shaderProgram, fragmentShader);
      context.linkProgram(shaderProgram);

      if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {
        alert(`焯！${context.getProgramInfoLog(shaderProgram)}`);
        return null;
      }
      return shaderProgram;
    };
    const initBuffers = (context: WebGLRenderingContext) => {
      const positionBuffer = context.createBuffer();
      const position = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
      ];
      context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array(position), context.STATIC_DRAW);

      const colorBuffer = context.createBuffer();
      const colors = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
      ];
      context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array(colors), context.STATIC_DRAW);

      return {
        color: colorBuffer,
        position: positionBuffer,
      };
    };
    const drawScene = (
      context: WebGLRenderingContext,
      program: ProgramInfo,
      buffers: WebGLBuffer,
    ) => {
      context.clearColor(0.0, 0.0, 0.0, 1.0);
      context.clearDepth(1.0);
      context.enable(context.DEPTH_TEST);
      context.depthFunc(context.LEQUAL);

      context.clear(context.COLOR_BUFFER_BIT);
      context.clear(context.DEPTH_BUFFER_BIT);

      const fieldOfView = (45 * Math.PI) / 180;
      const canvas = context.canvas as HTMLCanvasElement;
      const aspect = canvas.clientWidth / canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      const projectionMatrix = mat4.create();

      mat4.perspective(
        projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar,
      );

      const modelViewMatrix = mat4.create();

      mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

      {
        const numComponent = 3;
        const type = context.FLOAT;
        const normalize = false;
        const stride = 0;

        const offset = 0;
        context.bindBuffer(context.ARRAY_BUFFER, buffers);
        context.vertexAttribPointer(
          program.attribLocations.vertexPosition,
          numComponent,
          type,
          normalize,
          stride,
          offset,
        );
        context.enableVertexAttribArray(program.attribLocations.vertexPosition);
      }

      context.useProgram(program.program);
      context.uniformMatrix4fv(
        program.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
      );
      context.uniformMatrix4fv(
        program.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
      );
      {
        const offset = 0;
        const vertexCount = 4;
        context.drawArrays(context.TRIANGLE_STRIP, offset, vertexCount);
      }
    };
    const initCanvas = () => {
      const canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
      glContext.value = canvas?.getContext('webgl');
      if (!glContext.value) {
        alert('焯！');
        return;
      }
      glContext.value.clearColor(0.0, 0.0, 0.0, 1.0);
      glContext.value.clear(glContext.value.COLOR_BUFFER_BIT);
    };
    const init = () => {
      initCanvas();
      if (glContext.value === null) return;
      const vsSource = `
        attribute vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;
        void main() {
          gl_Position = uProjectionMatrix* uModelViewMatrix * vec4(aVertexPosition, 1.0);
          vColor = aVertexColor;
        }
      `;
      const fsSource = `
        varying lowp vec4 vColor;
        void main(void) {
          gl_FragColor = vColor;
        }
      `;
      const shaderProgram = initShader(glContext.value, vsSource, fsSource);
      if (!shaderProgram) return;
      programInfo.value.program = shaderProgram;
      programInfo.value.attribLocations.vertexPosition = glContext.value.getAttribLocation(shaderProgram, 'aVertexPosition');
      programInfo.value.attribLocations.vertexColorAttribute = glContext.value.getAttribLocation(
        shaderProgram,
        'aVertexColor',
      );
      glContext.value.enableVertexAttribArray(
        programInfo.value.attribLocations.vertexColorAttribute,
      );
      programInfo.value.uniformLocations = {
        projectionMatrix: glContext.value.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: glContext.value.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      };
      const { position, color } = initBuffers(glContext.value);
      if (position === null) return;
      drawScene(glContext.value, programInfo.value, position);
    };
    onMounted(() => {
      init();
    });
    return {};
  },
});
</script>
<style scoped lang="scss">
.webgl {
  height: 100vh;
  width: 100vw;
  .canvas {
    height: 100%;
    width: 100%;
  }
}
</style>
