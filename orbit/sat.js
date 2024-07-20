// Venturing into Space 
//   Ravi Saripalli

const space  = {
         AU:   1.495978707e11, // Astornomical Unit in meters
         G:    6.6743015e-11,  // Grav.Const. (m3/(kg s^2))
}

const sun = {
       radius: 696340e3,
       mass:    1.989e30,
}

const earth = { 
    radius:  6.371e6,   // meters
    ecc:     0.003353,  // flatness (ellipticity)
    mass:    5.9742e24, // kg
    au:      1.0,  // Astronomical Units
    tilt:    23.44,  // Rotational Axis tilt (deg)
    orbit: { ecc:  0.01671, // Eccentricity
              rp:  147.095e9,  // Perihelion (m)  
              ra:  152.1e9,    // Aphelion (m)
           }
} 

class orbit { 
      constructor (Mc, e) { } 
      // Eccemtricity from peri and aphelion values
      getEcc(ra, rp) { return  (1 - 2 / (1 + ra/rp)); }
                
      // Get Orbital Velocity along the orbit
      getVt(theta) { return (theta) ; }
                
      // Gravitational acceleration at distance r
      getGravity(r) { return (Mc * space.G / r^2) ; }
} // end orbit class


function EarthOrbit (vrs, vts, rs) {
//  Get Earth's Orbit around Sun

  // escape velocity of sun
  const veSun = Math.sqrt ( 2 * space.G * sun.mass  / sun.radius ) ;

  // Dimensionless parameters that influence orbit
  const  Es = vrs * vrs + vts * vts - 1.0 / rs ;
  const  Hs = rs * vts ;
  const  beta = 1.0 / (2 * Hs * Hs) ;
  const  alpha = Math.sqrt(4 * Es * Hs * Hs + 1) / ( 2 * Hs * Hs) ;
  var rp = 1 / (alpha + beta) ;
  var re = 1 / (beta - alpha) ;
  var ecc = (re - rp) / (re + rp) ;

  var  HsEarth = 2.7e40 / (earth.mass * sun.radius * veSun) ; 
  var  vtEarth = HsEarth / (151.3e9/sun.radius) ;
  console.log("sun escape Velocity m/s :", veSun);
  console.log("sun to earth dist (dimless)", 151.3e9/sun.radius);
  console.log("Earth tangential velocity dim.less", vtEarth) ;

  var inputs = {vrs: vrs, vts: vts, rs: rs} ;
  var param = {Es: Es, Hs: Hs, alpha: alpha, beta: beta} ;
  var orbdim = {rp: rp , rpE: earth.orbit.rp/sun.radius,
                re: re , reE: earth.orbit.ra/sun.radius,
                ecc: ecc ,  eccE: earth.orbit.ecc} ;
  console.log(inputs, param,orbdim) ;

}
    // setting radial vel=0, according to literature
    // Distance from sun (all in dimensionless variables
     EarthOrbit(0, 0.048375, 217.279) ;
