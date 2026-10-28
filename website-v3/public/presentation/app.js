import {trace} from './trace.js';

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

const signalPath = trace.map(([time, acceleration], index) => `${index ? 'L' : 'M'}${((time + .590201) / 1.966398 * 940).toFixed(2)} ${(170 - acceleration / 150 * 150).toFixed(2)}`).join(' ');

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
  if (slide.media === 'graphic') {
    const items = (slide.items || []).map(([number, label]) => `<div class="graphic-item"><span>${escapeHtml(number)}</span><strong>${escapeHtml(label)}</strong></div>`).join('');
    return `<div class="slide-media graphic graphic-${escapeHtml(slide.graphic)}"><div class="graphic-content">${slide.tag ? `<div class="graphic-tag">${escapeHtml(slide.tag)}</div>` : ''}${slide.metric ? `<div class="graphic-metric">${escapeHtml(slide.metric)}</div><div class="graphic-metric-label">${escapeHtml(slide.metricLabel)}</div>` : ''}${slide.quote ? `<div class="graphic-quote">${escapeHtml(slide.quote).replaceAll('\n','<br>')}</div>` : ''}${items ? `<div class="graphic-items">${items}</div>` : ''}${slide.foot ? `<div class="graphic-foot">${escapeHtml(slide.foot)}</div>` : ''}</div></div>`;
  }
  if (slide.media === 'model') {
    return `<div class="slide-media model-media" id="model-media"><img class="model-fallback" src="assets/optimized/shell-cad.c2933895e0f8.jpg" alt="Provisional ClevaCado shell CAD view"><span class="model-status" id="model-status">Loading 3D model…</span><button class="model-button" id="model-button" type="button" aria-pressed="false" disabled>Separate shell ↗</button>${caption}</div>`;
  }
  if (slide.media === 'signal') {
    return `<div class="slide-media signal-media"><button class="signal-button" id="signal-button" type="button">Replay signal ↻</button><div class="signal-visual" id="signal-visual"><div class="signal-heading">RECORDED ACCELERATION · g</div><svg viewBox="0 0 940 190" preserveAspectRatio="none" role="img" aria-label="Recorded acceleration from one controlled nominal 15 centimetre drop"><path d="M0 20H940 M0 95H940 M0 170H940" stroke="#b8ff5a66" fill="none"/><path class="signal-trace" d="${signalPath}" fill="none" stroke="#b7ff5a" stroke-width="3" vector-effect="non-scaling-stroke" pathLength="1"/></svg><div class="axis"><span>−0.59 s</span><span>0 s</span><span>+1.38 s</span></div><small>One controlled example · not a bruise measurement</small></div>${caption}</div>`;
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
  if (next && next.media === 'model') {
    const prepareModel = () => { if (story.slides[current + 1]?.media === 'model') initialiseModel(); };
    if (window.requestIdleCallback) window.requestIdleCallback(prepareModel); else setTimeout(prepareModel, 300);
  }
}

function renderSlide(index, updateHash = true) {
  if (index < 0 || index >= story.slides.length) return;
  stopModelAnimation();
  current = index;
  const slide = story.slides[current];
  const lines = slide.lines?.length ? `<ul class="support-lines">${slide.lines.map(line => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : '';
  const source = slide.source ? `<a class="source-link" href="${escapeHtml(slide.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(slide.source)} ↗</a>` : '';
  $('#stage').innerHTML = `<article class="slide layout-${escapeHtml(slide.layout || 'light')}" data-slide="${escapeHtml(slide.id)}"><div class="slide-copy"><div class="eyebrow">${escapeHtml(slide.eyebrow)}</div><h1>${escapeHtml(slide.title)}${slide.accent ? `<em>${escapeHtml(slide.accent)}</em>` : ''}</h1><p class="detail">${escapeHtml(slide.detail)}</p>${lines}${source}</div>${renderMedia(slide)}</article>`;
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
    $('#signal-button').addEventListener('click', replaySignal);
    requestAnimationFrame(replaySignal);
  }
  preloadNextImage();
}

function replaySignal() {
  const plot = $('#signal-visual');
  if (!plot) return;
  plot.classList.remove('playing');
  void plot.offsetWidth;
  plot.classList.add('playing');
}

async function initialiseModel() {
  if (model || modelFailed) return model;
  if (modelPromise) return modelPromise;
  modelPromise = (async () => {
    try {
      const [THREE, {STLLoader}] = await Promise.all([import('three'), import('./vendor/STLLoader.js')]);
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
      const loader = new STLLoader();
      const geometries = await Promise.all(['shell-upper.4e0633dcf571.stl', 'shell-lower.3896e1c3f3c3.stl'].map(name => loader.loadAsync(`./assets/optimized/${name}`)));
      const material = new THREE.MeshStandardMaterial({color:0x5ed143, roughness:.48, metalness:.07});
      const meshes = geometries.map(geometry => { geometry.computeVertexNormals(); const mesh = new THREE.Mesh(geometry, material); group.add(mesh); return mesh; });
      const box = new THREE.Box3().setFromObject(group), size = new THREE.Vector3(), centre = new THREE.Vector3();
      box.getSize(size); box.getCenter(centre); meshes.forEach(mesh => mesh.position.sub(centre));
      const homeZ = -centre.z;
      group.scale.setScalar(3.7 / Math.max(size.x, size.y, size.z)); group.rotation.x = -Math.PI / 2; group.rotation.z = .15;
      model = {renderer, scene, camera, group, meshes, homeZ, open:false, openAmount:0};
      if (story.slides[current].media === 'model') showReadyModel();
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
  if (!model || !host || story.slides[current].media !== 'model') return;
  const box = host.getBoundingClientRect();
  if (!box.width || !box.height) return;
  model.renderer.setSize(Math.max(1, box.width), Math.max(1, box.height), false);
  model.camera.aspect = box.width / box.height; model.camera.updateProjectionMatrix();
}

function drawModel() {
  if (!model || story.slides[current].media !== 'model' || !$('#model-media')) { modelFrame = 0; return; }
  const desired = model.open ? 1 : 0;
  model.openAmount = reducedMotion.matches ? desired : model.openAmount + (desired - model.openAmount) * .045;
  model.meshes[0].position.z = model.homeZ + model.openAmount * 12;
  model.meshes[1].position.z = model.homeZ - model.openAmount * 12;
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
  splitTimer = setTimeout(() => { if (!userChangedShell && story.slides[current].media === 'model') setShell(true); }, reducedMotion.matches ? 0 : 1400);
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
  if (event.key === 'ArrowRight') { event.preventDefault(); renderSlide(current + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); renderSlide(current - 1); }
});
window.addEventListener('resize', resizeModel);
window.addEventListener('hashchange', () => {
  const rawHash = location.hash.slice(1), hash = rawHash === 'build' ? 'problem' : rawHash, exact = story.slides.findIndex(slide => slide.id === hash), section = sectionStart(hash);
  if (exact >= 0) renderSlide(exact, false); else if (section >= 0) renderSlide(section, false);
});
const rawInitialHash = location.hash.slice(1);
const initialHash = rawInitialHash === 'build' ? 'problem' : rawInitialHash;
const exact = story.slides.findIndex(slide => slide.id === initialHash);
const section = sectionStart(initialHash);
renderSlide(exact >= 0 ? exact : section >= 0 ? section : 0, false);
