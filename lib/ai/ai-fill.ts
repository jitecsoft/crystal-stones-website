import { categorySubfamilies, productCategories } from "@/lib/products/categories";

/**
 * Catalogue assistant for the admin team.
 *
 * It looks at an uploaded image, optionally checks public reference material
 * for the stone name, and returns the fields the media library and product
 * form need. The provider is any OpenAI-compatible chat API, configured with
 * AI_API_KEY, AI_BASE_URL and AI_MODEL.
 *
 * The copy rules are deliberately conservative: the assistant never invents
 * certifications, prices, quarry names or availability — unknown facts are
 * left empty and confirmed on enquiry.
 */

export type AiFields = {
  title?: string;
  alt_text?: string;
  caption?: string;
  description?: string;
  summary?: string;
  seo_title?: string;
  seo_description?: string;
  tags?: string[];
  category?: string;
  subfamily?: string;
  colours?: string[];
  patterns?: string[];
  finishes?: string[];
  applications?: string[];
  origin_country?: string;
  origin_region?: string;
  care_notes?: string;
};

export type AiFillResult = { fields: AiFields; sources: string[]; note: string };

export function aiConfigured() {
  return Boolean(process.env.AI_API_KEY);
}

function aiBaseUrl() {
  return (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
}

function aiModel() {
  return process.env.AI_MODEL || "gpt-4o-mini";
}

const USER_AGENT = "CrystalStonesCatalogue/1.0 (admin catalogue assistant)";

/** Words that appear in nearly every stone query and cannot identify a reference. */
const GENERIC_WORDS = new Set([
  "marble", "stone", "stones", "slab", "slabs", "surface", "surfaces", "porcelain", "granite",
  "onyx", "sintered", "countertop", "countertops", "limestone", "travertine", "sandstone", "quartzite",
  "quartz", "collection", "catalogue", "catalog", "series", "design", "range", "product", "colour",
  "color", "tile", "tiles", "kitchen", "bathroom", "wall", "floor", "flooring", "cladding"
]);

/** Tokens that must appear in a reference title for it to be about this material. */
function identifyingTokens(query: string) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !GENERIC_WORDS.has(token));
}

async function fetchWikipedia(query: string): Promise<{ text: string; sources: string[] }> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`;
    const response = await fetch(searchUrl, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return { text: "", sources: [] };
    const data = await response.json();
    const tokens = identifyingTokens(query);
    const hits = (data?.query?.search ?? []).filter((hit: { title?: string }) => {
      if (!tokens.length) return true;
      const title = (hit.title ?? "").toLowerCase();
      return tokens.some((token) => title.includes(token));
    }).slice(0, 2);
    if (!hits.length) return { text: "", sources: [] };
    const snippets = hits.map((hit: { snippet?: string }) => (hit.snippet ?? "").replace(/<[^>]+>/g, "")).join(" ");
    let extract = "";
    try {
      const titles = hits.map((hit: { title: string }) => hit.title).join("|");
      const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&format=json&origin=*&titles=${encodeURIComponent(titles)}`;
      const extractResponse = await fetch(extractUrl, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(5000) });
      if (extractResponse.ok) {
        const pages = (await extractResponse.json())?.query?.pages ?? {};
        extract = Object.values(pages as Record<string, { extract?: string }>)
          .map((page) => page.extract ?? "")
          .join("\n")
          .slice(0, 2500);
      }
    } catch {
      extract = "";
    }
    return { text: [snippets, extract].filter(Boolean).join("\n").slice(0, 2200), sources: hits.map((hit: { title: string }) => `Wikipedia · ${hit.title}`) };
  } catch {
    return { text: "", sources: [] };
  }
}

async function fetchWebResults(query: string): Promise<{ text: string; sources: string[] }> {
  try {
    const response = await fetch("https://lite.duckduckgo.com/lite/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": USER_AGENT },
      body: new URLSearchParams({ q: query }).toString(),
      signal: AbortSignal.timeout(6000)
    });
    if (!response.ok) return { text: "", sources: [] };
    const html = await response.text();
    const links = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)]
      .map((match) => match[1])
      .filter((url) => !url.includes("duckduckgo.com"))
      .slice(0, 6);
    const tokens = identifyingTokens(query);
    const relevantLinks = links.filter((url) => {
      if (!tokens.length) return true;
      const lowered = url.toLowerCase();
      return tokens.some((token) => lowered.includes(token));
    });
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2200);
    const sources = (relevantLinks.length ? relevantLinks : links).slice(0, 4).map((url) => url.replace(/^https?:\/\//, "").split("/")[0]);
    return { text, sources };
  } catch {
    return { text: "", sources: [] };
  }
}

/** Best-effort public reference material for the stone name. */
export async function gatherWebContext(query: string) {
  if (!query) return { text: "", sources: [] };
  const [wiki, web] = await Promise.all([fetchWikipedia(query), fetchWebResults(query)]);
  return { text: [wiki.text, web.text].filter(Boolean).join("\n\n").slice(0, 3500), sources: [...wiki.sources, ...web.sources] };
}

function categoryList() {
  return productCategories.map((category) => category.slug).join(", ");
}

function subfamilyList() {
  return Object.entries(categorySubfamilies)
    .map(([category, subs]) => `${category}: ${subs.map((sub) => sub.slug).join(", ")}`)
    .join("\n");
}

function systemPrompt(mode: "media" | "product") {
  return [
    "You are the catalogue editor for Crystal Stones, an Indian supplier of natural stone and architectural surfaces (sintered stone, porcelain slabs, marble, granite, onyx, sandstone, travertine).",
    "You write for B2B architects, designers and contractors reading on a website.",
    mode === "media"
      ? "You are captioning one catalogue photograph."
      : "You are completing one product record in the catalogue.",
    "Rules:",
    "1. Describe only what you can actually see in the image and what the provided reference text states. Never invent certifications, prices, quarry names, thicknesses, formats, availability or awards.",
    "2. If a fact is unknown, leave the field empty rather than guessing.",
    "3. Write in plain, confident, trade-aware English. No hype, no emoji.",
    "4. Use the British spelling style already used on the site (colour, finish, surface).",
    "5. Alt text must describe the actual image for accessibility, under 240 characters.",
    `6. "category" must be one of: ${categoryList()}.`,
    `7. "subfamily" must be empty or one of the colour families listed for the chosen category:\n${subfamilyList()}`,
    "8. SEO title under 60 characters, SEO description under 155 characters, tags between 3 and 6 short lowercase entries.",
    "Return only a JSON object with these keys and no commentary:",
    '{"title":"","alt_text":"","caption":"","description":"","summary":"","seo_title":"","seo_description":"","tags":[],"category":"","subfamily":"","colours":[],"patterns":[],"finishes":[],"applications":[],"origin_country":"","origin_region":"","care_notes":""}'
  ].join("\n");
}

function userPrompt(input: { name?: string; description?: string; hint?: string; contextText: string; hasImage: boolean; mode: "media" | "product" }) {
  const parts: string[] = [];
  parts.push(input.hasImage
    ? "A catalogue photograph is attached. Base the visual description on what the image shows."
    : "No photograph is attached, so describe the material from the name and description only, and leave visual claims out.");
  if (input.name) parts.push(`Name given by the team: ${input.name}`);
  if (input.description) parts.push(`Team description: ${input.description}`);
  if (input.hint) parts.push(`Extra note from the team: ${input.hint}`);
  if (input.contextText) parts.push(`Public reference material found online (may be unreliable — use only what clearly matches this material):\n${input.contextText}`);
  else parts.push("No public reference material was found. Work from the image and the team notes only, and leave unknown facts empty.");
  parts.push(input.mode === "media"
    ? "Return the caption fields for this photograph."
    : "Return the product fields, including a short summary for listing cards and care notes that stay general.");
  return parts.join("\n\n");
}

async function callModel(imageDataUrl: string | null, prompt: string, mode: "media" | "product"): Promise<string> {
  const content: (Record<string, unknown> | { type: string; text: string })[] = [{ type: "text", text: prompt }];
  if (imageDataUrl) content.push({ type: "image_url", image_url: { url: imageDataUrl } });
  const base = {
    model: aiModel(),
    messages: [
      { role: "system", content: systemPrompt(mode) },
      { role: "user", content: content as unknown as string }
    ],
    temperature: 0.35
  };
  const send = (payload: Record<string, unknown>) => fetch(`${aiBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.AI_API_KEY}` },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(45000)
  });

  // Ask for strict JSON first, then fall back for providers that do not
  // support JSON mode, then for providers that reject image payloads.
  const attempts: Record<string, unknown>[] = [
    { ...base, response_format: { type: "json_object" } },
    { ...base },
    { ...base, response_format: { type: "json_object" }, messages: [{ role: "system", content: systemPrompt(mode) }, { role: "user", content: prompt }] },
    { ...base, messages: [{ role: "system", content: systemPrompt(mode) }, { role: "user", content: prompt }] }
  ];

  let lastStatus = 0;
  for (const attempt of attempts) {
    const response = await send(attempt);
    if (response.ok) {
      const data = await response.json();
      const raw = data?.choices?.[0]?.message?.content;
      const text = Array.isArray(raw)
        ? raw.map((part: { text?: string }) => part?.text ?? "").join("")
        : typeof raw === "string" ? raw : "";
      if (text.trim()) return text;
      throw new Error("The AI provider returned an empty response.");
    }
    lastStatus = response.status;
    if (response.status !== 400 && response.status !== 404 && response.status !== 415) break;
  }
  throw new Error(`The AI provider returned an error (${lastStatus}).`);
}

function extractJson(text: string): Record<string, unknown> {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("The AI response could not be read as JSON.");
  return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
}

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function cleanList(value: unknown, max = 24): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, max);
  return items.length ? items : undefined;
}

export function sanitizeFields(raw: Record<string, unknown>): AiFields {
  const fields: AiFields = {};
  const title = cleanText(raw.title, 180);
  if (title) fields.title = title;
  const alt = cleanText(raw.alt_text, 240);
  if (alt) fields.alt_text = alt;
  const caption = cleanText(raw.caption, 500);
  if (caption) fields.caption = caption;
  const description = cleanText(raw.description, 2000);
  if (description) fields.description = description;
  const summary = cleanText(raw.summary, 500);
  if (summary) fields.summary = summary;
  const seoTitle = cleanText(raw.seo_title, 60);
  if (seoTitle) fields.seo_title = seoTitle;
  const seoDescription = cleanText(raw.seo_description, 155);
  if (seoDescription) fields.seo_description = seoDescription;
  const careNotes = cleanText(raw.care_notes, 1000);
  if (careNotes) fields.care_notes = careNotes;
  const originCountry = cleanText(raw.origin_country, 120);
  if (originCountry) fields.origin_country = originCountry;
  const originRegion = cleanText(raw.origin_region, 120);
  if (originRegion) fields.origin_region = originRegion;
  const tags = cleanList(raw.tags, 12);
  if (tags) fields.tags = tags.map((tag) => tag.toLowerCase()).slice(0, 12);
  const colours = cleanList(raw.colours);
  if (colours) fields.colours = colours;
  const patterns = cleanList(raw.patterns);
  if (patterns) fields.patterns = patterns;
  const finishes = cleanList(raw.finishes);
  if (finishes) fields.finishes = finishes;
  const applications = cleanList(raw.applications);
  if (applications) fields.applications = applications;
  const category = typeof raw.category === "string" ? raw.category.trim() : "";
  if (productCategories.some((item) => item.slug === category)) fields.category = category;
  const subfamily = typeof raw.subfamily === "string" ? raw.subfamily.trim() : "";
  if (subfamily && (categorySubfamilies as Record<string, { slug: string }[]>)[category]?.some((item) => item.slug === subfamily)) {
    fields.subfamily = subfamily;
  }
  return fields;
}

export async function aiFill(input: {
  imageDataUrl?: string | null;
  name?: string;
  description?: string;
  hint?: string;
  contextText?: string;
  sources?: string[];
  mode: "media" | "product";
}): Promise<AiFillResult> {
  const prompt = userPrompt({
    name: input.name,
    description: input.description,
    hint: input.hint,
    contextText: input.contextText ?? "",
    hasImage: Boolean(input.imageDataUrl),
    mode: input.mode
  });
  const raw = extractJson(await callModel(input.imageDataUrl ?? null, prompt, input.mode));
  const fields = sanitizeFields(raw);
  const filled = Object.keys(fields).length;
  return {
    fields,
    sources: input.sources ?? [],
    note: filled
      ? "Fields filled in. Review the wording, then save — the team stays responsible for what is published."
      : "The AI did not return usable details. Add the name or a one-line description and try again."
  };
}
