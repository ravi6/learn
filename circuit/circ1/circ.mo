model circ "Resistor Heating up effects with Inductor in Series"
  import Modelica.Electrical.Analog.Sources.* ;
  import Modelica.Electrical.Analog.Basic.* ;

// set negative alpha for NTC (negetive Temperature Coeff.)
// Now testing using Nicrome wire Temp Coeff which is positive
// Using 1.5Ohm ... 5W ceramic wire wound resitor
// Inductance of primary is assumed to b 35mH

  RaviResistor R(Rref=1.5, Tref=15, alpha=3.0e-3, i(start=0)) ;
  Inductor L(L=35e-3) ; // 35mH
  Ground   G ; 
  SineVoltage VS(V=240*1.4, f=50) ;
  Real  Qloss ;   // Heat lost to ambient by convection
  Real  h = 15 ;   // Natural convection heat transfer coeff. (W/m2C)
  Real  A = (1.0 * 3 / 8) * 4 * 25.4e-3 * 25.4e-3 ; // heat tranfer area
                // four sides of a rectangular wirewound resistor
                // = (3.14 * 10e-3 * 10e-3 * 0.25) * 2 ; // 10mm disc NSTC
  Real Ta = 15 ; // Ambient Temperature
  Real mass = 1e-3 ; //a gram of Resistor (Nichrome+Ceramics)
  Real  Cp = 750 ;  // J/kgC Ceramic Specific Heat

equation
  connect(VS.n, G.p) ;
  connect(VS.p, R.p) ;
  connect(R.n, L.p) ;
  connect(L.n, G.p) ;
  Qloss = h * A * (R.T - Ta) // Natural Convection loss  
          +    5.67e-8 *  0.9 * ( (R.T + 273)^4 - (Ta + 273)^4 ) ;
            // White Ceramic emissivity, Radiation loss
  mass * Cp * der(R.T) = R.Qgen - Qloss ;  // Transient Heat Balance
initial equation
  R.T = Ta  ;   // Resistor at ambient to start with
end circ;
