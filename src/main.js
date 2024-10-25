import * as THREE from 'three' ;
import './style.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// scene
const scene = new THREE.Scene();

// create our sphere 
const geometry = new THREE.SphereGeometry(3, 64, 64); // 64 segments in both directions for smoooth circle

// create a material, color or image texture
const material = new THREE.MeshStandardMaterial({ 
    color: '#00ff83', // color of the outside of the sphere
    roughness: 0.4, // how rough the surface is
});

// create a mesh, which is a combination of the geometry and material
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// light - important to see the object
const light = new THREE.PointLight(0xffffff, 100, 100); // color, intensity
light.position.set(0, 10, 10); // x, y, z
light.intensity = 100;
scene.add(light);

// camera - important to see the object
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100); // field of view, aspect ratio (width/height), near, far further than 0.1 and closer than 100
camera.position.z = 20; // move the camera back
scene.add(camera);

// renderer - to render the scene on canvas in index.html
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);// set the size of the renderer
renderer.setPixelRatio(2);
renderer.render(scene, camera); // render the scene with the camera

//Controls - to move the camera
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled

controls.autoRotate = true;
controls.autoRotateSpeed = 5;

controls.enablePan = false;
controls.enableZoom = false;

// Resise the window
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

const loop =() => {
    //mesh.position.x += 0.01; use gtab because the object moving depends on how fast your laptop is 
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}
loop();

//Timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1}); // scale the object from 0 to 1
tl.fromTo('nav', {y: '-100%'}, {y: '0%'}); // move the nav from -100% to 0% at the same time as the object
tl.fromTo('.title', {opacity: 0}, {opacity: 1} ); // fade in the title after 1 second

// mouse animation color
let mouseDown = false;
let rgb = [];

window.addEventListener('mousedown', () => {
    mouseDown = true;
});
window.addEventListener('mouseup', () => {
    mouseDown = false;
});
window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150,

        ]
        //console.log(rgb);
        //lets animate
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`); // = new THREE.Color(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);

        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
        });
    }
});