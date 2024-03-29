import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Effects from '../effects/effects.js';
import { inView } from 'motion';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import * as dat from 'dat-gui'
import { gsap } from "gsap/gsap-core";

export default class AsciiArtRenderer {
  constructor({ element, index }) {
    this.element = element;
    this.index = index;
    this.initialized = false;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.asciiEffect = null;
    // this.controls = null;
    this.sizes = null;
    this.sphere = null;
    this.plane = null;
    this.textLoader = null;
    this.textMesh = null;
    this.textMaterial = null;
    this.scale = { value: 0 };
    this.positionX = { value: 0 };
    this.effects = new Effects()
    
    // delete
    // this.gui = new dat.GUI()
    
    inView(this.element, () => {
      this.intialized = true;
      this.init()
      return () => {
        this.intialized = false;
        this.destroy()
      }
    })
  }

  init() {
    if (this.initialized) return;

    this.sizes = { width: this.element.clientWidth, height: this.element.clientHeight };
    
    // CAMERA
    this.camera = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 1, 1000);
    this.camera.position.y = 0;
    this.camera.position.z = 250;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0, 0, 0);
    
    // LIGHT
    const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
    pointLight1.position.set(500, 500, 500);
    this.scene.add(pointLight1);

    const ambientLight = new THREE.AmbientLight(0xffffff, .5); // Color and intensity
    this.scene.add(ambientLight);

    // GEOMETRY
    const textLoader = new FontLoader();
    textLoader.load('/fonts/allnce-neue-regular-2.json', (font) => {
      const textGeometry = new TextGeometry('@', {
        font: font,
        size: 180,
        height: 20,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 3,
      });

      this.textMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
      this.textMaterial.transparent = true;
      // const textMaterial = new THREE.MeshBasicMaterial({ color: 0xe0e0e0 });
      this.textMesh = new THREE.Mesh(textGeometry, this.textMaterial);
      this.textMesh.scale.set(1.5, 1.5, 1.5);
      textGeometry.center();

      this.scene.add(this.textMesh);
    });

    // RENDERER
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    
    // ASCII POST PROCESSING
    this.asciiEffect = new AsciiEffect(this.renderer, ' .:-+=*%$@#', { invert: true });
    this.asciiEffect.setSize(this.sizes.width, this.sizes.height);
    this.asciiEffect.domElement.style.color = "#CBE4FF";
    this.asciiEffect.domElement.style.backgroundColor = 'transparent';

    this.element.appendChild(this.asciiEffect.domElement);
    
    // this.controls = new OrbitControls(this.camera, this.asciiEffect.domElement);
    // this.controls.enableDamping = true;

    this.initialized = true;


    // this.gui.add(pointLight1, 'intensity').min(0).max(2).step(0.01)
    // this.gui.add(pointLight1, 'decay').min(0).max(2).step(0.01)
    // this.gui.add(pointLight1.position, 'x').min(-1000).max(1000).step(1)
    // this.gui.add(pointLight1.position, 'y').min(-1000).max(1000).step(1)
    // this.gui.add(pointLight1.position, 'z').min(-1000).max(1000).step(1)
  }

  resize() {
    if (!this.initialized) return;

    this.sizes.width = this.element.clientWidth;
    this.sizes.height = this.element.clientHeight;
    
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.asciiEffect.setSize(this.sizes.width, this.sizes.height);
  }

  update() {
    if (!this.initialized) return;

    // this.controls.update();
    if (this.textMesh) {
      if (window.isFirstContactSlide == true) {
        // fade opacity and scale in to 1 over 2 seconds
        gsap.to(this.scale, { value: 1.5, duration: 2.5, ease: "expo.out" });
        gsap.to(this.positionX, { value: 0.0, duration: 3.5, ease: "expo.out" });
        // this.textMaterial.opacity = this.opacity.value;
        this.textMesh.scale.x = this.scale.value
        this.textMesh.scale.y = this.scale.value
        this.textMesh.scale.z = this.scale.value
        
        this.textMesh.rotation.x = this.effects.time.elapsed / 1000;
        this.textMesh.rotation.z = this.effects.time.elapsed / 1000;
        this.textMesh.position.y = Math.abs(Math.sin(this.effects.time.elapsed / 1000)) * 10
        this.textMesh.position.x = this.positionX.value
      } else {
        // scale textmesh to 0 as opacity also fades to 0 over 2 seconds
        gsap.to(this.scale, { value: 0.0, duration: .25, ease: "expo.out" });
        gsap.to(this.positionX, { value: -800.0, duration: 5.25, ease: "expo.out" });
        // this.textMaterial.opacity = this.opacity.value;
        // this.textMesh.scale.x = this.opacity.value
        this.textMesh.rotation.x = this.effects.time.elapsed / 1000;
        this.textMesh.rotation.z = this.effects.time.elapsed / 1000;
        this.textMesh.position.y = Math.abs(Math.sin(this.effects.time.elapsed / 1000)) * 10
        this.textMesh.position.x = this.positionX.value
      }
    }
    
    this.asciiEffect.render(this.scene, this.camera);
  }

  destroy() {
    if (!this.initialized) return;

    // Stop controls
    // this.controls.dispose();

    // Dispose geometries, materials, and textures
    this.textMesh.geometry.dispose();
    this.textMesh.material.dispose();
    // Remove the effect element from the DOM
    this.element.removeChild(this.asciiEffect.domElement);
    
    this.initialized = false;
  }
}
