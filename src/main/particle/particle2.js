import * as THREE from 'three'
import { Points } from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

// 目标：设置点
// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 10);

// 把相机添加入场景
scene.add(camera)

const geometry = new THREE.SphereGeometry( 3, 32, 16 );
const material = new THREE.PointsMaterial( { color: 0x888888 } );
material.size=0.1
const points = new Points(geometry,material)
scene.add(points);


// 灯光
const light = new THREE.DirectionalLight( 0xFFFFFF );
scene.add(light);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 将webgl渲染的canvas内容添加到body上
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement);

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

