import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import VertexShader from "./deep/vertex.glsl";
import FragmentShader from "./deep/fragment.glsl";

// 目标：认识shader

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
camera.position.set(0, 0, 2);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const params = {
  uWaresFrequency: 14,
  uScale: 0.03,
  uXzScale: 1.5,
  uNoiseFrequency: 10,
  uNoiseScale: 1.5,
  uTime:0,
  uLowColor:'#ff0000',
  uHightColor:'#ffff00',
  uXspeed:1,
  uZspeed:1,
  uNoiseSpeed:1,
  uOpacity:1
};

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: VertexShader,
  fragmentShader: FragmentShader,
  uniforms: {
    uWaresFrequency: {
      value: params.uWaresFrequency,
    },
    uScale: {
      value: params.uScale,
    },
    uXzScale:{
      value:params.uXzScale
    },
    uNoiseFrequency:{
      value:params.uNoiseFrequency
    },
    uNoiseScale:{
      value:params.uNoiseScale
    },
    uTime:{
      value:params.uTime
    },
    uLowColor:{
      value:new THREE.Color(params.uLowColor)
    },
    uHightColor:{
      value:new THREE.Color(params.uHightColor)
    },
    uXspeed:{
      value:params.uXspeed
    },
    uZspeed:{
      value:params.uZspeed
    },
    uNoiseSpeed:{
      value:params.uNoiseSpeed
    },
    uOpacity:{
      value:params.uOpacity
    }
  },
  side: THREE.DoubleSide,
  transparent: true,
});

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 1024, 1024),
  shaderMaterial
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);
// 动画
gui
  .add(params, "uWaresFrequency")
  .min(1)
  .max(100)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uWaresFrequency.value = value;
  });
gui
  .add(params, "uScale")
  .min(0.01)
  .max(5.0)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uScale.value = value;
  });

  gui
  .add(params, "uNoiseFrequency")
  .min(1)
  .max(100)
  .step(1)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseFrequency.value = value;
  });
  gui
  .add(params, "uNoiseScale")
  .min(0.1)
  .max(5)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseScale.value = value;
  });


  
  gui
  .add(params, "uXzScale")
  .min(0.01)
  .max(5)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uXzScale.value = value;
  });

  gui
  .add(params, "uZspeed")
  .min(0.01)
  .max(5)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uZspeed.value = value;
  });
  gui
  .add(params, "uNoiseSpeed")
  .min(0.01)
  .max(5)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseSpeed.value = value;
  });
  gui
  .add(params, "uOpacity")
  .min(0.01)
  .max(5)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uOpacity.value = value;
  });

  gui
  .addColor(params, "uLowColor").onFinishChange((value) => {
    shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value);
  });
  gui.addColor(params,'uHightColor').onFinishChange((value)=>{
    shaderMaterial.uniforms.uHightColor.value = new THREE.Color(value);
  })
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
  shaderMaterial.uniforms.uTime.value = elapsedTime;
  //   console.log(elapsedTime);
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();
