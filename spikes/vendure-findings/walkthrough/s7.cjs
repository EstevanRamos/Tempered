const {chromium}=require('/home/user/Tempered/svelte-commerce/node_modules/@playwright/test');
const {snap,OUT}=require('./lib.cjs');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:1280,height:900},storageState:OUT+'/state.json'});const pg=await ctx.newPage();const log=[];
pg.on('pageerror',e=>log.push('pageerror: '+e.message.slice(0,200)));pg.on('console',m=>{if(m.type()==='error')log.push('console: '+m.text().slice(0,200))});
pg.on('response',async r=>{if(r.url().includes('3001/shop-api')){try{const q=r.request().postData()||'';const t=await r.text();const op=(q.match(/\b(mutation|query)\b[^{]*\{\s*(\w+)/)||[])[2]||'?';log.push('shop-api '+op+' → '+(/errorCode|"errors"/.test(t)?t.slice(0,300):'ok'))}catch{}}});
await pg.goto('http://localhost:3000/checkout/payment',{waitUntil:'networkidle'});await pg.waitForTimeout(800);
await pg.getByTestId('checkout-button').click();await pg.waitForTimeout(2500);   // review
await pg.getByTestId('checkout-button').click();                                  // confirm
await pg.waitForURL(/success|failed|process/,{timeout:30000}).catch(()=>{});await pg.waitForLoadState('networkidle');await pg.waitForTimeout(2500);
console.log('URL:',pg.url());await snap(pg,'08-placed');
console.log((await pg.locator('#main').last().innerText()).replace(/\n+/g,' | ').slice(0,700));
await ctx.storageState({path:OUT+'/state.json'});
console.log('--- log');console.log([...new Set(log)].filter(l=>!/CERT_AUTH|TUNNEL|Stripe|ipify/.test(l)).join('\n'));await b.close()})();
