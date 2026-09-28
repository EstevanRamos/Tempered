const {open,snap}=require('./lib.cjs');
(async()=>{const {b,pg,log}=await open();
for(const [u,n] of [['/products','14-listing'],['/products?search=camera','15-search'],['/collections/electronics','16-collection'],['/','17-home']]){
 await pg.goto('http://localhost:3000'+u,{waitUntil:'networkidle'});await pg.waitForTimeout(2500);
 const cards=await pg.evaluate(()=>{const s=['[data-testid=product-card]','[data-testid=featured-product-card]','a[href^="/products/"]'];return s.map(x=>x+':'+document.querySelectorAll(x).length).join(' ')});
 const names=await pg.evaluate(()=>[...new Set([...document.querySelectorAll('a[href^="/products/"]')].map(a=>a.innerText.trim().split('\n')[0]).filter(Boolean))].slice(0,6).join(', '));
 await pg.screenshot({path:require('./lib.cjs').OUT+'/'+n+'.png'});console.log(u,'→',cards,'|',names);}
console.log('--- log');console.log([...new Set(log)].filter(l=>!/CERT_AUTH|TUNNEL|Stripe|ipify|^→/.test(l)).join('\n'));await b.close()})();
