import { ObjectStackClient } from '@objectstack/client';
import { ObjectStackAdapter } from '@object-ui/data-objectstack';

// Wrapper to debug requests
const fetchWrapper = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();
    // Ignore vite hot reload or node module requests
    if (url.includes('/api/')) {
        console.log('[DEBUG-FETCH]', url);
    }
    return globalThis.fetch(input, init);
};

// Use empty string to auto-detect or match MSW if it handles root
const BASE_URL = ''; 

export const client = new ObjectStackClient({
  baseUrl: BASE_URL, 
  fetch: fetchWrapper
});

export const dataSource = new ObjectStackAdapter({
  baseUrl: BASE_URL,
  token: 'mock-token',
  fetch: fetchWrapper
});

export const initClient = async () => {
    console.log('[Client] Connecting...');
    // Only connect client (adapter connects lazily or we can connect it too)
    await client.connect();
    // await dataSource.connect(); // Adapter usually auto-connects on request
    console.log('[Client] Connected');
}