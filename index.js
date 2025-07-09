import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";
import {getFresnelMat}  from "./getFresnelMat.js";
//renderer, camera and scene

//window size
const w = window.innerWidth;
const h = window.innerHeight;

//renderer 
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

//creating a canvas element inside our HTML and attaching our renderer to it
document.body.appendChild(renderer.domElement);

const earthGroup= new THREE.Group();
earthGroup.rotation.z= -23.4 * Math.PI/180;

//field of view in degrees
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 500;

//camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

//setting z-index of the camera
camera.position.z = 2.5;

//scene
const scene = new THREE.Scene();

//defining orbit-controls
const controls= new OrbitControls(camera ,renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor= 0.03;

const geo = new THREE.IcosahedronGeometry(1.0, 12);

//basic mesh material (but doesn't interact with light) :-
//const mat = new THREE.MeshBasicMaterial({ color: 0xccff });

const loader= new THREE.TextureLoader();
//standard mesh material that interacts with light
const mat = new THREE.MeshStandardMaterial({
    map: loader.load("earthmap4k.jpg"),
});

const mesh = new THREE.Mesh(geo, mat);

const stars= getStarfield();
stars.position.z = -50;
scene.add(stars);
earthGroup.add(mesh);

const lightsMat= new THREE.MeshBasicMaterial({
   map: loader.load("earthlights4k.jpg"),
   blending: THREE.AdditiveBlending,
   transparent:true,
});

const lightMesh= new THREE.Mesh(geo, lightsMat);


const cloudMat= new THREE.MeshStandardMaterial({
    map: loader.load("earthclouds4k.jpg"),
   transparent:true,
   opacity:0.5,
    blending: THREE.AdditiveBlending,
});
const cloudMesh= new THREE.Mesh(geo, cloudMat);
cloudMesh.scale.setScalar(1.005);


const fresnelMat= getFresnelMat();

const glowMesh = new THREE.Mesh(geo, fresnelMat);

glowMesh.scale.setScalar(1.01);                  // Ensure it renders after others


earthGroup.add(cloudMesh);
earthGroup.add(lightMesh);
earthGroup.add(glowMesh);

scene.add(earthGroup);

//lighting
//above white below black
// const hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.5); // dimmer light
// scene.add(hemiLight);

//directional light
const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(-2, 0.5, 2);
scene.add(dirLight);


function animate(t = 0) {
    //calling an API for animations
    requestAnimationFrame(animate);

    //cool animation(in-out):- 
    //mesh.scale.setScalar(Math.cos(t * 0.001) + 1.0);

    //animating the mesh- rotation
    mesh.rotation.y += 0.002;
    lightMesh.rotation.y+=0.002;
    cloudMesh.rotation.y +=0.003;
    glowMesh.rotation.y += 0.002;

    renderer.render(scene, camera);
    controls.update();
}

animate();
