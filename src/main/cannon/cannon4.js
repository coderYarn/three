import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
// 导入connon引擎
import * as CANNON from "cannon-es";

// 目标：设置cube跟着旋转
console.log(CANNON);

// const gui = new dat.GUI();
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

// 设置相机位置
camera.position.set(0, 0, 18);
scene.add(camera);
const cubeWordMaterial = new CANNON.Material("cube");

const cubeArr = []
function createCube() {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial();
  const cube = new THREE.Mesh(cubeGeometry, material);
  cube.castShadow = true;
  scene.add(cube);
  // 创建物理小球
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  // 设置物体材质


  // 创建物理世界的物体
  const cubeBody = new CANNON.Body({
    shape: cubeShape,
    position: new CANNON.Vec3(0, 0, 0),
    // 小球质量
    mass: 1,
    material: cubeWordMaterial,
  });
  cubeBody.applyLocalForce(
    new CANNON.Vec3(0,0,180),
    new CANNON.Vec3(0,0,0)
  )
  world.addBody(cubeBody);
  cubeBody.addEventListener("collide", HitEvent);
  // 创建击打声音
  const hitSound = new Audio("./audio.mp3");

  // 添加监听碰撞事件

  function HitEvent(e) {
    const imapctStrength = e.contact.getImpactVelocityAlongNormal();
    console.log(imapctStrength);
    if (imapctStrength > 2) {
      hitSound.currentTime = 0;
      hitSound.volume = imapctStrength /10>=1?1:imapctStrength /10;
      hitSound.play();
    }
  }
  cubeArr.push({
    mesh:cube,
    body:cubeBody
  })
}

const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial()
);

floor.position.set(0, -5, 0);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// 创建物理世界
// const world = new CANNON.World({gravity:9.8});
const world = new CANNON.World();
world.gravity.set(0, -9.8, 0);
window.addEventListener("click",()=>{
  createCube()
})
const floorShape = new CANNON.Plane(20, 20);

const floorBody = new CANNON.Body();
const floorBodyMaterial = new CANNON.Material("floor");
floorBody.mass = 0;
floorBody.material = floorBodyMaterial;
// 设置两种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(
  cubeWordMaterial,
  floorBodyMaterial,
  {
    friction: 0.1, //摩擦力
    restitution: 0.7, //弹性
  }
);

// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial);

// 设置世界碰撞的默认材料，如果材料没有设置，都用这个
world.defaultContactMaterial = defaultContactMaterial;

floorBody.addShape(floorShape);
floorBody.position.set(0, -5, 0);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

world.addBody(floorBody);
// 添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.castShadow = true;
scene.add(dirLight);

// 初始化渲染器
// 渲染器透明
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;

// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();
function render() {
  let deltaTime = clock.getDelta();
  // 更新物理引擎世界的物体
  world.step(1 / 60, deltaTime);
  // cube.position.copy(cubeBody.position);
  cubeArr.forEach(item=>{
    item.mesh.position.copy(item.body.position);
    item.mesh.quaternion.copy(item.body.quaternion);
  })
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");

  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
