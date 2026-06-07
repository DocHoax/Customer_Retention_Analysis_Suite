import type { IncomingMessage, ServerResponse } from 'http';
import { INITIAL_CUSTOMERS } from '../../src/mockData';
import { sendJson } from '../_shared';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  sendJson(res, 200, {
    success: true,
    customers: INITIAL_CUSTOMERS,
  });
}