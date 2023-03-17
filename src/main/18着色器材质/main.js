import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
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
camera.position.set(0, 0, 10);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "textures/environmentMaps/0/px.jpg",
  "textures/environmentMaps/0/nx.jpg",
  "textures/environmentMaps/0/py.jpg",
  "textures/environmentMaps/0/ny.jpg",
  "textures/environmentMaps/0/pz.jpg",
  "textures/environmentMaps/0/nz.jpg",
]);

scene.environment = envMapTexture;
scene.background = envMapTexture;
// 设置灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.position.set(0, 0, 200);
scene.add(directionalLight);
const textureLoader = new THREE.TextureLoader();
const modelTexture =textureLoader.load("/models/LeePerrySmith/color.jpg")
const normalTexture =textureLoader.load("/models/LeePerrySmith/normal.jpg")
const material = new THREE.MeshStandardMaterial({
  map:modelTexture,
  normalMap:normalTexture
})
const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking:THREE.RGBADepthPacking
})
depthMaterial.onBeforeCompile = (shader,render)=>{
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
    }
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    float angle = transformed.y*0.5;
    mat2 rotateMatrix = rotate2d(angle);
    transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}
const loader = new GLTFLoader()
loader.load("models/LeePerrySmith/LeePerrySmith.glb",(gltf)=>{
  // console.log(gltf);
  // scene.add(gltf.scene)
  const mesh = gltf.scene.children[0];
  mesh.material = material;
  mesh.castShadow = true;
  // 设置自定义的深度材质
  mesh.customDepthMaterial = depthMaterial
  scene.add(mesh)
})
material.onBeforeCompile=(shader,render)=>{
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
    }
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    "#include <beginnormal_vertex>",
    `
    #include <beginnormal_vertex>
    float angle = position.y*0.5;
    mat2 rotateMatrix = rotate2d(angle);
    objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    // float angle = transformed.y*0.5;
    // mat2 rotateMatrix = rotate2d(angle);
    transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}
// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial()
);
plane.position.set(0, 0, -6);
plane.receiveShadow = true;
// plane.rotation.x = -Math.PI/2;
scene.add(plane);

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

  //   console.log(elapsedTime);
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();
