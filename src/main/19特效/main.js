import * as THREE from "three";
import * as dat from "dat.gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import {
  EffectComposer,
  EffectComposer,
} from "three/examples/jsm/postprocessing/EffectComposer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
// import deepVertexShader from "./15flylight/deep/vertex.glsl";
// import deepFragmentShader from "./15flylight/deep/fragment.glsl";

// 目标：后期处理

// 初始化场景
const scene = new THREE.Scene();
const gui = new dat.GUI();
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
const loader = new GLTFLoader();
loader.load("models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
  const mesh = gltf.scene.children[0];
  scene.add(mesh);
});

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
// scene.add(plane);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.shadowMap.type = THREE.VSMShadowMap;

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 合成效果
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(window.innerWidth, window.innerHeight);

// 添加渲染通道
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// 添加点效果
const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const smaaPass = new SMAAPass();
effectComposer.addPass(smaaPass);
// 发光效果
const unrealBloomPass = new UnrealBloomPass();
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
effectComposer.addPass(unrealBloomPass);

// 屏幕闪动
// const glitchPass = new GlitchPass();
// effectComposer.addPass(glitchPass)
unrealBloomPass.exposure = 1;
unrealBloomPass.strength = 1;
unrealBloomPass.radius = 0;
unrealBloomPass.threshold = 1;
gui.add(renderer,'toneMappingExposure').min(0).max(1.0).step(0.01)
gui.add(unrealBloomPass,'strength').min(0).max(1.0).step(0.01)
gui.add(unrealBloomPass,'radius').min(0).max(1.0).step(0.01)
gui.add(unrealBloomPass,'threshold').min(0).max(1.0).step(0.01)
// const colorParmams = {
//   r:0,
//   g:0,
//   b:0.1
// }
// const shaderPass = new ShaderPass({
//   uniforms:{
//     tDiffuse:{
//       value:""
//     },
//     uColor:{
//       value:new THREE.Color(colorParmams.r,colorParmams.g,colorParmams.b)
//     }
//   },
//   vertexShader:`
//   varying vec2 vUv;
//   void main(){
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
//   }
//   `,
//   fragmentShader:`
//   uniform sampler2D tDiffuse;
//   varying vec2 vUv;
//   uniform vec3 uColor;
//   void main(){
//     vec4 color = texture2D(tDiffuse,vUv);
//     color.xyz += uColor;
//     gl_FragColor = color;
//   }
//   `
// })
// gui.add(colorParmams,'r').min(0).max(1).step(0.01).onChange((value)=>{
//   shaderPass.uniforms.uColor.value.r = value;
// })
// gui.add(colorParmams,'g').min(0).max(1).step(0.01).onChange((value)=>{
//   shaderPass.uniforms.uColor.value.g = value;
// })
// gui.add(colorParmams,'b').min(0).max(1).step(0.01).onChange((value)=>{
//   shaderPass.uniforms.uColor.value.b = value;
// })
// effectComposer.addPass(shaderPass)
const normalTexture = textureLoader.load("./textures/interfaceNormalMap.png")
const techPass = new ShaderPass({
  uniforms :{
    uNormalMap:{
      value :null
    },
    tDiffuse:{
      value:null,
    },
    uTime:{
      value:0
    }
  },
  vertexShader:`
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `,
  fragmentShader:`
  uniform sampler2D tDiffuse;
  uniform sampler2D uNormalMap;
  uniform float uTime;
  varying vec2 vUv;
  uniform vec3 uColor;
  void main(){
    vec2 newUv = vUv;
    newUv+=sin((newUv.x+uTime)*5.0)*0.03;
    vec4 color = texture2D(tDiffuse,newUv);
    vec4 normalColor = texture2D(uNormalMap,vUv);
    // 设置光线射入的角度
    vec3 lightDirection = normalize(vec3(-5,5,0));
    float lightness = clamp(dot(normalColor.xyz,lightDirection),0.0,1.0);
    color.xyz += lightness;
    gl_FragColor = color;
  }
  `
})
techPass.material.uniforms.uNormalMap.value = normalTexture;
effectComposer.addPass(techPass)
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
  techPass.material.uniforms.uTime.value = elapsedTime;
  //   console.log(elapsedTime);
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  // renderer.render(scene, camera);
  effectComposer.render();
}

animate();
