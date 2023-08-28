global_settings { assumed_gamma 1.8 }

#include "colors.inc"
#include "shapes.inc"
#include "glass.inc"
#include "stones.inc"
#include "woods.inc"
#include "textures.inc"
#include "my.tex"

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

#declare doorHeight = 2030 ;
#declare doorWidth  = 860 ;  /with skirting 

// Investigating doorless options
// 700mm standard walking gap
#declare shGlass1Length = shBaseLength - 700 * 0 ;
#declare plasterHeight = 170 ;

//==============================
// Make  window frame with glass center
//  and wooden skirting
//==============================
#declare Window = 
  difference {
     object { UnitBox scale <(windowWidth + 2 *skirtWidth)/2, 
	                    (windowHeight + 2 * skirtWidth)/2, 
			    skirtDepth/2>
	      texture {T_Wood17} }
     object { UnitBox
	scale <windowWidth/2, windowHeight/2, skirtDepth/2> }

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
  translate < - (roomWidth - vanityDepth)/2,
                - (roomHeight - vanityHeight)/2,
	        - vanityWidth/2> }
//=============================
// Make Shower
//=============================
#declare shBase = 
     object { UnitBox
        scale <shBaseWidth/2, shBaseHeight/2, shBaseLength/2>
	translate < (roomWidth  - shBaseWidth) * 0.5, 
	            - (roomHeight - shBaseHeight) * 0.5, 
		    - roomLength +  shBaseLength * 0.5 > }

#declare shGlass1 = 
     object { UnitBox
        scale <1, shGlassHeight/2, shGlass1Length/2>
	translate < roomWidth * 0.5   - shBaseWidth, 
	            - (roomHeight - shGlassHeight) * 0.5, 
		    - roomLength +  shGlass1Length * 0.5 > }

#declare shGlass2 = 
     object { UnitBox
        scale <shBaseWidth/2, shGlassHeight/2, 1>
	translate < (roomWidth  - shBaseWidth) * 0.5, 
	            - (roomHeight - shGlassHeight) * 0.5, 
		    - roomLength + shBaseLength > }

//Shower splashback
#declare shSplash = 
     object { UnitBox scale <1, shGlassHeight/2,shBaseLength/2> 
	       translate <roomWidth*0.495, 
	                  -(roomHeight - shGlassHeight)/2, 
			  -(roomLength + shBaseLength)/2> }

#declare rearWall  = 
      difference {
	object {UnitBox scale <roomWidth/2, roomHeight/2, 1> }
        object {UnitBox scale <(windowWidth + 2 *skirtWidth)/2, 
	                    (windowHeight + 2 * skirtWidth)/2, 
			    skirtDepth/2> 
         	translate <0, 0.5 * (-roomHeight + windowHeight)
                         + skirtWidth + 1135  , 0> }
      }

#declare leftWall = 
     object { UnitBox scale <1, roomHeight/2, roomLength/2> 
	       translate <-roomWidth/2, 0, -roomLength/2> }

#declare rightWall = object { UnitBox scale <1, roomHeight/2, roomLength/2> 
	       translate <roomWidth/2, 0, -roomLength/2> }

#declare Ceiling = object { UnitBox scale <roomWidth/2, 1, roomLength/2> 
	       translate <0, roomHeight/2, -roomLength/2> }

#declare Floor = 
     object { UnitBox
           scale <roomWidth/2, 1, roomLength/2> 
	   translate <0, -roomHeight/2, -roomLength/2>
	   texture {floorTiles}
	   //texture {T_Grnt26}
     }

#declare Plaster =    // If we don't tile all the way
   object {
     union { 
            polygon { 5, <0, 0>, <0, 1>, <1, 1>, <1, 0>, <0, 0> 
	              scale <roomWidth, plasterHeight, 1> }
            polygon { 5, <0, 0>, <0, 1>, <1, 1>, <1, 0>, <0, 0> 
	              scale <roomLength, plasterHeight, 1> 
		      rotate y*90
		    }
            polygon { 5, <0, 0>, <0, 1>, <1, 1>, <1, 0>, <0,0> 
	              scale <roomLength, plasterHeight, 1> 
		      rotate y*90
		      translate<roomWidth-2, 0, 0>
		    }
       } translate <-roomWidth/2 , roomHeight/2 - plasterHeight, -2>
     }
                
//==============================
// Place objects in the bathroom
//==============================

// Reference Marker
object { sphere {<0, 0 ,0>, 30} 
          texture {pigment{ color Red }} }
object {rearWall texture {wallTiles}}
object {rightWall rotate y*90 texture {wallTiles} rotate y*-90}
object {leftWall rotate y*90 texture {wallTiles} rotate y*-90}
object {Floor rotate  y*45 texture {floorTiles} rotate y*-45 }

object {Window}
object {Vanity texture{vanityTiles}}
object {shBase  texture { shbase } finish {phong 0.4} }
object {shGlass1 texture {pigment {Col_Glass_Bluish}}}
object {shGlass2 texture {pigment {Col_Glass_Bluish}}}
//object {shSplash rotate y*90 texture {splashTiles} rotate y*-90}
object {Ceiling texture {ceilMat}}
//object {Plaster  texture {pigment {color <255/255, 203/255, 153/255>}}}

light_source {
   < 0, roomHeight/2, -roomLength/2 > 
   color White
   shadowless
   }

light_source {
   < 0, 0, -roomLength/2 > 
   color White
   spotlight
   point_at <0, roomHeight/2, -roomLength/2>
   radius 1200
   falloff 000
   tightness 50
   }
camera {
   //perspective
   location  <-roomWidth/4 - 900, 1000.0,  -roomLength*2.6>
   angle     45
   up        <0, 9, 0>
   right     <16, 0, 0>
   look_at <0,1200,0>
//   right     x*image_width/image_height
// direction <0.0, 0.0, 2.0>
}

