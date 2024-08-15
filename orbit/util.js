import {THREE} from "./init.js" ;
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';


// This module provides some useful stuff
//
export function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}

export class hexColor {
  constructor(obj) {
    this.obj = obj;
  }
  get value() {
    return `#${this.obj['color'].getHexString()}`;
  }
  set value(hexS) {
    this.obj['color'].set(hexS);
  }
} // end hexColor class

export function setColor (obj) {
  // Change color of  any object with interacive dialogue
  // returns dialogue object linked to target "obj"
  // <esc> to close dialogue
    let  dlg = document.createElement("dialog"); 
     dlg.classList.add("dlgFrame") ;
    let  hdr = document.createElement("header"); 
     hdr.innerText = "Set Color" ;
     dlg.appendChild(hdr);
     
     let rgbvec = obj.color.toArray() ;
     // console.log ("rgbvec", rgbvec) ;
     // Create three sliders 
      ["r", "g", "b"].forEach(function(val, index){
          let div = document.createElement("div"); 
	  let input = document.createElement("input"); 
	    input.id = val ;
	    input.min = 0 ; input.max = 255 ; input.value = rgbvec[index]*255 ; input.step = 1 ;
	    input.class = "slider"; input.type = "range" ; 
  	    input.addEventListener("input", function(){
	          let rgb = "rgb(" + document.getElementById("r").value + ","
		     + document.getElementById("g").value + ","
		     + document.getElementById("b").value + ")" ;
	          //console.log(rgb) ; obj.color.set(rgb);
	          document.getElementById("msg").innerText = rgb ;
	     }); // end evenlistener
	    div.appendChild(input);
            dlg.appendChild(div);
	    document.body.appendChild(dlg);
      });
	  let label = document.createElement("label"); 
	  label.id="msg"; label.innerText = 
                "rgb(" + Math.round(rgbvec[0]*255) + "," 
                       + Math.round(rgbvec[1]*255) + "," 
                       + Math.round(rgbvec[2]*255) + ")" ; 
          dlg.appendChild(label);
	  dlg.addEventListener("close", function(){dlg.remove();});
 return(dlg);
}// setColor
 
export function setPos (obj){
  // Position any object with interacive dialogue
  // returns dialogue object linked to target "obj"
  // <esc> to close dialogue
    let  dlg = document.createElement("dialog"); 
     dlg.classList.add("dlgFrame") ;
    let  hdr = document.createElement("header"); 
     hdr.innerText = "Set Position" ;
     dlg.appendChild(hdr);
     
     // Create three sliders 
      ["x", "y", "z"].forEach(function(val, index){
	  let vec = [obj.position.x, obj.position.y, obj.position.z];
          let div = document.createElement("div"); 
	  let input = document.createElement("input"); 
	    input.id = val ;
	    input.min = -150 ; input.max = 150 ; input.value = vec[index]  ; input.step = 0.1 ;
	    input.class = "slider"; input.type = "range" ; 
  	    input.addEventListener("input", function(){
	          obj.position.x = document.getElementById("x").value; 
	          obj.position.y = document.getElementById("y").value; 
	          obj.position.z = document.getElementById("z").value; 
	          document.getElementById("msg").innerText = 
		     [obj.position.x,  obj.position.y,  obj.position.z];
	     }); // end evenlistener
	    div.appendChild(input);
            dlg.appendChild(div);
	    document.body.appendChild(dlg);
      });
	  let label = document.createElement("label"); 
	  label.id="msg"; 
	  label.innerText = 
	     [obj.position.x,  obj.position.y,  obj.position.z];
          dlg.appendChild(label);
	  dlg.addEventListener("close", function(){dlg.remove();});
 return(dlg);
}// setPosition


export function getFaces (mesh) {
  // Get faces in a mesh / geometry in THREEjs

 const faces = [];
 const position = mesh.geometry.getAttribute( 'position' );
 const isIndexed = ( mesh.geometry.index != null ) ;

// Get or Create Face (tirangular) node indicies
 if (isIndexed) {  // mesh is indexed
   const index = mesh.geometry.getIndex();
   for ( let i = 0; i < index.count; i += 3 ) {
     let face = { a: index.getX (i), b: index.getX (i+1), c: index.getX (i+2),
	            normal: new THREE.Vector3 () };
     faces.push (face);
   }
 } else { // not indexed ... why we use 3 instead of itemSize??
    for ( let i = 0; i < position.count; i += 3 ) {
	let face = { a: i, b: i+1, c: i+2,
	             normal: new THREE.Vector3 () };
	faces.push (face);
    }
 }

// Get normals of these faces and store them in faces 
 faces.forEach ( (face) => {
     let verts = [] ;  // Add three vertices for each triangular face
     [face.a, face.b, face.c].forEach ( (idx) => {
         verts.push ( new THREE.Vector3 (position.getX (idx),
	                                 position.getY (idx),
	                                 position.getZ (idx)) ); });
     let f = new THREE.Triangle (verts [0], verts [1], verts [2]);
     f.getNormal (face.normal) ;
 }); // loop over all faces

 return (faces) ;
} // end getFaces 


export function getVerts (mesh) {
  // Get vertices of the mesh/geometry in THREEjs
  const position = mesh.geometry.getAttribute( 'position' );
  const vertices = [];

  for ( let i = 0; i < position.count / position.itemSize; i++ ) {
    const vertex = new Vector3( position.getX(i),
				position.getY(i),
				position.getZ(i));
    vertices.push(vertex);
  }

  return (vertices) ;
} // end getVerts

export function getfUvs (mesh) {
  const fUvs = [];
  const position = mesh.geometry.getAttribute( 'position' );
  const isIndexed = ( mesh.geometry.index != null ) ;

  if (isIndexed) {
     let uv =  mesh.geometry.getAttribute ('uv') ;
     const index = mesh.geometry.getIndex ();
     for (let i = 0; i < index.count; i += 3) {
	const fUv = []  ;
        for (let k = 0; k < 3 ; k++) {
	    let j = index.getX (i + k) ;
	    fUv.push (new Vector2 (uv.getX (j), uv.getY (j)));
	}
     }
     fUvs.push(fUv);
     return (fUvs) ;
  }
 
 // unIndexded case
  // If uv is undefined and mesh is not indexed
  // this is the case I am interested in
  let uv =  mesh.geometry.getAttribute ('uv') ;
  if (typeof(uv) === "undefined" ) { // let me generate it 
    console.log("uv undefined so I am creating it :))");
    console.log("Position Count:", position.count) ;
    mesh.geometry.setAttribute ('uv', 
      new THREE.BufferAttribute (
	 new Float32Array (position.count*2), 
	  2,  false));
    uv =  mesh.geometry.getAttribute ('uv') ;
   
    for (let i = 0 ; i < position.count - 3  ; i  = i + 3) { // count = number of vertices
       // we have all triangles
       mesh.geometry.attributes.uv.setXY (i, 0.0, 0.0) ; // for now we make it arbitrary
       mesh.geometry.attributes.uv.setXY (i+1, 0.0, 1.0) ; // for now we make it arbitrary
       mesh.geometry.attributes.uv.setXY (i+2, 1.0, 1.0) ; // for now we make it arbitrary
    }
  } // end undefined uv code

  // uv.needsUpdate = true ;

  for ( let i = 0; i < uv.count; i += 3 ) {
    const fUv = []  ;
    for (let k = 0; k < 3 ; k++) { 
       let j = i + k ;
       fUv.push (new THREE.Vector2 ( uv.getX (j), uv.getY (j)));
    }
     fUvs.push(fUv);
     return (fUvs) ;
  }

} // end getfUvs

export function simplify (mesh, factor) {
  // redduce the number of facets to desired fraction
  // Not working for my plane
  const nmesh = mesh.clone();
  nmesh.geometry.computeVertexNormals() ;

/* Delete all attributes excepting position */ 
//for ( const name in nmesh.geometry.attributes ) {
//     if ( name !== 'position' ) 
//     nmesh.geometry.deleteAttribute( name );
//}

  //  why bother tinkering with the material ??
  nmesh.material = mesh.material.clone();
  nmesh.material.flatShading = true;
  const count = Math.floor( 
  nmesh.geometry.attributes.position.count * factor ); // number of vertices to remove

  const modifier = new SimplifyModifier();
  nmesh.geometry = modifier.modify( nmesh.geometry, count );
  console.log("geo", nmesh.geometry) ;
  let nnmesh = nmesh.geometry.toNonIndexed() ;
  return (nnmesh) ;
} // end simple

export function measure (mesh) {
    let geom = mesh.geometry ;
    geom.computeBoundingBox () ;
    geom.computeBoundingSphere () ;
    let radius = geom.boundingSphere.radius;
    let v3 = new THREE.Vector3 () ;
    let b3 = geom.boundingBox   ;
    let size = new THREE.Vector3 () ;
    b3.getSize (size) ;
    b3.getCenter (v3);
    let ans = {name: mesh.name, cntr: v3, size: size, radius: radius} ;
    console.log ("Measure of ", mesh.name, ":", ans) ;
    return (ans) ;
}
	
export function skinMesh (geom, img) {
  // wraps the geom with a skin (specified as image) and returns mesh

  const tex = new THREE.TextureLoader().load (img);
  var mat = new THREE.MeshPhongMaterial ({  
    map: tex, color: 0x999999, shininess: 150, specular: 0x555555 }) ; 
  let mesh = new THREE.Mesh (geom, mat) ;
  mesh.name = "tmpMesh" ;
  console.log(img, geom) ;
  let meas = measure (mesh) ;
  // We make the decal projector cover entire mesh
  let pos =  meas.cntr ; //  projector pos
  let orient = new THREE.Vector3 (0, 0, 0) ; // projector orientation (euler angles)
  let size = meas.size ;  // projector size
  let ngeom =  new DecalGeometry (mesh, pos, orient, size) ;
  let obj = new THREE.Mesh (ngeom, mat) ;
  return (obj) ;
}

