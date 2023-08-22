global_settings { assumed_gamma 1.8 }

#include "colors.inc"
#include "shapes.inc"
#include "materials.inc"
#include "glass.inc"
#include "stones.inc"


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
#declare shGlassHeight = 1500 ;


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
		       - roomLength +  shBaseLength * 0.5   >
	texture {sandalwood}
     }


#declare shGlass1 = 
     object {UnitBox
        scale <1, shGlassHeight*0.5, shBaseLength*0.5>
	translate <  roomWidth * 0.5   - shBaseWidth, 
	             - (roomHeight - shGlassHeight) * 0.5, 
		       - roomLength +  shBaseLength * 0.5   >
	texture {pigment {Col_Glass_Bluish}}
     }

#declare shGlass2 = 
     object {UnitBox
        scale <shBaseWidth*0.5, shGlassHeight*0.5, 1>
	translate <  (roomWidth  - shBaseWidth) * 0.5, 
	             - (roomHeight - shGlassHeight) * 0.5, 
		       - roomLength + shBaseLength    >
	//texture {pigment {color <0.9, 0.94, 1, 0.8> }}
	texture {pigment {Col_Glass_Bluish}}
     }
//==============================
// Place objects in the bathroom
//==============================

// Reference Marker
object { sphere {<0, 0 ,0>, 30} 
          texture {pigment{ color Red }} }
object {window}
object {vanity}
object {shBase}
object {shGlass1}
object {shGlass2}

// Window wall
object { UnitBox
           scale <roomWidth*0.5, roomHeight*0.5, 1> 
           texture {wallMat}
}

//left Wall
object { UnitBox
           scale <1, roomHeight*0.5, roomLength*0.5> 
	   translate <-roomWidth*0.5, 0, -roomLength*0.5>
	   texture {wallMat}
}

//right Wall
object { UnitBox
           scale <1, roomHeight*0.5, roomLength*0.5> 
	   translate <roomWidth*0.5, 0, -roomLength*0.5>
	   texture {wallMat}
}

//Ceiling
object { UnitBox
           scale <roomWidth*0.5, 1, roomLength*0.5> 
	   translate <0, roomHeight*0.5, -roomLength*0.5>
	   texture {ceilMat}
}

//Floor
object { UnitBox
           scale <roomWidth*0.5, 1, roomLength*0.5> 
	   translate <0, -roomHeight*0.5, -roomLength*0.5>
	   texture {T_Grnt26}

}

light_source {
   < 0, roomHeight*0.5, -roomLength*0.5 > 
   color White
   shadowless
   }
light_source {
   < 0, roomHeight*0.5, -roomLength*0.75 > 
   color White
   shadowless
   }

camera {
   //perspective
   location  <-roomWidth*0.25, 0.0,  -roomLength*4.6>
   //location  <-roomWidth*0.25, 0.0,  -roomLength*4.6>
   //location  <+roomWidth*2, 0.0,  -roomLength*4.6>
   angle     45
   up        <0, 1, 0>
   look_at   <roomWidth*0.5, -roomHeight, -roomLength*0.5>

//   right     x*image_width/image_height
// direction <0.0, 0.0, 2.0>
}

/*
   rotate 30*y
   translate <0.72, -0.24, 0>
   rotate 96.2052*z
   translate <1, 0, -5>
*/
