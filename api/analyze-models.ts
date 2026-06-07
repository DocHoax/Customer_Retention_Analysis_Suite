import type { IncomingMessage, ServerResponse } from 'http';
import { buildModelAnalysis, readJsonBody, resolveCustomers, sendJson } from './_shared';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const customers = resolveCustomers(body);
    sendJson(res, 200, buildModelAnalysis(customers));
  } catch (error: any) {
    sendJson(res, 500, {
      success: false,
      error: error?.message || 'Failed to analyze models.',
    });
  }
}