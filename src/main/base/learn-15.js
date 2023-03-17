import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

// 目标：材质和纹理常用属性
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
const doorColorTextrue =  textrueLoader.load('./textures/door/color.png')
// 设置纹理编译
// doorColorTextrue.offset.x = 0.5;
// doorColorTextrue.offset.y = 0.5;
// doorColorTextrue.offset.set(0.5,0.5)
// 纹理旋转
// 设置旋转的远点
// doorColorTextrue.center.set(0.5,0.5)
// 旋转45°
// doorColorTextrue.rotation = Math.PI/4;
// 设置纹理的重复
doorColorTextrue.wrapS = THREE.RepeatWrapping
doorColorTextrue.wrapT = THREE.RepeatWrapping
doorColorTextrue.repeat.set(2,3)
const cubeGeometry = new THREE.BoxGeometry(1,1,1)
const basicMaterial = new THREE.MeshBasicMaterial({
  color:"#ffff00",
  map:doorColorTextrue
});

const cube = new THREE.Mesh(cubeGeometry,basicMaterial)
// 添加物体
scene.add(cube)

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

