// Textured cube objects Module
import {THREE, loader, scene} from "./init.js" ;
import {STLLoader}  from 'three/addons/loaders/STLLoader.js';
import {SimplifyModifier} from 'three/addons/modifiers/SimplifyModifier.js';
import {getfUvs, getVerts, getFaces} from "./util.js";


export  async function Plane ()  {
 // Let me tru load an stl file of the plane

  const loader = new STLLoader ();
  const geom = await loader.loadAsync ("imgs/plane.stl") ;
    // Aircraft Skin
    const texture = new THREE.TextureLoader().load( "imgs/plane.jpg" );
    texture.repeat.set( 1024/8, 1024/8) ;
    texture.wrapS = THREE.RepeatWrapping ;
    texture.wrapT = THREE.RepeatWrapping ;
    console.log("geomFaces", geom.faces) ;
    console.log("texture", texture) 
    console.log(geom.attributes.position.count) ;
    console.log(geom.index) ;

     var mshMat ;
     if ( geom.hasColors ) {
	  mshMat = new THREE.MeshPhongMaterial({
	  opacity: geometry.alpha, vertexColors: true });
      } else { 
	 mshMat = new THREE.MeshPhongMaterial ({  
	 map: texture,
	// color: 0x777777, shininess: 150 
	 }); 
	 console.log ("no colors") ;
      };

      geom.scale (1e-2, 1e-2, 1e-2) ;
      const obj = new THREE.Mesh (geom, mshMat) ;
      obj.position.set (0, 0, 0) ;
      console.log (getFaces(obj).length) ;
      return (obj) ;
}// end plane
