
import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.querySelectorAll("#contact-section-canvas").forEach(element => { 

  let camera, controls, scene, renderer, effect, sizes;
  let sphere, plane;
  const start = Date.now();

  init();
  animate();
  
  function init() {
    sizes = { 
      width: element.clientWidth,
      height: element.clientHeight
    }
    console.log(element)
    
    camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 1, 1000);
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0, 0, 0 );

    const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
    pointLight1.position.set( 500, 500, 500 );
    scene.add( pointLight1 );

    const pointLight2 = new THREE.PointLight( 0xffffff, 1, 0, 0 );
    pointLight2.position.set( - 500, - 500, - 500 );
    scene.add( pointLight2 );

    sphere = new THREE.Mesh( new THREE.SphereGeometry( 200, 20, 10 ), new THREE.MeshPhongMaterial( { flatShading: true } ) );
    scene.add( sphere );

    // Plane
    plane = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
    plane.position.y = - 200;
    plane.rotation.x = - Math.PI / 2;
    scene.add( plane );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    effect = new AsciiEffect( renderer, ' .:-+*=%@#', { invert: true } );
    effect.setSize( window.innerWidth, window.innerHeight );
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';

    // Special case: append effect.domElement, instead of renderer.domElement.
    // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.
    element.appendChild(effect.domElement);

    // controls = new TrackballControls(camera, effect.domElement);
    controls = new OrbitControls(camera, effect.domElement)
    window.addEventListener( 'resize', onWindowResize );
  }

  function onWindowResize() {
    sizes.width = canvas.clientWidth;
    sizes.height = canvas.clientHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( sizes.width, sizes.height );
    effect.setSize( sizes.width, sizes.height );
  }

  //

  function animate() {
    requestAnimationFrame( animate );
    render();
  }

  function render() {

    const timer = Date.now() - start;

    sphere.position.y = Math.abs( Math.sin( timer * 0.002 ) ) * 150;
    sphere.rotation.x = timer * 0.0003;
    sphere.rotation.z = timer * 0.0002;

    controls.update();
    effect.render( scene, camera );

  }
})
