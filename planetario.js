import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Configuração da cena
const scene = new THREE.Scene();



// Configuração da câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 15, 15);
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

// Configuração do mundo físico
const world = new CANNON.World();
world.gravity.set(0, 0, 0);  // Desativa a gravidade padrão

// Criação dos corpos físicos
const planetShape = new CANNON.Sphere(3.5);
const planet = new CANNON.Body({ mass: 0 });
planet.addShape(planetShape);
planet.position.set(0, 0, 0);

const moonShape = new CANNON.Sphere(0.5);
const moon = new CANNON.Body({
  mass: 5,
  position: new CANNON.Vec3(-5, 0, 0),
});
moon.addShape(moonShape);
moon.velocity.set(0, 8, 0);
moon.linearDamping = 0.0;

// Adiciona os corpos físicos ao mundo físico
world.addBody(planet);
world.addBody(moon);

// Adiciona os corpos físicos à cena
const planetMesh = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
scene.add(planetMesh);

const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
scene.add(moonMesh);

// Adiciona um ouvinte para o evento preStep
world.addEventListener('preStep', () => {
  const moon_to_planet = new CANNON.Vec3();
  moon.position.negate(moon_to_planet);

  const distance = moon_to_planet.length();
  moon_to_planet.normalize();

  // Calcula a força gravitacional
  const gravitationalForce = 1500 / Math.pow(distance, 2);
  moon_to_planet.scale(gravitationalForce, moon.force);
});

// Função de animação
function animate() {
  requestAnimationFrame(animate);

  // Atualiza os corpos físicos
  world.step(1 / 60);

  // Atualiza a posição dos meshes
  planetMesh.position.copy(planet.position);
  moonMesh.position.copy(moon.position);

  // Renderiza a cena
  renderer.render(scene, camera);
}

// Inicia a animação
animate();
