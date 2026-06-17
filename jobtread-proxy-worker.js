/* Optional Cloudflare Worker — only needed if Zipsnap shows a CORS/network
   error when saving to JobTread (browsers may block direct calls to the API).
   Deploy free at https://workers.cloudflare.com, then paste the worker URL
   into Zipsnap → Settings → "Proxy URL".

   It simply forwards Zipsnap's request body to the JobTread Pave API and
   returns the response with CORS headers added. The grant key travels inside
   the request body exactly as before — nothing is stored here. */

export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });

    const body = await request.text();
    const upstream = await fetch('https://api.jobtread.com/pave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }
};
