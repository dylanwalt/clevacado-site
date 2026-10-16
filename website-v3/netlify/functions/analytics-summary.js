import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const STORE_NAME = 'clevacado-analytics';
const PASSWORD_SALT_HEX = '7888bc0220ecf3cbd6a692c040d4ec7d';
const PASSWORD_HASH_ENV_KEY = 'ANALYTICS_PASSWORD_HASH';
const PASSWORD_ITERATIONS = 210000;
const SESSION_COOKIE = 'clevacado_analytics_session';
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const VIEWER_ID_PATTERN = /^[a-f0-9]{16}$/;

function getPasswordHash() {
  const netlifyHash = typeof Netlify === 'undefined' ? '' : Netlify.env?.get?.(PASSWORD_HASH_ENV_KEY) || '';
  return netlifyHash || process.env[PASSWORD_HASH_ENV_KEY] || '';
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}

function getCookie(request, name) {
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : '';
}

function passwordMatches(password) {
  if (typeof password !== 'string' || password.length < 1) return false;
  const passwordHash = getPasswordHash();
  if (!/^[a-f0-9]{64}$/i.test(passwordHash)) return false;
  const candidate = pbkdf2Sync(password, Buffer.from(PASSWORD_SALT_HEX, 'hex'), PASSWORD_ITERATIONS, 32, 'sha256');
  const expected = Buffer.from(passwordHash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function sessionSignature(payload) {
  const passwordHash = getPasswordHash();
  return createHmac('sha256', passwordHash).update(payload).digest('hex');
}

function createSessionCookie() {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${expiresAt}.${randomBytes(18).toString('hex')}`;
  const token = Buffer.from(`${payload}.${sessionSignature(payload)}`).toString('base64url');
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/.netlify/functions/analytics-summary; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

function hasValidSession(request) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [expiresAt, nonce, signature] = decoded.split('.');
    const payload = `${expiresAt}.${nonce}`;
    return Number(expiresAt) > Date.now() && Boolean(nonce) && signature === sessionSignature(payload);
  } catch {
    return false;
  }
}

function emptyDaily(days) {
  const result = [];
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - index);
    result.push({ date: date.toISOString().slice(0, 10), pageViews: 0, events: 0 });
  }
  return result;
}

export default async (request) => {
  if (request.method === 'POST') {
    let body = {};
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid request.' }, 400);
    }

    if (body.action === 'login') {
      if (!passwordMatches(body.password)) return json({ error: 'That password is not correct.' }, 401);
      return json({ ok: true }, 200, { 'Set-Cookie': createSessionCookie() });
    }

    if (body.action === 'logout') {
      return json({ ok: true }, 200, {
        'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/.netlify/functions/analytics-summary; Max-Age=0`,
      });
    }
  }

  if (request.method !== 'GET' || !hasValidSession(request)) {
    return json({ error: 'Authentication required.' }, 401);
  }

  try {
    const url = new URL(request.url);
    const requestedDays = Number(url.searchParams.get('days') || 30);
    const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;
    const requestedViewer = url.searchParams.get('viewer') || '';
    const viewer = VIEWER_ID_PATTERN.test(requestedViewer) ? requestedViewer : '';
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const store = getStore(STORE_NAME);
    const { blobs } = await store.list({ prefix: 'events/' });
    const events = (await Promise.all(blobs.map((blob) => store.get(blob.key, { type: 'json' })))).filter(Boolean);
    const recentEvents = events.filter((event) => {
      if (Date.parse(event.timestamp) < cutoff) return false;
      return !viewer || event.viewerFingerprint === viewer;
    });
    const rangeEvents = events.filter((event) => Date.parse(event.timestamp) >= cutoff);
    const eventCounts = new Map();
    const pathCounts = new Map();
    const videoCounts = new Map();
    const sessionHashes = new Set();
    const viewerCounts = new Map();
    const rangeViewerHashes = new Set();
    const daily = emptyDaily(days);
    const dailyByDate = new Map(daily.map((item) => [item.date, item]));

    for (const event of rangeEvents) {
      if (event.viewerFingerprint) {
        rangeViewerHashes.add(event.viewerFingerprint);
        viewerCounts.set(event.viewerFingerprint, (viewerCounts.get(event.viewerFingerprint) || 0) + 1);
      }
    }

    for (const event of recentEvents) {
      eventCounts.set(event.event, (eventCounts.get(event.event) || 0) + 1);
      pathCounts.set(event.path, (pathCounts.get(event.path) || 0) + 1);
      if (event.sessionHash) sessionHashes.add(event.sessionHash);
      const day = dailyByDate.get(event.timestamp.slice(0, 10));
      if (day) {
        day.events += 1;
        if (event.event === 'page_view') day.pageViews += 1;
      }
      if (event.event === 'video_play') {
        const videoName = event.properties?.video || 'unknown';
        videoCounts.set(videoName, (videoCounts.get(videoName) || 0) + 1);
      }
    }

    const sortCounts = (map) => [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    const sortViewerCounts = (map) => [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100)
      .map(([id, count]) => ({ id, count }));

    return json({
      ok: true,
      days,
      totalEvents: recentEvents.length,
      pageViews: eventCounts.get('page_view') || 0,
      activeSessions: sessionHashes.size,
      uniqueViewers: viewer ? (rangeViewerHashes.has(viewer) ? 1 : 0) : rangeViewerHashes.size,
      selectedViewer: viewer || 'all',
      pilotFormOpens: eventCounts.get('pilot_form_open') || 0,
      pilotFormDrafts: eventCounts.get('pilot_form_draft') || 0,
      pilotFormSubmits: eventCounts.get('pilot_form_submit') || 0,
      videoPlays: eventCounts.get('video_play') || 0,
      eventCounts: sortCounts(eventCounts),
      pathCounts: sortCounts(pathCounts),
      videoCounts: sortCounts(videoCounts),
      viewerCounts: sortViewerCounts(viewerCounts),
      daily,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return json({ error: 'Analytics storage is not available yet.' }, 503);
  }
};
