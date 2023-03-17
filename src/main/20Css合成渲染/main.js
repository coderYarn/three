import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import {CSS2DRenderer,CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer"
// 目标：认识shader
const EARTH_RADIUS = 1;
const MOON_RADIUS = 0.27;
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


// 光线
const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 0, 1);
scene.add(dirLight);
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);
// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 纹理
const textureLoader = new THREE.TextureLoader();

// 加载模型
const loader = new GLTFLoader()
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS,16,16)
const earthMaterial = new THREE.MeshPhongMaterial({
  shininess:5,
  specular: 0x333333,
  shininess: 5,
  map: textureLoader.load("textures/planets/earth_atmos_2048.jpg"),
  specularMap: textureLoader.load("textures/planets/earth_specular_2048.jpg"),
  normalMap: textureLoader.load("textures/planets/earth_normal_2048.jpg"),
  normalScale: new THREE.Vector2(0.85, 0.85),
})
const earth = new THREE.Mesh(
  earthGeometry,
  earthMaterial
)
earth.rotation.y = Math.PI
scene.add(earth)
const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS,16,16)
const moonMaterial = new THREE.MeshPhongMaterial({
  shininess:5,
  map:textureLoader.load("textures/planets/moon_1024.jpg")
})
const moon = new THREE.Mesh(
  moonGeometry,
  moonMaterial
)
scene.add(moon)

// 添加提示标签
const earthDiv = document.createElement("div")
earthDiv.className = "label"
earthDiv.innerHTML = "地球"
const earthLabel = new CSS2DObject(earthDiv)

earthLabel.position.set(0,1,0);
earth.add(earthLabel)

// 设置CSS2d渲染器
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth,window.innerHeight)
labelRenderer.domElement.style.position = "fixed"
labelRenderer.domElement.style.top='0px'
labelRenderer.domElement.style.left='0px'
document.body.appendChild(labelRenderer.domElement)
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

// // 将渲染器添加到body
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, labelRenderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
controls.autoRotate = true;

const clock = new THREE.Clock();
function animate(t) {
  const elapsedTime = clock.getElapsedTime();
  // console.log(Math.sin(elapsedTime)*5,Math.cos(elapsedTime)*5);
  moon.position.set(Math.sin(elapsedTime)*5,0,Math.cos(elapsedTime)*5)
  labelRenderer.render(scene,camera)
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();
