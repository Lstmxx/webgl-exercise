<script lang="ts" setup>
import * as THREE from 'three';
import { onMounted } from 'vue';

let scene: THREE.Scene;
let geometry: THREE.BoxGeometry;
let material: THREE.MeshBasicMaterial;

const init = () => {
  scene = new THREE.Scene();
  geometry = new THREE.BoxGeometry(100, 100, 100);
  material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 10, 0);
  scene.add(mesh);
};

onMounted(() => {
  init();
});
</script>

<template>
  <div id="three" class="webgl">
    <!-- <canvas id="canvas" class="canvas"></canvas> -->
  </div>
</template>

<style scoped lang="scss">

</style>
