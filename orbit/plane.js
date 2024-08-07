// Textured cube objects Module
import {THREE, loader, scene} from "./init.js" ;
import {STLLoader}  from 'three/addons/loaders/STLLoader.js';

export  function plane(){
 // Let me tru load an stl file of the plane

  const loader = new STLLoader () ;
  loader.load ("./plane/plane.stl", function (geom) {
   var mshMat ;
   if ( geom.hasColors ) {
	  mshMat = new THREE.MeshPhongMaterial({
	 opacity: geometry.alpha, 
	 vertexColors: true });
    } else { 
          mshMat = new THREE.MeshPhongMaterial({
	   color: new THREE.Color ("rgb(255, 0, 0)"),
	   specular: 0x111111, shininess: 200 });
      // mshMat = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
         console.log ("no colors") 
    };

    const mesh = new THREE.Mesh (geom, mshMat) ;

    geom.computeBoundingBox() ;
    mesh.scale.set (1e-2, 1e-2, 1e-2) ;
    //mesh.position.set (0, 0, 0) ;
    //mesh.rotation.set ( -Math.PI / 2, 0, 0 ) ;
    const v3 = new THREE.Vector3() ;
    const b3 = new THREE.Box3() ;
    b3.setFromObject(mesh) ;
    b3.getCenter(v3);
    console.log(v3) ;




    mesh.castShadow = true ;
    mesh.receiveShadow = true ;
    scene.add (mesh) ; // Note that scene is global so we have access
}); }// end plane
