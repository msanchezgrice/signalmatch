import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules:{userAgent:"*",allow:["/","/resources/","/about","/contact","/privacy","/terms"],disallow:["/api/","/app/","/dashboard/"]}, sitemap:"https://www.signalmatch.me/sitemap.xml", host:"https://www.signalmatch.me" }; }
