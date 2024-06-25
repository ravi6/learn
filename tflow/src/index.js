// Author: Ravi Saripalloi
// 21 Jun 2024
import { Hono } from 'hono'
import { html, raw } from 'hono/html'

const app = new Hono() ;
app.basePath = "./src" ;

app.get ('/', (c) => {      // serve startup page
    console.log( c.req.url ) ;
    return new Response (
           Bun.file(app.basePath + "/index.html"), 
           {headers: {"Content-Type": "text/html"}},
    );
});

app.get ('/*', (c) => {      // resources from app source
  let url =  new URL(c.req.url) ; // elaborate json url
  console.log (url) ;
  let fpath = app.basePath + url.pathname ;  // prepend base path
   return new Response ( Bun.file(fpath) );
});

app.post('/*', async (c) => {
  let url =  new URL(c.req.url) ; // elaborate json url
  let spath = app.basePath + url.pathname   ;
  console.log (url, spath) ;
  const frmData = await c.req.formData();

 // save both model components 
 // weird that we can't save frmData in one go as is
 ["model.json", "model.weights.bin"].forEach ( async (f) => {
          await Bun.write(spath + f, frmData.get(f));
 } ); 

 return new Response("Success" );
}) ;  // end post

export default app ;
