<template>
  <canvas id="three" class="webgl"></canvas>
</template>

<script lang="tsx">
import { defineComponent, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default defineComponent({
  name: 'Example3',
  setup() {
    let renderer: THREE.WebGLRenderer | null = null;
    let camera: THREE.Camera | null = null;
    let scene: THREE.Scene | null = null;
    let cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | null = null;
    let controls: OrbitControls | null = null;

    const animate = () => {
      if (cube && camera && renderer && scene && controls) {
        controls.update();
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

      const material = new THREE.MeshBasicMaterial({ color: '#112233' });

      cube = new THREE.Mesh(geometry, material);
      cube.position.set(2, 2, 2);
      scene.add(cube);
      scene.background = new THREE.Color(0xf0f0f0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.3));

      controls = new OrbitControls(camera, renderer.domElement);

      const light = new THREE.DirectionalLight(0xffffff, 0.35);
      light.position.set(1, 1, 1).normalize();
      scene.add(light);

      const axisHelper = new THREE.AxesHelper(250);
      scene.add(axisHelper);

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
