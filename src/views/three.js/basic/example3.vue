<template>
  <canvas id="three" class="webgl"></canvas>
</template>

<script lang="tsx">
import { defineComponent, onMounted } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'Example3',
  setup() {
    let renderer: THREE.WebGLRenderer | null = null;
    let camera: THREE.Camera | null = null;
    let scene: THREE.Scene | null = null;
    let cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | null = null;

    const getRandomColor = () => (Math.random() * 255).toFixed(0);
    const startColor = new THREE.Color(
      `rgb(${getRandomColor()},${getRandomColor()},${getRandomColor()})`,
    );
    const endColor = new THREE.Color(
      `rgb(${getRandomColor()},${getRandomColor()},${getRandomColor()})`,
    );
    const timeRange = 60 * 2;
    const step = { r: 0, g: 0, b: 0 };
    const stepUpdate = () => {
      step.r = (startColor.r - endColor.r) / timeRange;
      step.g = (startColor.g - endColor.g) / timeRange;
      step.b = (startColor.b - endColor.b) / timeRange;
    };
    let t = 0;
    const animate = (time: number) => {
      if (cube && camera && renderer && scene) {
        const val = time * 0.001;

        cube.rotation.x = val;
        cube.rotation.y = val;
        if (t === timeRange) {
          startColor.set(endColor.getStyle());
          endColor.set(`rgb(${getRandomColor()},${getRandomColor()},${getRandomColor()})`);
          stepUpdate();
          t = 0;
        }
        cube.material.color.r += step.r;
        cube.material.color.g += step.g;
        cube.material.color.b += step.b;
        t += 1;
        renderer.render(scene, camera);

        requestAnimationFrame(animate);
      }
    };

    const init = () => {
      const canvas = document.getElementById('three');
      if (canvas === null) return;
      const { clientHeight, clientWidth } = canvas;
      renderer = new THREE.WebGL1Renderer({ canvas });
      renderer.setSize(clientWidth, clientHeight);

      camera = new THREE.PerspectiveCamera(
        75,
        clientWidth / clientHeight,
        1,
        500,
      );
      camera.position.set(0, 0, 2);

      scene = new THREE.Scene();

      const geometry = new THREE.BoxGeometry(1, 1, 1);

      const material = new THREE.MeshBasicMaterial({ color: startColor });

      cube = new THREE.Mesh(geometry, material);
      cube.matrixAutoUpdate = true;
      scene.add(cube);
      scene.background = new THREE.Color(0xf0f0f0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.3));

      const light = new THREE.DirectionalLight(0xffffff, 0.35);
      light.position.set(1, 1, 1).normalize();
      scene.add(light);
      requestAnimationFrame(animate);
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
}
</style>
