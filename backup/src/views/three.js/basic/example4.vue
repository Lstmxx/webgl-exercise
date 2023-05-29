<script lang="ts" setup>
import * as THREE from 'three';
import { onMounted } from 'vue';

let scene: THREE.Scene;
let geometry: THREE.BoxGeometry;

const init = () => {
  scene = new THREE.Scene();
  geometry = new THREE.BoxGeometry(100, 100, 100);
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
