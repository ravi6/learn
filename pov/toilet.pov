global_settings { assumed_gamma 1.8 }

#include "colors.inc"
#include "shapes.inc"

camera {
   location  <-8.0, 4.0, -54.0>
   angle 40 
   up        <0.0, 1.0, 0.0>
   look_at   <-2.0, 0.0, -4.0>
}

light_source { <100.0, 400.0, -600.0> color White }

//   a back-light to create a highlight on the board
light_source { <12.0, 4.0, 12.0> color White }

#declare toilet =  
/*
  union {
      object { Disk_Y scale <10, 5, 10> } 
      sphere { <-10, 0, 0>, 7 }
  }
   union {
      object {UnitBox  scale <5, 10, 10> } 
      object {UnitBox  scale <5, 10, 10> } 

   }

//object{toilet rotate -30*x  
 // texture {pigment {color Blue }}} 

lathe {
  bezier_spline
  4,
  <73,221>, <25,25>, <211,256>, <194,48>
  pigment{Blue}
  scale 0.04
  rotate -10*x
}
*/
sphere { <0,clock,0>,1 pigment {rgb 1}}
