<script lang="ts" setup>

import RepeatComponent from './components/repeat/index.vue';
import MandelbrotSet from './components/mandelbrot-set/index.vue';
import RandomComponent from './components/random/index.vue';

</script>

<template>
  <div class="wrapper">

    <repeat-component />
    <mandelbrot-set />
    <random-component />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
}
</style>
