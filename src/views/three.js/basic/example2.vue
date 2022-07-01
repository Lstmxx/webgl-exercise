<template>
  <div id="three" class="webgl">
  </div>
</template>

<script lang="tsx">
import { defineComponent, onMounted } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'Example2',
  setup() {
    let renderer: THREE.WebGLRenderer | null = null;
    let camera: THREE.Camera | null = null;
    let scene: THREE.Scene | null = null;
    const init = () => {
      const dom = document.getElementById('three');
      if (dom === null) return;
      const { clientHeight, clientWidth } = dom;
      renderer = new THREE.WebGL1Renderer();
      renderer.setSize(clientWidth, clientHeight);
      dom.appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(
        45,
        clientWidth / clientHeight,
        1,
        500,
      );
      camera.position.set(0, 0, 100);
      camera.lookAt(0, 0, 0);

      scene = new THREE.Scene();

      const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
      const points = [];
      points.push(new THREE.Vector3(-10, 0, 0));
      points.push(new THREE.Vector3(0, 10, 0));
      points.push(new THREE.Vector3(10, 0, 0));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);

      scene.add(line);
      renderer.render(scene, camera);
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
