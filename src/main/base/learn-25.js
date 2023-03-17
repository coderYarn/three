import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import dat from 'dat.gui'

// 目标：设置聚光灯
// 灯光阴影
const clock = new THREE.Clock()
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const gui =new dat.GUI()
// 设置相机位置
camera.position.set(0, 0, 10);

// 把相机添加入场景
scene.add(camera)

const sphereGeometry = new THREE.SphereGeometry(1,20,20)
const material = new THREE.MeshStandardMaterial()

const sphere = new THREE.Mesh(sphereGeometry,material)
sphere.castShadow = true
scene.add(sphere);

const planeGeometry = new THREE.PlaneGeometry(50,50)
const plane = new THREE.Mesh(planeGeometry,material)
plane.position.set(0,-1,0)
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane)

// 灯光
const light = new THREE.AmbientLight(0xffffff,0.5)
scene.add(light);

const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1,20,20),
  new THREE.MeshBasicMaterial({
    color:0xff0000
  })
)
smallBall.position.set(2,2,2)

const pointLight = new THREE.PointLight(0xff0000,1)
// pointLight.position.set(2,2,2);
pointLight.castShadow = true;

pointLight.shadow.radius = 20;
pointLight.shadow.mapSize.set(2048,2048);
pointLight.target = sphere;
pointLight.angle = Math.PI/6;
pointLight.distance = 0;
pointLight.penumbra = 0;
pointLight.decay = 0;
// 设置透视相机的属性
gui.add(pointLight.position,'x').min(-5).max(5).step(0.1)
gui.add(pointLight,"distance").min(0).max(5).step(0.1)
gui.add(pointLight,"decay").min(0).max(5).step(0.1)
// scene.add(pointLight);
scene.add(smallBall)
smallBall.add(pointLight)
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 将webgl渲染的canvas内容添加到body上
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)
function animate() {
  let time = clock.getElapsedTime();

  smallBall.position.x = Math.sin(time)*3;
  smallBall.position.z = Math.cos(time)*3;
  smallBall.position.y = 2+Math.sin(time)*2;
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate()
// 窗口变化,更新渲染页面
window.addEventListener("resize",(e)=>{
  // 更新摄像头
  camera.aspect = window.innerWidth/window.innerHeight;
  // 更新摄像头的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth,window.innerHeight)
  // 设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
})

