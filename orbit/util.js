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
	    input.min = 0 ; input.max = 10 ; input.value = vec[index]  ; input.step = 0.1 ;
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

