import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


// Inicializa a cena global
const scene = new THREE.Scene();

// Configuração do renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adiciona eixos XYZ para facilitar a visualização
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Armazena a posição inicial da bola
const initialBallPosition = new THREE.Vector3(0, 0, 0);
let initialMass = 1;

// Função para reiniciar a cena com nova gravidade
function restartScene() {
   // Limpa a cena atual
   scene.children.length = 0;
   scene.add(axesHelper);

   // Configuração da câmera
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.set(10, 10, 10);
   camera.lookAt(0, 0, 0);

   // Adiciona controles de órbita para mover a câmera
   const controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
   controls.dampingFactor = 0.25;
   controls.enableZoom = true;

   // Configuração do mundo físico
   const world = new CANNON.World();
   world.gravity.set(0, 0, 0); // Configuração inicial da gravidade

   // Configuração da bola em Three.js
   const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
   const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
   const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
   scene.add(ballMesh);

   // Configuração do corpo da bola em Cannon.js
   const ballShape = new CANNON.Sphere(1);
   const ballBody = new CANNON.Body({
       mass: initialMass,
       shape: ballShape,
       material: new CANNON.Material(),
   });
   ballBody.position.copy(initialBallPosition);

   world.addBody(ballBody);
    // Configuração da bola em Three.js
    const ball2Geometry = new THREE.SphereGeometry(1, 32, 32);
    const ball2Material = new THREE.MeshBasicMaterial({ color: "blue" });
    const ball2Mesh = new THREE.Mesh(ball2Geometry, ball2Material);
 
    // Configuração do corpo da bola em Cannon.js
    const ball2Shape = new CANNON.Sphere(1);
    const ball2Body = new CANNON.Body({
        mass: initialMass,
        shape: ballShape,
        material: new CANNON.Material(),
    });
    ball2Body.position.set(0, 10, 0)
 



   // Função para ajustar a gravidade
   function addBall(){
    
    scene.add(ball2Mesh);
    world.addBody(ball2Body);


   }

   function setGravity() {
    console.log(`Applying gravity with values: x = ${gravity.x}, y = ${gravity.y}, z = ${gravity.z}`);
    const gravityX = parseFloat(gravity.x) || 0;
    const gravityY = parseFloat(gravity.y) || 0;
    const gravityZ = parseFloat(gravity.z) || 0;

       // Configura a nova gravidade no mundo físico
       world.gravity.set(gravityX, gravityY, gravityZ);

       // Reseta a posição da bola para a posição inicial
       ballBody.position.copy(initialBallPosition);
       console.log(ballBody.mass)
       ballBody.velocity.set(0, 0, 0); // Reseta a velocidade
   }

   // Função para aplicar a massa escolhida
   function applyMass() {
    const massValue = parseFloat(massControl.getValue()) || 0; // Use o controle da GUI
    console.log(mass);

    // Atualiza a massa inicial
    initialMass = massValue;

    // Reseta a posição da bola para a posição inicial
    ballBody.position.copy(initialBallPosition);

    // Atualiza a massa no corpo da bola em Cannon.js
    ballBody.mass = massValue;

    // Reseta a velocidade
    ballBody.velocity.set(0, 0, 0);

    // Atualiza a gravidade no mundo físico
    const gravityX = parseFloat(gravity.x) || 0;
    const gravityY = parseFloat(gravity.y) || 0;
    const gravityZ = parseFloat(gravity.z) || 0;
    world.gravity.set(gravityX, gravityY, gravityZ);
}
function applyVelocity() {
    // Obtém os valores dos controles na GUI
    const velocityX = parseFloat(velocity.x) || 0;
    const velocityY = parseFloat(velocity.y) || 0;
    const velocityZ = parseFloat(velocity.z) || 0;

    console.log(velocityX, velocityY, velocityZ);

    // Atualiza a velocidade no corpo da bola em Cannon.js
    ballBody.velocity.set(velocityX, velocityY, velocityZ);
}
   // Configuração do GUI
   const gui = new dat.GUI({ name: 'My GUI' });

   // Gravity Folder
   const gravityFolder = gui.addFolder('Gravity');
   const gravity = { x: 0, y: 0, z: 0 };
   gravityFolder.add(gravity, 'x', -10, 10).name('gravityX');
   gravityFolder.add(gravity, 'y', -10, 10).name('gravityY');
   gravityFolder.add(gravity, 'z', -10, 10).name('gravityZ');
   // Adiciona o botão para chamar a função setGravity
    gravityFolder.add({ setGravity: setGravity }, 'setGravity');
  
   
    // Mass Folder
    const massFolder = gui.addFolder('Mass');
    const mass = { value: initialMass };
    const massControl = massFolder.add(mass, 'value', 0, 10).name('Mass');
    massFolder.add({ applyMass: applyMass }, 'applyMass');
  
   
   // Velocity Folder
const velocityFolder = gui.addFolder('Velocity');
const velocity = { x: 0, y: 0, z: 0 };

// Adiciona controles para os componentes X, Y e Z da velocidade
velocityFolder.add(velocity, 'x', -10, 10).name('velocityX');
velocityFolder.add(velocity, 'y', -10, 10).name('velocityY');
velocityFolder.add(velocity, 'z', -10, 10).name('velocityZ');
velocityFolder.add({ applyVelocity: applyVelocity }, 'applyVelocity');
// Crie uma pasta chamada "Objetos"
const objetosFolder = gui.addFolder('Objetos');

// Adicione um botão na pasta "Objetos" para chamar a função addBall
objetosFolder.add({ addBall: addBall }, 'addBall').name('Adicionar Bola');


    // Função de animação
    function animate() {
        requestAnimationFrame(animate);

        // Atualiza a posição da bola em Three.js com base na posição do corpo em Cannon.js
        ballMesh.position.copy(ballBody.position);
        ball2Mesh.position.copy(ball2Body.position);
        // Atualiza o mundo físico em Cannon.js
        world.step(1 / 60);

        // Atualiza os controles de câmera
        controls.update();

        // Renderiza a cena
        renderer.render(scene, camera);
    }

    // Inicia a animação
    animate();
}

// Chama a função para iniciar a cena
restartScene();
