<script lang="ts" setup>
import * as THREE from 'three';
import { onMounted } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
// import { GUI } from 'dat.gui';

const createLambertGeometry = (scene: THREE.Scene) => {
  const geometry = new THREE.BoxGeometry(100, 60, 30);
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff, //设置材质颜色
    transparent: true,//开启透明
    opacity: 0.5,//设置透明度
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      // 在XOZ平面上分布
      mesh.position.set(i * 200, 0, j * 200);
      scene.add(mesh); //网格模型添加到场景中  
    }
  }
};

// const createPhongGeometry = (scene: THREE.Scene) => {
//   const geometry = new THREE.BoxGeometry(100, 60, 30);
//   const material = new THREE.MeshPhongMaterial();
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.set(100, 60, 30);
//   scene.add(mesh);
//   return mesh;
// };

// const initGui = () => {
//   const gui = new GUI();
//   return gui;
// };

const initControls = (camera: THREE.Camera, renderer: THREE.WebGLRenderer, cb: () => void) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', cb);
};

const initStats = (targetDom: HTMLElement, renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => {
  const stats = new Stats();
  targetDom.appendChild(stats.dom);
  const render = () => {
    stats.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
};


const init = () => {
  const dom = document.getElementById('three');
  if (!dom) return;

  const height = dom.clientHeight;
  const width = dom.clientWidth;
  const scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);
  
  createLambertGeometry(scene);

  // const width = 800;
  // const height = 500;
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 8000);
  camera.position.set(100, 100, 100);
  camera.lookAt(axesHelper.position);
  // camera.lookAt(lambertMesh.position);

  const pointLight = new THREE.PointLight(0xffffff, 1.0);
  pointLight.position.set(100, 100, 100);
  scene.add(pointLight);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 150);
  scene.add(pointLightHelper);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setClearColor(0x123456, 1);
  renderer.setSize(width, height);

  initStats(dom, renderer, scene, camera);  
  
  dom.appendChild(renderer.domElement);
  
  initControls(camera, renderer, () => {
    renderer.render(scene, camera);
    console.log('camera.position', camera.position);
  });

  window.onresize = () => {
    const dom = document.getElementById('three');
    if (dom) {
      const height = dom.clientHeight;
      const width = dom.clientWidth;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }
  };
};

onMounted(() => {
  init();
});
</script>

<template>
  <div id="three" class="webgl">
  </div>
</template>

<style scoped lang="scss">
.webgl {
  height: 100%;
  width: 100%;
}
</style>
