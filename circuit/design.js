/*
  * Lots of doubts on definitions of window, core  
  * and associated properties ... without any reference
  * to winding mix ... where do i get some respectable
  * values of Bm ... Current Density delta (appears 20A/mm^2)`
  * Why use circum circle diameter for core. 
  * Investigate Limb to Limb distance is less than circum circle dia 
  * of the centre core.

* /

/* ==========================================
 * All dimensions and areas in mm and mm^2
 * ========================================== 
 * /

/* Distance from core centers
 * here it is center limb to side limb
 * D is distance between core centers
 * or distance between adjacent limbs
*/

tdd = (95 - 30 - 2*15) /2 ; // outer limb dimension
D = (30*0.5 + 15 + tdd/2)  ;
 
/* Get Circumscribed dia of the core (d)
 * is it only central limb cross section
 * or all limbs ?? not sure
 * for now I will use central limb only
*/
Acore = 30 * 70  ;

// Rectangular cross section circumdia
d= (30^2 + 70^2)^0.5 ;
k = Acore / d^2 ;

//Get window width (Getting Negative values )
Wwin = D - d  ; // Width of window

// Is the window width combined window of both windings??
Hwin = 25 + 15 ; 
Awin = Wwin * Hwin  ; 

f = 50 ; // Hz
Bm = 1 ;

//Flux given Flux Density and core area  
phim = Bm * Acore * 1e-6    // Bm max magnetic flux
Emft = 4.44 * f * phim // Emf per turn

Np = 225 ;
PcondArea = Np * 3.147 * (0.483)**2 / 4 ;
PIrms = 4 ; // rms ampearage of primary
Delta = PIrms / (PcondArea /Np) ;  // Primary current density

// Normal design rule is to keep this density same in all windings

//Single Phase transformer
// Q is kvA
kw = 1 ;
Q = 2.22 * f * Bm * kw * Delta * Awin * Acore * 1e-6 * 1e-3 ;
console.log({Q:Q, Wwin:Wwin, Hwin:Hwin, Awin:Awin, 
             Acore:Acore, PcondArea:PcondArea, 
	     Delta:Delta, Emft:Emft, d:d, D:D});
