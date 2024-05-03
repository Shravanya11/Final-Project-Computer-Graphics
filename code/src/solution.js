import * as THREE from 'three';

let renderer, scene, camera, katamariBall, objects = [];
let speed = { x: 0, z: 0 };
const rotationSpeed = 0.1;
let totalPoints = 0; // Variable to keep track of total points scored
let collectedObjects = 0; // Variable to keep track of collected objects

window.init = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 90, 100);

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
  const objectGeometry = new THREE.BoxGeometry(10 ,10, 10);
  const texture2 = new THREE.TextureLoader().load('./assets/image.jpg');
  const objectMaterial = new THREE.MeshBasicMaterial({ map: texture2 });
  for (let i = 0; i < 50; i++) {
    const object = new THREE.Mesh(objectGeometry, objectMaterial);
    const posX = 2 * Math.random() * (500 - 20 * 2) - 500 + 20;
    const posZ = 2 * Math.random() * (500 - 20 * 2) - 500 + 20;
    object.position.set(posX, 15 / 2, posZ);
    scene.add(object);
    objects.push(object);
  }

  // Add three more objects with different textures on the ground
  const textures = [
    './assets/cermaic.jpg',
    './assets/rocks.jpg',
    './assets/images.png'
  ];

  for (let i = 0; i < 3; i++) {
    const texture = new THREE.TextureLoader().load(textures[i]);
    const objectMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const object = new THREE.Mesh(objectGeometry, objectMaterial);
    const posX = 2 * Math.random() * (500 - 20 * 2) - 500 + 20;
    const posZ = 2 * Math.random() * (500 - 20 * 2) - 500 + 20;
    object.position.set(posX, 15 / 2, posZ);
    scene.add(object);
    objects.push(object);
  }

  // Create the Katamari ball
  const ballGeometry = new THREE.SphereGeometry(20, 32, 32);
  const texture3 = new THREE.TextureLoader().load('./assets/soccer ball.png');
  const ballMaterial = new THREE.MeshBasicMaterial({ map: texture3 });
  katamariBall = new THREE.Mesh(ballGeometry, ballMaterial);
  katamariBall.position.set(0, 20, 0); // Set initial position of the ball
  scene.add(katamariBall);
  camera.position.set(0, 70, 100);
  camera.lookAt(katamariBall.position);

  // Display total points scored at the top right of the screen
  const pointsMessage = document.createElement('div');
  pointsMessage.textContent = 'Total Points: ' + totalPoints;
  pointsMessage.style.position = 'absolute';
  pointsMessage.style.top = '10px';
  pointsMessage.style.right = '10px';
  pointsMessage.style.fontSize = '30px';
  pointsMessage.style.color = 'white';
  document.body.appendChild(pointsMessage);
};

window.loop = () => {
  if (collectedObjects >= 10) {
    // Display game-over message and total points scored
    const gameOverMessage = document.createElement('div');
    gameOverMessage.textContent = 'Game Over!!';
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.fontSize = '50px';
    gameOverMessage.style.color = 'Black';
    document.body.appendChild(gameOverMessage);

    // Hide total points message
    document.querySelector('div').style.display = 'none';

    return;
  }

  // Move the Katamari ball only when using the keyboard
  const nextPositionX = katamariBall.position.x + speed.x;
  const nextPositionZ = katamariBall.position.z + speed.z;

  // Check if the next position is within the boundaries of the ground
  const groundSize = 1000; // Assuming ground size is 1000x1000
  const halfGroundSize = groundSize / 2;
  const ballRadius = 20; // Assuming Katamari ball radius is 20
  if (
    nextPositionX - ballRadius >= -halfGroundSize &&
    nextPositionX + ballRadius <= halfGroundSize &&
    nextPositionZ - ballRadius >= -halfGroundSize &&
    nextPositionZ + ballRadius <= halfGroundSize
  ) {
    katamariBall.position.x = nextPositionX;
    katamariBall.position.z = nextPositionZ;
  }

  // Calculate rotation angle based on movement direction
  const rotationAngle = Math.atan2(speed.z, speed.x);

  // Apply rotation to the ball only when using the keyboard
  if (speed.x !== 0 || speed.z !== 0) {
    katamariBall.rotation.y = rotationAngle;
  }

  // Check for collision with objects
  objects.forEach(object => {
    if (katamariBall.position.distanceTo(object.position) < 30) {
      scene.remove(object); // Remove object from scene
      // Move the object to stick to the Katamari ball
      katamariBall.attach(object);
      // Optionally, increase the size of the Katamari ball
      katamariBall.scale.set(katamariBall.scale.x + 0.1, katamariBall.scale.y + 0.1, katamariBall.scale.z + 0.1);
      totalPoints += 10; // Increment total points when collecting an object
      collectedObjects++; // Increment collected objects count
      // Update total points message
      document.querySelector('div').textContent = 'Total Points: ' + totalPoints;
    }
  });

  camera.position.x = katamariBall.position.x;
  camera.position.z = katamariBall.position.z + 100;
  camera.lookAt(katamariBall.position);

  renderer.render(scene, camera);
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      speed.z = -0.9; // Move ball forward
      katamariBall.rotation.x -= 0.3;
      break;
    case 'ArrowDown':
      speed.z = 0.9; // Move ball backward
      katamariBall.rotation.x += 0.3;
      break;
    case 'ArrowLeft':
      speed.x = -0.9; // Move ball left
      katamariBall.rotation.z += 0.3;
      break;
    case 'ArrowRight':
      speed.x = 0.9; // Move ball right
      katamariBall.rotation.z -= 0.3;
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
