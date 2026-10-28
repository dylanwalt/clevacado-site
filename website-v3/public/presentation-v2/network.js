/* Illustrative connections, not a geographic or measured supply-chain map. */
const host=document.querySelector('#market-network');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
try {
  const T=await import('three');
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;host.append(renderer.domElement);
  const scene=new T.Scene(), camera=new T.PerspectiveCamera(38,1,.1,100);camera.position.set(0,0,9);camera.lookAt(0,0,0);
  scene.add(new T.HemisphereLight(0xf3ffe7,0x245133,2.5));const light=new T.DirectionalLight(0xffffff,2.3);light.position.set(4,6,8);scene.add(light);
  const fruit=new T.Group();scene.add(fruit);
  const body=new T.Mesh(new T.SphereGeometry(.85,36,28),new T.MeshStandardMaterial({color:0x7ab552,roughness:.72}));body.scale.set(.78,1.03,.75);fruit.add(body);
  const leaf=new T.Mesh(new T.SphereGeometry(.25,20,16),new T.MeshStandardMaterial({color:0xc8ef9f,roughness:.8}));leaf.scale.set(1.4,.25,.5);leaf.position.set(.18,1,0);leaf.rotation.z=.55;fruit.add(leaf);
  const ends=[new T.Vector3(-2.3,1.45,0),new T.Vector3(2.3,1.35,0),new T.Vector3(0,-1.9,0)];
  const green=new T.MeshStandardMaterial({color:0xbbe987,emissive:0x274d1b,roughness:.45});
  const dotMaterial=new T.MeshBasicMaterial({color:0xe8ffbe});
  const connections=ends.map((end,i)=>{
    const curve=new T.QuadraticBezierCurve3(new T.Vector3(0,0,0),new T.Vector3(end.x*.55,end.y*.55, .25),end);
    const line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(72)),new T.LineBasicMaterial({color:0xabe594,transparent:true,opacity:.72}));scene.add(line);
    const node=new T.Mesh(new T.SphereGeometry(.15,20,16),green);node.position.copy(end);scene.add(node);
    const ring=new T.Mesh(new T.TorusGeometry(.24,.014,8,32),new T.MeshBasicMaterial({color:0xb2e99a,transparent:true,opacity:.65}));ring.position.copy(end);scene.add(ring);
    const dot=new T.Mesh(new T.SphereGeometry(.065,12,10),dotMaterial);scene.add(dot);
    return {curve,line,node,ring,dot,phase:i*.31};
  });
  const particles=[];for(let i=0;i<20;i++){const p=new T.Mesh(new T.SphereGeometry(.025,8,6),new T.MeshBasicMaterial({color:0xb8e9a7,transparent:true,opacity:.5}));p.position.set(Math.sin(i*5.2)*2.7,Math.cos(i*2.7)*2.2,-.8);scene.add(p);particles.push(p)}
  function resize(){const box=host.getBoundingClientRect();if(!box.width||!box.height)return;renderer.setSize(box.width,box.height,false);camera.aspect=box.width/box.height;camera.updateProjectionMatrix()}
  const observer=new ResizeObserver(resize);observer.observe(host);resize();let activeSince=null,wasVisible=false;
  function draw(time){requestAnimationFrame(draw);const visible=document.querySelector('#numbers').classList.contains('active');if(!visible){wasVisible=false;return}if(!wasVisible){resize();activeSince=time;wasVisible=true}const elapsed=(time-activeSince)/1000;
    fruit.rotation.y=reduced.matches?.25:time*.00036;fruit.position.y=reduced.matches?0:Math.sin(time*.0018)*.10;
    connections.forEach((c,i)=>{const reveal=reduced.matches?1:Math.min(1,Math.max(0,(elapsed-i*.38)/1.35));c.line.geometry.setDrawRange(0,Math.max(0,Math.floor(reveal*73)));c.node.scale.setScalar(Math.max(.001,reveal));c.ring.scale.setScalar(Math.max(.001,reveal)*(1+(reduced.matches?0:.12*Math.sin(time*.003+i))));c.dot.visible=reveal>.98&&!reduced.matches; if(c.dot.visible)c.dot.position.copy(c.curve.getPoint((elapsed*.28+c.phase)%1));});
    particles.forEach((p,i)=>{p.material.opacity=reduced.matches?.35:.2+.25*(1+Math.sin(time*.002+i))/2});renderer.render(scene,camera)
  }requestAnimationFrame(draw);
} catch(error){host.hidden=true;document.querySelector('.network-fallback').hidden=false;console.error('Market network unavailable',error)}
