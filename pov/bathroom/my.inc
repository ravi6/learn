#declare frostyGlass = texture {
  pigment {Col_Glass_General}
  finish {F_Glass6}
}

#declare milkyglass = texture { pigment {White filter 0.95}
             normal {bumps 0.4}
             finish {reflection 0.2 specular 0.4
                    roughness 1 crand 0.02}
            scale 0.01
}

#declare floorTiles  =  texture { 
  pigment { image_map {png "tiles/tile5.png"} scale 136 }
}

#declare wallTiles  =  texture { 
  pigment { image_map {png "tiles/tile1.png"} scale 409 }
  finish {reflection 0.0 specular 0.4 roughness 1}
}

#declare ceilMat  =  texture { 
  pigment { White }  
  finish {reflection 0.1 specular 0.4 roughness 1}
}

#declare splash = texture {
  pigment { image_map {png "tiles/tile8.png"} scale 200 }
}

#declare shbase = texture {
  pigment { image_map { png "tiles/shbase.png"} scale 100 }
  finish {ambient 0.2  diffuse 0.6}
}

/*
#declare wallTiles = texture {
        radial
	texture_map {
		[0.25 
                  pigment { image_map { png "tiles/Aqua.png" }}
	          finish { ambient 0 diffuse 1 phong .35 phong_size 120 }
                ] } // might need to scale x slightly
	frequency 4  //  gives you four sides
	rotate y*45  //  moves edge of image to corners of cube
	scale  800
}
*/
