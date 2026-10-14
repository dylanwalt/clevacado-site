// Browser-only companion for the copied testing dashboard. It gives the
// dashboard's real Live inference tab a deterministic, clearly synthetic feed.
(() => {
  const originalFetch = window.fetch.bind(window);
  const colours = { rubber_mat: '#49bc8b', tar_road: '#569cfa', dirt_road: '#d5aa52', small_drop: '#e6c65b', medium_drop: '#ee8c55' };
  const events = [
    ['small_drop', 0.6, 1.3, 0.91, 'Small drop · synthetic replay'],
    ['dirt_road', 2.0, 3.8, 0.84, 'Dirt road · synthetic replay'],
    ['tar_road', 4.0, 5.8, 0.88, 'Tar road · synthetic replay'],
    ['medium_drop', 6.1, 6.9, 0.94, 'Medium drop · synthetic replay'],
    ['rubber_mat', 8.0, 9.8, 0.86, 'Rubber mat conveyor belt · synthetic replay'],
  ].map(([klass, start_s, end_s, score, reason]) => ({
    class: klass, label: klass === 'rubber_mat' ? 'rubber mat conveyor belt' : String(klass).replaceAll('_', ' '), start_s, end_s, score,
    impact_s: klass.includes('drop') ? start_s + 0.2 : null, status: 'final', quality: 'synthetic demo', reason,
    color: colours[klass], probabilities: { [klass]: score, background: 1 - score },
  }));
  const model = { model_id: 'SIMULATED-browser-inference-v1', score_kind: 'illustrative model scores', validation_scope: 'No physical validation; website-only replay' };
  const inference = () => ({ ready: true, message: 'SIMULATED DATA · inference replay active', model, capture_key: 'SIMULATED-browser-demo', lag_s: 0.02, events });
  window.fetch = async (input, options) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (url.pathname === '/api/inference/events') return new Response(JSON.stringify({ total: events.length, events }), { headers: { 'Content-Type': 'application/json' } });
    if (url.pathname === '/api/state') {
      const response = await originalFetch(input, options); const state = await response.json(); state.inference = inference();
      return new Response(JSON.stringify(state), { status: response.status, headers: { 'Content-Type': 'application/json' } });
    }
    return originalFetch(input, options);
  };
  window.setTimeout(() => {
    const button = [...document.querySelectorAll('.tabs button')].find((item) => item.textContent === 'Live inference');
    button?.addEventListener('click', async () => {
      const state = await window.fetch('/api/state').then((response) => response.json());
      if (typeof window.renderInference === 'function') window.renderInference(state);
    });
  }, 0);
})();
