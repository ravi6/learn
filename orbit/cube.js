// Textured cube objects Module
import {THREE, loader} from "./init.js" ;
export function Cube(){

  let geom = new THREE.BoxGeometry(3,3,3);
  let mat1 = new THREE.MeshPhongMaterial({  
       map: loader.load("textures/tex1.jpg"),
       color: 'rgb(200,00,0)',
       shininess: 150,
       }); 
  let mat2 = new THREE.MeshPhongMaterial({  
       map: loader.load("textures/tex1.jpg"),
       color: 'rgb(100,200,100)',
       shininess: 150,
       }); 
  // texture map each face of the cube
  let mat = [mat1, mat1, mat1, mat1, mat2, mat1] ; 
  let cube = new THREE.Mesh(geom, mat);
  cube.position.set(0,0,0) ;
  return(cube);
}
