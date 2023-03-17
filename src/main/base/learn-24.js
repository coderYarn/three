import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import dat from 'dat.gui'
// 目标：设置聚光灯
// 灯光阴影

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

const spotLight = new THREE.SpotLight(0xffffff,1)
spotLight.position.set(5,5,5);
spotLight.castShadow = true;

spotLight.shadow.radius = 20;
spotLight.shadow.mapSize.set(2048,2048);
spotLight.target = sphere;
spotLight.angle = Math.PI/6;
spotLight.distance = 0;
spotLight.penumbra = 0;
spotLight.decay = 0;
// 设置透视相机的属性
gui.add(sphere.position,'x').min(-5).max(5).step(0.1)
gui.add(spotLight,"angle").min(0).max(Math.PI/2).step(0.01)
gui.add(spotLight,"distance").min(0).max(50).step(0.1)
gui.add(spotLight,"penumbra").min(0).max(1).step(0.01)
gui.add(spotLight,"decay").min(0).max(5).step(0.1)
scene.add(spotLight);
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

