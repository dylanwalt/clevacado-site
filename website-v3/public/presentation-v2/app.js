import {signals} from './signals.js';
const slides=[...document.querySelectorAll('.slide')],nav=[...document.querySelectorAll('#nav span')];
const $=selector=>document.querySelector(selector),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let current=0,model=null,frame=0,lastModelTime=0,traceTimer=0,traceGroup=0;
function show(index){current=Math.max(0,Math.min(slides.length-1,index));slides.forEach((slide,i)=>{slide.classList.toggle('active',i===current);slide.setAttribute('aria-hidden',String(i!==current))});const section=[0,1,2,2,3,4][current];nav.forEach((item,i)=>item.classList.toggle('active',i===section));$('#counter').textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;$('#back').disabled=current===0;$('#next').disabled=current===slides.length-1;$('#next').innerHTML=current===slides.length-1?'End <span>✳</span>':'Next <span>→</span>';history.replaceState(null,'',`${location.pathname}${location.search}#${slides[current].id}`);clearTimeout(traceTimer);if(current===3){traceGroup=0;showTraces()}if(isModelSlide()&&model){mountModel();resize();if(!frame)draw()}else{cancelAnimationFrame(frame);frame=0;lastModelTime=0}}
$('#back').addEventListener('click',()=>show(current-1));$('#next').addEventListener('click',()=>show(current+1));document.addEventListener('keydown',e=>{if(e.altKey||e.metaKey||e.ctrlKey)return;if(e.key==='ArrowRight')show(current+1);if(e.key==='ArrowLeft')show(current-1)});
function isModelSlide(){return current===0||current===3}
function modelHost(){return $(current===3?'#solution-model-host':'#model-host')}
function mountModel(){if(!model||!isModelSlide())return;const host=modelHost();host.append(model.renderer.domElement);const fallback=host.querySelector('img'),status=host.querySelector('span');if(fallback)fallback.hidden=true;if(status)status.hidden=true}
function resize(){if(!model||!isModelSlide())return;const r=modelHost().getBoundingClientRect();if(!r.width||!r.height)return;model.renderer.setSize(r.width,r.height,false);model.camera.aspect=r.width/r.height;model.camera.updateProjectionMatrix()}
// A looping assembly story, in seconds. All movement is illustrative.
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
const phase=(time,start,end)=>ease((time-start)/(end-start));
function draw(time=performance.now()){
  if(!model||!isModelSlide()){frame=0;lastModelTime=0;return}
  const dt=lastModelTime?Math.min(.05,(time-lastModelTime)/1000):0;lastModelTime=time;
  if(!reduced.matches)model.time=(model.time+dt*1.4)%34;
  const t=reduced.matches?0:model.time;
  // Unfasten, open, and lift the electronics out; reassemble in the opposite order.
  const unscrew=phase(t,2,3.8)*(1-phase(t,29,31));
  const withdraw=phase(t,3.8,4.8)*(1-phase(t,28,29));
  const shellOpen=phase(t,4.8,7)*(1-phase(t,26,28));
  const boardLift=phase(t,7,9)*(1-phase(t,23,25.5));
  model.meshes[0].position.z=model.homeZ+shellOpen*95;
  model.meshes[1].position.z=model.homeZ-shellOpen*60;
  model.board.position.z=model.boardHomeZ+boardLift*38;
  model.group.scale.setScalar(model.baseScale*(1-.22*shellOpen));
  for(const screw of model.screws){
    screw.position.z=screw.userData.seatedZ+10*unscrew+22*withdraw+95*shellOpen;
    screw.rotation.z=unscrew*(10/.7)*Math.PI*2;
  }
  // Modules leave first. The individual header pins then settle before modules return.
  for(const item of model.parts){
    const apart=phase(t,9,10.5)*(1-phase(t,item.start,item.end));
    item.node.position.copy(item.home).addScaledVector(item.offset,apart);
  }
  const pinApart=phase(t,10,11)*(1-phase(t,12,14));
  for(const pin of model.pins){pin.node.position.copy(pin.home);pin.node.position.y+=pinApart*18}
  let label='ASSEMBLED PROTOTYPE';
  if(t>=2&&t<4.8)label='UNFASTENING THE SHELL';
  else if(t>=4.8&&t<9)label='OPENING THE HOUSING';
  else if(t>=9&&t<12)label='EXPLORING THE ELECTRONICS';
  else if(t>=12&&t<14)label='ADDING THE HEADER PINS';
  else if(t>=14&&t<20.5)label='ADDING ELECTRONIC MODULES';
  else if(t>=20.5&&t<23)label='INSERTING THE MICROSD CARD';
  else if(t>=23&&t<26)label='SLOTTING INTO THE CRADLE';
  else if(t>=26&&t<28)label='CLOSING THE SHELL';
  else if(t>=28&&t<31)label='FASTENING THE FOUR SCREWS';
  model.stageLabels.forEach(node=>{if(node.textContent!==label)node.textContent=label});
  if(!reduced.matches)model.group.rotation.z+=.23*dt;
  model.renderer.render(model.scene,model.camera);frame=requestAnimationFrame(draw)
}
function showTraces(){if(current!==3)return;const names=['15 cm drop','45 cm drop','80 cm drop','Rubber mat','Tar road','Dirt road'];for(let i=0;i<3;i++){const index=traceGroup*3+i,sample=signals[index],last=sample.points.at(-1)[0],max=Math.max(...sample.points.map(point=>point[1])),limit=Math.max(5,Math.ceil(max/5)*5),path=$(`#trace-path-${i}`),svg=$(`#trace-svg-${i}`);path.setAttribute('d',sample.points.map(([t,v],n)=>`${n?'L':'M'}${(t/last*500).toFixed(2)} ${(95-v/limit*90).toFixed(2)}`).join(' '));path.setAttribute('stroke',sample.color);path.setAttribute('pathLength','1');$(`#trace-label-${i}`).textContent=names[index];$(`#trace-scale-${i}`).textContent=`0–${limit} g`;svg.setAttribute('aria-label',`${names[index]}, controlled recording ${sample.trial}, magnitude auto-scaled 0 to ${limit} g, two seconds`);svg.classList.remove('tracing');void svg.getBoundingClientRect();svg.classList.add('tracing')}if(!reduced.matches)traceTimer=setTimeout(()=>{traceGroup=(traceGroup+1)%2;showTraces()},7500)}

window.addEventListener('resize',resize);
// R4 CAD coordinates in millimetres: M4 × 30 socket caps, with a 3 mm hex recess.
function makeScrews(T,group,centre){
  const metal=new T.MeshStandardMaterial({color:0xabb5b9,metalness:.82,roughness:.29});
  const shaft=new T.CylinderGeometry(2,2,30,24);
  shaft.rotateX(Math.PI/2);shaft.translate(0,0,-15);
  const headShape=new T.Shape();headShape.absarc(0,0,3.5,0,Math.PI*2,false);
  const socket=new T.Path();
  for(let i=0;i<6;i++){const a=-i*Math.PI/3, x=Math.cos(a)*Math.sqrt(3), y=Math.sin(a)*Math.sqrt(3);if(!i)socket.moveTo(x,y);else socket.lineTo(x,y)}
  socket.closePath();headShape.holes.push(socket);
  const head=new T.ExtrudeGeometry(headShape,{depth:4,bevelEnabled:false,curveSegments:24});
  const dark=new T.MeshStandardMaterial({color:0x313a3b,metalness:.5,roughness:.5});
  const socketBottom=new T.CylinderGeometry(Math.sqrt(3),Math.sqrt(3),.12,6);socketBottom.rotateX(Math.PI/2);socketBottom.translate(0,0,.4);
  return [[19.502,27.851,14.415],[-19.502,27.851,14.814],[-19.502,-27.851,16.88],[19.502,-27.851,15.03]].map(([x,y,z])=>{
    const screw=new T.Group();screw.add(new T.Mesh(shaft,metal),new T.Mesh(head,metal),new T.Mesh(socketBottom,dark));
    screw.position.set(x-centre.x,y-centre.y,z-centre.z);screw.userData.seatedZ=screw.position.z;group.add(screw);return screw
  });
}
function prepareElectronics(T,board){
  const modules=[];board.traverse(node=>{if(/MOVE/i.test(node.name))modules.push(node)});
  const find=prefix=>modules.find(node=>node.name.startsWith(prefix));
  const specifications=[
    ['02',14,16,new T.Vector3(-20,35,-10)],
    ['03',15.5,17.5,new T.Vector3(20,35,0)],
    ['05',17,19,new T.Vector3(-20,35,10)],
    ['06',18.5,20.5,new T.Vector3(20,-35,0)],
    ['04',20.5,22,new T.Vector3(27,0,0)]
  ];
  const parts=specifications.map(([prefix,start,end,offset])=>{
    const node=find(prefix);if(!node)throw new Error(`Missing electronics group ${prefix}`);
    return {node,home:node.position.clone(),offset,start,end};
  });
  const pins=[];for(const module of modules)module.traverse(node=>{
    if(/header.pin|solder.pin/i.test(node.name))pins.push({node,home:node.position.clone()});
  });
  if(!pins.length)throw new Error('Electronics header pins unavailable');
  return {parts,pins};
}
async function initModel(){try{const [T,{STLLoader},{GLTFLoader}]=await Promise.all([import('three'),import('./vendor/STLLoader.js'),import('./vendor/GLTFLoader.js')]);const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;const scene=new T.Scene(), camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(4.5,3.1,6.5);camera.lookAt(0,0,0);scene.add(new T.HemisphereLight(0xffffff,0x335b2a,2.1));const light=new T.DirectionalLight(0xffffff,2.1);light.position.set(5,7,8);scene.add(light);const rim=new T.DirectionalLight(0xb7ff5a,1.2);rim.position.set(-4,3,-6);scene.add(rim);const group=new T.Group();scene.add(group);const loader=new STLLoader(),gltf=new GLTFLoader();async function geometry(base,compressed){if('DecompressionStream' in window){try{const r=await fetch('assets/'+compressed);if(!r.ok||!r.body)throw Error();return loader.parse(await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer())}catch{}}return loader.loadAsync('assets/'+base)}
const [a,b,c,boardFile]=await Promise.all([geometry('r4-upper.a7434ba7522a.stl','r4-upper.a7434ba7522a.a0291c634712.stl.gz'),geometry('r4-lower.a61364729736.stl','r4-lower.a61364729736.a9916511c6fe.stl.gz'),geometry('r4-cradle.b66db2768d49.stl','r4-cradle.b66db2768d49.6b675815b221.stl.gz'),gltf.loadAsync('assets/veroboard-reconstruction.c27982d89a60.glb')]);const shell=new T.MeshStandardMaterial({color:0x699d49,roughness:.72,metalness:.02}),cradle=new T.MeshStandardMaterial({color:0xd39a52,roughness:.65,metalness:.03,side:T.DoubleSide});const meshes=[a,b,c].map((g,i)=>{g.computeVertexNormals();const m=new T.Mesh(g,i===2?cradle:shell);group.add(m);return m});const box=new T.Box3().setFromObject(group),size=new T.Vector3(),centre=new T.Vector3();box.getSize(size);box.getCenter(centre);meshes.forEach(m=>m.position.sub(centre));const board=boardFile.scene,bc=new T.Vector3();new T.Box3().setFromObject(board).getCenter(bc);board.position.sub(bc);board.position.z-=7.6;board.position.sub(centre);group.add(board);const screws=makeScrews(T,group,centre),{parts,pins}=prepareElectronics(T,board);const stageLabels=['#model-host','#solution-model-host'].map(selector=>{const label=document.createElement('span');label.className='assembly-stage';$(selector).append(label);return label});const baseScale=2.6/Math.max(size.x,size.y,size.z);group.scale.setScalar(baseScale);group.rotation.x=-Math.PI/2;group.rotation.z=.15;model={renderer,scene,camera,group,meshes,screws,board,boardHomeZ:board.position.z,parts,pins,stageLabels,baseScale,homeZ:-centre.z,time:0};if(isModelSlide()){mountModel();resize();if(!frame)draw();}}catch(e){document.querySelectorAll('#model-status,#solution-model-status').forEach(status=>status.textContent='Static CAD preview');console.error('3D model unavailable',e)}}
const aliases={people:'hello',problem:'numbers',roadmap:'future'};const hash=aliases[location.hash.slice(1)]||location.hash.slice(1);const start=slides.findIndex(slide=>slide.id===hash);show(embedMode==='village'?5:embedMode==='prototype'?0:start<0?0:start);if(embedMode!=='village')initModel();
