import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Configuração da cena
const scene = new THREE.Scene();

// Adiciona eixos XYZ para facilitar a visualização
const axes = new THREE.AxesHelper(5);
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

// Configuração do mundo físico
const world = new CANNON.World();
world.gravity.set(0, -10, 0); // Configuração da gravidade

// Criação dos corpos físicos
const ballBody = new CANNON.Body({
    shape: new CANNON.Sphere(1),
    mass: 1,
    restitution: 0.5, // Coeficiente de restituição
});
ballBody.position.set(0, 10, 0);

const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type:CANNON.Body.STATIC,
});
groundBody.position.set(0, 0, 0);

// Adição dos corpos físicos ao mundo físico
world.addBody(ballBody);
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI/2,0,0)
// Configuração da bola em Three.js
const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
ballMesh.position.copy(ballBody.position);
// Configuração do plano
const planeGeometry = new THREE.BoxGeometry(10, 10, 0.1);  // Ajuste a altura conforme desejado
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// Adição da bola à cena
scene.add(ballMesh);

// Função de animação
function animate() {
    requestAnimationFrame(animate);

    // Atualiza a posição da bola em Three.js com base na posição do corpo em Cannon.js
    ballMesh.position.copy(ballBody.position);
    ballMesh.quaternion.copy(ballBody.quaternion);
    planeMesh.position.copy(groundBody.position);
    planeMesh.quaternion.copy(groundBody.quaternion);

    // Verifica se houve contato entre a bola e o plano
    const collision = world.collisions.find((c) => c.bodyA === ballBody && c.bodyB === groundBody);

    // Se houve contato, atualiza a posição e a rotação da bola de acordo com a deformação
    if (collision) {
        const vertices = ballBody.getDeformedVertices();
        ballMesh.geometry.vertices = vertices;
        ballMesh.rotation.setFromEuler(vertices.map((v) => Math.atan2(v.y, v.x)));
    }

    // Atualiza o mundo físico
    world.step(1 / 60);

    // Renderiza a cena
    renderer.render(scene, camera);
}
// Inicia a animação
animate();