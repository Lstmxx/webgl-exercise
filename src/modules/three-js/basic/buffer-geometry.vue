<script lang="ts" setup>
import * as THREE from 'three';
import { onMounted } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
// import { GUI } from 'dat.gui';

const createGeometry = (scene: THREE.Scene) => {
  // const geometry = new THREE.BufferGeometry();
  // const vertices = new Float32Array([
  //   0, 0, 0, //顶点1坐标
  //   50, 0, 0, //顶点2坐标
  //   0, 100, 0, //顶点3坐标
  //   0, 0, 10, //顶点4坐标
  //   0, 0, 100, //顶点5坐标
  //   50, 0, 10, //顶点6坐标
  // ]);
  // const attributes = new THREE.BufferAttribute(vertices, 3);
  // geometry.attributes.position = attributes;

  // const material = new THREE.PointsMaterial({
  //   color: 0xffff00,
  //   size: 10.0,
  // });
  // const points = new THREE.Points(geometry, material);
  // scene.add(points);

  // const lineMaterial = new THREE.LineBasicMaterial({
  //   color: 0xff0000
  // });
  // const line = new THREE.LineSegments(geometry, lineMaterial);
  // scene.add(line);

  // const v = new Float32Array([
  //   0, 0, 0, //顶点1坐标
  //   80, 0, 0, //顶点2坐标
  //   80, 80, 0, //顶点3坐标
  //   0, 80, 0, //顶点4坐标
  // ]);
  // const attribute = new THREE.BufferAttribute(v, 3);
  // geometry.attributes.position = attribute;
  // geometry.index = new THREE.BufferAttribute(new Uint16Array([
  //   0, 1, 2, 0, 2, 3,
  // ]), 1);
  // const m = new THREE.MeshLambertMaterial({
  //   color: 0x0000ff, 
  //   side: THREE.DoubleSide, //两面可见
  // });
  // scene.add(new THREE.LineLoop(geometry, m));
  const geometry = new THREE.SphereGeometry(100, 32, 16);
  console.log('几何体', geometry);
  console.log('顶点位置', geometry.attributes.position);
  console.log('顶点索引', geometry.index);
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    wireframe: true,//线条模式渲染mesh对应的三角形数据
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const random = () => Number((Math.random() * 255).toFixed(0));
  // const axis = new THREE.Vector3(0, 1, 0)

  const isPlusOrM = (current: number, target: number, distance = 1) => {
    const dis = Math.abs(current - target)
    const minDistance = dis > distance ? distance : dis;

    return current > target ? -minDistance : minDistance;
  };

  const changeColor = (curColor: THREE.Color, targetColor: THREE.Color) => {
    curColor.r += isPlusOrM(curColor.r, targetColor.r, 7);
    curColor.b += isPlusOrM(curColor.b, targetColor.b, 7);
    curColor.g += isPlusOrM(curColor.g, targetColor.g, 7);

    if (curColor.r === targetColor.r && curColor.g === targetColor.g && curColor.b === targetColor.b) {
      targetColor.setRGB(random(), random(), random());
    }
  };

  const color = new THREE.Color();
  color.setRGB(random(), random(), random());
  
  const targetColor = new THREE.Color();
  targetColor.setRGB(random(), random(), random());
  const render = () => {
    mesh.rotation.y += 0.01;
    mesh.rotation.x += 0.01;
    mesh.rotation.z += 0.01;

    changeColor(color, targetColor);

    // const color = `rgb(${random()},${random()},${random()})`;
    console.log('rgb', color);
    material.color.set(`rgb(${color.r},${color.g},${color.b})`);

    console.log(material.color);
    requestAnimationFrame(render);
  };
  render();
};

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
  
  createGeometry(scene);

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
