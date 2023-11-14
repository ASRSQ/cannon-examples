import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Configuração da cena
const scene = new THREE.Scene();

// Configuração da câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// Configuração do renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adiciona controles de órbita para mover a câmera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Configuração da luz
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Configuração do mundo físico
const world = new CANNON.World();
world.gravity.set(0, -10, 0);

// Criação do cubo (box) em Three.js
const boxGeometry = new THREE.BoxGeometry(2,2,2);
const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

// Criação do cubo (box) em Cannon.js
const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
});
boxBody.position.set(0, 5, 0);
world.addBody(boxBody);
// Configuração do plano
const planeGeometry = new THREE.BoxGeometry(10,10,0.1);  // Ajuste a altura conforme desejado
const planeMaterial = new THREE.MeshBasicMaterial({ color: "gray" });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.1))
  })
  groundBody.position.set(0,0,0)
  
groundBody.quaternion.setFromEuler(-Math.PI/2,0,0)
  world.addBody(groundBody);
// Criação do cilindro (cylinder) em Three.js
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
scene.add(cylinderMesh);

// Criação do cilindro (cylinder) em Cannon.js
const cylinderBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Cylinder(1, 1, 2, 32),
});
cylinderBody.position.set(0, 10, 0); // Ajuste a posição conforme necessário
world.addBody(cylinderBody);

// Configuração da bola
const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);

scene.add(ballMesh);

// Criação dos corpos físicos
const ballBody = new CANNON.Body({
    shape: new CANNON.Sphere(1),
    mass: 1,
});
ballBody.position.set(0,12,0)
world.addBody(ballBody);
// Função de animação
function animate() {
    requestAnimationFrame(animate);

    // Atualiza a posição do cubo em Three.js com base na posição do corpo em Cannon.js
    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);
    planeMesh.position.copy(groundBody.position);
    planeMesh.quaternion.copy(groundBody.quaternion);
    cylinderMesh.position.copy(cylinderBody.position);
    cylinderMesh.quaternion.copy(cylinderBody.quaternion);
    ballMesh.position.copy(ballBody.position);
    ballMesh.quaternion.copy(ballBody.quaternion);
    controls.update();

    // Renderiza a cena
    renderer.render(scene, camera);

    // Atualiza o mundo físico
    world.step(1 / 60);
}

// Inicia a animação
animate();
