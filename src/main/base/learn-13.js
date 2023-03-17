import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

// 目标：打造酷炫的三角形
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

for (let i = 0; i < 50; i++) {
  const Geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9);
  // 每一个三角形，需要三个顶点，每个顶点需要三个值
  for (let j = 0; j <9; j++) {
    positionArray[j] = Math.random()*5;
    
  }

  Geometry.setAttribute("position",new THREE.BufferAttribute(positionArray,3))
  let color = new THREE.Color(Math.random(),Math.random(),Math.random());
  const Material = new THREE.MeshBasicMaterial({color: color,transparent:true,opacity:0.5})
  const mesh = new THREE.Mesh(Geometry,Material)

  scene.add(mesh)
  
}


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

