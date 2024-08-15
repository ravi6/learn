// Textured cube objects Module
import {THREE, loader, scene} from "./init.js" ;
import {STLLoader}  from 'three/addons/loaders/STLLoader.js';
import {SimplifyModifier} from 'three/addons/modifiers/SimplifyModifier.js';
import {getfUvs, getVerts, getFaces, simplify, skinMesh} from "./util.js";

export  async function Plane ()  {
 // Let me tru load an stl file of the plane

  const loader = new STLLoader ();
  const geom = await loader.loadAsync ("imgs/plane.stl") ;
    // Aircraft Skin
      geom.scale (1e-2, 1e-2, 1e-2) ;
      let obj = skinMesh (geom, "imgs/plane.jpg") ;
      obj.name = "plane" ;
      obj.position.set (0, 0, 0) ;
      getfUvs (obj) ;  // generates UV attribute for my plane
//      console.log ("plane", obj) ;
      
      return (obj) ;
}// end plane
