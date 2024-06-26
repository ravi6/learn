// Author: Ravi Saripalloi
// 21 Jun 2024
import { Hono } from 'hono'
import { html, raw } from 'hono/html'

const app = new Hono() ;
app.basePath = "./src" ;

app.get ('/', (c) => {      // serve startup page
 //  console.log( c.req.url ) ;
   return new Response (
         Bun.file(app.basePath + "/index.html"), 
         {headers: {"Content-Type": "text/html"}},
    );
});

app.get ('/upload/*', async (c) => {   // request for saved model 
  let url =  new URL (c.req.url) ; 
  let fpath = app.basePath + url.pathname ;  
  let frmData = new FormData() ;

// make files into blobs and then push it to formData
  let file = Bun.file (fpath + "model.json") ;
  let buf =  await file.arrayBuffer () ;
  let blob = new Blob([buf], {type: "application/json;charset=utf-8"}) ;
  frmData.set ("model.json", blob) ;

  file = Bun.file (fpath + "model.weights.bin") ;
  buf =  await file.arrayBuffer () ;
  blob = new Blob([buf], {type: "application/octet-stream"}) ;
  frmData.set ("model.weights.bin", blob) ;

  for (const key of frmData.keys()) { console.log(key); }
  return new Response (frmData) ;
});

app.get ('/*', (c) => {      // resources from app source
  let url =  new URL(c.req.url) ; // elaborate json url
  //console.log (url) ;
  let fpath = app.basePath + url.pathname ;  // prepend base path
  return new Response (Bun.file (fpath));
});

app.post('/*', async (c) => { // saving model
  let url =  new URL(c.req.url) ; // elaborate json url
  let spath = app.basePath + url.pathname   ;
//  console.log (url, spath) ;
  const frmData = await c.req.formData();
  console.log(frmData) ;
 // save both model components 
 // weird that we can't save frmData in one go as is
 ["model.json", "model.weights.bin"].forEach ( async (f) => {
          await Bun.write(spath + f, frmData.get(f));
 } ); 

 return new Response("Success" );
}) ;  // end post

export default app ;
