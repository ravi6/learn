// Captures images and saves them with incremental rotations
  import  {THREE, scene, camera, getRenderer} from "./init.js" ;
  import {Plane} from "./plane.js" ;
  import {Rots} from "./rots.js" ;
  import {light, dlight, addBtns} from  "./lights.js" ;
  import {sleep, measure, saveScene, upload} from "./util.js" ;
//  import {OrbitControls} from 'three/addons/controls/OrbitControls'

var renderer = getRenderer () ;
var samples = {n: 5, tmax: 40, isRandom: true} ;
var rotObj = new Rots (samples.n, samples.tmax * Math.PI / 180.0, 
                       samples.isRandom) ;
let plane = await Plane () ;

export async function capture () {
  scene.add (plane) ;
  scene.add (light); 
  scene.add (dlight);
  addBtns () ;
  await sleep(100) ;  // needed this to get non blank first frame
  renderer.render (scene, camera) ;
  //  scene.add (new THREE.AxesHelper(40)) ;
  // Generate images and save until done
  genImage () ;
  let nt = samples.n * samples.n * samples.n ;
  //Wait for all images to be generated
  while  (rotObj.rots.length < nt) await sleep (100) ;
  upload (JSON.stringify (rotObj.rots), "key", true) ;
}

function genImage () {  // recursive function
     renderer.render (scene, camera) ;
     sleep (100).then ( () => {
	     let more = rotObj.rotate (plane)
	     saveScene (rotObj.fname) ;
	     if (more) genImage () ; // recurisive call
             //else console.log ("ccc",JSON.stringify(rotObj.rots)) ;
            }); 
} // genImages

function animate(){
    requestAnimationFrame (animate);
    // some rotation ito be added
    renderer.render (scene, camera);
}
