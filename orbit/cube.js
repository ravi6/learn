const Sigma = 5.67e-8 ; // W/(m^2 K^4)
const Xaxis = [1 0 0] ;
const Yaxis = [0 1 0] ;
const Zaxis = [0 0 1] ;

const RadFlux = {
      Solar:  555.24,  // W/m2
      Earth:   54.42,  // Earths Albedo
      EIR:     40.73,  // Earths IR radiation
}
const Materials = {
    Steel: { rho: 7500,  // density (kg/m3)
               k: 1.23,  // thermal cond. (W/mC)
              cp: 400,   // specific heat (J/kgC)
               e: 0.1,   // emissivity
    },
    Aluminum: { rho: 3500,
                  k: 1.23,
                 cp: 400,   // specific heat (J/kgC)
                  e: 0.1,   // emissivity
    },
};


class plate {
   constructor(name, w, h, t) {
      this.name = name ;
      this.w = w ;
      this.h = h ;
      this.t = t ;  
      this.mat = Material.Aluminum;
      this.dir = Zaxis ; // outward normal in z direction
      // Make default emissivities of both faces of the
      // plate same. They can be altered depending on surface finish
      // if required
      this.eTop = mat.e ;  // emissivity top face
      this.eBot = mat.e ;  // emissivity bottom face
   }
   orient(vec) {
      this.dir = vec ;
   } 
   


} // end plate

class viewf {

}

function radFlux(T, e){
    // Calculate radiant heatflux given 
    // Temperature(C) and emissivity
    return (Sigma * e * (T + 273)^4 )
}

// Lets start with a box like object
w=2; d=1; h=3; t=0.01 ; mat=Materials.Aluminum ;
p1 = new plate("top", w, d, t, mat, Yaxis);
p2 = new plate("bot", w, d, t, mat, -Yaxis);

p3 = new plate("left", d, h, t, mat, -Xaxis);
p4 = new plate("right", d, h, t, mat, Xaxis);

p5 = new plate("front", w, h, t, mat, Zaxis);
p6 = new plate("back", w, h, t, mat, -Zaxis);

pb.w=100 ;
console.log(pb, pt);