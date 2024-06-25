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
  let fpath =  new URL(c.req.url).pathname ; //get pathname (/...)
  fpath = app.basePath + fpath ;  // prepend base path
   return new Response ( Bun.file(fpath) );
});

app.post('/upload', async (c) => {
  const frmData = await c.req.formData();
  console.log(frmData) ;
  const fname = frmData.get('fname') ;
//  await Bun.write('my.pdf', fname);
  return new Response("Success"  + fname);
}) ;

export default app ;
