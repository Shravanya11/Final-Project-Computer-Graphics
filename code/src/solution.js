import * as THREE from 'three';

let renderer, scene, camera, katamariBall;

window.init = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  scene.add(directionalLight);
  const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
  scene.add(helper);

  // Create the ground
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const texture = new THREE.TextureLoader().load('./assets/rocks.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(50, 50);
  const groundMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotateX(-Math.PI / 2);
  scene.add(ground);

  // Create the Katamari ball
  const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
  const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  katamariBall = new THREE.Mesh(ballGeometry, ballMaterial);
  katamariBall.position.set(0, 1, 0); // Set initial position of the ball
  scene.add(katamariBall);

  console.log('made a scene');
};

let speed = { x: 0, z: 0 };

window.loop = () => {
  // Move the Katamari ball
  katamariBall.position.x += speed.x;
  katamariBall.position.z += speed.z;

  renderer.render(scene, camera);
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      speed.z = -0.1; // Move ball forward
      break;
    case 'ArrowDown':
      speed.z = 0.1; // Move ball backward
      break;
    case 'ArrowLeft':
      speed.x = -0.1; // Move ball left
      break;
    case 'ArrowRight':
      speed.x = 0.1; // Move ball right
      break;
  }
}

function onKeyUp(event) {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      speed.z = 0; // Stop movement on Z-axis
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
      speed.x = 0; // Stop movement on X-axis
      break;
  }
}
