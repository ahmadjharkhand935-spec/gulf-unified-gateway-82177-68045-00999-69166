import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  // Get the response
  const response = await context.next();
  
  // Add custom headers
  const headers = new Headers(response.headers);
  
  // Add security headers
  headers.set("X-Powered-By", "Gulf Unified Platform");
  headers.set("X-Response-Time", Date.now().toString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = { path: "/*" };
