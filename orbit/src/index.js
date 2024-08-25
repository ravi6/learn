// Author: Ravi Saripalloi
// 25 Jun 2024
// Marshalls all requests from my 
//    stat application

import { Hono } from 'hono'
import { html, raw } from 'hono/html'
import {$} from "bun" 

const app = new Hono() ;
app.basePath = "./src" ;

app.get ('/', (c) => {      // serve startup page
   return new Response (
         Bun.file (app.basePath + "/index.html"), 
                   getHeader ("index.html")) ;
});

app.get ('/*', (c) => {      // resources from app source
  let url =  new URL(c.req.url) ; // elaborate json url
  let fpath = app.basePath + url.pathname ;  // prepend base path
  // console.log("Serving: ",  fpath) ;
  return new Response (Bun.file (fpath)) ;
});

app.post('/output', async (c) => { // saving images to output dir
  //console.log ("Output req");
  let url =  new URL(c.req.url) ; // elaborate json url
  let spath = app.basePath + url.pathname   ;
  const frm = await c.req.formData()
  let fname = spath + "/" + frm.get('name') ;
  await Bun.write (fname, frm.get('blob'));
  const res = await $`./src/imgclip ${fname}  `;
 return new Response("Success Always" );
 
}) ;  // end post

// CNN model saving and restoring hooks
app.get ('/upload/*', async (c) => {   // request for saved model 
  let url =  new URL (c.req.url) ; 
  let fpath = app.basePath + url.pathname ;  
  console.log("Serving: ",  fpath) ;
  return new Response (Bun.file (fpath));
});  // end upload file getter

app.post('/upload/*', async (c) => { // saving model
  let url =  new URL(c.req.url) ; // elaborate json url
  let spath = app.basePath + url.pathname   ;
  console.log("Posted: " + spath) ;
  const frmData = await c.req.formData();
 
 // save both model and weights (they arrive as blobs
  //   encased in FormData pack
 ["model.json", "model.weights.bin"].forEach ( async (f) => {
          let p = spath + "/" + f;
          console.log("Saving: ",  p) ;
          const data = await frmData.get(f) ;
          await Bun.write (p, data);
 }); 
 return new Response("Success" );
}) ;  // end post

function getHeader (fname) {
  // set HTTP header based on file type
  let ctype =  "text/html" ;  // my default for others
  if (fname.slice(-3) === "bin") 
       ctype =  "application/octet-stream" ;
  else if (fname.slice(-4) === "json") 
       ctype =  "application/json" ;
  let hdr =  {"headers":  {"Content-Type": ctype}}  ;   
  return (hdr) ;
} // end getHeader

export default app ;
