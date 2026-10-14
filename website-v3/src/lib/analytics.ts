export type AnalyticsEventName =
  | 'page_view'
  | 'pilot_form_open'
  | 'pilot_form_draft'
  | 'pilot_form_submit'
  | 'scenario_generate'
  | 'telemetry_point_select'
  | 'video_play';

const EVENT_ENDPOINT = '/.netlify/functions/analytics-event';
const SESSION_STORAGE_KEY = 'clevacado_analytics_session';

function getSessionId() {
  if (typeof window === 'undefined') return undefined;

  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;

    const sessionId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    return sessionId;
  } catch {
    return undefined;
  }
}

export function track(event: AnalyticsEventName, properties: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;

  const payload = JSON.stringify({
    event,
    path: window.location.pathname,
    sessionId: getSessionId(),
    device: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
    properties,
  });

  try {
    const body = new Blob([payload], { type: 'application/json' });
    if (navigator.sendBeacon?.(EVENT_ENDPOINT, body)) return;
  } catch {
    // Fall through to fetch when sendBeacon is unavailable.
  }

  void fetch(EVENT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

export function trackOnce(key: string, event: AnalyticsEventName, properties: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;

  try {
    const storageKey = `clevacado_analytics_once_${key}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, '1');
  } catch {
    // Still record the event if session storage is unavailable.
  }

  track(event, properties);
}
