import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
// 目标：gui调试掌握
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

cube.rotation.set(Math.PI / 4, 0, 0);
scene.add(cube);
//创建gui
const gui = new dat.GUI();
gui.add(cube.position,"x").min(0).max(5).step(0.1).name('移动x轴坐标').onChange((value)=>{
  console.log("value被修改了：",value);
}).onFinishChange((value)=>{
  console.log("完全停下来了：",value);
});
// 修改物体的颜色
const params = {
  color:"#ffff00",
  fn:()=>{
    gsap.to(cube.position,{x:5,duration:2,yoyo:true,repeat:-1})
  }
}
gui.addColor(params,'color').onChange((value)=>{
  console.log("value被修改了：",value);
  cube.material.color.set(value)
}).onFinishChange((value)=>{
  console.log("完全停下来了：",value);
});
gui.add(cube,"visible").name('显示');
// 设置按钮点击触发某个事件
gui.add(params,'fn').name('立方体运动')
const folder = gui.addFolder("设置立方体")
folder.add(cube.material,'wireframe').name("线框")
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



window.addEventListener("dblclick",()=>{
  const fullScreenElement = document.fullscreenElement;
  if(!fullScreenElement){
    renderer.domElement.requestFullscreen();
  }else{
    document.exitFullscreen();
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

