import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

// 目标：控制器阻尼
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
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00
})
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// 修改物体的位置
// cube.position.set(5,0,0)
// cube.position.x = 3;
// 把几何体添加入场景
// cube.scale.set(3,2,1)
// cube.scale.x=5
cube.rotation.set(Math.PI / 4, 0, 0)
scene.add(cube)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body上

document.body.appendChild(renderer.domElement)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环中调动controls.update()。
controls.enableDamping = true;

// 创建坐标轴服务器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

// 设置时钟
const clock = new THREE.Clock();

// 设置动画
const animate1 =  gsap.to(cube.position, {
  x: 5,
  ease:"power1.inOut",
  duration: 5,
  repeat:-1,//设置重复的次数，无线循环-1
  yoyo:true, // 往返运动
  delay:2,//延迟运动
  onComplete:()=>{
    console.log("动画完成");
  },
  onStart:()=>{
    console.log("动画开始");
  }
})
gsap.to(cube.rotation, {
  x: Math.PI * 2,
  ease:"power1.inOut",
  duration: 5,
  repeat:-1,
})
window.addEventListener("dblclick",()=>{
  console.log(animate1);
  if(animate1.isActive()){
    animate1.pause();
  }else{
    animate1.resume();
  }
})
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