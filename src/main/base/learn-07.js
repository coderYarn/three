import * as THREE from 'three'
import {  OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


// 目标：Clock对象用于跟踪事件
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

// 设置相机位置
camera.position.set(0,0,10);

// 把相机添加入场景
scene.add(camera)

// 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1,1,1)
// 创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({color:0xffff00})
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
// 修改物体的位置
// cube.position.set(5,0,0)
cube.position.x = 3;
// 把几何体添加入场景
// cube.scale.set(3,2,1)
// cube.scale.x=5
cube.rotation.set(Math.PI/4,0,0)
scene.add(cube)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth,window.innerHeight)
// 将webgl渲染的canvas内容添加到body上

document.body.appendChild(renderer.domElement)

// 创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement);
// 创建坐标轴服务器
const axesHelper = new THREE.AxesHelper( 5 );
scene.add(axesHelper)

//设置时钟
const clock = new THREE.Clock();
function animate(){
  // 获取事件运行的总时长
  let time = clock.getElapsedTime();
  // console.log(time);
  // let deltaTime = clock.getDelta();
  // console.log(deltaTime);
  // console.log(time,deltaTime);
  let t = time / 1000 % 5;
  console.log(t);
  cube.position.x = t * 1;
  // if(cube.position.x>5){
  //   cube.position.x = 0;
  // }
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}
animate()