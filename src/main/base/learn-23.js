import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import {RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
// 目标：环境纹理
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 10);

// 把相机添加入场景
scene.add(camera)
// 设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  'textures/environmentMaps/1/px.jpg',
  'textures/environmentMaps/1/nx.jpg',
  'textures/environmentMaps/1/py.jpg',
  'textures/environmentMaps/1/ny.jpg',
  'textures/environmentMaps/1/pz.jpg',
  'textures/environmentMaps/1/nz.jpg',
])
// 加载HDR 环境
const rgbeLoader= new RGBELoader();
rgbeLoader.loadAsync('textures/hdr/002.hdr').then(texture=>{
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
})
const sphereGeometry = new THREE.SphereGeometry(1,20,20);
const material = new THREE.MeshStandardMaterial({
  metalness:0.7,
  roughness:0.1,
  // envMap:envMapTexture
});
const sphere = new THREE.Mesh(sphereGeometry,material)
scene.add(sphere)
// 给场景添加背景
// scene.background = envMapTexture;
// 给场景所有的物体添加默认贴图
// scene.environment = envMapTexture;
// 灯光
const light = new THREE.AmbientLight(0xffffff,0.5)
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff,0.5)
directionalLight.position.set(10,10,10);

scene.add(directionalLight);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
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

