// Shuffle keys so that we can get randomised
// data set. Note that json file should have json extension
// otherwise it wont work

import keys from "./keys.json";  // load json object from file
keys.sort(() => 0.5 - Math.random()) // it is an array we shuffle it
//console.log( JSON.stringify(keys)) ;
Bun.write("./xxx",JSON.stringify(keys)) ; // write the suffled keys
