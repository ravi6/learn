function design2() {
 // Another way to examine desing of Magnetron Transformer on Miele

 const prim  = {
       n   : 255,     // no. of turns
       awg : 26,      // winding size
       d   : 0.483,   // wire diameter in mm
       nTA : 4.15,   //  no. of turns per sq.mm
       lT  : 1,      // lenght of conductor in one turn
       V   : 240,    // RMS Voltage (V)
       I   : 3,     // RMS Current (Amp)
 };
     
 const sec = {
       n   : 1740,  // no. of turns
       awg : 30,    // winding size (code)
       d   : 0.296, // wire diameter in mm
       nTA : 8.81,  // no. of turns per mm2
       lT  : 1,    // lenght of conductor in one turn
       V   : 1680, // RMS Voltage (V)
       I   : 0.3,  // RMS Current (amp)
 };

 const core  = {
        tw:  30,  // Toungue width (mm)
        td:  70,  // Toungue depth (mm) laminations depth)
        ww:  15,  // Window width (mm) any one of the windows)
        wh:  40,  // Window height (mm)
        B:  1.0,  // Magnetic Flux (Web/m2)
 };

 const T = {
           p: prim,  s: sec, c: core,  
           f:     50,    // frequency
           pwr:   1200,  // Rated power (W)
           eff:   0.87,  // Efficiency
           tpv:   1,    // Turns per volt
 };

 console.log("Packing Density of wires");
 console.log({lit:T.p.nTA, act:T.p.n/ (15*15), ideal:1.0/(3.147*0.25*T.p.d*T.p.d)}) ;
 console.log({lit:T.s.nTA, act:T.s.n/ (25*15), ideal:1.0/(3.147*0.25*T.s.d*T.s.d))}) ;
 console.log(JSON.stringify(T)) ;

  // Get currents in both windings
  T.p.I = (T.pwr / T.eff) / T.p.V ;  // amps
  T.s.I = T.pwr / T.s.V ;

  // Estimate Core area (Tounge) Required 
  var Acore = 1.152e2 * Math.sqrt(T.pwr) ;  // mm2

  //Calculate Number of Turns per Volt paameter
  T.tpv = 1.0 / (4.44 * T.f * Acore * 1e-6 * T.c.B ) ;
  console.log("Acore:", Acore, "tpv", T.tpv ) ;

  // And Number of Turns of primary and secondary
  T.p.n = T.p.V  *  T.tpv  ;
  T.s.n = T.s.V * T.tpv * 1.03 ;  // Extra to allow for copper losses

  // Estimate window area required
  var Acopper = (T.p.n / T.p.nTA) + (T.s.n / T.s.nTA) ;  // mm2
  var Awindow = Acopper * 4 ;  // Allows for insulation etc. (tweeked)

  // Assuming Tounge depth and window height are given
  // Calculate Tounge and window widths ... keeps the comparison
  // between estimate and actual simple
  T.c.tw = Acore / T.c.td ;
  T.c.ww = Awindow / T.c.wh ;

  console.log(JSON.stringify(T)) ;
  //var T2 ='<pre>'+JSON.stringify(T, null, 2)+'</pre>';
} // end design2

function design1()
{
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
}

