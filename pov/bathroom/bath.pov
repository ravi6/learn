global_settings { assumed_gamma 1.8 }

#include "colors.inc"
#include "shapes.inc"
#include "glass.inc"
#include "stones.inc"
#include "woods.inc"
#include "textures.inc"
#include "ravi.inc"


// Room and content dimensions
#declare skirtWidth = 70 ;
#declare skirtDepth = 19 ;
#declare windowWidth = 1950 - 2 * skirtWidth ; 
#declare windowHeight = 1025 - 2 * skirtWidth;

#declare roomWidth = 2075 ;
#declare roomLength = 2350 ;
#declare roomHeight = 2330 ;

#declare vanityWidth = 910 ;
#declare vanityHeight = 895 ;
#declare vanityDepth = 460 ;
#declare sinkDepth = 150 ;

#declare shBaseWidth = 900 ;
#declare shBaseHeight = 30 ;
#declare shBaseLength = 1200 ;
#declare shGlassHeight = 2000 ;

// Investigating doorless options
// 700mm standard walking gap
#declare shGlass1Length = shBaseLength - 700 * 0 ;

//==============================
// Make  window frame with glass center
//  and wooden skirting
//==============================
#declare Window = 
  difference {
     object { UnitBox scale <(windowWidth + 2 *skirtWidth)*0.5, 
	                    (windowHeight + 2 * skirtWidth)*0.5, 
			    skirtDepth*0.5>
	      texture {T_Wood17} }
     object { UnitBox
	scale <windowWidth*0.5, windowHeight*0.5, skirtDepth*0.5> }

   translate <0, 0.5 * (-roomHeight + windowHeight)
                         + skirtWidth + 1135  , 0>
    texture {milkyglass}
 } // end Window

//=============================
// Make Vanity
//=============================
#declare  Vanity = object {
  difference {
    object { UnitBox scale <vanityWidth, vanityHeight, vanityDepth>
            scale 0.5 }
    object { sphere {<0,0,0>, 1} scale <1.5, 1, 1> 
             scale 200 translate 350*y }
  }
  rotate y*90
  translate < - (roomWidth - vanityDepth)*0.5,
                - (roomHeight - vanityHeight)*0.5,
	        - vanityWidth*0.5> }
//=============================
// Make Shower
//=============================
#declare shBase = 
     object { UnitBox
        scale <shBaseWidth*0.5, shBaseHeight*0.5, shBaseLength*0.5>
	translate < (roomWidth  - shBaseWidth) * 0.5, 
	            - (roomHeight - shBaseHeight) * 0.5, 
		    - roomLength +  shBaseLength * 0.5 > }

#declare shGlass1 = 
     object { UnitBox
        scale <1, shGlassHeight*0.5, shGlass1Length*0.5>
	translate < roomWidth * 0.5   - shBaseWidth, 
	            - (roomHeight - shGlassHeight) * 0.5, 
		    - roomLength +  shGlass1Length * 0.5 > }

#declare shGlass2 = 
     object { UnitBox
        scale <shBaseWidth*0.5, shGlassHeight*0.5, 1>
	translate < (roomWidth  - shBaseWidth) * 0.5, 
	            - (roomHeight - shGlassHeight) * 0.5, 
		    - roomLength + shBaseLength > }

//Shower splashback
#declare shSplash = 
     object { UnitBox scale <1, roomHeight*0.5, roomLength*0.5> }

#declare rearWall  = 
      difference {
	object {UnitBox scale <roomWidth*0.5, roomHeight*0.5, 1> }
        object {UnitBox scale <(windowWidth + 2 *skirtWidth)*0.5, 
	                    (windowHeight + 2 * skirtWidth)*0.5, 
			    skirtDepth*0.5> 
         	translate <0, 0.5 * (-roomHeight + windowHeight)
                         + skirtWidth + 1135  , 0> }
      }

#declare leftWall = 
     object { UnitBox scale <1, roomHeight*0.5, roomLength*0.5> 
	       translate <-roomWidth*0.5, 0, -roomLength*0.5> }

#declare rightWall = object { UnitBox scale <1, roomHeight*0.5, roomLength*0.5> 
	       translate <roomWidth*0.5, 0, -roomLength*0.5> }

#declare Ceiling = object { UnitBox scale <roomWidth*0.5, 1, roomLength*0.5> 
	       translate <0, roomHeight*0.5, -roomLength*0.5> }

#declare Floor = 
     object { UnitBox
           scale <roomWidth*0.5, 1, roomLength*0.5> 
	   translate <0, -roomHeight*0.5, -roomLength*0.5>
	   texture {T_Grnt26}
     }
//==============================
// Place objects in the bathroom
//==============================

// Reference Marker
object { sphere {<0, 0 ,0>, 30} 
          texture {pigment{ color Red }} }
object {rearWall texture {BrickWall}}
object {rightWall texture {BrickWall}}
object {leftWall texture {BrickWall}}
object {Ceiling texture {ceilMat}}
object {Floor texture {floorMat}}
object {Window}
object {Vanity texture{T_Grnt29}}
object {shBase  texture { shbase } finish {phong 0.4} }
object {shGlass1 texture {pigment {Col_Glass_Bluish}}}
object {shGlass2 texture {pigment {Col_Glass_Bluish}}}


light_source {
   < 0, roomHeight*0.5, -roomLength*0.5 > 
   color White
   shadowless
   }

camera {
   //perspective
   location  <-roomWidth*0.25 - 900, 2000.0,  -roomLength*4.6>
   angle     45
   up        <0, 9, 0>
   right     <16, 0, 0>
   look_at <0,0,0>
//   right     x*image_width/image_height
// direction <0.0, 0.0, 2.0>
}

