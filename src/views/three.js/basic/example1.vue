<template>
  <div id="three" class="webgl">
    <!-- <canvas id="canvas" class="canvas"></canvas> -->
  </div>
</template>

<script lang="tsx">
import { defineComponent, onMounted } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'Example1',
  setup() {
    let renderer: THREE.WebGLRenderer | null = null;
    let camera: THREE.Camera | null = null;
    let scene: THREE.Object3D<THREE.Event> | null = null;
    let cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | null = null;
    let x = 0.01;
    const animate = () => {
      requestAnimationFrame(animate);
      if (renderer && camera && scene) {
        if (cube) {
          if (cube.position.x < -5) {
            x = 0.01;
          } else if (cube.position.x > 5) {
            x = -0.01;
          }
          cube.position.x += x;
          cube.position.y = Math.sin(cube.position.x);
        }
        renderer.render(scene as any, camera as any);
      }
    };
    const init = () => {
      const threeDom = document.getElementById('three');
      console.log(threeDom);
      if (threeDom === null) return;
      const { clientWidth, clientHeight } = threeDom;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        clientWidth / clientHeight,
        0.1,
        1000,
      );
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      camera.position.z = 5;
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(clientWidth, clientHeight);
      threeDom.appendChild(renderer.domElement);
      animate();
      console.log('renderDomEL: ', renderer.domElement);
    };
    onMounted(() => {
      init();
    });
    init();
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
