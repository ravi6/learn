//   Sandalwood ( makes a great burled maple, too)
#declare sandalwood = texture {
   pigment {
      bozo
      turbulence 0.2
      color_map {
         [0.000, 0.171   color red  0.725  green  0.659  blue  0.455  filter  0.000
                         color red  0.682  green  0.549  blue  0.420  filter  0.000]
         [0.171, 0.274   color red  0.682  green  0.549  blue  0.420  filter  0.000
                         color red  0.557  green  0.451  blue  0.322  filter  0.000]
         [0.274, 0.393   color red  0.557  green  0.451  blue  0.322  filter  0.000
                         color red  0.725  green  0.659  blue  0.455  filter  0.000]
         [0.393, 0.564   color red  0.725  green  0.659  blue  0.455  filter  0.000
                         color red  0.682  green  0.549  blue  0.420  filter  0.000]
         [0.564, 0.701   color red  0.682  green  0.549  blue  0.420  filter  0.000
                         color red  0.482  green  0.392  blue  0.278  filter  0.000]
         [0.701, 1       color red  0.482  green  0.392  blue  0.278  filter  0.000
                         color red  0.725  green  0.659  blue  0.455  filter  0.000]
      }
      scale <0.2, 0.2, 1>
      scale 2
   }
}

#declare milkyglass = texture {
             pigment {White filter 0.95}
             normal {bumps 0.4}
             finish {reflection 0.2
                    specular 0.4
                    roughness 1
                    refraction 0.4
                    ior 1.2
                    crand 0.02}
            scale 0.01
    }


#declare floorMat  =  texture { 
             pigment {LightBlue
             turbulence 0.5 omega 0.7 rotate -40*y scale 6
	   }
           finish {reflection 0.2 specular 0.4 roughness 1}
}

#declare wallMat  =  texture { 
             pigment {LightBlue
             turbulence 0.5 omega 0.7 rotate -40*y scale 6
	   }
           finish {reflection 0.2 specular 0.4 roughness 1}
}

#declare ceilMat  =  texture { 
           pigment { White }  
           finish {reflection 0.1 specular 0.4 roughness 1}
}

