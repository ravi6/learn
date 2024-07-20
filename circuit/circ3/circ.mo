model circ "Microwave Oven Circuit Simplified"
  import Modelica.Electrical.Analog.Sources.* ;
  import Modelica.Electrical.Analog.Basic.* ;
  import Modelica.Electrical.Analog.Ideal.IdealTransformer ;
  import Modelica.Electrical.Analog.Ideal.IdealDiode ;
  import Modelica.Electrical.Analog.Ideal.ControlledIdealTwoWaySwitch ;
  import Modelica.Blocks.Math.RootMeanSquare ;

// set negative alpha for NTC (negetive Temperature Coeff.)
// Now testing using Nicrome wire Temp Coeff which is positive
// Using 1.5Ohm ... 5W ceramic wire wound resitor

  RaviResistor R(Rref=1.5, Tref=15, alpha=3.0e-3, i(start=0)) ;
  Capacitor    C(C=1.06e-6) ; // The big Cap
  IdealDiode   D ; // Rectifying diode on Secondary Output
  Ground       G ; 
  SineVoltage  VS(V=240*1.4, f=50) ;
  IdealTransformer T(n=0.1, Lm1=300e-3, considerMagnetization=true);

// Components that make up Magnetron
  ConstantVoltage MagVS(V = 2000) ;
  IdealDiode      MagD ;
  Resistor        MagRon(R = 5e3) ;   // Oscillatory mode resistance
  Resistor        MagRoff(R = 100e3) ;   // NonOscillatory mode resistance
  ControlledIdealTwoWaySwitch  MagSW(level = -2000) ;

// RMS values calculating blocks
  RootMeanSquare rmsVSi ;
  RootMeanSquare rmsVSv ;
  RootMeanSquare rmsMagPower ;

  Real  Qloss ;   // Heat lost to ambient by convection
  Real  h = 15 ;   // Natural convection heat transfer coeff. (W/m2C)
  Real  A = (1.0 * 3 / 8) * 4 * 25.4e-3 * 25.4e-3 ; // heat tranfer area
                // four sides of a rectangular wirewound resistor
                // = (3.14 * 10e-3 * 10e-3 * 0.25) * 2 ; // 10mm disc NSTC
  Real Ta = 15 ; // Ambient Temperature
  Real mass = 1e-3 ; //a gram of Resistor (Nichrome+Ceramics)
  Real  Cp = 750 ;  // J/kgC Ceramic Specific Heat
  Real MagEff (min=0, max=100) ;
  Real rmsPowerIn ; 

equation

// Power Supply, MOT, and Big Cap
  connect(VS.n, G.p) ;
  connect(VS.p, R.p) ;
  connect(R.n, T.p1) ;
  connect(T.n1, G.p) ;
  connect(T.n2, G.p) ;
  connect(T.p2, D.n) ;
  connect(D.p, C.n) ;// Large negative DC voltage to Magnetron
  connect(C.p, G.p) ;   
  

// Magnetron Model 
  connect(D.p, MagSW.p) ;
  connect(MagSW.n2, MagRoff.p) ;
  connect(MagRoff.n, G.p);
  connect(MagSW.n1, MagD.n) ;
  connect(MagSW.control, D.p);

  connect(MagD.p, MagVS.n) ;
  connect(MagVS.p, MagRon.p) ;
  connect(MagRon.n, G.p) ;
// End Magetron

  Qloss = h * A * (R.T - Ta) // Natural Convection loss  
          +    5.67e-8 *  0.9 * ( (R.T + 273)^4 - (Ta + 273)^4 ) ;
            // White Ceramic emissivity, Radiation loss
  mass * Cp * der(R.T) = R.Qgen - Qloss ;  // Transient Heat Balance

// Overall Efficiency of the Microwave
  rmsVSv.u = VS.v ; rmsVSi.u = VS.i ;
  rmsPowerIn = rmsVSv.y * rmsVSi.y ;
  rmsMagPower.u = MagRon.LossPower ;
  MagEff =  100  ;

initial equation
  R.T = Ta  ;   // Resistor at ambient to start with
  C.v = 0 ;
  
end circ;
