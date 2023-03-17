import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

// 目标：AO环境遮挡
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 10);

// 把相机添加入场景
scene.add(camera)

// 添加物体
// 创建几何体
// 导入纹理
const textrueLoader = new THREE.TextureLoader()
const doorColorTextrue =  textrueLoader.load('./textures/door/color.jpg')
const doorAplhaTextrue =  textrueLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTextrue =  textrueLoader.load('./textures/door/ambientOcclusion.jpg')
// 导入置换贴图
const doorHeightTextrue =  textrueLoader.load('./textures/door/height.jpg')
// 金属贴图

const doorRoughnessTextrue =  textrueLoader.load('./textures/door/roughness.jpg')
const doorMetalnessTextrue =  textrueLoader.load('./textures/door/metalness.jpg')
const doorNormalTextrue =  textrueLoader.load('./textures/door/normal.jpg')
const cubeGeometry = new THREE.BoxGeometry(1,1,1,50,50,50)
const Material = new THREE.MeshStandardMaterial({
  color:"#ffff00",
  map:doorColorTextrue,
  alphaMap:doorAplhaTextrue,
  transparent:true,
  aoMap:doorAmbientOcclusionTextrue,
  displacementMap:doorHeightTextrue,
  aoMapIntensity:0.5,
  displacementScale:0.05,
  roughnessMap:doorRoughnessTextrue,
  roughness:1,
  metalnessMap:doorMetalnessTextrue,
    metalness:0.5,
  normalMap:doorNormalTextrue,
  // normalScale:1,

});
cubeGeometry.setAttribute('uv2',new THREE.BufferAttribute(cubeGeometry.attributes.uv.array,2))
const cube = new THREE.Mesh(cubeGeometry,Material)
// 添加物体
scene.add(cube)
const planeGeometry = new THREE.PlaneGeometry(1,1,20,20);
const plane = new THREE.Mesh(planeGeometry,Material);
plane.position.set(1,0,0);
scene.add(plane);
planeGeometry.setAttribute('uv2',new THREE.BufferAttribute(planeGeometry.attributes.uv.array,2))

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

