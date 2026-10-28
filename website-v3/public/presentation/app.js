import {signals} from './signals.js';

const story = window.PRESENTATION;
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let modelPromise = null;
let model = null;
let modelFailed = false;
let modelFrame = 0;
let splitTimer = 0;
let userChangedShell = false;
let signalTimer = 0;
let signalIndex = 0;
let activeExhibit = null;
const modelIsVisible = () => !!$('#model-media') && (activeExhibit === 'model' || story.slides[current]?.media === 'model');

function sectionStart(section) {
  return story.slides.findIndex(slide => slide.section === section);
}

function stopModelAnimation() {
  cancelAnimationFrame(modelFrame);
  modelFrame = 0;
  clearTimeout(splitTimer);
}

function renderMedia(slide) {
  const caption = `<span class="media-caption">${escapeHtml(slide.caption || '')}</span>`;
  if (slide.media === 'brand') {
    return `<div class="slide-media brand-media"><img class="feature-logo" src="assets/logo.png" alt="ClevaCado — post-harvest diagnostics"><div class="brand-comic"><span>${escapeHtml(slide.quote)}</span></div></div>`;
  }
  if (slide.media === 'cartoon') {
    return `<div class="slide-media cartoon-media"><img src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.alt)}" decoding="async"><blockquote>${escapeHtml(slide.quote)}</blockquote><span class="cartoon-label">FICTIONAL ILLUSTRATION</span></div>`;
  }
  if (slide.media === 'bruise-story') {
    return `<div class="slide-media bruise-story"><img class="bruise-photo" src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.alt)}"><div class="bruise-comic"><img src="${escapeHtml(slide.jokeImage)}" alt="${escapeHtml(slide.jokeAlt)}"><blockquote>${escapeHtml(slide.quote)}</blockquote></div><span class="cartoon-label">AI-GENERATED ILLUSTRATIONS</span></div>`;
  }
  if (slide.media === 'logo') {
    return `<div class="slide-media cover-logo"><img src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.alt)}"></div>`;
  }
  if (slide.media === 'problem') {
    return `<div class="slide-media bruise-media"><img src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.alt)}" decoding="async"><span class="media-caption">ILLUSTRATION · AI-GENERATED</span></div>`;
  }
  if (slide.media === 'graphic') {
    const items = (slide.items || []).map(([number, label]) => `<div class="graphic-item"><span>${escapeHtml(number)}</span><strong>${escapeHtml(label)}</strong></div>`).join('');
    return `<div class="slide-media graphic graphic-${escapeHtml(slide.graphic)}"><div class="graphic-content">${slide.tag ? `<div class="graphic-tag">${escapeHtml(slide.tag)}</div>` : ''}${slide.metric ? `<div class="graphic-metric">${escapeHtml(slide.metric)}</div><div class="graphic-metric-label">${escapeHtml(slide.metricLabel)}</div>` : ''}${slide.quote ? `<div class="graphic-quote">${escapeHtml(slide.quote).replaceAll('\n','<br>')}</div>` : ''}${items ? `<div class="graphic-items">${items}</div>` : ''}${slide.foot ? `<div class="graphic-foot">${escapeHtml(slide.foot)}</div>` : ''}</div></div>`;
  }
  if (slide.media === 'model') {
    return `<div class="slide-media model-media" id="model-media"><img class="model-fallback" src="assets/optimized/r4-open.e9066db75b94.jpg" alt="R4 shell and cradle CAD inspection view"><span class="model-status" id="model-status">Loading 3D model…</span><button class="model-button" id="model-button" type="button" aria-pressed="false" disabled>Separate shell ↗</button>${caption}</div>`;
  }
  if (slide.media === 'signal') {
    return `<div class="slide-media signal-media"><button class="signal-button" id="signal-button" type="button">Next recording →</button><div class="signal-visual" id="signal-visual"><div class="signal-heading">RECORDED ACCELERATION · <span id="signal-label"></span></div><svg viewBox="0 0 940 190" preserveAspectRatio="none" role="img" id="signal-svg"><defs><clipPath id="signal-clip"><rect class="signal-reveal" width="940" height="190"/></clipPath></defs><path d="M0 20H940 M0 95H940 M0 170H940" stroke="#ffffff40" fill="none"/><path class="signal-trace" id="signal-trace" clip-path="url(#signal-clip)" fill="none" stroke-width="3" vector-effect="non-scaling-stroke"/></svg><div class="axis"><span>0 s</span><span id="signal-scale"></span><span>2 s</span></div><small>Individual controlled recording · auto-scaled · not a bruise measurement</small></div>${caption}</div>`;
  }
  return `<div class="slide-media"><img class="media-image" src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.alt)}" style="--position:${escapeHtml(slide.position || '50% 50%')}" decoding="async">${caption}</div>`;
}

function renderSections() {
  const currentSection = story.slides[current].section;
  $('#sections').innerHTML = story.sections.map(section => `<button type="button" data-section="${escapeHtml(section.id)}" ${section.id === currentSection ? 'aria-current="step"' : ''}>${escapeHtml(section.label)}</button>`).join('');
  document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => renderSlide(sectionStart(button.dataset.section))));
}

function preloadNextImage() {
  const next = story.slides[current + 1];
  if (next && next.image) { const image = new Image(); image.src = next.image; }
  if (current <= 1) {
    const prepareModel = () => { if (current <= 1) initialiseModel(); };
    if (window.requestIdleCallback) window.requestIdleCallback(prepareModel); else setTimeout(prepareModel, 300);
  }
}

function renderSlide(index, updateHash = true) {
  if (index < 0 || index >= story.slides.length) return;
  closeExhibit();
  stopModelAnimation();
  clearTimeout(signalTimer);
  current = index;
  const slide = story.slides[current];
  const lines = slide.lines?.length ? `<ul class="support-lines">${slide.lines.map(line => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : '';
  const source = slide.source ? (slide.sourceUrl ? `<a class="source-link" href="${escapeHtml(slide.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(slide.source)} ↗</a>` : `<span class="source-link">${escapeHtml(slide.source)}</span>`) : '';
  const miniJoke = slide.jokeImage && ['model','signal'].includes(slide.media) ? `<div class="mini-joke"><img src="${escapeHtml(slide.jokeImage)}" alt="${escapeHtml(slide.jokeAlt)}"><span>${escapeHtml(slide.quote)}</span></div>` : '';
  if (slide.layout === 'brief') {
    const columns = slide.columns.map((column, index) => {
      const groups = column.map(group => `<section class="brief-group"><h2>${escapeHtml(group.title)}</h2><ul>${group.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`).join('');
      const illustration = slide.image && index === 1 ? `<figure class="brief-illustration"><img src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.imageAlt)}"><figcaption>AI-GENERATED ILLUSTRATION</figcaption></figure>` : '';
      const actions = slide.actions && index === 1 ? `<div class="exhibit-actions"><button type="button" data-exhibit="model">Explore the prototype ↗</button><button type="button" data-exhibit="signal">View recorded signals ↗</button></div>` : '';
      return `<div class="brief-column">${groups}${illustration}${actions}</div>`;
    }).join('');
    $('#stage').innerHTML = `<article class="slide brief-slide brief-${escapeHtml(slide.id)}" data-slide="${escapeHtml(slide.id)}"><header class="brief-header"><div><div class="eyebrow">${escapeHtml(slide.eyebrow)}</div><h1>${escapeHtml(slide.title)}</h1></div>${slide.logo ? '<img class="brief-logo" src="assets/logo.png" alt="ClevaCado — post-harvest diagnostics">' : ''}</header><div class="brief-columns">${columns}</div>${slide.closing ? `<p class="brief-closing">${escapeHtml(slide.closing)}</p>` : ''}${slide.footnote ? `<p class="brief-footnote">${escapeHtml(slide.footnote)}</p>` : ''}</article>`;
    document.querySelectorAll('[data-exhibit]').forEach(button => button.addEventListener('click', () => openExhibit(button.dataset.exhibit)));
  } else {
    $('#stage').innerHTML = `<article class="slide layout-${escapeHtml(slide.layout || 'light')}" data-slide="${escapeHtml(slide.id)}"><div class="slide-copy"><div class="eyebrow">${escapeHtml(slide.eyebrow)}</div><h1>${escapeHtml(slide.title)}${slide.accent ? `<em>${escapeHtml(slide.accent)}</em>` : ''}</h1><p class="detail">${escapeHtml(slide.detail)}</p>${lines}${source}${miniJoke}</div>${renderMedia(slide)}</article>`;
  }
  $('#chapter-label').textContent = story.sections.find(section => section.id === slide.section)?.label || 'Start';
  $('#top-counter').textContent = `${String(current + 1).padStart(2, '0')} / ${String(story.slides.length).padStart(2, '0')}`;
  $('#slide-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(story.slides.length).padStart(2, '0')}`;
  $('#progress').style.width = `${(current + 1) / story.slides.length * 100}%`;
  $('#previous').disabled = current === 0;
  $('#next').disabled = current === story.slides.length - 1;
  $('#next').setAttribute('aria-label', current === story.slides.length - 1 ? 'End of presentation' : `Next: ${story.slides[current + 1].title}`);
  $('#next').innerHTML = `<span>${current === story.slides.length - 1 ? 'End' : 'Next'}</span><b aria-hidden="true">→</b>`;
  renderSections();
  if (updateHash) { try { history.replaceState(null, '', `#${slide.id}`); } catch {} }
  if (slide.media === 'model') {
    userChangedShell = false;
    $('#model-button').addEventListener('click', toggleShell);
    mountModel();
  }
  if (slide.media === 'signal') {
    signalIndex = 0;
    $('#signal-button').addEventListener('click', () => { clearTimeout(signalTimer); signalIndex = (signalIndex + 1) % signals.length; playSignal(); });
    requestAnimationFrame(playSignal);
  }
  preloadNextImage();
}

function closeExhibit() {
  if (!activeExhibit) return;
  clearTimeout(signalTimer); stopModelAnimation();
  document.querySelector('#exhibit')?.remove(); activeExhibit = null;
}

function openExhibit(type) {
  closeExhibit(); activeExhibit = type;
  const isModel = type === 'model';
  const slide = isModel ? {media:'model',caption:'R4 SHELL + CRADLE · ELECTRONICS PLACEMENT ILLUSTRATIVE'} : {media:'signal',caption:'RECORDED LAB EXAMPLES · NOT LIVE DATA'};
  document.body.insertAdjacentHTML('beforeend', `<div class="exhibit-backdrop" id="exhibit" role="dialog" aria-modal="true" aria-label="${isModel ? 'Explore the prototype' : 'Recorded signals'}"><div class="exhibit-panel"><header><div><span class="exhibit-kicker">${isModel ? 'THE PROTOTYPE' : 'LAB RECORDINGS'}</span><h2>${isModel ? 'A closer look at ClevaCado' : 'Six handling events'}</h2></div><button type="button" id="exhibit-close">Back to slide ×</button></header><div class="exhibit-body">${renderMedia(slide)}<p>${isModel ? 'R4 shell and cradle CAD with a photo-recreated electronics illustration. Assembly and fit remain to be validated.' : 'Recorded examples of drops and surfaces. Each trace is individually auto-scaled; it is not live telemetry or a direct measurement of bruising.'}</p></div></div></div>`);
  $('#exhibit-close').addEventListener('click', closeExhibit);
  if (isModel) { userChangedShell = false; $('#model-button').addEventListener('click', toggleShell); mountModel(); }
  else { signalIndex = 0; $('#signal-button').addEventListener('click', () => { clearTimeout(signalTimer); signalIndex = (signalIndex + 1) % signals.length; playSignal(); }); requestAnimationFrame(playSignal); }
  $('#exhibit-close').focus();
}

function playSignal() {
  const plot = $('#signal-visual'), path = $('#signal-trace');
  if (!plot || !path || (activeExhibit !== 'signal' && story.slides[current]?.media !== 'signal')) return;
  const sample = signals[signalIndex], duration = sample.points.at(-1)[0];
  const limit = Math.ceil(Math.max(...sample.points.map(([,value]) => value)) / 5) * 5;
  const geometry = sample.points.map(([time,value], index) => `${index ? 'L' : 'M'}${(time / duration * 940).toFixed(2)} ${(170 - value / limit * 150).toFixed(2)}`).join(' ');
  path.setAttribute('d', geometry); path.setAttribute('stroke', sample.color);
  $('#signal-label').textContent = sample.label;
  $('#signal-label').style.color = sample.color;
  $('#signal-scale').textContent = `0–${limit} g`;
  $('#signal-svg').setAttribute('aria-label', `${sample.label}, controlled recording ${sample.trial}, auto-scaled from 0 to ${limit} g`);
  plot.classList.remove('playing'); void plot.offsetWidth; plot.classList.add('playing');
  if (!reducedMotion.matches) signalTimer = setTimeout(() => { signalIndex = (signalIndex + 1) % signals.length; playSignal(); }, 3100);
}

async function initialiseModel() {
  if (model || modelFailed) return model;
  if (modelPromise) return modelPromise;
  modelPromise = (async () => {
    try {
      const [THREE, {STLLoader}, {GLTFLoader}] = await Promise.all([import('three'), import('./vendor/STLLoader.js'), import('./vendor/GLTFLoader.js')]);
      const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = 'model-canvas';
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
      camera.position.set(4.5, 3.1, 6.5); camera.lookAt(0, 0, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x335b2a, 2.1));
      const light = new THREE.DirectionalLight(0xffffff, 2.1); light.position.set(5, 7, 8); scene.add(light);
      const rim = new THREE.DirectionalLight(0xb7ff5a, 1.2); rim.position.set(-4, 3, -6); scene.add(rim);
      const group = new THREE.Group(); scene.add(group);
      const loader = new STLLoader(), gltf = new GLTFLoader();
      const assets = './assets/optimized/';
      // Gzip copies decompress to the exact source STLs; older browsers use the originals.
      const loadGeometry = async (original, compressed) => {
        if (!('DecompressionStream' in window)) return loader.loadAsync(assets + original);
        try {
          const response = await fetch(assets + compressed, {priority:'low'});
          if (!response.ok || !response.body) throw new Error('Compressed model unavailable');
          const bytes = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
          return loader.parse(bytes);
        } catch { return loader.loadAsync(assets + original); }
      };
      const [upperGeometry, lowerGeometry, cradleGeometry, boardFile] = await Promise.all([
        loadGeometry('r4-upper.a7434ba7522a.stl', 'r4-upper.a7434ba7522a.a0291c634712.stl.gz'),
        loadGeometry('r4-lower.a61364729736.stl', 'r4-lower.a61364729736.a9916511c6fe.stl.gz'),
        loadGeometry('r4-cradle.b66db2768d49.stl', 'r4-cradle.b66db2768d49.6b675815b221.stl.gz'),
        gltf.loadAsync(assets + 'veroboard-reconstruction.c27982d89a60.glb')
      ]);
      const shellMaterial = new THREE.MeshStandardMaterial({color:0x699d49, roughness:.72, metalness:.02});
      const cradleMaterial = new THREE.MeshStandardMaterial({color:0xd39a52, roughness:.65, metalness:.03, side:THREE.DoubleSide});
      const meshes = [upperGeometry, lowerGeometry, cradleGeometry].map((geometry, index) => {
        geometry.computeVertexNormals(); const mesh = new THREE.Mesh(geometry, index === 2 ? cradleMaterial : shellMaterial); group.add(mesh); return mesh;
      });
      const shellBox = new THREE.Box3().setFromObject(group), size = new THREE.Vector3(), centre = new THREE.Vector3();
      shellBox.getSize(size); shellBox.getCenter(centre); meshes.forEach(mesh => mesh.position.sub(centre));
      const board = boardFile.scene, boardBox = new THREE.Box3().setFromObject(board), boardCentre = new THREE.Vector3();
      boardBox.getCenter(boardCentre); board.position.sub(boardCentre); board.position.z += -7.6; board.position.sub(centre); group.add(board);
      group.scale.setScalar(2.6 / Math.max(size.x, size.y, size.z)); group.rotation.x = -Math.PI / 2; group.rotation.z = .15;
      model = {renderer, scene, camera, group, meshes, homeZ:-centre.z, open:false, openAmount:0};
      if (modelIsVisible()) showReadyModel();
      return model;
    } catch {
      modelFailed = true;
      const status = $('#model-status'); if (status) status.textContent = 'Static CAD preview';
      const button = $('#model-button'); if (button) button.hidden = true;
      return null;
    }
  })();
  return modelPromise;
}

function resizeModel() {
  const host = $('#model-media');
  if (!model || !host || !modelIsVisible()) return;
  const box = host.getBoundingClientRect();
  if (!box.width || !box.height) return;
  model.renderer.setSize(Math.max(1, box.width), Math.max(1, box.height), false);
  model.camera.aspect = box.width / box.height; model.camera.updateProjectionMatrix();
}

function drawModel() {
  if (!model || !modelIsVisible() || !$('#model-media')) { modelFrame = 0; return; }
  const desired = model.open ? 1 : 0;
  model.openAmount = reducedMotion.matches ? desired : model.openAmount + (desired - model.openAmount) * .045;
  model.meshes[0].position.z = model.homeZ + model.openAmount * 55;
  model.meshes[1].position.z = model.homeZ - model.openAmount * 55;
  if (!reducedMotion.matches) model.group.rotation.z += .002;
  model.renderer.render(model.scene, model.camera);
  modelFrame = requestAnimationFrame(drawModel);
}

function setShell(open) {
  if (!model) return;
  model.open = open;
  const button = $('#model-button');
  if (button) { button.setAttribute('aria-pressed', String(open)); button.textContent = open ? 'Close shell ↙' : 'Separate shell ↗'; }
}

function toggleShell() { userChangedShell = true; if (model) setShell(!model.open); }

function showReadyModel() {
  const host = $('#model-media'), button = $('#model-button');
  if (!host || !button || !model) return;
  host.append(model.renderer.domElement);
  host.classList.add('ready'); button.disabled = false;
  setShell(false); resizeModel();
  if (!modelFrame) drawModel();
  splitTimer = setTimeout(() => { if (!userChangedShell && modelIsVisible()) setShell(true); }, reducedMotion.matches ? 0 : 1400);
}

function mountModel() {
  if (modelFailed) { $('#model-status').textContent = 'Static CAD preview'; $('#model-button').hidden = true; return; }
  if (model) showReadyModel(); else initialiseModel();
}

$('#previous').addEventListener('click', () => renderSlide(current - 1));
$('#next').addEventListener('click', () => renderSlide(current + 1));
$('.brand').addEventListener('click', event => { event.preventDefault(); renderSlide(0); });
document.addEventListener('keydown', event => {
  if (event.altKey || event.metaKey || event.ctrlKey || event.target.closest('input,textarea,select,[contenteditable=true]')) return;
  if (event.key === 'Escape' && activeExhibit) { event.preventDefault(); closeExhibit(); return; }
  if (activeExhibit) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); renderSlide(current + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); renderSlide(current - 1); }
});
window.addEventListener('resize', resizeModel);
function legacyHash(hash) { return ({home:'people', opening:'people', roadmap:'people', build:'problem', walt:'people', simpson:'people', agriculture:'project', story:'journey', sharing:'investigation'})[hash] || hash; }
window.addEventListener('hashchange', () => {
  const rawHash = location.hash.slice(1), hash = legacyHash(rawHash), exact = story.slides.findIndex(slide => slide.id === hash), section = sectionStart(hash);
  if (exact >= 0) renderSlide(exact, false); else if (section >= 0) renderSlide(section, false);
});
const rawInitialHash = location.hash.slice(1);
const initialHash = legacyHash(rawInitialHash);
const exact = story.slides.findIndex(slide => slide.id === initialHash);
const section = sectionStart(initialHash);
renderSlide(exact >= 0 ? exact : section >= 0 ? section : 0, false);
