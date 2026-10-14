// Display-only insight tools. Raw acceleration and recorded timestamps never change.
let followDiagnostics=true,pausedLogAnchor=null;
const followButton=document.createElement('button');followButton.id='followDiagnostics';followButton.className='secondary';followButton.textContent='Pause auto-scroll';followButton.setAttribute('aria-pressed','true');logPager.append(followButton);
const previousPaginate=paginateLogs;
function visibleLogEnd(){return [...$('logs').children].filter(row=>!row.hidden).at(-1)||$('logs').lastElementChild}
paginateLogs=function(){if(followDiagnostics)logPage=0;previousPaginate();const rows=[...$('logs').children],size=Math.max(1,Math.floor($('logs').clientHeight/28));
 if(!followDiagnostics&&pausedLogAnchor){let end=rows.indexOf(pausedLogAnchor)+1;if(end===0){end=Math.min(size,rows.length);pausedLogAnchor=rows[end-1]}const start=Math.max(0,end-size);rows.forEach((row,i)=>row.hidden=i<start||i>=end);$('logPage').textContent='Paused · '+(start+1)+'–'+end+' / '+rows.length;$('olderLogs').disabled=start===0;$('newerLogs').disabled=end>=rows.length}
 $('logs').scrollTop=followDiagnostics?$('logs').scrollHeight:0;followButton.textContent=followDiagnostics?'Pause auto-scroll':'Resume auto-scroll';followButton.setAttribute('aria-pressed',String(followDiagnostics))};
function moveLogPage(direction){const rows=[...$('logs').children],size=Math.max(1,Math.floor($('logs').clientHeight/28));const anchor=followDiagnostics?visibleLogEnd():pausedLogAnchor;followDiagnostics=false;pausedLogAnchor=rows[Math.max(0,Math.min(rows.length-1,rows.indexOf(anchor)+direction*size))];paginateLogs()}
$('olderLogs').onclick=()=>moveLogPage(-1);$('newerLogs').onclick=()=>moveLogPage(1);followButton.onclick=()=>{if(followDiagnostics)pausedLogAnchor=visibleLogEnd();followDiagnostics=!followDiagnostics;paginateLogs()};
// The original observer captured its callback; a second observer follows the new policy.
new MutationObserver(()=>paginateLogs()).observe($('logs'),{childList:true});

const equations={
 temperature_c:['Direct sensor reading','BME280 temperature = Bosch compensation of raw adc_T using calibration coefficients in the chip. Firmware converts to °C. This is sensor temperature, not a separate fruit-core probe.'],
 pressure_hpa:['Direct sensor reading','BME280 pressure = Bosch compensation of raw adc_P using adc_T/t_fine and pressure coefficients. Pressure in Pa ÷ 100 = hPa.'],
 humidity_rh:['Direct sensor reading','BME280 relative humidity = Bosch compensation of raw adc_H using t_fine and humidity coefficients, bounded to 0–100 %RH.'],
 saturation_vapor_pressure_hpa:['Derived from temperature','es = 6.112 × exp(17.62 T / (243.12 + T)) hPa. T is measured °C; Magnus ambient-range approximation.'],
 vapor_pressure_hpa:['Derived from temperature and humidity','e = es × RH / 100 hPa. Derived calculations clamp RH to 0.01–100% to keep logarithms finite.'],
 dew_point_c:['Derived from temperature and humidity','γ = ln(RH/100) + 17.62 T/(243.12 + T); Td = 243.12 γ/(17.62 − γ) °C. RH is clamped to 0.01–100%.'],
 absolute_humidity_gm3:['Derived from temperature and humidity','AH = 216.7 × e/(T + 273.15) g/m³; e is vapour pressure in hPa.'],
 specific_humidity_gkg:['Derived from pressure, temperature and humidity','q = 622 e/(p − 0.378 e) g/kg, only if denominator > 0. p is measured hPa.'],
 vpd_hpa:['Derived from temperature and humidity','VPD = max(0, es − e) hPa. Vapour pressure deficit is not measured directly.'],
 condensation_margin_c:['Derived from temperature and humidity','Margin = T − Td °C. This compares sensor air temperature with dew point; a colder surface can still condense.'],
 altitude_m:['Derived pressure estimate','Altitude = 44330 × [1 − (p/p0)^0.19029495] m. p0 = configured sea-level pressure (1013.25 hPa by default). Weather changes affect this estimate; no GPS.'],
 sea_level_pressure_hpa:['Configured assumption','p0 = configured default sea-level pressure in hPa. This value is assumed, not measured by the component.'],
 condensation_state:['Derived heuristic','Margin ≤ 0 °C: condensing; <2: high; <5: watch; otherwise low. These are display heuristics, not certified fruit-risk thresholds.'],
 address:['Sensor metadata','I2C bus address detected by firmware, normally 0x76. It is an identifier, not an environmental measurement.'],
 chip_id:['Sensor metadata','BME280 identity register, normally 0x60. No calculation.'],
 read_errors:['Diagnostic counter','Cumulative BME280 read failures; no physical unit or environmental equation.']
};
equations.temperature_c[1]='Raw adc_T is a 20-bit register reading; T1–T3 are chip factory coefficients. v1 = (adc_T/16384 − T1/1024) T2; d = adc_T/131072 − T1/8192; t_fine = v1 + d² T3; T = t_fine/5120 °C. t_fine also compensates pressure and humidity. This is sensor temperature, not fruit-core temperature.';
equations.pressure_hpa[1]='Raw adc_P is 20-bit; P1–P9 are chip coefficients. v1 = t_fine/2 − 64000; v2 = v1² P6/32768 + 2 v1 P5; v2 = v2/4 + P4×65536. Then v1 = (P3 v1²/524288 + P2 v1)/524288; v1 = (1 + v1/32768) P1. A zero v1 is invalid. p = (1048576 − adc_P − v2/4096)×6250/v1; p = p + (P9 p²/2147483648 + p P8/32768 + P7)/16. Output = p/100 hPa.';
equations.humidity_rh[1]='Raw adc_H is 16-bit; H1–H6 are chip coefficients. h0 = t_fine − 76800; h = [adc_H − (64 H4 + H5 h0/16384)] × [H2/65536 × (1 + H6 h0/67108864 × (1 + H3 h0/67108864))]. Then h = h × (1 − H1 h/524288). RH = clamp(h, 0, 100) %. Coefficients are read from the BME280 at boot.';
// Bosch BME280 rev 1.24, Tables 2–4. These are typical component
// specifications under stated conditions, not system calibration certificates.
const bmeAccuracySource='https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf';
const bmeAccuracy={
 temperature_c:['Typ. ±0.5 °C · 0–65 °C','Typical internal-sensor temperature accuracy ±0.5 °C over 0–65 °C. PCB temperature and self-heating affect ambient estimates; this does not certify fruit-core temperature.'],
 humidity_rh:['Typ. ±3 %RH · 20–80% @25 °C','Typical absolute accuracy ±3 percentage points RH at 25 °C and 20–80 %RH, including hysteresis; non-condensing conditions. The stated accuracy does not apply across the entire operating range.'],
 pressure_hpa:['Typ. ±1 hPa · 300–1100 hPa / 0–65 °C','Typical absolute pressure accuracy ±1.0 hPa at 300–1100 hPa and 0–65 °C. Typical ±1.7 hPa at −20–0 °C; ±1.5 hPa at 1100–1250 hPa and 25–40 °C. These are absolute accuracy, not resolution or filtered noise.'],
 sea_level_pressure_hpa:['Assumed · no sensor accuracy','Configured sea-level pressure, not measured. No BME280 accuracy specification applies to this assumed input.'],
 address:['Metadata · accuracy N/A','Bus identifier; physical measurement accuracy is not applicable.'],
 chip_id:['Metadata · accuracy N/A','Identity register; physical measurement accuracy is not applicable.'],
 read_errors:['Counter · accuracy N/A','Diagnostic count; physical measurement accuracy is not applicable.']
};
function environmentAccuracy(key,e){
 const spec=bmeAccuracy[key]||['Calculated · accuracy unqualified','Calculated from BME280 inputs. Bosch supplies no direct accuracy specification for this derived value. Input uncertainty and equation assumptions propagate; system uncertainty has not been calibrated.'];
 let outside=false;
 if(e?.ready){const t=Number(e.temperature_c),h=Number(e.humidity_rh),p=Number(e.pressure_hpa);
  if(key==='temperature_c')outside=!(t>=0&&t<=65);
  if(key==='pressure_hpa')outside=!(t>=0&&t<=65&&p>=300&&p<=1100);
  // Bosch specifies humidity accuracy at 25 °C, not a wider temperature band.
  // Do not invent a ±temperature tolerance around that test point.
  if(key==='humidity_rh')outside=!(h>=20&&h<=80);
 }
 return {label:spec[0]+(outside?' · outside stated range':''),detail:spec[1]};
}
let equationPages=[],equationPage=0;
function showEquationPage(){const text=equationPages[equationPage]||'';$('equationText').textContent=text;$('equationPage').textContent=(equationPage+1)+' / '+Math.max(1,equationPages.length);$('previousEquation').disabled=equationPage===0;$('nextEquation').disabled=equationPage>=equationPages.length-1}
const equationPane=document.createElement('section');equationPane.className='equation-pane';equationPane.hidden=true;equationPane.innerHTML='<div class="panelhead"><strong id="equationTitle"></strong><button id="closeEquation" class="secondary">Close equation</button></div><p id="equationText"></p><p class="small">Inputs: temperature T (°C), relative humidity RH (%), pressure p (hPa). Derived values use the current firmware equations.</p>';$('bme').closest('section').append(equationPane);$('closeEquation').onclick=()=>{equationPane.hidden=true;renderEnvironmentGraphs()};const equationPager=document.createElement('div');equationPager.className='pager';equationPager.innerHTML='<button id="previousEquation" class="secondary">Previous</button><span id="equationPage"></span><button id="nextEquation" class="secondary">Next</button>';equationPane.append(equationPager);const sourceLink=document.createElement('a');sourceLink.href=bmeAccuracySource;sourceLink.target='_blank';sourceLink.rel='noopener';sourceLink.textContent='Bosch datasheet · Tables 2–4';sourceLink.className='accuracy-source';equationPager.append(sourceLink);$('previousEquation').onclick=()=>{equationPage--;showEquationPage()};$('nextEquation').onclick=()=>{equationPage++;showEquationPage()};
let environmentHistory=[],environmentSignature='';
function ingestEnvironment(s){environmentHistory=(s.environment_history||[]).slice(-720);if(!environmentHistory.length&&s.environment?.ready)environmentHistory=[s.environment];}
function renderEnvironmentGraphs(){if(activeTab!=='environment')return;const cells=[...$('bme').children];for(let i=0;i<metrics.length;i++){
 const [name,key]=metrics[i],cell=cells[i];if(!cell)continue;cell.classList.add('environment-metric');
 let button=cell.querySelector('button');if(!button){button=document.createElement('button');button.className='equation-button';button.textContent='Equation';button.setAttribute('aria-label','Equation for '+name);button.onclick=()=>{equationPane.hidden=false;$('equationTitle').textContent=name+' · '+equations[key][0];const full=equations[key][1]+" Accuracy: "+environmentAccuracy(key,testingState?.environment).detail;equationPages=full.match(/.{1,240}(?:\s|$)/g)||[full];equationPage=0;showEquationPage();const e=testingState?.environment;equationPane.querySelector('p.small').textContent=e?.ready?'Current snapshot inputs: T '+Number(e.temperature_c).toFixed(3)+' °C · RH '+Number(e.humidity_rh).toFixed(3)+' % · p '+Number(e.pressure_hpa).toFixed(3)+' hPa. Factory coefficients come from the sensor.':'Inputs: T (°C), RH (%), p (hPa); no current snapshot available.';renderEnvironmentGraphs()};cell.append(button)}
 let accuracy=cell.querySelector('.metric-accuracy');if(!accuracy){accuracy=document.createElement('span');accuracy.className='metric-accuracy';cell.append(accuracy)}const spec=environmentAccuracy(key,testingState?.environment);accuracy.textContent=spec.label;accuracy.title=spec.detail+' Source: Bosch BME280 rev 1.24, Tables 2–4.';
 let canvas=cell.querySelector('canvas');if(!canvas){canvas=document.createElement('canvas');canvas.className='environment-spark';canvas.setAttribute('aria-label',name+' history');cell.append(canvas)}
 if(['address','chip_id'].includes(key)&&testingState?.environment?.[key]!=null)cell.querySelector('strong').textContent='0x'+Number(testingState.environment[key]).toString(16).toUpperCase();
 const numeric=environmentHistory.map((row,index)=>({v:key==='condensation_state'?({low:0,watch:1,high:2,condensing:3}[row[key]]??NaN):row[key]==null?NaN:Number(row[key]),t:Number.isFinite(Date.parse(row.host_time_utc))?Date.parse(row.host_time_utc)/1000:Number(row.device_uptime_s??index)})).filter(p=>Number.isFinite(p.v));
 const rect=canvas.getBoundingClientRect(),w=Math.max(20,rect.width),h=Math.max(14,rect.height),d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;const ctx=canvas.getContext('2d');ctx.scale(d,d);ctx.strokeStyle='#5ad6cc';ctx.fillStyle='#91a49e';ctx.font='8px sans-serif';
 if(['address','chip_id'].includes(key)){ctx.fillText('Sensor identifier · no trend',2,h/2+3);continue}
 if(!numeric.length){ctx.fillText('Metadata · no numeric trend',2,h/2+3);continue}
 if(numeric.length===1){ctx.fillText('1 snapshot · waiting for trend',2,h/2+3);continue}
 const lo=Math.min(...numeric.map(p=>p.v)),hi=Math.max(...numeric.map(p=>p.v)),span=Math.max(hi-lo,.001),start=numeric[0].t,end=numeric.at(-1).t;ctx.beginPath();numeric.forEach((p,j)=>{const x=2+(p.t-start)/Math.max(1,end-start)*(w-4),y=h-3-(p.v-lo)/span*(h-10);if(j)ctx.lineTo(x,y);else ctx.moveTo(x,y)});ctx.stroke();canvas.title=numeric.length+' measured snapshots · '+lo.toFixed(3)+' to '+hi.toFixed(3)+' · '+Math.max(0,end-start).toFixed(0)+' seconds';canvas.dataset.samples=numeric.length;
}}
const oldBme=renderBme;renderBme=function(b,t){if($('bme').children.length!==metrics.length)oldBme(b,t);else{metrics.forEach(([name,key,unit],i)=>{const value=b?.[key];$('bme').children[i].querySelector('strong').textContent=value==null?'—':(typeof value==='number'?value.toFixed(3):value)+' '+unit});$('snapshotTime').textContent=t?'Snapshot · '+t+(b&&(b.age_ms!=null||b.sample_age_ms!=null)?' · Sensor reading age '+(Number(b.age_ms??b.sample_age_ms)/1000).toFixed(1)+'s':''):'No BME280 snapshot recorded'}renderEnvironmentGraphs()};

let displayCentre=null,centreFile='',centreSource='Waiting for quiet readings',spatialLastT=null,spatialPublishedAt=performance.now();
function reference(){return testingState?.noise_reference||{common_band_g:1.66,axis_band_g:[1.5,1.55,1.66],approximate_mean_g:[-1.72,-1.57,1.29]}}
function centreFromRecent(force=false){const p=points||[],rate=testingState?.capture_rate_hz||400,minSamples=Math.min(16,Math.max(3,Math.ceil(3*rate))),duration=Math.max(3000000,(minSamples-1)*1000000/rate+100000);if(p.length<minSamples)return false;const last=p.at(-1).t,window=p.filter(x=>last-x.t<=duration);if(window.length<minSamples||last-window[0].t<duration-300000)return false;const mean=[0,1,2].map(a=>window.reduce((sum,x)=>sum+x.v[a],0)/window.length),sd=[0,1,2].map(a=>Math.sqrt(window.reduce((sum,x)=>sum+(x.v[a]-mean[a])**2,0)/window.length));if(!force&&sd.some((v,a)=>v>reference().axis_band_g[a]/2))return false;if(force&&sd.some((v,a)=>v>reference().axis_band_g[a]))return false;displayCentre=mean;centreSource='Frozen '+(force?'operator':'quiet-window')+' baseline';return true}
function updateCentre(s){const key=s.filename+'|'+s.capture_rate_hz;if(key!==centreFile){centreFile=key;displayCentre=null;centreSource='Waiting for quiet readings'}if(s.testing?.baseline?.mean_g&&s.testing.baseline.rate_hz===s.capture_rate_hz){displayCentre=s.testing.baseline.mean_g;centreSource='Saved stationary baseline'}else if(!displayCentre)centreFromRecent();const latest=(s.points||[]).at(-1)?.t;if(latest!==spatialLastT){spatialLastT=latest;spatialPublishedAt=performance.now()}}
const centreOption=document.createElement('option');centreOption.value='centered';centreOption.textContent='Centred motion + noise band';$('graphView').prepend(centreOption);$('graphView').value='centered';
const priorInsightsDraw=draw;draw=function(){const raw=points,mode=$('graphView').value,ref=reference(),base=displayCentre||ref.approximate_mean_g;if(mode==='centered'){points=raw.map(p=>({...p,v:p.v.map((v,a)=>v-base[a])}));$('graphView').value='raw'}priorInsightsDraw();if(mode==='centered'){$('graphView').value=mode;$('viewExplanation').textContent=(displayCentre?centreSource:'Historical approximate centre')+' · orange ±'+ref.common_band_g.toFixed(2)+' g inferred '+(ref.rate_specific?ref.rate_hz+' Hz ':'')+'quiet reference; raw CSV unchanged.'}
 const c=$('plot'),r=c.getBoundingClientRect(),ctx=c.getContext('2d'),limit=Math.max(2,Math.ceil(Math.max(1,...points.flatMap(p=>p.v.map(Math.abs)))*1.2));
 if(mode==='centered'||mode==='baseline'){ctx.save();ctx.strokeStyle='#ffab40';ctx.lineWidth=1.4;ctx.setLineDash([6,4]);for(const value of [-ref.common_band_g,ref.common_band_g]){const y=44+(limit-value)/(2*limit)*(r.height-88);ctx.beginPath();ctx.moveTo(44,y);ctx.lineTo(r.width-8,y);ctx.stroke()}ctx.restore();c.dataset.noiseBandG=ref.common_band_g}else{delete c.dataset.noiseBandG;$('viewExplanation').textContent+=' Select centred motion to compare with the stationary noise band.'}
 points=raw;drawSpatial();};
const settings=document.createElement('div');settings.className='controls trail-settings';settings.innerHTML='<label>Style <select id="spatialStyle" aria-label="Motion view style"><option value="pointer">A · Clean pointer</option><option value="ribbon">B · Short ribbon</option><option value="planes">C · XY / XZ / YZ</option></select></label><label>Smooth <select id="spatialSmooth" aria-label="Display smoothing"><option value="0">Off · raw</option><option value="50" selected>50 ms</option><option value="100">100 ms</option></select></label><label>Trail <select id="trailSeconds" aria-label="Trail lifetime"><option value="0.6" selected>0.6 s</option><option value="1">1 s</option><option value="2">2 s</option><option value="3">3 s</option><option value="5">5 s</option><option value="8">8 s</option></select></label><label>Points <select id="trailPoints" aria-label="Trail point limit"><option selected>40</option><option>80</option><option>200</option><option>500</option></select></label><label>Scale <select id="spatialScale" aria-label="3D scale"><option value="auto">Auto</option><option value="2">±2 g</option><option value="5" selected>±5 g</option><option value="10">±10 g</option><option value="50">±50 g</option></select></label><button id="centreSpatial" class="secondary">Centre while still</button><span id="centreFeedback" class="small"></span>';$('spatialPlot').closest('.spatial-panel').append(settings);$('spatialPlot').closest('.spatial-panel').querySelector('p').textContent='Choose A, B or C to compare. Hold still, then Centre. Smoothing is display-only and can hide short peaks; raw CSV is unchanged. This shows acceleration, not position.';
$('centreSpatial').onclick=()=>{$('centreFeedback').textContent=centreFromRecent(true)?'Centre captured from recent quiet readings.':'Hold still for at least 3 seconds (longer at low rates); recent readings are missing or unstable.';draw();drawSpatial()};for(const id of ['trailSeconds','trailPoints','spatialScale','spatialStyle','spatialSmooth'])$(id).onchange=()=>drawSpatial();
window.removeEventListener('resize',drawSpatial);
window.addEventListener('resize',()=>drawSpatial());
drawSpatial=function(){
 if(activeTab!=='spatial')return;const began=performance.now(),canvas=$('spatialPlot'),r=canvas.getBoundingClientRect();if(r.width<10||r.height<10)return;
 const d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;const ctx=canvas.getContext('2d');ctx.scale(d,d);
 const lifetime=Number($('trailSeconds').value),cap=Number($('trailPoints').value),style=$('spatialStyle').value,smooth=Number($('spatialSmooth').value),all=points||[],latest=all.at(-1)?.t??0,stale=testingState?.capture_state==='Saved review'?0:(performance.now()-spatialPublishedAt)/1000,base=displayCentre||reference().approximate_mean_g;
 // Average by elapsed time rather than connecting hundreds of noisy samples.
 // The original samples and peaks remain untouched in every recorded file.
 const tail=all.filter(p=>(latest-p.t)/1e6+stale<lifetime),bins=[];
 for(const p of tail){const bucket=smooth?Math.floor(p.t/(smooth*1000)):p.t;let bin=bins.at(-1);if(!bin||bin.bucket!==bucket){bin={bucket,t:p.t,sum:[0,0,0],n:0};bins.push(bin)}bin.t=p.t;bin.n++;p.v.forEach((v,a)=>bin.sum[a]+=v-base[a])}
 const stride=Math.max(1,Math.ceil(bins.length/cap));let recent=bins.filter((_,i)=>i%stride===0||i===bins.length-1).slice(-cap).map(p=>({v:p.sum.map(v=>v/p.n),age:(latest-p.t)/1e6+stale}));
 for(const id of ['spatialLeft','spatialRight','spatialUp','spatialDown','spatialReset'])$(id).disabled=style==='planes';
 const setting=$('spatialScale').value,extent=setting==='auto'?Math.max(2,...recent.flatMap(p=>p.v.map(Math.abs)))*1.15:Number(setting);
 const colours=['#b5ed72','#5ad6cc','#ff8b9c'];ctx.lineCap='round';ctx.lineJoin='round';ctx.font='11px sans-serif';
 function drawTrail(project){if(style!=='pointer')for(let i=1;i<recent.length;i++){const alpha=Math.max(0,1-recent[i].age/lifetime);ctx.strokeStyle='rgba(230,244,255,'+(alpha*.7)+')';ctx.lineWidth=1+alpha*2;ctx.beginPath();ctx.moveTo(...project(recent[i-1].v));ctx.lineTo(...project(recent[i].v));ctx.stroke()}
  if(recent.length){const xy=project(recent.at(-1).v),alpha=Math.max(0,1-recent.at(-1).age/lifetime);ctx.globalAlpha=alpha;ctx.fillStyle='#f5fbff';ctx.strokeStyle='#0b1110';ctx.lineWidth=3;ctx.beginPath();ctx.arc(...xy,7,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.globalAlpha=1}}
 if(style==='planes'){
  const pairs=[[0,1,'XY'],[0,2,'XZ'],[1,2,'YZ']],w=r.width/3;
  pairs.forEach(([a,b,name],i)=>{const cx=w*(i+.5),cy=r.height/2,scale=Math.min(w-50,r.height-80)*.42/extent;
   const project=v=>[cx+Math.max(-extent,Math.min(extent,v[a]))*scale,cy-Math.max(-extent,Math.min(extent,v[b]))*scale];ctx.strokeStyle='#273b36';ctx.strokeRect(w*i+8,8,w-16,r.height-16);ctx.fillStyle='#c9d9d3';ctx.fillText(name+' · ±'+extent.toFixed(1)+' g',w*i+20,28);
   for(const [axis,horizontal] of [[a,true],[b,false]]){ctx.strokeStyle=colours[axis];ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-(horizontal?extent*scale:0),cy+(horizontal?0:extent*scale));ctx.lineTo(cx+(horizontal?extent*scale:0),cy-(horizontal?0:extent*scale));ctx.stroke();ctx.fillStyle=colours[axis];ctx.fillText('XYZ'[axis],cx+(horizontal?extent*scale+5:5),cy-(horizontal?5:extent*scale+5))}
   ctx.fillStyle='#60776c';ctx.fillText('0',cx+5,cy+13);drawTrail(project);
  });
 }else{
  const scale=Math.min(r.width,r.height)*.36/extent;
  function project(v){const[x,y,z]=v.map(x=>Math.max(-extent,Math.min(extent,x))),cy=Math.cos(spatialYaw),sy=Math.sin(spatialYaw),cp=Math.cos(spatialPitch),sp=Math.sin(spatialPitch),a=x*cy-z*sy,b=x*sy+z*cy;return[r.width/2+a*scale,r.height/2-(y*cp-b*sp)*scale]}
  for(let a=0;a<3;a++){const v=[0,0,0],zero=project(v);v[a]=-extent;ctx.strokeStyle=colours[a]+'55';ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(...project(v));ctx.lineTo(...zero);ctx.stroke();ctx.setLineDash([]);v[a]=extent;const end=project(v);ctx.strokeStyle=colours[a];ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(...zero);ctx.lineTo(...end);ctx.stroke();ctx.fillStyle=colours[a];ctx.font='bold 13px sans-serif';ctx.fillText('+'+'XYZ'[a],end[0]+7,end[1]-5)}
  const origin=project([0,0,0]);ctx.strokeStyle='#ffab40';ctx.lineWidth=1;ctx.beginPath();ctx.arc(...origin,5,0,Math.PI*2);ctx.stroke();
  if(recent.length&&style==='pointer'){ctx.strokeStyle='#eff8ff88';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(...origin);ctx.lineTo(...project(recent.at(-1).v));ctx.stroke()}
  drawTrail(project);ctx.fillStyle='#91a49e';ctx.font='11px sans-serif';ctx.fillText('Fixed axes · ±'+extent.toFixed(1)+' g · orange centre = still baseline',12,20);
 }
 if(recent.length){const v=recent.at(-1).v;$('spatialValue').textContent=v.map((v,a)=>'XYZ'[a]+' '+v.toFixed(2)).join(' · ')+' g'+(smooth?' · '+smooth+' ms average':' · raw')+(v.some(x=>Math.abs(x)>extent)?' · exceeds scale (pointer at edge)':'')}else $('spatialValue').textContent='Cleared · waiting for readings';
 $('centreFeedback').textContent=centreSource+' · display-only centre '+base.map(v=>v.toFixed(2)).join(', ')+' g';canvas.dataset.pointCount=recent.length;canvas.dataset.renderMs=(performance.now()-began).toFixed(3);canvas.dataset.style=style;canvas.dataset.trailSeconds=lifetime;
};
const previousRenderTesting=renderTesting;renderTesting=function(s){testingState=s;ingestEnvironment(s);updateCentre(s);previousRenderTesting(s);renderEnvironmentGraphs()};
setInterval(()=>{if(activeTab==='spatial')drawSpatial()},100);window.addEventListener('resize',renderEnvironmentGraphs);if(lastState)renderTesting(lastState);
