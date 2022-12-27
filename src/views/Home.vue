<template>
  <div class="home">
    <a class="route" v-for="(route, index) in routes" :key="index" @click="handleRoute(route.path)">
      {{ route.name }}
    </a>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const routes = computed(() => router.getRoutes());

watch(() => [routes], () => {
  console.log('routes', routes.value);
}, {
  immediate: true,
});

const handleRoute = (path: string) => {
  router.push({
    path,
  });
};

</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  .route {
    margin-top: 10px;
    cursor: pointer;
  }
}
</style>
