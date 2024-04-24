import * as THREE from 'three';

let renderer, scene, camera, katamariBall, objects = [];
let speed = { x: 0, z: 0 };
const rotationSpeed = 0.1;

window.init = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 90, 100);
  //camera.lookAt(0, 0, 0);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  scene.add(directionalLight);
  const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
  //scene.add(helper);

  // Create the ground
  const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
  const texture = new THREE.TextureLoader().load('./assets/backgound.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  const groundMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotateX(-Math.PI / 2);
  scene.add(ground);

  // Create objects on the ground
  const objectGeometry = new THREE.BoxGeometry(15, 15, 15);
  const texture2 = new THREE.TextureLoader().load('./assets/rocks.jpg');
  const objectMaterial = new THREE.MeshBasicMaterial({ map:texture2 });
  for (let i = 0; i < 50; i++) {
    const object = new THREE.Mesh(objectGeometry, objectMaterial);
    const posX =2* Math.random() * (500 - 20*2)-500+20;
    const posZ = 2* Math.random() * (500 - 20*2)-500+20;
    object.position.set(posX, 15/2, posZ);
    scene.add(object);
    objects.push(object);
  }

  // Create the Katamari ball
  const ballGeometry = new THREE.SphereGeometry(20, 32, 32);
  const texture1 = new THREE.TextureLoader().load('./assets/soccer ball.png');
  const ballMaterial = new THREE.MeshBasicMaterial({ map: texture1 });
  katamariBall = new THREE.Mesh(ballGeometry, ballMaterial);
  katamariBall.position.set(0, 20, 0); // Set initial position of the ball
  scene.add(katamariBall);
  camera.position.set(0,70,100);
  camera.lookAt(katamariBall.position);

};

window.loop = () => {

  if(objects.length<40){
    console.log('game over');
    return;
  }

  // Move the Katamari ball
  katamariBall.position.x += speed.x;
  katamariBall.position.z += speed.z;

  // Calculate rotation angle based on movement direction
  const rotationAngle = Math.atan2(speed.z, speed.x);

  // Apply rotation to the ball
  katamariBall.rotation.y = rotationAngle;

  // Check for collision with objects
  objects.forEach(object => {
    if (katamariBall.position.distanceTo(object.position) < 30) {
      scene.remove(object); // Remove object from scene
      objects = objects.filter(obj => obj !== object); // Remove object from objects array
      // Optionally, increase the size of the Katamari ball
      katamariBall.scale.set(katamariBall.scale.x + 0.1, katamariBall.scale.y + 0.1, katamariBall.scale.z + 0.1);
    }
  });
  

  camera.position.x=katamariBall.position.x;
  camera.position.z=katamariBall.position.z+100;
  camera.lookAt(katamariBall.position);


  renderer.render(scene, camera);
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      speed.z = -0.8; // Move ball forward
      katamariBall.rotation.x-=0.3;
      break;
    case 'ArrowDown':
      speed.z = 0.8; // Move ball backward
      katamariBall.rotation.x+=0.3;
      break;
    case 'ArrowLeft':
      speed.x = -0.8; // Move ball left
      katamariBall.rotation.z+=0.3;
      break;
    case 'ArrowRight':
      speed.x = 0.8; // Move ball right
      katamariBall.rotation.z-=0.3;
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
