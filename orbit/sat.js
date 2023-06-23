// Venturing into Space 
//   Ravi Saripalli

const space  = {
         AU:   1.495978707e11, // Astornomical Unit in meters
         G:    6.6743015e-11,  // Grav.Const. (m3/(kg s^2))
};
const earth = { 
    radius:  6.371e6,   // meters
     ecc:     0.003353,  // flatness (ellipticity)
     mass:    5.9742e24, // kg
     au:      1.0,  // Astronomical Units
     tilt:    23.44,  // Rotational Axis tilt (deg)
     orbit: {
        ecc:  0.01671, // Eccentricity
         rp:   147.095e9,  // Perihelion (m)  
         ra:   152.1e9,    // Aphelion (m)
            }} ;

            class orbit { 
               constructor (Mc, e)
               // Eccemtricity from peri and aphelion values
                getEcc(ra, rp) {
                   return  (1 - 2 / (1 + ra/rp));
                   }
                
                   // Get Orbital Velocity along the orbit
                getVt(theta) {
                   return () ;
               }
                
                // Gravitational acceleration at distance r
                getGravity(r){
                   return (Mc * space.G / r^2) ;
                }
            } // end orbit class