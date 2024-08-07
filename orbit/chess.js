// Chess Pieces module
//
import {THREE} from "./init.js" ;
export function Bishop(){
    const curve = new THREE.CubicBezierCurve(
    	new THREE.Vector2( 0, 0 ),
    	new THREE.Vector2( -5, 15 ),
    	new THREE.Vector2( 20, -15 ),
    	new THREE.Vector2( 0, 0 ),
    );
    
    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    
    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material );
    return curveObject ;
}

/*
  const  points = [] ;
  for (let i = 0; i <10 ; i++) {
    points.push(new THREE.Vector2(3 * Math.sin(i*0.2) + 3,
                                        (i-5) * 0.8));
    console.log(points[i].x, points[i].y);
  }
  */
