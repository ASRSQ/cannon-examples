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
scene.add(ballMesh);

// Configuração do plano
const planeGeometry = new THREE.BoxGeometry(10, 10, 0.1);  // Ajuste a altura conforme desejado
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// Configuração do mundo físico
const world = new CANNON.World();
world.gravity.set(0, -10, 0); // Configuração da gravidade

// Criação dos corpos físicos
const ballBody = new CANNON.Body({
    shape: new CANNON.Sphere(1),
    mass: 1,
});
ballBody.position.set(0, 10, 0);

const planeBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC,
});
planeBody.position.set(0, 0, 0);
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

// Adição dos corpos físicos ao mundo físico
world.addBody(ballBody);
world.addBody(planeBody);

// Adiciona um listener de clique na tela
window.addEventListener('click', onSceneClick, false);

// Função chamada quando ocorre um clique na tela
function onSceneClick(event) {
    // Verifica se a posição do clique está na esfera
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Converte as coordenadas do clique para um valor entre -1 e 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Atualiza o raio com base na posição do clique
    raycaster.setFromCamera(mouse, camera);

    // Verifica se o raio atinge a esfera
    const intersects = raycaster.intersectObject(ballMesh);

    if (intersects.length > 0) {
        // Se a esfera foi clicada, adicione a força superior
        addTopForce(ballBody, 1, 500); // Ajuste a força conforme necessário
    }
}

// Função para adicionar uma força superior a uma esfera
function addTopForce(body, radius, strength) {
    // O topo da esfera, relativo ao centro da esfera
    const topPoint = new CANNON.Vec3(0, radius, 0);
    const force = new CANNON.Vec3(-strength, 0, 0);

    // Aplica a força
    body.applyForce(force, topPoint);
}

// Função de animação
function animate() {
    requestAnimationFrame(animate);

    // Atualiza a posição da bola em Three.js com base na posição do corpo em Cannon.js
    ballMesh.position.copy(ballBody.position);
    ballMesh.quaternion.copy(ballBody.quaternion);
    planeMesh.position.copy(planeBody.position);
    planeMesh.quaternion.copy(planeBody.quaternion);

    controls.update();

    // Renderiza a cena
    renderer.render(scene, camera);

    // Atualiza o mundo físico
    world.step(1 / 60);
}

// Inicia a animação
animate();
