// Persist numerical processing, controls, visible text and actual rendered plots.
// A server acknowledgement means the observation has been committed to disk.
const retentionStatus=document.createElement('span');retentionStatus.id='autosaveStatus';retentionStatus.className='small';retentionStatus.textContent='Automatic local recording active';document.querySelector('.capture-toolbar').append(retentionStatus);
const retentionQueue=[];let retentionSending=false,retentionScheduled=false,retentionLast='',retentionErrors=[];
const retentionBrowserId=crypto.randomUUID();let retentionSequence=0;
const retentionDB=new Promise((resolve,reject)=>{const request=indexedDB.open('clevacado-dashboard-outbox',1);request.onupgradeneeded=()=>request.result.createObjectStore('outbox',{keyPath:'id',autoIncrement:true});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
async function retentionStore(action,value){const db=await retentionDB;return new Promise((resolve,reject)=>{const tx=db.transaction('outbox',action==='first'?'readonly':'readwrite',{durability:'strict'});const store=tx.objectStore('outbox');let result;const req=action==='put'?store.add({body:value}):action==='delete'?store.delete(value):store.openCursor();req.onsuccess=()=>{result=action==='first'?req.result?.value:req.result};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
retentionDB.then(()=>sendRetention()).catch(e=>{retentionStatus.textContent='Persistent display save unavailable: '+e.message;retentionStatus.className='small bad'});
window.addEventListener('error',e=>{retentionErrors.push(String(e.message));scheduleRetention()});
window.addEventListener('unhandledrejection',e=>{retentionErrors.push(String(e.reason));scheduleRetention()});
function retainView(){
 if(!lastState)return;
 const settings=Object.fromEntries([...document.querySelectorAll('input,select')].map(e=>[e.id||e.name,{value:e.value,checked:e.checked}]));
 const canvases=[...document.querySelectorAll('canvas')].filter(c=>c.getBoundingClientRect().width>0&&c.getBoundingClientRect().height>0).map(c=>({id:c.id||c.closest('.metric')?.querySelector('label')?.textContent||'canvas',width:c.width,height:c.height,dataset:{...c.dataset},png:c.toDataURL('image/png').split(',')[1]}));
 const body={browser_id:retentionBrowserId,filename:lastState.filename,samples:lastState.samples,active_tab:activeTab,settings,visible_text:document.body.innerText.replace(retentionStatus.textContent,''),
  viewport:{width:innerWidth,height:innerHeight,device_pixel_ratio:devicePixelRatio},display_centre:displayCentre,centre_source:centreSource,spatial:{yaw:spatialYaw,pitch:spatialPitch,published_at_ms:spatialPublishedAt},
  fft:fftLatest,fft_paused:fftPaused,fft_waterfall:fftRows,canvases,errors:retentionErrors};
 const signature=JSON.stringify(body);if(signature===retentionLast)return;retentionLast=signature;
 retentionQueue.push({...JSON.parse(signature),observation_id:retentionBrowserId+'-'+(++retentionSequence),history_folder:lastState.retention?.history_folder,raw_data_file:lastState.raw_data_file,browser_utc:new Date().toISOString()});sendRetention();
}
function scheduleRetention(){if(retentionScheduled)return;retentionScheduled=true;requestAnimationFrame(()=>{retentionScheduled=false;try{retainView()}catch(e){retentionStatus.textContent='Display archive error: '+e.message;retentionStatus.className='small bad'}})}
async function sendRetention(){if(retentionSending)return;retentionSending=true;try{while(true){while(retentionQueue.length){await retentionStore('put',retentionQueue[0]);retentionQueue.shift()}const pending=await retentionStore('first');if(!pending)break;const response=await fetch('/api/observation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pending.body),signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('Local archive returned '+response.status);await retentionStore('delete',pending.id);retentionStatus.textContent='Autosaved on this Mac · raw, results & views';retentionStatus.className='small ok';}}catch(e){retentionStatus.textContent='Archive pending: '+e.message+' · retrying automatically';retentionStatus.className='small bad';setTimeout(sendRetention,1000)}finally{retentionSending=false}}
const retentionDraw=draw;draw=function(...args){const value=retentionDraw(...args);scheduleRetention();return value};
const retentionSpatial=drawSpatial;drawSpatial=function(...args){const value=retentionSpatial(...args);scheduleRetention();return value};
const retentionFFT=renderFFT;renderFFT=function(...args){const value=retentionFFT(...args);scheduleRetention();return value};
// Capture controls, equations, marker/diagnostic pagination and navigation too.
document.addEventListener('click',scheduleRetention);document.addEventListener('change',scheduleRetention);document.addEventListener('input',scheduleRetention);
window.addEventListener('resize',scheduleRetention);
new MutationObserver(scheduleRetention).observe($('logs'),{childList:true,subtree:true});
window.addEventListener('beforeunload',e=>{if(retentionQueue.length){e.preventDefault();e.returnValue='Display archive is still saving.'}});
scheduleRetention();
