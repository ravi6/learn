// Textured cube objects Module
import {THREE, loader, scene} from "./init.js" ;
import {STLLoader}  from 'three/addons/loaders/STLLoader.js';

export  async function Plane ()  {
 // Let me tru load an stl file of the plane

  const loader = new STLLoader ();
  const geom = await loader.loadAsync ("plane.stl") ;
    // Aircraft Skin
    const texture = new THREE.TextureLoader().load( "imgs/plane.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );

     var mshMat ;
     if ( geom.hasColors ) {
	  mshMat = new THREE.MeshPhongMaterial({
	  opacity: geometry.alpha, vertexColors: true });
      } else { 
	 mshMat = new THREE.MeshPhongMaterial ({  
	 map: texture, color: 0xcccccc, shininess: 50 }); 
	 console.log ("no colors") ;
      };

      geom.scale (1e-2, 1e-2, 1e-2) ;
      const obj = new THREE.Mesh (geom, mshMat) ;
      obj.position.set (0, 0, 0) ;
      return (obj) ;
}// end plane
