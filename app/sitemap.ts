import type { MetadataRoute } from "next";

const lastModified = new Date("2026-08-06T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://getwiwi.com",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://getwiwi.com/support",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://getwiwi.com/privacy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://getwiwi.com/terms",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://getwiwi.com/delete-account",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
