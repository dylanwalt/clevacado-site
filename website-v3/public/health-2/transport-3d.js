import * as T from 'three';
import {GLTFLoader} from '/presentation-v2/vendor/GLTFLoader.js';

const stage=document.querySelector('#stage'), switcher=document.querySelector('#motion-control'), status=document.querySelector('#render-status');
const roots=[...document.querySelectorAll('.model-view')], pref=matchMedia('(prefers-reduced-motion: reduce)');
const MODEL='/health/models/';
const TAU=Math.PI*2;
let renderer, views, motion=!pref.matches, time=0, last=0, raf=0, runningScale=1, frameCount=0;
const mk=(color,roughness=.58,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
const mats={rubber:mk(0x253338,.84),floor:mk(0xb6c2b9,.86),wall:mk(0xe3eae2,.84),bench:mk(0x758789,.43,.26),steel:mk(0x9eaeaf,.32,.44),green:mk(0x5e7163,.66),tray:mk(0xc7ddd0,.79),foam:mk(0xb3c8b9,.94),accent:mk(0xd5ed56,.48),white:mk(0xe2e8de,.76),lining:mk(0x537460,.71),strip:mk(0x8a9e89,.61),dark:mk(0x4e5b57,.78)};
const geometries=new Map();
function part(root,g,material,x,y,z){const p=new T.Mesh(g,material);p.position.set(x,y,z);root.add(p);return p}
function g(key,make){if(!geometries.has(key))geometries.set(key,make());return geometries.get(key)}
function box(root,mat,x,y,z,w,h,d){return part(root,g('b:'+w+':'+h+':'+d,()=>new T.BoxGeometry(w,h,d)),mat,x,y,z)}
function cylinder(root,mat,x,y,z,r,h){return part(root,g('c:'+r+':'+h,()=>new T.CylinderGeometry(r,r,h,20)),mat,x,y,z)}
function contact(root,x,y,z,w,d,s=.24){
 const m=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{o:{value:s}},vertexShader:`varying vec2 q; void main(){q=uv*2.-1.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 q;uniform float o;void main(){float a=pow(clamp(1.-dot(q,q),0.,1.),2.);gl_FragColor=vec4(.04,.07,.045,o*a);}`});
 const p=part(root,new T.PlaneGeometry(w,d),m,x,y,z);p.rotation.x=-Math.PI/2;return p;
}
function frameProduct(template,width=1) {
 const obj=template.clone(true);obj.updateMatrixWorld(true);
 const b=new T.Box3().setFromObject(obj),sz=b.getSize(new T.Vector3()),mid=b.getCenter(new T.Vector3());
 if(!Number.isFinite(sz.x)||sz.x<=.001)throw Error('Model has no usable width');
 obj.scale.multiplyScalar(width/sz.x);obj.position.add(new T.Vector3(-mid.x,-b.min.y,-mid.z).multiplyScalar(width/sz.x));
 const outer=new T.Group();outer.add(obj);return outer;
}
function bench(scene,color=mats.bench){
 box(scene,color,0,-.092,0,3.7,.16,1.85);
 box(scene,mats.steel,0,-.15,.936,3.7,.09,.034);
}
function rollerBed(scene){
 const rollers=new T.Group();scene.add(rollers);
 for(let i=-18;i<=18;i++){if(i===0)continue;const o=cylinder(rollers,mats.steel,i*.129,-.065,0,.045,1.16);o.rotation.x=Math.PI/2;}
 for(const z of [-.61,.61]){box(rollers,mats.dark,0,-.095,z,5.3,.16,.085);box(rollers,mats.steel,0,-.019,z,5.3,.025,.09);}
 box(rollers,mats.rubber,0,-.15,0,5.4,.06,1.28);
 return rollers;
}
function room(scene,caseId,type) {
 scene.background=new T.Color(caseId==='neonatal'?0xb5c6ba:caseId==='specimen'?0xcbd9d6:0xd6ddcc);
 scene.fog=new T.Fog(scene.background,5,10);
 const floor=part(scene,new T.PlaneGeometry(40,40),mats.floor,0,-(type==='setup'||caseId==='specimen'?.79:.25),0);
 floor.rotation.x=-Math.PI/2;
 box(scene,mats.wall,0,1.14,-1.88,8,3.5,.10);
 box(scene,mats.strip,0,-.05,-1.81,8,.08,.045);
 if(caseId==='neonatal') {
   for(const x of [-2.3,-1.4]){box(scene,mats.bench,x,.49,-1.72,.76,1.03,.2);for(const y of [.16,.46,.76]){box(scene,mats.white,x,y,-1.57,.72,.22,.12);box(scene,mats.steel,x,y+.02,-1.49,.28,.027,.04)}}
   box(scene,mats.green,1.22,.91,-1.77,1.75,1.18,.17);box(scene,mats.white,1.22,.91,-1.65,1.58,1.03,.10);
   box(scene,mats.rubber,0,-.055,0,5.9,.10,1.91);
   for(const z of [-.84,.84]){box(scene,mats.steel,0,.009,z,5.6,.022,.038);}
   for(const x of [-.65,1.3])box(scene,mats.steel,x,.006,0,.028,.009,1.53);
 } else {
   const shade=caseId==='pharma'?mats.green:mats.bench;
   for(const x of [-2.0,-.76,.48,1.72]){box(scene,mats.white,x,.29,-1.73,1.11,.88,.14);box(scene,shade,x,.36,-1.62,.21,.035,.029);}
   box(scene,mats.steel,0,.76,-1.75,5.22,.052,.27);
   if(type==='event'&&caseId==='pharma') rollerBed(scene);else bench(scene,caseId==='pharma'?mats.dark:mats.bench);
 }
 const amb=new T.HemisphereLight(0xf1fbff,0x687a6a,2.15);scene.add(amb);
 const key=new T.DirectionalLight(0xfff5e2,2.75);key.position.set(3,5,5);scene.add(key);
 const bounce=new T.DirectionalLight(0xd3edeb,1.45);bounce.position.set(-3,2,-2);scene.add(bounce);
}
function chassisLid(actor,caseId){
 if(caseId==='specimen') return actor.getObjectByName('CarrierLid');
 const child=actor.getObjectByName('ShipperLid');
 if(!child)return null;
 const p=child.parent, ext=new T.Box3().setFromObject(child), pivot=new T.Group(), old=new T.Vector3((ext.min.x+ext.max.x)/2,ext.min.y,ext.min.z);
 p.updateMatrixWorld(true);pivot.position.copy(p.worldToLocal(old));p.add(pivot);pivot.updateMatrixWorld(true);pivot.attach(child);
 return pivot;
}
function rack(scene,caseId){
 const assembly=new T.Group();
 assembly.position.set(.18,0,.65);scene.add(assembly);
 const isP=caseId==='pharma';
 box(assembly,mats.tray,0,.04,0,.56,.08,.31);
 box(assembly,mats.foam,0,.08,0,.5,.042,.263);
 for(const z of [-.134,.134])box(assembly,mats.tray,0,.103,z,.56,.075,.033);
 for(const x of [-.264,.264])box(assembly,mats.tray,x,.103,0,.032,.075,.25);
 if(isP){for(const x of [-.19,-.085,.02,.127]){const pl=cylinder(assembly,mats.white,x,.156,-.004,.032,.117);cylinder(assembly,mats.steel,x,.228,-.004,.034,.03);}}
 else {for(const x of [-.19,-.09,.01,.11]){const tube=cylinder(assembly,mats.white,x,.155,-.01,.022,.115);cylinder(assembly,mats.green,x,.218,-.01,.026,.026);}}
 return assembly;
}
function makeView(root,template,vial,pod){
 const [id,type]=root.dataset.scene.split(':'), scene=new T.Scene(), setup=type==='setup';
 room(scene,id,type);
 const actor=frameProduct(template,id==='neonatal'?1.25:1.22);scene.add(actor);
 let prop=null,lid=null,inset=null,mount=null;
 const neon=id==='neonatal';
 const spec=id==='specimen';
 if(setup){
   if(!neon){actor.position.set(-.33,0,-.055);lid=chassisLid(actor,id);inset=rack(scene,id);} 
   if(neon){const old=actor.getObjectByName('MotionLogger');if(old){actor.updateMatrixWorld(true);mount=new T.Box3().setFromObject(old).getCenter(new T.Vector3());old.visible=false;}prop=frameProduct(pod,.15);scene.add(prop);prop.rotation.y=-.22;}
   else if(spec){
     prop=new T.Group();const y=.054;
     cylinder(prop,mats.accent,0,y,0,.026,.107);
     cylinder(prop,mats.green,0,y+.064,0,.03,.025);scene.add(prop);
   } else {prop=frameProduct(vial,.079);scene.add(prop);}
 }
 const shadow=contact(scene,0,id==='pharma'&&type==='event'?-.004:.004,0,neon?1.64:1.68,neon?.78:1.14,.51);
 if(lid)lid.rotation.x=spec?-.19:-.13;
 const camera=new T.PerspectiveCamera(neon?35:setup?30:27,1,.06,28);
 const aim=new T.Vector3(0,neon?.655:id==='pharma'&&type==='event'?.21:setup?.37:.28,setup&& !neon?.13:0);
 const cam0=setup?(neon?[2.0,1.42,2.55]:[1.71,1.42,2.56]):(neon?[-1.38,1.55,2.86]:[1.61,1.25,2.69]);
 function step(t) {
   const dur=id==='neonatal'?8.6:id==='pharma'?8:7.8,p=(t+(id==='specimen'?.22:id==='neonatal'?.48:0))%dur;
   const smooth=(a,b,x=p)=>T.MathUtils.smoothstep(x,a,b);
   const set=(x,y,z)=>prop.position.set(x,y,z);
   const eventAt=id==='pharma'?3.5:spec?3.38:4.0;
   let fx=0,fy=0,fz=0,rx=0,rz=0;
   if(setup){
     const place=smooth(.55,2.85),reset=smooth(dur-.6,dur),down=place*(1-reset);
     if(neon){
       const z=(mount?.z??.275)+.24*(1-down), y=(mount?.y??.24)-.013+.37*(1-down);
       set((mount?.x??.28)+.31*(1-down),y,z);
     }else{
       const z=.645+.21*(1-down), y=.112+.52*(1-down);
       set(.39+.24*(1-down),y,z);
       if(lid)lid.rotation.x=-(spec?.86:.48)*smooth(.1,1.6)*(1-smooth(4.65,6.5));
     }
     shadow.position.x=neon?0:-.33;shadow.position.z=neon?0:-.055;
   }else{
     const a=Math.max(0,p-eventAt), impact=a<1.05?Math.sin(a*23)*Math.exp(-4.9*a):0;
     if(id==='pharma'){
       const approach=smooth(.45,6.2); fx=-1.03+2.06*approach;fy=.025+Math.abs(impact)*.045;rz=-.12*impact;rx=.05*impact;
     }else if(spec){
       fy=.38*(1-smooth(.5,eventAt))+.049*Math.abs(impact);fx=-.25+.29*smooth(.25,4);rz= -.14*(1-smooth(.9,eventAt))+.07*impact; fz=-.02;
     }else{
       const b=(p>=3.25&&p<=5.35)?Math.sin((p-3.25)*20)*Math.sin((p-3.25)/2.1*Math.PI):0;
       fx=-.42+.84*smooth(.1,7.4);fy=.017+Math.abs(b)*.034;rz=.043*b;rx=-.048*b;fz=.045*b;
     }
     actor.position.set(fx,fy,fz);actor.rotation.set(rx,id==='pharma'?.06:spec?-.14:.04,rz);
     shadow.position.set(fx,shadow.position.y,fz);shadow.material.uniforms.o.value=.52-fy*.36;
     root.parentElement.classList.toggle('flagging',motion&&p>=eventAt&&p<eventAt+1.43);
   }
   const drift=motion?.07*Math.sin(p/dur*TAU):0;
   camera.position.set(cam0[0]+drift,cam0[1],cam0[2]-drift);camera.lookAt(aim);
 }
 return {scene,camera,root,step,row:root.closest('.row')};
}
function dimensions(){
 const stageBox=stage.getBoundingClientRect(), scale=stageBox.width/1920;
 let ratio=window.devicePixelRatio||1;
 const resolution=Math.min(1,Math.max(.45,scale*Math.min(1.45,ratio)));
 if(Math.abs(resolution-runningScale)>.015 || renderer.domElement.width<10){runningScale=resolution;renderer.setPixelRatio(resolution);renderer.setSize(1920,1080,true)}
 for(const v of views){
   if(v.row.hidden)continue;
   const b=v.root.getBoundingClientRect();
   const x=Math.round((b.left-stageBox.left)/scale), y=Math.round((stageBox.bottom-b.bottom)/scale);
   const w=Math.round(b.width/scale),h=Math.round(b.height/scale);
   v.viewport=[x,y,w,h];v.camera.aspect=w/Math.max(1,h);v.camera.updateProjectionMatrix();
 }
}
function draw(){
 renderer.setScissorTest(false);renderer.setClearColor(0,0);renderer.clear(true,true,true);renderer.setScissorTest(true);
 const active=views.filter(v=>!v.row.hidden);stage.dataset.visibleDraws=String(active.length);
 for(const v of active){
   renderer.setViewport(...v.viewport);renderer.setScissor(...v.viewport);v.step(time);renderer.render(v.scene,v.camera);
 }
 stage.dataset.frames=String(++frameCount);
}
function cancel(){if(raf){cancelAnimationFrame(raf);raf=0}last=0}
function loop(now){
 raf=0;
 if(!motion||document.hidden||stage.dataset.render!=='live')return;
 if(!last||now-last>=37){const dt=last?Math.min(.095,(now-last)/1000):0;last=now;time=(time+dt)%670800;draw()}
 raf=requestAnimationFrame(loop);
}
function update(){
 cancel(); switcher.textContent=motion?'Pause motion':'Play motion';stage.dataset.motion=motion?'playing':'paused';
 if(!views||stage.dataset.render!=='live')return;
 if(motion&&!document.hidden)raf=requestAnimationFrame(loop);
 else draw();
}
function fallback(){
 stage.dataset.render='stills';switcher.hidden=true;status.textContent='Static views';cancel();
}
async function start(){
 if(roots.length!==6)throw Error('Missing a viewport');
 renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
 renderer.setSize(1920,1080,true);
 renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback()});
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 renderer.autoClear=false;
 const loader=new GLTFLoader();
 const files=['pharma','specimen','neonatal','vial','sensor'];
 async function model(id) {
   if(id!=='neonatal')return loader.loadAsync(MODEL+id+'.glb');
   // The standard GLB is split into transport chunks to keep deployment assets small.
   const chunks=await Promise.all([0,1,2].map(async i=>{
     const r=await fetch(MODEL+'neonatal-'+i+'.bin');
     if(!r.ok)throw Error('Neonatal model part '+i+' could not load');
     return new Uint8Array(await r.arrayBuffer());
   }));
   const total=chunks.reduce((n,c)=>n+c.byteLength,0);
   if(total!==702476)throw Error('Neonatal model byte count mismatch');
   const bytes=new Uint8Array(total);let at=0;
   for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.byteLength;}
   return loader.parseAsync(bytes.buffer,MODEL);
 }
 const models=Object.fromEntries(await Promise.all(files.map(async id=>[id,(await model(id)).scene])));
 if(Object.values(models).some(model=>!model.getObjectByProperty('isMesh',true)))throw Error('An asset contains no renderable mesh');
 views=roots.map(root=>makeView(root,models[root.dataset.scene.split(':')[0]],models.vial,models.sensor));
 stage.append(renderer.domElement);stage.dataset.draws=String(views.length);
 if(!motion)time=3.08;
 dimensions();draw();stage.dataset.render='live';switcher.hidden=false;status.textContent='';
 switcher.addEventListener('click',()=>{motion=!motion;update()});
 pref.addEventListener('change',()=>{motion=!pref.matches;update()});
 addEventListener('resize',()=>{dimensions();draw()});
 document.addEventListener('cleva:case-change',()=>{time=motion?0:3.08;dimensions();draw()});
 document.addEventListener('visibilitychange',update);
 update();
}
start().catch(err=>{console.warn('ClevaCado live 3D not available',err);fallback()});

