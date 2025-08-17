// Put your JavaScript program here.
// Refer to parameters in scope using dollar-sign{parameterName}.
// See: https://wiki.eecs.berkeley.edu/accessors/Version1/AccessorSpecification

slabL = 0.5 ;
slabW = 0.2 ;
slabT = 12.5e-3 ;
slabRho = 2700 ;  // Aluminumu 
slabMass = slabL * slabW * slabT * slabRho ;
slabMi = (1.0/12) * slabMass * (slabL * slabL + slabW * slabW) ;
console.log ("Slab :", slabMass, slabMi) ;


camL = 0.3 ;
camR = 0.15 ;
camMass = 4 ;  //kg
camMi = 0.25 * camMass * (camR * camR + camL * camL / 3) ;
console.log ("cam: ", camMass, camMi);

   exports.setup = function() {
       this.output('Mi', {'type':'double'});
   }
   exports.fire = function() {
           this.send('Mi', slabMi + camMi);
       }
 
   