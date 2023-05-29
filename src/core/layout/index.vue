<template>
  <div class="home">
    <div class="route-menu">
      <a class="route-menu-item" v-for="(route, index) in routes" :key="index" @click="handleRoute(route.path)">
        {{ route.name }}
      </a>
    </div>
    <div class="content">
      <!-- <router-view /> -->
      <router-view v-slot="{ Component, route }">
        <keep-alive :max="10">
          <component
            :is="Component"
            v-if="route && route.meta && !route.meta.noCache"
            :key="route.name"
          />
        </keep-alive>
        <component
          :is="Component"
          v-if="route && route.meta && route.meta.noCache"
          :key="route.name"
        />
      </router-view>
    </div>
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
  height: 100vh;
  width: 100vw;
  .route-menu {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    min-width: 200px;
    .route-menu-item {
      padding: 10px;
      margin-top: 10px;
      cursor: pointer;
    }
  }
  .content {
    flex: 1;
    max-height: 100vh;
    overflow: auto;
  }
}
</style>
