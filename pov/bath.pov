global_settings { assumed_gamma 1.8 }

#include "colors.inc"
#include "shapes.inc"

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

//   Lights, Camera ...
camera {
   perspective
   location  <1000, 1000, -12000>
   angle 60 // direction <0.0, 0.0, 2.0>
   up        <0.0, 1.0, 0.0>
//   right     x*image_width/image_height
//   look_at   <95, 45, -400>
}

light_source { <500, 6000, -16000> color White }


//   Add another wood texture around the edges
#declare windowWidth = 1900 ; 
#declare windowHeight = 800  ;
#declare skirtWidth = 70 ;
#declare skirtDepth = 19 ;

#declare window =  difference{
   object {UnitBox
      scale <windowWidth + skirtWidth, 
             windowHeight + skirtWidth, skirtDepth>
      texture {sandalwood}
     }

   object {UnitBox
      scale <windowWidth, windowHeight, skirtDepth>
     }

} // end windowFrame

object { window 
         texture {
	   milkyglass
         }
}

#declare roomWidth = 2500 ;
#declare roomLength = 3000 ;
#declare roomHeight = 3000 ;

// Window wall
object { UnitBox
           scale <roomWidth, roomHeight, 1> 
           texture {wallMat}
       }

//left Wall
object { UnitBox
           scale <1, roomHeight, -roomLength> 
	   translate <-roomWidth, 0, 0>
	   texture {wallMat}
       }

//right Wall
object { UnitBox
           scale <1, roomHeight, -roomLength> 
	   translate <roomWidth, 0, 0>
	   texture {wallMat}
       }

//Ceiling
object { UnitBox
           scale <roomWidth, 1, -roomLength> 
	   translate <0, roomHeight, 0>
	   texture {ceilMat}
       }

//Floor
object { UnitBox
           scale <roomWidth, 1, -roomLength> 
	   translate <0, -roomHeight, 0>
	   texture {floorMat}
       }
/*
   rotate 30*y
   translate <0.72, -0.24, 0>
   rotate 96.2052*z
   translate <1, 0, -5>
*/
