 /* Setup camera, scene, and render objects */
 import * as THREE from 'three' ;
 import WebGL from 'three/addons/capabilities/WebGL.js';
 if ( ! WebGL.isWebGLAvailable() ) { alert("No WebGL support") }; 
 import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

  const loader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera (
                45, window.innerWidth / window.innerHeight,
                0.1, 1000);
  camera.position.set (10,-10, 150);
  camera.up = new THREE.Vector3 (0, 0, 1) ;

  const renderer = new THREE.WebGLRenderer();
 
  // Setup display on the web page
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement); 

  export {THREE, GUI, loader, scene, camera, renderer} ;
