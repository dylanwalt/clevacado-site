import { createHash, createHmac, randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const STORE_NAME = 'clevacado-analytics';
const VIEWER_FINGERPRINT_KEY = '40bb3e557cf074eb17184f7cac6da744c6329a32ecaffc5e3552387580718ca4';
const ALLOWED_EVENTS = new Set([
  'page_view',
  'pilot_form_open',
  'pilot_form_draft',
  'pilot_form_submit',
  'scenario_generate',
  'telemetry_point_select',
  'video_play',
]);

function cleanString(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function getClientIp(request, context) {
  if (context?.ip) return cleanString(context.ip, 100);

  const forwardedFor = cleanString(request.headers.get('x-forwarded-for'), 300);
  return forwardedFor ? cleanString(forwardedFor.split(',')[0], 100) : '';
}

function createViewerFingerprint(ip) {
  return ip ? createHmac('sha256', VIEWER_FINGERPRINT_KEY).update(ip).digest('hex').slice(0, 16) : undefined;
}

export default async (request, context) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const event = cleanString(body?.event, 40);
    if (!ALLOWED_EVENTS.has(event)) {
      return new Response(null, { status: 204 });
    }

    const now = new Date();
    const timestamp = now.toISOString();
    const path = cleanString(body?.path, 120) || '/';
    const device = body?.device === 'mobile' ? 'mobile' : 'desktop';
    const sessionId = cleanString(body?.sessionId, 120);
    const sessionHash = sessionId
      ? createHash('sha256').update(sessionId).digest('hex').slice(0, 16)
      : undefined;
    const viewerFingerprint = createViewerFingerprint(getClientIp(request, context));
    const properties = {};

    if (body?.properties && typeof body.properties === 'object') {
      for (const [key, value] of Object.entries(body.properties).slice(0, 4)) {
        if (typeof value === 'string' || typeof value === 'number') {
          properties[cleanString(key, 30)] = typeof value === 'string' ? cleanString(value, 50) : value;
        }
      }
    }

    const store = getStore(STORE_NAME);
    await store.setJSON(`events/${timestamp.slice(0, 10)}/${Date.now()}-${randomUUID()}`, {
      event,
      path,
      device,
      sessionHash,
      viewerFingerprint,
      properties,
      timestamp,
    });

    return new Response(null, {
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    // Analytics must never interfere with the public landing page.
    return new Response(null, { status: 204 });
  }
};
