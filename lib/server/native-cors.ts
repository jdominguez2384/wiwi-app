const allowedNativeOrigins = new Set([
  "capacitor://localhost",
  "http://localhost",
  "https://localhost",
]);

export function isAllowedNativeOrigin(origin: string | null) {
  return origin !== null && allowedNativeOrigins.has(origin);
}

function getCorsHeaders(request: Request, methods: string[]) {
  const origin = request.headers.get("origin");
  const headers = new Headers({ Vary: "Origin" });

  if (!isAllowedNativeOrigin(origin)) return headers;

  headers.set("Access-Control-Allow-Origin", origin!);
  headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  headers.set("Access-Control-Allow-Methods", [...methods, "OPTIONS"].join(", "));
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

export function nativeJson(
  request: Request,
  body: unknown,
  init: ResponseInit & { methods?: string[] } = {}
) {
  const { methods = [], ...responseInit } = init;
  const headers = new Headers(responseInit.headers);

  for (const [key, value] of getCorsHeaders(request, methods)) {
    headers.set(key, value);
  }

  return Response.json(body, { ...responseInit, headers });
}

export function nativePreflight(request: Request, methods: string[]) {
  const origin = request.headers.get("origin");

  if (!isAllowedNativeOrigin(origin)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request, methods),
  });
}
