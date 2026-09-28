const {chromium}=require('/home/user/Tempered/svelte-commerce/node_modules/@playwright/test');
const {snap,OUT}=require('./lib.cjs');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:1280,height:900}});const pg=await ctx.newPage();const log=[];
pg.on('pageerror',e=>log.push('pageerror: '+e.message.slice(0,200)));pg.on('console',m=>{if(m.type()==='error'&&!/node_invalid_placement/.test(m.text()))log.push('console: '+m.text().slice(0,200))});
pg.on('response',async r=>{if(r.url().includes('3001/shop-api')){try{const q=r.request().postData()||'';const t=await r.text();if(/errorCode|"errors"/.test(t))log.push('shop-api ERR '+t.slice(0,300))}catch{}}});
await pg.goto('http://localhost:3000/my/orders',{waitUntil:'networkidle'});await pg.waitForTimeout(1000);
console.log('logged-out /my/orders →',pg.url());
await pg.goto('http://localhost:3000/?show_auth=true&login=true&redirect=%2Fmy%2Forders',{waitUntil:'networkidle'});await pg.waitForTimeout(1500);
console.log('login URL',pg.url());console.log(JSON.stringify(await pg.evaluate(()=>[...document.querySelectorAll('input,button')].filter(e=>e.offsetParent).map(e=>[e.tagName,e.id||e.name,e.type,(e.innerText||e.placeholder||'').slice(0,30)]))));
await snap(pg,'12-login');
const email=pg.locator('input[type=email]').first();await email.fill('ace.spike@example.com');
const pw=pg.locator('input[type=password]');if(await pw.count()){await pw.first().fill('Tempered!2026');}
await pg.getByRole('button',{name:/sign in|log ?in|continue/i}).last().click();await pg.waitForTimeout(3500);
if(await pg.locator('input[type=password]').count()&&!(await pw.first().inputValue().catch(()=>''))){await pg.locator('input[type=password]').first().fill('Tempered!2026');await pg.getByRole('button',{name:/sign in|log ?in|continue/i}).last().click();await pg.waitForTimeout(3500);}
console.log('after login URL',pg.url());
await pg.goto('http://localhost:3000/my/orders',{waitUntil:'networkidle'});await pg.waitForTimeout(1500);
console.log('orders after login:',(await pg.locator('#main').last().innerText()).replace(/\n+/g,' | ').slice(0,160));
await pg.getByRole('link',{name:/view details/i}).first().click().catch(e=>console.log('no details link',e.message.slice(0,60)));await pg.waitForTimeout(2500);
console.log('detail URL',pg.url());await snap(pg,'13-order-detail');
console.log((await pg.locator('#main').last().innerText()).replace(/\n+/g,' | ').slice(0,700));
console.log('--- log');console.log([...new Set(log)].filter(l=>!/CERT_AUTH|TUNNEL|Stripe|ipify/.test(l)).join('\n'));await b.close()})();
