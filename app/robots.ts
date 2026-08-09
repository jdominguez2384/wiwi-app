import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacy", "/terms", "/support", "/delete-account"],
      disallow: [
        "/dashboard",
        "/history",
        "/insights",
        "/add-shift",
        "/edit-shift",
        "/settings",
        "/pro",
        "/api",
      ],
    },
    sitemap: "https://getwiwi.com/sitemap.xml",
    host: "https://getwiwi.com",
  };
}
