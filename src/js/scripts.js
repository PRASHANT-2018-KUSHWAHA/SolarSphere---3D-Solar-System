import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextureLoader } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Asset Imports
import earthTexture from '../img/earth_texture.png';
import sunTexture from '../img/sun_texture.png';
import marsTexture from '../img/mars_texture.png';
import jupiterTexture from '../img/jupiter_texture.png';
import starsTexture from '../img/stars.png';

/** Renderer Setup */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/** Scene and Camera */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    250
);
camera.position.set(0, 30, 80);

/** Orbit Controls */
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;

/** Lighting */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft global light
scene.add(ambientLight);

// Sunlight - PointLight to mimic sunlight
const sunLight = new THREE.PointLight(0xffffff, 1.2, 300);
sunLight.castShadow = true;
scene.add(sunLight);

/** Background */
const textureLoader = new TextureLoader();
scene.background = textureLoader.load(starsTexture);

/** Add Celestial Objects */
const createPlanet = (radius, texture, position) => {
    const geometry = new THREE.SphereGeometry(radius, 50, 50);
    const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture),
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(...position);
    planet.castShadow = true;
    planet.receiveShadow = true;
    return planet;
};

// Sun
const sun = createPlanet(8, sunTexture, [0, 0, 0]);
sunLight.position.set(0, 0, 0); // Ensure light follows the Sun
sun.add(sunLight);
scene.add(sun);

// Earth
const earth = createPlanet(3, earthTexture, [45, 0, 0]);
scene.add(earth);

// Mars
const mars = createPlanet(2.5, marsTexture, [80, 0, 0]);
scene.add(mars);

// Jupiter
const jupiter = createPlanet(7, jupiterTexture, [120, 0, 0]);
scene.add(jupiter);


/** Postprocessing */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(
    new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
);

/** Animation Loop */
const clock = new THREE.Clock();
function animate() {
    const elapsed = clock.getElapsedTime();

    // Rotate Sun and Planets
    sun.rotation.y += 0.002;
    earth.rotation.y += 0.005;
    mars.rotation.y += 0.004;
    jupiter.rotation.y += 0.003;

    // Orbit Planets Around the Sun
    earth.position.x = 15 * Math.cos(elapsed * 0.5);
    earth.position.z = 15 * Math.sin(elapsed * 0.5);

    mars.position.x = 25 * Math.cos(elapsed * 0.3);
    mars.position.z = 25 * Math.sin(elapsed * 0.3);

    jupiter.position.x = 40 * Math.cos(elapsed * 0.2);
    jupiter.position.z = 40 * Math.sin(elapsed * 0.2);

    orbit.update();
    composer.render();
}
renderer.setAnimationLoop(animate);

/** Responsive Design */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
