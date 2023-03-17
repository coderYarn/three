import * as THREE from "three";
import { Points } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 目标：设置点
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10
);

// 设置相机位置
camera.position.set(0, 0, 40);

// 把相机添加入场景
scene.add(camera);

function createPoints(url, size = 0.5) {
  const particleMaterial = new THREE.BufferGeometry();
  const count = 5000;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }
  particleMaterial.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particleMaterial.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({ color: 0x888888 });

  // 载入纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./textures/particles/" + url + ".png");
  material.map = texture;
  material.alphaMap = texture;
  material.size = 0.1;
  material.color.set(0xfff000);
  material.depthWrite = false;
  material.vertexColors = true;
  // 相机深度而衰减
  material.sizeAttenuation = true;
  material.blending = THREE.AdditiveBlending;
  const points = new Points(particleMaterial, material);
  return points;
}
const points = createPoints("xh");
const points2 = createPoints("xh",1);
const points3 = createPoints("5",1);
scene.add(points);
scene.add(points2)
scene.add(points3)

// 灯光
const light = new THREE.DirectionalLight(0xffffff);
scene.add(light);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 将webgl渲染的canvas内容添加到body上
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();
function animate() {
  let time = clock.getElapsedTime();
  points2.rotation.x = time * 0.3;
  points2.rotation.y = time * 0.5;
  points.rotation.x = time * 0.4;
  points3.rotation.x = time * 0.2;
  points3.rotation.y = time * 0.1;
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// 窗口变化,更新渲染页面
window.addEventListener("resize", () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像头的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});
