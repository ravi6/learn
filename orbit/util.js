import {THREE} from "./init.js" ;

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
}

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
	          console.log(rgb) ; obj.color.set(rgb);
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
     let face = { a: index.getX(i), b: index.getX(i+1), c: index.getX(i+2),
	            normal: new Vector3() };
     faces.push(face);
   }
 } else { // not indexed ... why we use 3 instead of itemSize??
    for ( let i = 0; i < position.count; i += 3 ) {
	let face = { a: i, b: i+1, c: i+2 };
	faces.push(face);
    }
 }

// Get normals of these faces and store them in faces 
 faces.forEach ( (face) => {
     let verts = [] ;  // Add three vertices for each triangular face
     [face.a, face.b, face.c].forEach ( (idx) => {
         verts.push ( new THREE.Vector3 (position.getX (idx),
	                                 position.getY (idx),
	                                 position.getZ (idx)) ); });
     let f = new THREE.Triangle (verts[0], verts[1], verts[2]);
     THREE.Triangle.getNormal (face) ;
 }); // loop over all faces

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

  return vertices;
} // end getVerts

export function getfUvs (mesh) {
  const fUvs = [];
  const uv = mesh.geometry.getAttribute ('uv');

  if (isIndexed (mesh)) {
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

  for ( let i = 0; i < uv.count; i += 3 ) { // unIndexded case
    const fUv = []  ;
    for (let k = 0; k < 3 ; k++) {
       let j = i + k ;
       fUv.push (new Vector2 ( uv.getX (j), uv.getY (j)));
    }
     fUvs.push(fUv);
     return (fUvs) ;
  }

} // end getfUvs
