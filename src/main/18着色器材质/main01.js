import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
// import deepVertexShader from "./15flylight/deep/vertex.glsl";
// import deepFragmentShader from "./15flylight/deep/fragment.glsl";

// 目标：认识shader

// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 2);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const geometry = new THREE.PlaneGeometry(1,1,512,512);
const material = new THREE.MeshBasicMaterial({
  color:0x00ff00,
  side:THREE.DoubleSide,
})
const basicUniform = {
  uTime:{
    value:0
  }
}
material.onBeforeCompile=(shader,render)=>{
  console.log(shader.vertexShader);
  console.log(shader.fragmentShader);
  shader.uniforms.uTime = basicUniform.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>
    uniform float uTime;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    transformed.x += sin(uTime) * 2.0;
    transformed.z += cos(uTime) * 2.0;
    `
  )
}
const plane = new THREE.Mesh(geometry,material)

// plane.rotation.x = -Math.PI/2;
scene.add(plane)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.shadowMap.type = THREE.VSMShadowMap;

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 将渲染器添加到body
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock();
function animate(t) {
  const elapsedTime = clock.getElapsedTime();
  basicUniform.uTime.value = elapsedTime;
  
  //   console.log(elapsedTime);
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();
