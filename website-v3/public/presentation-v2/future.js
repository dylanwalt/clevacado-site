// A short, illustrative journey using the same R4 shell as the presentation.
const slide=document.querySelector('#future');
const host=document.querySelector('#future-traveller');
const track=document.querySelector('.future-track');
const replay=document.querySelector('.future-replay');
const pause=document.querySelector('.future-pause');
const cards=[...document.querySelectorAll('.future-grid article')];
const sceneStage=document.querySelector('.future-scene-stage');
const stageNames=['01 · DSL INCUBATION','02 · SEE THE JOURNEY','03 · LEARN & EXPAND','04 · USE AI THOUGHTFULLY'];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let start=null,frame=0,renderer,camera,scene,fruit,resize,pausedAt=null,signal,signalDot,THREE,deliveryTruck,island,networkFlows=[],beaconRings=[],fruitHalo,windRotor,roadLights=[],truckWheels=[];
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function select(index){cards.forEach((card,i)=>card.classList.toggle('future-current',index===i));if(sceneStage.textContent!==stageNames[index])sceneStage.textContent=stageNames[index]}
function reset(){start=null;pausedAt=null;track.classList.remove('is-paused');pause.textContent=reduced.matches?"Motion reduced":"Pause ❚❚";pause.setAttribute("aria-pressed","false");select(0);if(renderer&&slide.classList.contains('active')&&!frame)frame=requestAnimationFrame(tick)}
function tick(now){
  frame=0;if(!slide.classList.contains('active'))return;
  if(start===null)start=now;
  const time=reduced.matches?0:((now-start)/1000)%15;
  const arrival=reduced.matches?1:ease(time/.9);
  let x=-5.85+.75*arrival,hop=reduced.matches?0:Math.sin(Math.PI*arrival)*.28,flip=0,stage=0;
  const starts=[1,4.8,8.6];
  for(let i=0;i<starts.length;i++){
    const p=ease((time-starts[i])/2.2);
    x+=3.4*p;
    if(p>0)stage=i+1;
    if(p>0&&p<1){hop=Math.sin(Math.PI*p)*.48;flip=i===1?Math.PI*2*p:Math.sin(Math.PI*p)*-.32}
  }
  // Return across the course to make the end connect smoothly to the start.
  if(time>=12){const back=ease((time-12)/2.7);x=5.1-10.95*back;hop=Math.sin(Math.PI*back)*.55;flip=-Math.PI*2*back;stage=back<.33?3:back<.66?2:0}
  fruit.position.set(x,-.17+hop,.65);
  const from=new THREE.Vector3(x,-.17+hop+.36,.65),to=new THREE.Vector3(1.5,1.03,-.62);
  signal.geometry.setFromPoints([from,to]);signal.computeLineDistances();
  const wave=reduced.matches?.5:(time*1.8)%1;
  signalDot.position.lerpVectors(from,to,wave);
  for(const [i,flow] of networkFlows.entries()){
    const progress=reduced.matches?.5:(time*.25+i*.31)%1;
    flow.dots.forEach((dot,n)=>dot.position.copy(flow.curve.getPoint((progress+n*.48)%1)));
  }
  for(const [i,ring] of beaconRings.entries()){
    const pulse=reduced.matches?.5:(time*.7+i*.35)%1;
    ring.scale.setScalar(.65+pulse*1.1);ring.material.opacity=.48*(1-pulse);
  }
  fruitHalo.position.copy(fruit.position);fruitHalo.rotation.z=reduced.matches?0:time*2*Math.PI/15;
  island.rotation.y=reduced.matches?0:.13*Math.sin(time*2*Math.PI/15);
  fruit.rotation.z=flip;
  fruit.rotation.y=reduced.matches?0:time*(4*Math.PI/15);
  if(deliveryTruck)deliveryTruck.position.x=reduced.matches?0:.85*Math.sin(time*2*Math.PI/15);
  truckWheels.forEach(wheel=>{wheel.rotation.y=reduced.matches?0:Math.sin(time*2*Math.PI/15)*5});
  if(windRotor)windRotor.rotation.z=reduced.matches?0:time*4*Math.PI/15;
  for(const [i,light] of roadLights.entries())light.material.opacity=reduced.matches?.45:.32+.45*(.5+.5*Math.sin(time*2*Math.PI/3-i*.8));
  camera.position.x=reduced.matches?0:.38*Math.sin(time*2*Math.PI/15);
  camera.lookAt(0,-.15,0);
  select(stage);renderer.render(scene,camera);
  if(!reduced.matches&&pausedAt===null)frame=requestAnimationFrame(tick);
}
// Miniature physical scene; shapes are visual storytelling, not measured infrastructure.
function buildIsland(T){
  const mat=(color,roughness=.86)=>new T.MeshStandardMaterial({color,roughness});
  const grass=mat(0x79a85b),earth=mat(0x92735a),road=mat(0xbaa98c),walls=mat(0xe7e4c9),roof=mat(0xa86c50),glass=mat(0x86bbc0,.35),leaves=mat(0x53874b),trunk=mat(0x79634d),steel=mat(0x6b837a);
  // Seeded texture adds surface grain without external assets or network requests.
  function surface(base,light,dark){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const context=canvas.getContext('2d');context.fillStyle=base;context.fillRect(0,0,256,256);let seed=127;for(let i=0;i<4200;i++){seed=(seed*16807)%2147483647;const x=seed%256;seed=(seed*16807)%2147483647;const y=seed%256;context.fillStyle=i%2?light:dark;context.fillRect(x,y,i%7===0?2:1,1)}const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(3,2);return texture}
  grass.map=surface('#88aa70','#a3c486','#75985d');earth.map=surface('#b09b7c','#c2af8f','#978169');road.map=surface('#d7c8ab','#e1d6bd','#bfb195');
  function box(w,h,d,m,x,y,z){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);scene.add(o);return o}
  function cylinder(radius1,radius2,height,m,x,y,z){const o=new T.Mesh(new T.CylinderGeometry(radius1,radius2,height,12),m);o.position.set(x,y,z);scene.add(o);return o}
  const base=cylinder(1, .92,.34,earth,0,-.85,0);base.scale.set(5.95,1,1.75);
  const turf=cylinder(1,1,.12,grass,0,-.62,0);turf.scale.set(5.92,1,1.72);
  box(11.0,.035,.42,road,0,-.54,.65);
  for(let x=-5;x<=5;x+=.48)box(.17,.01,.015,walls,x,-.515,.65);
  function tree(x,z,scale){cylinder(.045,.065,.36*scale,trunk,x,-.36,z);const crown=new T.Mesh(new T.IcosahedronGeometry(.25*scale,2),leaves.clone());crown.material.color.offsetHSL((x%3)*.008,0,(z%3)*.018);crown.scale.set(1,1.18,.9);crown.position.set(x,-.08+.1*scale,z);scene.add(crown);for(const [dx,dy,dz] of [[-.13,.03,.04],[.12,.07,-.02],[.02,.15,.02]]){const cluster=new T.Mesh(new T.IcosahedronGeometry(.14*scale,1),crown.material);cluster.position.set(x+dx*scale,-.08+.1*scale+dy*scale,z+dz);scene.add(cluster)}}
  for(const [x,z,k] of [[-5.1,-.7,.8],[-4.6,-1,.85],[-4.05,-.9,.8],[-3.5,-.85,.75],[-2.9,-1,.7],[.1,-1.08,.68],[.7,-1.12,.8],[2.4,-1,.75],[2.9,-.9,.7],[4.75,-.95,.9],[5.15,-.65,.72]])tree(x,z,k);
  function house(x,z){box(.78,.52,.68,walls,x,-.25,z);const top=new T.Mesh(new T.ConeGeometry(.61,.42,4),roof);top.rotation.y=Math.PI/4;top.position.set(x,.22,z);scene.add(top);box(.19,.3,.02,trunk,x,-.37,z+.35);for(const dx of [-.26,.26]){box(.16,.16,.025,glass,x+dx,-.22,z+.35);box(.018,.17,.03,walls,x+dx,-.22,z+.37);box(.16,.018,.03,walls,x+dx,-.22,z+.37)}box(.15,.22,.14,roof,x+.23,.29,z-.14);box(.62,.035,.12,road,x,-.51,z+.42)}
  house(-4.45,-.35);house(4.45,-.4);
  // Packhouse, with roof, loading doors and a chimney.
  box(1.65,.55,.72,walls,-1.55,-.24,-.47);box(1.78,.12,.84,roof,-1.55,.08,-.47);
  box(.34,.33,.03,glass,-1.95,-.34,-.09);box(.34,.33,.03,glass,-1.45,-.34,-.09);box(.26,.55,.2,steel,-.98,.18,-.67);
  for(const wx of [-2.2,-1.7,-1.2]){box(.42,.025,.02,steel,wx,-.23,-.07);box(.42,.025,.02,steel,wx,-.36,-.07)}
  for(const [cx,cz] of [[-2.5,.03],[-2.3,.03],[-2.5,.22]]){box(.16,.12,.16,roof,cx,-.46,cz);box(.17,.02,.17,walls,cx,-.40,cz)}
  // Fenced orchard rows and paths make the miniature feel inhabited.
  for(let x=-5.5;x<-2.8;x+=.27){box(.025,.2,.025,wood(),x,-.43,-1.13)}
  function wood(){return trunk}
  box(2.8,.025,.025,trunk,-4.15,-.37,-1.13);box(2.8,.025,.025,trunk,-4.15,-.46,-1.13);
  for(let x=2.4;x<4.4;x+=.35){box(.025,.18,.025,trunk,x,-.44,-1.12)}box(2,.025,.025,trunk,3.4,-.40,-1.12);
  // A small delivery vehicle and varied foliage give the route a sense of life.
  const truckWhite=mat(0xf2f1df),truckDark=mat(0x566b63);
  deliveryTruck=new T.Group();scene.add(deliveryTruck);
  const truckParts=[box(.55,.24,.25,truckWhite,.25,-.39,-.03),box(.22,.18,.25,walls,.64,-.42,-.03),box(.1,.08,.26,glass,.69,-.37,-.03)];
  for(const px of [.05,.42,.67]){const wheel=cylinder(.065,.065,.28,truckDark,px,-.53,-.03);wheel.rotation.x=Math.PI/2;truckParts.push(wheel);truckWheels.push(wheel)}
  truckParts.forEach(part=>deliveryTruck.attach(part));
  for(const [x,z] of [[-5.4,-.45],[-3.1,-.38],[-2.65,-1.1],[.1,-.8],[2.8,-.42],[3.45,-1.2],[5.45,-.55]]){const bush=new T.Mesh(new T.IcosahedronGeometry(.15,1),leaves);bush.scale.set(1.4,.55,1);bush.position.set(x,-.49,z);scene.add(bush)}
  // Fenced orchard beds and a rotating windmill add life to the growing stage.
  const crop=mat(0x567746),soil=mat(0x8e7458),white=mat(0xe4eadc);
  for(const z of [-1.2,-.97,-.74]){box(1.05,.03,.12,soil,-3.65,-.545,z);for(let x=-4.08;x<-3.14;x+=.17){const shrub=new T.Mesh(new T.SphereGeometry(.055,8,6),crop);shrub.position.set(x,-.48,z);scene.add(shrub)}}
  cylinder(.025,.04,.88,steel,-3.02,-.10,-.68);
  windRotor=new T.Group();windRotor.position.set(-3.02,.38,-.61);scene.add(windRotor);
  for(let i=0;i<4;i++){const blade=new T.Mesh(new T.BoxGeometry(.08,.35,.018),white);blade.position.y=.20;const hub=new T.Group();hub.rotation.z=i*Math.PI/2;hub.add(blade);windRotor.add(hub)}
  const hub=new T.Mesh(new T.SphereGeometry(.06,12,8),roof);windRotor.add(hub);
  // A roof of small solar panels and an outdoor loading platform.
  box(.83,.025,.38,steel,-1.55,.16,-.5);
  for(let i=0;i<4;i++)box(.18,.03,.30,glass,-1.85+i*.20,.18,-.5);
  box(1.85,.04,.3,road,-1.55,-.51,.12);
  for(const x of [-4.1,-2.6,-.3,.9,2.6,4.0]){const light=new T.Mesh(new T.SphereGeometry(.028,10,8),new T.MeshBasicMaterial({color:0xffe7aa,transparent:true,opacity:.5}));light.position.set(x,-.44,.92);scene.add(light);roadLights.push(light)}
  // An illustrative DSL incubation stop at the beginning of the route.
  const dslCanvas=document.createElement('canvas');dslCanvas.width=512;dslCanvas.height=192;
  const dslContext=dslCanvas.getContext('2d');dslContext.fillStyle='#f5faee';dslContext.fillRect(0,0,512,192);
  dslContext.fillStyle='#24593c';dslContext.font='800 90px sans-serif';dslContext.textAlign='center';dslContext.fillText('DSL',256,91);
  dslContext.font='700 48px sans-serif';dslContext.fillText('INCUBATION',256,151);
  const dslTexture=new T.CanvasTexture(dslCanvas);dslTexture.colorSpace=T.SRGBColorSpace;
  box(.9,.37,.07,steel,-5.02,.23,.03);box(.035,.59,.045,steel,-5.34,-.25,.03);box(.035,.59,.045,steel,-4.70,-.25,.03);
  const dslSign=new T.Mesh(new T.PlaneGeometry(.83,.31),new T.MeshBasicMaterial({map:dslTexture}));dslSign.position.set(-5.02,.23,.072);scene.add(dslSign);
  // A real ClevaCado logo on a roadside billboard, built into the 3D scene.
  const billboardX=3.25,billboardZ=-.38;
  box(.045,.70,.055,steel,billboardX-.56,-.19,billboardZ);box(.045,.70,.055,steel,billboardX+.56,-.19,billboardZ);
  box(1.43,.50,.09,steel,billboardX,.16,billboardZ);
  box(1.34,.42,.018,walls,billboardX,.16,billboardZ+.057);
  const logoTexture=new T.TextureLoader().load('assets/logo.png');logoTexture.colorSpace=T.SRGBColorSpace;
  const logoSign=new T.Mesh(new T.PlaneGeometry(1.25,.33),new T.MeshBasicMaterial({map:logoTexture,transparent:true}));logoSign.position.set(billboardX,.16,billboardZ+.07);scene.add(logoSign);
  for(const offset of [-.49,.49]){const lamp=cylinder(.035,.035,.09,steel,billboardX+offset,.44,billboardZ+.02);lamp.rotation.x=Math.PI/2;const glow=new T.Mesh(new T.SphereGeometry(.027,10,8),new T.MeshBasicMaterial({color:0xffe9ae,transparent:true,opacity:.65}));glow.position.set(billboardX+offset,.44,billboardZ+.08);scene.add(glow);roadLights.push(glow)}
  // Steel communication mast with cross members.
  for(const dx of [-.22,.22]){const post=cylinder(.025,.025,1.5,steel,1.5+dx/2,.18,-.62);post.rotation.z=dx>0?.15:-.15}
  for(let y=-.36;y<.78;y+=.25)box(.36,.025,.025,steel,1.5,y,-.62);
  const beacon=new T.Mesh(new T.SphereGeometry(.08,16,12),mat(0xe4ba4d,.5));beacon.position.set(1.5,1.03,-.62);scene.add(beacon);
  const marker=new T.Mesh(new T.TorusGeometry(.16,.025,10,24),mat(0xe9f5d6));marker.rotation.x=Math.PI/2;for(const x of [-5.1,-1.7,1.7,5.1]){const dot=marker.clone();dot.position.set(x,-.49,.65);scene.add(dot)}
  signal=new T.Line(new T.BufferGeometry(),new T.LineDashedMaterial({color:0x4b9c70,dashSize:.1,gapSize:.08,transparent:true,opacity:.7}));scene.add(signal);
  signalDot=new T.Mesh(new T.SphereGeometry(.055,12,8),new T.MeshBasicMaterial({color:0xdcff99}));scene.add(signalDot);
  // Animated data routes are a conceptual visual, not measured telemetry.
  const tower=new T.Vector3(1.5,1.03,-.62);
  const destinations=[new T.Vector3(-1.55,.18,-.47),new T.Vector3(-4.45,.32,-.35),new T.Vector3(4.45,.32,-.4)];
  for(const target of destinations){
    const middle=tower.clone().lerp(target,.5);middle.y=Math.max(tower.y,target.y)+.08;
    const curve=new T.QuadraticBezierCurve3(tower,middle,target);
    const line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(48)),new T.LineDashedMaterial({color:0x29895d,dashSize:.10,gapSize:.09,transparent:true,opacity:.72}));line.computeLineDistances();scene.add(line);
    const dots=[0,1].map(n=>{const dot=new T.Mesh(new T.SphereGeometry(.055,12,8),new T.MeshBasicMaterial({color:n?0xb9ffd0:0xe9ff8b}));scene.add(dot);return dot});networkFlows.push({curve,dots});
  }
  for(let i=0;i<2;i++){const ring=new T.Mesh(new T.TorusGeometry(.18,.012,8,40),new T.MeshBasicMaterial({color:0x68c796,transparent:true,opacity:.3,depthWrite:false}));ring.position.set(1.5,.78,-.59);scene.add(ring);beaconRings.push(ring)}
  fruitHalo=new T.Group();
  const halo=new T.Mesh(new T.TorusGeometry(.32,.012,8,48),new T.MeshBasicMaterial({color:0xbde995,transparent:true,opacity:.7,depthWrite:false}));halo.rotation.x=Math.PI/2;fruitHalo.add(halo);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const spark=new T.Mesh(new T.SphereGeometry(.035,10,8),new T.MeshBasicMaterial({color:0xe4ffba}));spark.position.set(Math.cos(a)*.32,0,Math.sin(a)*.32);fruitHalo.add(spark)}
  scene.add(fruitHalo);
}
async function init(){
  try{
    const [T,{STLLoader}]=await Promise.all([import('three'),import('./vendor/STLLoader.js')]);
    THREE=T;renderer=new T.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);
    scene=new T.Scene();camera=new T.OrthographicCamera(-7.6,7.6,1,-1,.1,100);camera.position.set(0,5,20);camera.lookAt(0,-.15,0);
    scene.add(new T.HemisphereLight(0xffffff,0x4b7949,2.0));const light=new T.DirectionalLight(0xffedcf,2.8);light.position.set(-3,8,7);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-7;light.shadow.camera.right=7;light.shadow.camera.top=4;light.shadow.camera.bottom=-4;light.shadow.bias=-.0003;scene.add(light);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;buildIsland(T);
    // Keep the road, scenery, prototype and signals in one gently rotating world.
    island=new T.Group();const contents=scene.children.filter(object=>!object.isLight);scene.add(island);contents.forEach(object=>island.add(object));
    const loader=new STLLoader();
    async function getGeometry(base,compressed){
      if('DecompressionStream' in window){try{const response=await fetch('assets/'+compressed);if(!response.ok||!response.body)throw Error('compressed model unavailable');return loader.parse(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer())}catch{}}
      return loader.loadAsync('assets/'+base);
    }
    const [upper,lower]=await Promise.all([getGeometry('r4-upper.a7434ba7522a.stl','r4-upper.a7434ba7522a.a0291c634712.stl.gz'),getGeometry('r4-lower.a61364729736.stl','r4-lower.a61364729736.a9916511c6fe.stl.gz')]);
    const material=new T.MeshStandardMaterial({color:0x699d49,roughness:.72});
    const model=new T.Group();for(const geometry of [upper,lower]){geometry.computeVertexNormals();model.add(new T.Mesh(geometry,material))}
    const box=new T.Box3().setFromObject(model),centre=new T.Vector3(),size=new T.Vector3();box.getCenter(centre);box.getSize(size);model.position.sub(centre);
    const oriented=new T.Group();oriented.rotation.x=-Math.PI/2;oriented.scale.setScalar(.80/Math.max(size.x,size.y,size.z));oriented.add(model);
    fruit=new T.Group();fruit.add(oriented);island.add(fruit);
    resize=()=>{const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.top=7.6*r.height/r.width;camera.bottom=-camera.top;camera.updateProjectionMatrix()};
    scene.traverse(object=>{if(object.isMesh){object.castShadow=true;object.receiveShadow=true}});host.querySelector('.traveller-fallback').hidden=true;host.append(renderer.domElement);track.classList.add('scene-ready');
    window.addEventListener('resize',resize);
    if(slide.classList.contains('active')){resize();reset()}
  }catch(error){console.error('Future journey model unavailable',error);select(0)}
}
pause.addEventListener('click',()=>{
  if(reduced.matches||!renderer)return;
  if(pausedAt===null){track.classList.add('is-paused');pausedAt=performance.now();if(frame)cancelAnimationFrame(frame);frame=0;pause.textContent='Play ▶';pause.setAttribute('aria-pressed','true')}
  else{track.classList.remove('is-paused');if(start!==null)start+=performance.now()-pausedAt;pausedAt=null;pause.textContent='Pause ❚❚';pause.setAttribute('aria-pressed','false');frame=requestAnimationFrame(tick)}
});
function updateMotionPreference(){pause.disabled=reduced.matches;pause.textContent=reduced.matches?'Motion reduced':'Pause ❚❚';pause.setAttribute('aria-pressed','false')}
replay.addEventListener('click',()=>{if(frame)cancelAnimationFrame(frame);frame=0;reset()});
new MutationObserver(()=>{if(slide.classList.contains('active')){if(resize)resize();reset()}else{if(frame)cancelAnimationFrame(frame);frame=0;start=null}}).observe(slide,{attributes:true,attributeFilter:['class']});
reduced.addEventListener('change',()=>{reset();updateMotionPreference()});
updateMotionPreference();
if(embedMode!=='prototype')init();
