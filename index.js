import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const loader = new GLTFLoader();
loader.load(
  'models/scene.gltf', // Modelinizi buraya yükleyin
  function (gltf) {
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.log('An error happened');
  }
);

// Lighting
const light = new THREE.AmbientLight(0xFFFfff); // soft white light
scene.add(light);

// Plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
scene.add(plane);

// Box
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 1, 0); // Position the box above the plane
scene.add(box);

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // m/s²

// Plane physics
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({
  mass: 0,
});
planeBody.addShape(planeShape);
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody);

// Box physics
const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
const boxBody = new CANNON.Body({
  mass: 1,
});
boxBody.addShape(boxShape);
boxBody.position.set(0, 1, 0);
world.addBody(boxBody);
// Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.update();

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update physics
  world.step(1 / 60);

  // Copy coordinates from Cannon.js to Three.js
  box.position.copy(boxBody.position);
  box.quaternion.copy(boxBody.quaternion);

  renderer.render(scene, camera);
}

animate();