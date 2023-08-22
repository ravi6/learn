global_settings { assumed_gamma 1.8 }

#include "colors.inc"
#include "shapes.inc"
#include "materials.inc"


// Room and content dimensions
#declare skirtWidth = 70 ;
#declare skirtDepth = 19 ;
#declare windowWidth = 1950 - 2 * skirtWidth ; 
#declare windowHeight = 1025 - 2 * skirtWidth;

#declare roomWidth = 2075 ;
#declare roomLength = 2350 ;
#declare roomHeight = 2330 ;

#declare vanityWidth = 1200 ;
#declare vanityHeight = 900 ;
#declare vanityDepth = 450 ;

#declare shBaseWidth = 900 ;
#declare shBaseHeight = 30 ;
#declare shBaseLength = 1200 ;


//==============================
// Make  window frame with glass center
//  and wooden skirting
//==============================
#declare window = 
  difference {
     object {UnitBox
	scale <(windowWidth + 2 *skirtWidth)*0.5, 
	       (windowHeight + 2 * skirtWidth)*0.5, skirtDepth*0.5>
	texture {sandalwood}
       }
     object {UnitBox
	scale <windowWidth*0.5, windowHeight*0.5, skirtDepth*0.5>
       }
   translate <0, 0.5 * (-roomHeight + windowHeight)
                         + skirtWidth + 1135  , 0>
         texture { milkyglass }
 } // end Window

//=============================
// Make Vanity
//=============================
#declare vanity = 
     object {UnitBox
        scale <vanityWidth*0.5, vanityHeight*0.5, vanityDepth*0.5>
	rotate y*90
	translate <(-roomWidth + vanityDepth)*0.5
	           (-roomHeight + vanityHeight)*0.5, 
		   0>
	texture {sandalwood}
      }

//=============================
// Make ShowerBase
//=============================
#declare shBase = 
     object {UnitBox
        scale <shBaseWidth*0.5, shBaseHeight*0.5, shBaseLength*0.5>
	translate <  (roomWidth  - shBaseWidth) * 0.5, 
	             - (roomHeight - shBaseHeight) * 0.5, 
		       - (roomLength -  shBaseLength) * 0.5   >
	texture {sandalwood}
      }

//==============================
// Place objects in the bathroom
//==============================

// Reference Marker
object { sphere {<0, 0 ,0>, 100} 
          texture {pigment{ color Red }} }
object {window}
object {vanity}
object {shBase}

// Window wall
object { UnitBox
           scale <roomWidth*0.5, roomHeight*0.5, 1> 
           texture {wallMat}
}

//left Wall
object { UnitBox
           scale <1, roomHeight*0.5, -roomLength*0.5> 
	   translate <-roomWidth*0.5, 0, 0>
	   texture {wallMat}
}

//right Wall
object { UnitBox
           scale <1, roomHeight*0.5, -roomLength*0.5> 
	   translate <roomWidth*0.5, 0, 0>
	   texture {wallMat}
}

//Ceiling
object { UnitBox
           scale <roomWidth*0.5, 1, -roomLength*0.5> 
	   translate <0, roomHeight*0.5, 0>
	   texture {ceilMat}
}

//Floor
object { UnitBox
           scale <roomWidth*0.5, 1, -roomLength*0.5> 
	   translate <0, -roomHeight*0.5, 0>
	   texture {floorMat}
}

/*
   rotate 30*y
   translate <0.72, -0.24, 0>
   rotate 96.2052*z
   translate <1, 0, -5>
*/
light_source {
   < roomWidth*0.5, roomHeight*0.5, -roomLength*0.5 > 
   color White
   shadowless }

camera {
   perspective
   location  <0, 0, -roomLength*0.4>
   angle     55
   up        <0.0, 1, 0.0>
   look_at   <roomWidth*0.25, -roomHeight*0.55, -roomLength*0.25>
//   right     x*image_width/image_height
// direction <0.0, 0.0, 2.0>
}

