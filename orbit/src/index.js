// Author: Ravi Saripalloi
// 25 Jun 2024
// Marshalls all requests from my 
//    stat application



import { Hono } from 'hono'
import { html, raw } from 'hono/html'

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

app.post('/output', async (c) => { // saving any ascii file
  console.log ("Output req");
  let url =  new URL(c.req.url) ; // elaborate json url
  let spath = app.basePath + url.pathname   ;
  const frm = await c.req.formData()
  let fname = spath + "/" + frm.get('name') ;
  await Bun.write (fname, frm.get('blob'));
 return new Response("Success Always" );
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
