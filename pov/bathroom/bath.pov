global_settings { assumed_gamma 1.8 }

#include "colors.inc"
#include "shapes.inc"
#include "materials.inc"

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

// Room and content dimensions
#declare windowWidth = 1950 - 2 * 70 ; 
#declare windowHeight = 1025 - 2 * 70;
#declare skirtWidth = 70 ;
#declare skirtDepth = 19 ;

#declare roomWidth = 2075 ;
#declare roomLength = 2350 ;
#declare roomHeight = 2330 ;

#declare vanityWidth = 1200 ;
#declare vanityHeight = 900 ;
#declare vanityDepth = 450 ;

//==============================
// Make  window frame with glass center
//  and wooden skirting
//==============================
#declare window = 
  difference {
     object {UnitBox
	scale <windowWidth + skirtWidth, 
	       windowHeight + skirtWidth, skirtDepth>
	texture {sandalwood}
       }
     object {UnitBox
	scale <windowWidth, windowHeight, skirtDepth>
       }
   translate <0, 0.5 * (-roomHeight + windowHeight) + skirtWidth + 1135 , 0>
 } // end Window

//=============================
// Make Vanity
//=============================
#declare vanity = 
     object {UnitBox
        scale <vanityWidth, vanityHeight, vanityDepth>
	rotate y*90
	translate <-roomWidth + vanityDepth, 
	           -roomHeight + vanityHeight, 
		   0>
	texture {sandalwood}
      }

//==============================
// Place objects in the bathroom
//==============================

object { window 
         texture { milkyglass }
}

object {vanity}


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
