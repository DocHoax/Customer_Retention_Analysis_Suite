import type { IncomingMessage, ServerResponse } from 'http';
import { buildSimulatedDatasetFromBody, readJsonBody, sendJson } from '../_shared';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const customers = buildSimulatedDatasetFromBody(body);

    sendJson(res, 200, {
      success: true,
      message: `Successfully generated ${customers.length} simulated customer profiles.`,
      customers,
    });
  } catch (error: any) {
    sendJson(res, 500, {
      success: false,
      error: error?.message || 'Failed to generate simulated customers.',
    });
  }
}