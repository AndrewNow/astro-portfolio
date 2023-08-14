import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Effects from '../effects/effects.js';
import IntersectionObserver from '../imageBulge/managers/IntersectionObserver.js';
import { inView } from 'motion';

export default class AsciiArtRenderer {
  constructor({ element, index }) {
    this.element = element;
    this.index = index;
    this.initialized = false;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.asciiEffect = null;
    this.controls = null;
    this.sizes = null;
    this.sphere = null;
    this.plane = null;
    this.effects = new Effects()

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
    console.log('initialized ascii')
    if (this.initialized) return;

    this.sizes = { width: this.element.clientWidth, height: this.element.clientHeight };
    
    this.camera = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 1, 1000);
    this.camera.position.y = 150;
    this.camera.position.z = 500;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0, 0, 0);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
    pointLight1.position.set(500, 500, 500);
    this.scene.add(pointLight1);

    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(200, 10, 10), new THREE.MeshPhongMaterial({ flatShading: true }));
    this.scene.add(this.sphere);
    
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: 0xe0e0e0 }));
    this.plane.position.y = -200;
    this.plane.rotation.x = -Math.PI / 2;
    this.scene.add(this.plane);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    
    this.asciiEffect = new AsciiEffect(this.renderer, ' .:-+*=%@#', { invert: true });
    this.asciiEffect.setSize(this.sizes.width, this.sizes.height);
    this.asciiEffect.domElement.style.color = 'white';
    this.asciiEffect.domElement.style.backgroundColor = 'transparent';

    this.element.appendChild(this.asciiEffect.domElement);
    
    this.controls = new OrbitControls(this.camera, this.asciiEffect.domElement);
    this.controls.enableDamping = true;

    this.initialized = true;
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

    this.controls.update();
    this.sphere.position.y = Math.abs(Math.sin(this.effects.time.elapsed / 1000)) * 150;
    this.sphere.rotation.x = this.effects.time.elapsed / 1000;
    this.sphere.rotation.z = this.effects.time.elapsed / 1000;
    
    this.asciiEffect.render(this.scene, this.camera);
  }

  destroy() {
    console.log('destroyed ascii')
    if (!this.initialized) return;

    // Stop controls
    this.controls.dispose();

    // Dispose geometries, materials, and textures
    this.sphere.geometry.dispose();
    this.sphere.material.dispose();
    this.plane.geometry.dispose();
    this.plane.material.dispose();

    // Remove the effect element from the DOM
    this.element.removeChild(this.asciiEffect.domElement);
    
    this.initialized = false;
  }
}
