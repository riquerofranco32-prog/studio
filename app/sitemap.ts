import { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/services", "/start", "/#estimator", "/#about", "/#contact"].map(
    (path) => ({
      url: `${SITE.url}${path}`,
      lastModified: new Date(),
    }),
  );

  const workRoutes = projects.map((p) => ({
    url: `${SITE.url}/work/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...workRoutes];
}
