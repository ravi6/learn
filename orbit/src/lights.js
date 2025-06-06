  // Let there be LIGHT !!!
import {hexColor} from "./util.js" ;
import {THREE, GUI} from "./init.js" ;

 // const light = new THREE.AmbientLight(0xd8f808); 
  const light = new THREE.AmbientLight(0xffffff); 
	
  //const dlight = new THREE.DirectionalLight(0xd8f808,1);
  const dlight = new THREE.DirectionalLight(0xffffff, 1);
	// dlight.position.set(0, 10, 0);
	// dlight.target.position.set(-5, 0, 0);
	//scene.add(light.target);

export {light, dlight} ;

export function lightGUI() { 
  // adds GUI to control lights
   // This GUI design is from THREEJS 
  //  Realised it later that this exists
  let gui = new GUI();
  gui.add(light.color,'r',0,1,0.1).name('lightR').onChange(callme);
  gui.add(light.color,'g',0,1,0.1).name('lightG').onChange(callme);
  gui.add(light.color,'b',0,1,0.1).name('lightB').onChange(callme);
  gui.addColor(new hexColor(dlight), 'value').name('color');
  gui.add(dlight, 'intensity', 0, 2, 0.01);
  gui.add(dlight.target.position, 'x', -10, 10);
  gui.add(dlight.target.position, 'z', -10, 10);
  gui.add(dlight.target.position, 'y', 0, 10);
}

function callme(){console.log(light.color);}
	
export function addBtns () {
  let cont = document.getElementsByClassName("container")[0];
  let btn = document.createElement("button") ; 
  btn.id = "setLight" ; btn.innerText = btn.id ;
  cont.appendChild (btn) ;
  document.getElementById(btn.id).addEventListener(
       "click",function(){
         setColor(light).showModal();
       });
  btn = document.createElement("button") ; 
  btn.id = "setCamPos" ; btn.innerText = btn.id ;
  cont.appendChild (btn) ;
  document.getElementById(btn.id).addEventListener(
       "click",function(){
         setPos(camera).showModal();
       });
}
