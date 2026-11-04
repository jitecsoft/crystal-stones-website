/** Local-safe public URL. Set NEXT_PUBLIC_SITE_URL explicitly for each deployment. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
