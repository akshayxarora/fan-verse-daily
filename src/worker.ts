export default {
  async fetch(request: Request, env: { ASSETS: { fetch: (req: Request) => Promise<Response> } }): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Try to fetch the requested asset
    const response = await env.ASSETS.fetch(request);
    
    // If 404 and it's not a file with an extension, serve index.html for SPA routing
    if (response.status === 404) {
      // Check if path has a file extension (common static file extensions)
      const hasFileExtension = /\.(html|css|js|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|pdf|zip|txt)$/i.test(pathname);
      
      // If no file extension, serve index.html for client-side routing
      if (!hasFileExtension) {
        const indexUrl = new URL('/index.html', request.url);
        return env.ASSETS.fetch(new Request(indexUrl, request));
      }
    }
    
    return response;
  },
};

