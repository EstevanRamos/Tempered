const {chromium}=require('/home/user/Tempered/svelte-commerce/node_modules/@playwright/test');
const OUT='/tmp/claude-0/-home-user-Tempered/321b0b48-5646-5676-9166-29099919585e/scratchpad/spike';
async function open(){const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:1280,height:900}});const pg=await ctx.newPage();const log=[];
pg.on('console',m=>{if(['error','warning'].includes(m.type()))log.push(m.type()+': '+m.text().slice(0,200))});
pg.on('pageerror',e=>log.push('pageerror: '+e.message.slice(0,200)));
pg.on('response',r=>{if(r.status()>=400)log.push(r.status()+' '+r.url().slice(0,120))});
pg.on('request',r=>{const u=r.url();if(u.includes('3001'))log.push('→ '+r.method()+' '+u.slice(0,80)+' '+((r.postData()||'').match(/(query|mutation)\s*\w*|\b\w+\(/)?.[0]||''))});
return {b,ctx,pg,log}}
async function snap(pg,name){await pg.screenshot({path:OUT+'/'+name+'.png'});
return pg.evaluate(()=>[...document.querySelectorAll('button,a[href],input,select')].filter(e=>e.offsetParent).map(e=>(e.tagName+'|'+(e.getAttribute('data-testid')||'')+'|'+(e.innerText||e.getAttribute('aria-label')||e.name||e.placeholder||e.getAttribute('href')||'').trim().replace(/\s+/g,' ').slice(0,50))).filter((v,i,a)=>a.indexOf(v)===i).slice(0,80))}
module.exports={open,snap,OUT};
