import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Configuração da cena
const scene = new THREE.Scene();

// Adiciona eixos XYZ para facilitar a visualização
const axes = new THREE.AxesHelper(100);
scene.add(axes);

// Configuração da câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);
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

// Configuração da bola
const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
ballMesh.position.set(0,10,0)
scene.add(ballMesh);

// Configuração do plano
const planeGeometry = new THREE.BoxGeometry(10, 0.1, 10);  // Ajuste a altura conforme desejado
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);




// Função de animação
function animate() {
    requestAnimationFrame(animate);
  

    controls.update();
  
    // Renderiza a cena
    renderer.render(scene, camera);

    
}

// Inicia a animação
animate();