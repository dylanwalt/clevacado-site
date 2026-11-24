(() => {
 const rows=[...document.querySelectorAll('.row')], stage=document.getElementById('stage'), prev=document.getElementById('prev-case'), next=document.getElementById('next-case'), toggle=document.getElementById('rotation-control'), count=document.getElementById('case-counter'), cd=document.getElementById('rotation-countdown');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'), period=30000;
 let index=0, automatic=!reduced.matches, due=0, timeout=0, ticker=0;
 function paint(){
   stage.dataset.activeCase=rows[index].dataset.case;stage.dataset.rotation=automatic?'playing':'paused';
   toggle.textContent=automatic?'Pause rotation':'Start rotation';
   const label='Case '+(index+1)+' of '+rows.length;
   if(count.textContent!==label)count.textContent=label;
   if(!automatic){cd.textContent='Auto rotation off';return}
   if(document.hidden){cd.textContent='Auto rotation suspended';return}
   cd.textContent='Next in '+Math.min(30,Math.max(0,Math.ceil((due-Date.now())/1000)))+'s';
 }
 function schedule(){
   clearTimeout(timeout);clearInterval(ticker);due=Date.now()+period;paint();
   if(automatic&&!document.hidden){
     timeout=setTimeout(()=>show(index+1),period);
     ticker=setInterval(paint,250);
   }
 }
 function show(n){
   index=(n+rows.length)%rows.length;
   rows.forEach((row,i)=>{row.hidden=i!==index});
   document.dispatchEvent(new Event('cleva:case-change'));schedule();
 }
 function toggleRotation(){automatic=!automatic;schedule()}
 prev.addEventListener('click',()=>show(index-1));
 next.addEventListener('click',()=>show(index+1));
 toggle.addEventListener('click',toggleRotation);
 addEventListener('keydown',e=>{
   if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.isComposing||e.repeat||/^(INPUT|SELECT|TEXTAREA)$/.test(e.target?.tagName))return;
   if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}
   if(e.key.toLowerCase()==='p'){e.preventDefault();toggleRotation();}
 });
 reduced.addEventListener('change',e=>{automatic=!e.matches;schedule()});
 document.addEventListener('visibilitychange',schedule);
 schedule();
})();