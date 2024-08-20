 /* Setup camera, scene, objects */
 import * as THREE from 'three' ;
 import WebGL from 'three/addons/capabilities/WebGL.js';
 if ( ! WebGL.isWebGLAvailable() ) { alert("No WebGL support") }; 
 import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

  const loader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera (
                45, window.innerWidth / window.innerHeight,
                0.1, 1000);
 camera.position.set (2,-1, 60);
 camera.up = new THREE.Vector3 (0, 0, 1) ;

export function getRenderer () {
  // This is important if you want snapshots of scene programatically
    let renderer = new THREE.WebGLRenderer (
                        {preserveDrawingBuffer: true }); 
   // console.log(renderer.getContextAttributes()) ;
    // Setup display on the web page
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement); 
    return (renderer)
 }

export function relRenderer (renderer) {
    renderer.forceContextLoss(); renderer.context = null; 
    renderer.domElement = null; renderer = null;
 }

function resize_canvas( x = 512, y = 512 ) {
  // not giving good result (fixiit)
  var  canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = x;
  canvas.height = y;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

export {THREE, GUI, loader, scene, camera} ;
