import * as THREE from 'three'
import {  OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// console.log(THREE);

// 目标：创建控制器查看3d物体

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
//把几何体添加入场景
scene.add(cube)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth,window.innerHeight)
// 将webgl渲染的canvas内容添加到body上

document.body.appendChild(renderer.domElement)

// 创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement);

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene,camera)
}
animate()