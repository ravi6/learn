  // Let there be LIGHT !!!
import {hexColor} from "./util.js" ;
import {THREE, GUI} from "./init.js" ;

  const light = new THREE.AmbientLight(0xd8f808); 
	
  const dlight = new THREE.DirectionalLight(0xd8f808,1);
	// dlight.position.set(0, 10, 0);
	// dlight.target.position.set(-5, 0, 0);
	//scene.add(light.target);

export {light, dlight} ;

export function lightGUI() { // adds GUI to control lights
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
	
