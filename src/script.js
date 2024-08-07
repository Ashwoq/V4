console.log(
  "Wow someone is inspecting my website, If you find any issue means please inform me, Thank You ;)"
);

import "./style.css";
import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shaders/fireflies/fragments.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import gsap from "gsap";

/**
 * Base
 */
// const SPECTOR = require("spectorjs");
// const spector = new SPECTOR.Spector();
// spector.displayUI();

// Loading
const loadingManager = new THREE.LoadingManager();

const progress = document.getElementsByClassName("progress")[0];

loadingManager.onProgress = function (url, loaded, total) {
  const progressDuration = (loaded / total) * 1000;
  const delay = progressDuration > 8000 ? progressDuration : 8000;

  window.setTimeout(function () {
    progress.style.display = "none";

    // gsap
    const tl = gsap.timeline();
    tl.to(camera.position, {
      y: 5,
      duration: 3,
    })
      .to(camera.position, {
        x: 0.001,
        z: 0.001,
        duration: 1,
        ease: "power4.inOut",
      })
      .to(camera.position, {
        x: 4.3,
        y: 2.3,
        z: 4.6,
        duration: 3,
        ease: "power3.inOut",
      });
  }, delay);
};

// Debug
const debugObject = {};
const gui = new dat.GUI({
  width: 300,
  title: "Customization",
});
gui.close();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const fog = new THREE.Fog("#3c005c", 6, 15);
scene.fog = null;

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("./V4/V4.glb", (gltf) => {
  const combinedMesh = gltf.scene.children.find(
    (child) => child.name === "Combined"
  );

  const blue = gltf.scene.children.find((child) => child.name === "Blue");
  const green = gltf.scene.children.find((child) => child.name === "Green");
  const yellow = gltf.scene.children.find((child) => child.name === "Yellow");
  const violet = gltf.scene.children.find((child) => child.name === "Violet");
  const black = gltf.scene.children.find((child) => child.name === "Black");
  const portal = gltf.scene.children.find((child) => child.name === "Portal");

  combinedMesh.material = combinedMaterial;
  blue.material = blueLightMaterial;
  black.material = blackLightMaterial;
  green.material = greenLightMaterial;
  violet.material = violetLightMaterial;
  yellow.material = yellowLightMaterial;
  portal.material = PortalLightMaterial;

  window.addEventListener("keydown", function (e) {
    if (e.altKey && e.key === "x") {
      const prags = prompt("Vaazhapalam 🍌 Official Members Only ...");
      if (prags === "titanic" || prags === "Titanic" || prags === "TITANIC") {
        portal.material = titanicMaterial;
      } else {
        portal.material = PortalLightMaterial;
      }
    }
    if (e.altKey && e.key === "c") {
      document.getElementsByClassName("count")[0].style.display = "flex";
      document.getElementsByClassName("countCon")[0].style.display = "flex";
      document.getElementsByClassName("countRow")[0].style.display = "flex";
      document.getElementsByClassName("countRow")[1].style.display = "flex";
    }
  });

  scene.add(gltf.scene);
});

/**
 * Object
 */
const combinedTexture = textureLoader.load("./V4/Combined75.jpg");

combinedTexture.encoding = THREE.sRGBEncoding;
combinedTexture.flipY = false;
const combinedMaterial = new THREE.MeshBasicMaterial({
  map: combinedTexture,
});

const titanicTexture = textureLoader.load("./V4/titanic.jpg");
titanicTexture.encoding = THREE.sRGBEncoding;
titanicTexture.flipY = false;
const titanicMaterial = new THREE.MeshBasicMaterial({
  map: titanicTexture,
});

const blueLightMaterial = new THREE.MeshBasicMaterial({ color: 0x08a1ff });
const blackLightMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const greenLightMaterial = new THREE.MeshBasicMaterial({ color: 0x07ca11 });
const yellowLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffd708 });
const violetLightMaterial = new THREE.MeshBasicMaterial({ color: 0x990085 });
const PortalLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color(0xffffff) },
    uColorEnd: { value: new THREE.Color(0x000000) },
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
});

debugObject.portalColorStart = "#ffffff";
debugObject.portalColorEnd = "#000000";

const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCountARR = {
  firefliesCount: 250,
};
// const firefliesCount = 100;
const positionArray = new Float32Array(firefliesCountARR.firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCountARR.firefliesCount);

for (let i = 0; i < firefliesCountARR.firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 7.5;
  positionArray[i * 3 + 1] = 0.2 + Math.random() * 2.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 8.5;

  scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);

const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 100 },
    // uColor: { value: (1.0, 0.0, 1.0) },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  if (window.innerWidth <= 400) {
    gui.show(false);
  } else {
    gui.show(true);
  }
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

// media
if (window.innerWidth <= 400) {
  gui.show(false);
} else {
  gui.show(true);
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 15;
camera.position.z = 0;
camera.lookAt(scene.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enableZoom = false;
controls.dampingFactor = 0.2;
// controls.panSpeed = 2
// controls.rotateSpeed = 2
// controls.enablePan = false
controls.minDistance = 2;
controls.maxDistance = 15;
// controls.minTargetRadius = 10;
// camera angle movement
// controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
// controls.mouseButtons.LEFT = THREE.MOUSE.PAN;

// controls.keys = {
//   LEFT: "ArrowLeft" || "KeyA",
//   RIGHT: "ArrowRight" || "KeyD",
//   UP: "ArrowUp" || "KeyW",
//   BOTTOM: "ArrowDown" || "KeyS",
// };

// controls.minAzimuthAngle = Math.PI / 4;
// controls.maxAzimuthAngle = Math.PI / 2;

// controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;
//

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

// GUI
const bgGUIFD = gui.addFolder("Color");
bgGUIFD.close();
debugObject.clearColor = "#3c005c";
debugObject.fogColor = "#3c005c";
debugObject.shift = "Right click, move the mouse";
debugObject.control = "Left click, move the mouse";
renderer.setClearColor(debugObject.clearColor);
bgGUIFD
  .addColor(debugObject, "clearColor")
  .onChange(() => {
    renderer.setClearColor(debugObject.clearColor);
  })
  .name("Background Color");

const fliesGUIFD = gui.addFolder("Flies");
fliesGUIFD.close();
fliesGUIFD
  .add(firefliesMaterial.uniforms.uSize, "value")
  .min(0)
  .max(500)
  .step(1)
  .name("Size");

const guiBool = {
  fogBoolean: false,
  lightBoolean: false,
  topView: function () {
    camera.position.x = -1;
    camera.position.y = 10;
    camera.position.z = 0;
  },
  frontView: function () {
    camera.position.x = 0.1;
    camera.position.y = 1.3;
    camera.position.z = 6;
  },
  portalView: function () {
    camera.position.x = -0.02;
    camera.position.y = 2.85;
    camera.position.z = -6.9;
  },
  cameraReset: function () {
    controls.reset();
    camera.position.x = 4.3;
    camera.position.y = 2.3;
    camera.position.z = 4.6;
    // cameraGUI.reset();
  },
  resetDefault: function () {
    gui.reset();
    controls.reset();
    camera.position.x = 4.3;
    camera.position.y = 2.3;
    camera.position.z = 4.6;
    // this.cameraReset();
    renderer.setClearColor("#3c005c");
    fog.color.set("#3c005c");
    fog.near = 6;
    firefliesMaterial.uniforms.uSize.value = 100;
    fogVar.show(fogVar._hidden);
    fogCol.show(fogCol._hidden);
  },
};

const fogGUIFD = gui.addFolder("Fog");
fogGUIFD.close();

fogGUIFD
  .add(guiBool, "fogBoolean")
  .name("Turn On")
  .onChange(function (value) {
    fogVar.show(fogVar._hidden);
    fogCol.show(fogCol._hidden);
    guiBool.fogBoolean ? (scene.fog = fog) : (scene.fog = null);
  });

const fogCol = fogGUIFD
  .addColor(debugObject, "fogColor")
  .onChange(() => {
    fog.color.set(debugObject.fogColor);
  })
  .name("Color")
  .hide();

const fogVar = fogGUIFD
  .add(fog, "near")
  .min(0)
  .max(15)
  .step(1)
  .name("Focus Level")
  .hide();
const portalGUI = gui.addFolder("Portal");
portalGUI.close();
portalGUI
  .addColor(debugObject, "portalColorStart")
  .onChange(() => {
    PortalLightMaterial.uniforms.uColorStart.value.set(
      debugObject.portalColorStart
    );
  })
  .name("Inner Color");

portalGUI
  .addColor(debugObject, "portalColorEnd")
  .onChange(() => {
    PortalLightMaterial.uniforms.uColorEnd.value.set(
      debugObject.portalColorEnd
    );
  })
  .name("Outer Color");

const cameraGUI = gui.addFolder("Viewing Controls");
cameraGUI.close();
cameraGUI
  .add(camera.position, "x")
  .min(-15)
  .max(15)
  .step(0.1)
  .listen()
  .name("Left / Right");

cameraGUI
  .add(camera.position, "y")
  .min(0)
  .max(15)
  .step(0.1)
  .listen()
  .name("Top / Down");

cameraGUI
  .add(camera.position, "z")
  .min(-15)
  .max(15)
  .step(0.1)
  .listen()
  .name("Inward / Outward");

cameraGUI.add(guiBool, "topView").name("Top View");
cameraGUI.add(guiBool, "frontView").name("Front View");
cameraGUI.add(guiBool, "portalView").name("Portal View");
cameraGUI.add(guiBool, "cameraReset").name("Default Angle");
gui.add(debugObject, "shift").name("Move Object").disable();
gui.add(debugObject, "control").name("Change Angle").disable();
gui.add(guiBool, "resetDefault").name("Reset");

/**
 * Animate
 */
const clock = new THREE.Clock();

camera.rotation.y += Math.PI / 4;
camera.rotation.x += Math.PI / 4;
camera.rotation.z += Math.PI / 4;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  PortalLightMaterial.uniforms.uTime.value = elapsedTime;

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
