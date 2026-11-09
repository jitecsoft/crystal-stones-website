/**
 * Editorial starter catalogue. A country grouping is not proof of a slab's origin.
 * Promote a variety to verified origin only after checking supplier documents for
 * the named product/lot. This data file is the supported product-entry workflow.
 */

export type MarbleOrigin = "Italy" | "Turkey" | "Spain" | "Greece" | "Portugal";
export type MarbleOriginSlug = "italy" | "turkey" | "spain" | "greece" | "portugal" | "other";
export type StoneFamily = "marble" | "limestone" | "travertine" | "onyx" | "quartzite" | "granite" | "other";

export type ImportedMarbleVariety = {
  slug: string;
  name: string;
  aliases: string[];
  origin: {
    country: MarbleOrigin | null;
    region?: string;
    suggestedCountries: MarbleOrigin[];
    status: "reference-verified" | "pending";
    note: string;
    sourceUrls: string[];
    verifiedAt: string | null;
  };
  stoneFamily: StoneFamily;
  familyNote?: string;
  familyVerified: boolean;
  colours: string[];
  patterns: string[];
  finishes: string[];
  applications: string[];
  attributesVerified: boolean;
  description: string;
  careNotes: string;
  image: {
    src: string;
    alt: string;
    attribution: string;
    usage: string;
    illustrative: boolean;
  };
  technicalDocuments: { label: string; href: string; verifiedAt: string }[];
  availability: "enquiry-based" | "confirmed-available" | "unavailable";
  availabilityVerifiedAt: string | null;
  seoTitle: string;
  seoDescription: string;
};

const researchDate = "2026-11-04";

type MarbleImage = ImportedMarbleVariety["image"];

const marbleImages: Record<"white" | "beige" | "grey" | "dark" | "pink" | "brown", MarbleImage> = {
  white: {
    src: "/images/catalogue/imported-marble/pexels-white-marble.webp",
    alt: "Illustrative white marble surface with soft grey veining; not a photograph of the named variety or a current slab",
    attribution: "Pexels stock photography · colour-matched illustration",
    usage: "Colour-matched illustration only; replace with approved variety-specific photography before launch",
    illustrative: true,
  },
  beige: {
    src: "/images/catalogue/imported-marble/pexels-beige-marble.webp",
    alt: "Illustrative warm beige stone surface; not a photograph of the named variety or a current slab",
    attribution: "Pexels stock photography · colour-matched illustration",
    usage: "Colour-matched illustration only; replace with approved variety-specific photography before launch",
    illustrative: true,
  },
  grey: {
    src: "/images/catalogue/imported-marble/pexels-grey-marble.webp",
    alt: "Illustrative grey marble surface with tonal movement; not a photograph of the named variety or a current slab",
    attribution: "Pexels stock photography · colour-matched illustration",
    usage: "Colour-matched illustration only; replace with approved variety-specific photography before launch",
    illustrative: true,
  },
  dark: {
    src: "/images/catalogue/imported-marble/pexels-dark-marble.webp",
    alt: "Illustrative dark marble surface with pale veining; not a photograph of the named variety or a current slab",
    attribution: "Pexels stock photography · colour-matched illustration",
    usage: "Colour-matched illustration only; replace with approved variety-specific photography before launch",
    illustrative: true,
  },
  pink: {
    src: "/images/catalogue/imported-marble/pexels-pink-marble.webp",
    alt: "Illustrative muted pink marble surface; not a photograph of the named variety or a current slab",
    attribution: "Pexels stock photography · colour-matched illustration",
    usage: "Colour-matched illustration only; replace with approved variety-specific photography before launch",
    illustrative: true,
  },
  brown: {
    src: "/images/catalogue/imported-marble/pexels-brown-marble.webp",
    alt: "Illustrative warm brown and gold stone surface; not a photograph of the named variety or a current slab",
    attribution: "Pexels stock photography · colour-matched illustration",
    usage: "Colour-matched illustration only; replace with approved variety-specific photography before launch",
    illustrative: true,
  },
};

function marbleImageFor(colours: string[], name: string): MarbleImage {
  const search = name.toLowerCase();
  if (/viola|lilac|rosa|pink/.test(search)) return marbleImages.pink;
  if (/portoro|nero|marquina|dark|black/.test(search)) return marbleImages.dark;
  if (/rosso|red|brown|marron|emperador/.test(search)) return marbleImages.brown;
  if (/giallo|gold|beige|marfil|botticino|siena|crema/.test(search)) return marbleImages.beige;
  if (/grigio|grey|gray|bardiglio|orobico|tundra|cloud/.test(search)) return marbleImages.grey;
  if (/carrara|statuario|white|thassos|lasa|afyon|mugla|marmara/.test(search)) return marbleImages.white;

  const colourSearch = colours.join(" ").toLowerCase();
  if (/lilac|pink/.test(colourSearch)) return marbleImages.pink;
  if (/black/.test(colourSearch)) return marbleImages.dark;
  if (/red|brown/.test(colourSearch)) return marbleImages.brown;
  if (/beige|ivory/.test(colourSearch)) return marbleImages.beige;
  if (/grey|blue/.test(colourSearch)) return marbleImages.grey;
  return marbleImages.white;
}

const carraraQuarries = "https://www.igfmarmi.it/en/marble-quarries/";
const carraraCoop = "https://coopcavatorigioia.it/le-cave/";
const lasQuarry = "https://www.lasamarmo.it/en/quarry/";
const perlatoSource = "https://palmyrasrl.com/prodotto/perlato-sicilia/?lang=en";
const rossoLevantoSource = "https://www.marmiorobici.com/wp/?action=datasheet&id=1285&lang=en";
const bardiglioSource = "https://marmidicarrara.massacarrara.it/en/materiali/bardiglio/";
const orobicoSource = "https://www.gmpmarmiegraniti.it/uk/marble/grigio-orobico.asp";
const afyonSource = "https://turkishmarblecompany.com/stones/afyon-white/";
const muglaSource = "https://www.polmer.com.tr/about-us/";
const marmaraSource = "https://www.gmka.gov.tr/dokumanlar/yayinlar/Balikesir-Industry-Investment-Guide.pdf";
const tundraSource = "https://www.brachot.com/en/materials/tundgr/tundra-grey/";
const milasSource = "https://www.sunmermarble.com/en/history";
const spainSource = "https://marmoleseuroamerica.com/";
const cremaSource = "https://marmoldealicante.com/extraccion/";
const thassosSource = "https://iugs-geoheritage.org/geoheritage_stones/thassos-marble/";
const volakasSource = "https://www.volakasmarble.com/";
const estremozSource = "https://iugs-geoheritage.org/geoheritage_stones/estremoz-marbles/";

function variety(input: Omit<ImportedMarbleVariety, "image" | "technicalDocuments" | "availability" | "availabilityVerifiedAt" | "seoTitle" | "seoDescription">): ImportedMarbleVariety {
  return {
    ...input,
    image: marbleImageFor(input.colours, input.name),
    technicalDocuments: [],
    availability: "enquiry-based",
    availabilityVerifiedAt: null,
    seoTitle: `${input.name} | Imported Natural Marble | Crystal Stones`,
    seoDescription: `${input.description} Ask Crystal Stones to confirm origin documents, lot photographs, finishes and current availability for your project.`,
  };
}

export const importedMarbleVarieties: ImportedMarbleVariety[] = [
  variety({ slug: "statuario", name: "Statuario", aliases: ["Statuario marble"], origin: { country: "Italy", region: "Carrara, Tuscany", suggestedCountries: ["Italy"], status: "reference-verified", note: "Carrara quarry references list Statuario; verify the actual quarry and documents for each requested lot.", sourceUrls: [carraraQuarries], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, familyNote: "Commercial marble variety.", colours: ["White"], patterns: ["Veined"], finishes: [], applications: ["Wall cladding", "Flooring", "Furniture / bespoke work"], attributesVerified: true, description: "A Carrara-area white marble name associated with distinct grey veining. Individual blocks vary, so request current slab photographs before deciding on layout or book-matching.", careNotes: "Marble is acid-sensitive. Confirm the selected finish, sealing advice and care sheet for the actual lot and application.", }),
  variety({ slug: "calacatta-gold", name: "Calacatta Gold", aliases: ["Calacatta Oro"], origin: { country: null, region: undefined, suggestedCountries: ["Italy"], status: "pending", note: "The trade name is not enough to prove the source of a specific block; confirm the quarry and origin documents.", sourceUrls: [carraraQuarries], verifiedAt: null }, stoneFamily: "marble", familyVerified: false, familyNote: "Confirm lithology from supplier documents.", colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "A requested trade name for a statement marble direction. The exact background, warm veining, stone family and country must be checked against the selected slab and its documents.", careNotes: "Ask for the care sheet and finish guidance for the exact slab before specification.", }),
  variety({ slug: "carrara", name: "Carrara", aliases: ["Bianco Carrara", "Carrara marble"], origin: { country: "Italy", region: "Carrara, Tuscany", suggestedCountries: ["Italy"], status: "reference-verified", note: "Carrara quarry sources document this marble district; the exact quarry basin remains lot-specific.", sourceUrls: [carraraQuarries, carraraCoop], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["White", "Grey"], patterns: ["Veined"], finishes: [], applications: ["Flooring", "Wall cladding", "Kitchen countertop", "Bathroom / vanity"], attributesVerified: true, description: "Carrara is a family of Italian white and grey marbles rather than one uniform slab appearance. Ask to review the actual lot for tone, veining and block sequence.", careNotes: "Use a stone-specific care sheet; acids and abrasive cleaners can mark marble finishes.", }),
  variety({ slug: "arabescato", name: "Arabescato", aliases: ["Arabescato marble"], origin: { country: "Italy", region: "Carrara area", suggestedCountries: ["Italy"], status: "reference-verified", note: "Carrara quarry operators list Arabescato among their extracted marbles; confirm the specific quarry for each lot.", sourceUrls: [carraraQuarries, carraraCoop], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["White"], patterns: ["Veined"], finishes: [], applications: ["Wall cladding", "Flooring", "Furniture / bespoke work"], attributesVerified: true, description: "A white marble trade family known for networked arabesque veining. Arabescato names can refer to different quarry basins, so the source and slab pattern should be verified together.", careNotes: "Request finish-specific care instructions and confirm that the selected slab is suitable for the intended exposure.", }),
  variety({ slug: "lasa-white", name: "Lasa White", aliases: ["Lasa Marble", "Laaser Marmor"], origin: { country: "Italy", region: "Laas, South Tyrol", suggestedCountries: ["Italy"], status: "reference-verified", note: "The Laas quarry source documents Lasa marble from its White Water Quarry.", sourceUrls: [lasQuarry], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["White"], patterns: ["Banded", "Veined"], finishes: [], applications: ["Flooring", "Wall cladding", "Facade / exterior"], attributesVerified: true, description: "Lasa marble is quarried in the Laas valley and occurs in pure white and banded varieties. Confirm which Lasa variety is being offered, since mineral inclusions change its appearance.", careNotes: "Ask for the current technical sheet and finish-specific maintenance instructions for the selected Lasa variety.", }),
  variety({ slug: "botticino", name: "Botticino", aliases: ["Botticino Classico", "Botticino marble"], origin: { country: "Italy", region: "Botticino, Brescia", suggestedCountries: ["Italy"], status: "reference-verified", note: "The Botticino Marble Museum documents the extraction basin and its limestone formation.", sourceUrls: ["https://www.museodelmarmo.it/le-cave/bacino-estrattivo"], verifiedAt: researchDate }, stoneFamily: "limestone", familyVerified: true, familyNote: "Commercially grouped with marble, but the local museum describes the source formation as limestone.", colours: ["Beige"], patterns: [], finishes: [], applications: [], attributesVerified: true, description: "Botticino is a beige Italian dimension stone from the Botticino basin. It is often sold in the marble trade, while the local geological source describes the formation as limestone; the product record preserves that distinction.", careNotes: "Confirm the exact commercial grade, finish and supplier care sheet for the selected lot.", }),
  variety({ slug: "perlato-sicilia", name: "Perlato Sicilia", aliases: ["Perlato di Sicilia"], origin: { country: "Italy", region: "Custonaci, Sicily", suggestedCountries: ["Italy"], status: "reference-verified", note: "Sicilian producer and material references describe Perlato Sicilia from the Custonaci area.", sourceUrls: [perlatoSource, "https://www.furrer.it/it/marmo/perlato-sicilia.asp"], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["Beige"], patterns: ["Fossil / pearled", "Veined"], finishes: ["Polished", "Honed"], applications: ["Flooring", "Wall cladding", "Kitchen countertop"], attributesVerified: true, description: "An ivory-beige Sicilian marble associated with pearly fossil traces and fine warm veining. Ask for slab images to judge how strongly those features read at project scale.", careNotes: "Confirm suitability and protection for wet, food-preparation or exterior applications with the supplier care sheet.", }),
  variety({ slug: "calacatta-viola", name: "Calacatta Viola", aliases: ["Viola Calacatta"], origin: { country: null, suggestedCountries: ["Italy"], status: "pending", note: "Trade-name use can vary; verify quarry, country and stone family for the offered lot.", sourceUrls: [], verifiedAt: null }, stoneFamily: "marble", familyVerified: false, familyNote: "Confirm the stone family and origin against the actual lot documents.", colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "A requested dramatic-colour trade name. The exact source, stone family, vein character and availability are intentionally left for lot-level confirmation.", careNotes: "Request the actual slab photograph and care sheet before accepting a specification.", }),
  variety({ slug: "portoro", name: "Portoro", aliases: ["Portoro marble", "Portovenere black"], origin: { country: null, suggestedCountries: ["Italy"], status: "pending", note: "Confirm the quarry region and geological classification for the specific commercial material.", sourceUrls: [], verifiedAt: null }, stoneFamily: "other", familyVerified: false, familyNote: "Commercially described as marble in some listings; geological family requires lot documentation.", colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "Portoro is retained as a trade-name search entry, not as a confirmed geological classification. Request origin documents and a current slab photograph before comparing it with other dark stones.", careNotes: "Do not assume marble care or performance until the specific stone family and finish are confirmed.", }),
  variety({ slug: "rosso-levanto", name: "Rosso Levanto", aliases: ["Rosso Levanto marble"], origin: { country: "Italy", region: "Levanto, Liguria", suggestedCountries: ["Italy"], status: "reference-verified", note: "An Italian supplier datasheet identifies Rosso Levanto as quarried in Levanto, Italy; confirm each lot independently.", sourceUrls: [rossoLevantoSource], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["Red", "White"], patterns: ["Branching veins"], finishes: ["Polished", "Honed", "Brushed"], applications: ["Flooring", "Wall cladding", "Kitchen countertop", "Bathroom / vanity"], attributesVerified: true, description: "A red Italian stone with white branching veins, described by a supplier datasheet as Rosso Levanto marble. Slab sequence and vein continuity matter when planning a feature surface.", careNotes: "Use a stone-specific care sheet and confirm finish suitability for wet or food-preparation areas.", }),
  variety({ slug: "giallo-siena", name: "Giallo Siena", aliases: ["Giallo di Siena"], origin: { country: null, suggestedCountries: ["Italy"], status: "pending", note: "Verify the quarry and exact stone family against current supplier documents.", sourceUrls: [], verifiedAt: null }, stoneFamily: "other", familyVerified: false, colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "A requested Italian trade name retained for catalogue discovery. Origin, geological family and the actual colour range need confirmation from the offered lot.", careNotes: "Ask for the product-specific care guidance once the supplier has identified the material and finish.", }),
  variety({ slug: "bardiglio", name: "Bardiglio", aliases: ["Bardiglio marble"], origin: { country: "Italy", region: "Apuan Alps, Tuscany", suggestedCountries: ["Italy"], status: "reference-verified", note: "The Carrara marble district source documents Bardiglio in the Apuan Alps.", sourceUrls: [bardiglioSource, carraraCoop], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["Grey", "Blue-grey"], patterns: ["Veined"], finishes: ["Polished", "Honed", "Brushed", "Sandblasted"], applications: ["Flooring", "Wall cladding", "Bathroom / vanity", "Staircase"], attributesVerified: true, description: "Bardiglio is an Apuan marble with a blue-grey ground and lighter or darker veins. Quarry campaigns produce different variants, so compare actual slabs rather than relying on the family name.", careNotes: "The cited supplier advises finish selection by exposure; request its current care and technical sheets for the actual lot.", }),
  variety({ slug: "grigio-orobico", name: "Grigio Orobico", aliases: ["Orobico Grey", "Marmo Orobico"], origin: { country: "Italy", region: "Orobie Alps", suggestedCountries: ["Italy"], status: "reference-verified", note: "Italian supplier references identify the Orobic Alps as the source region.", sourceUrls: [orobicoSource, "https://www.granitifavorita.com/it/collezioni/marmi/orobico"], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["Grey", "Pink", "Brown", "Gold"], patterns: ["Veined", "Arabesque"], finishes: ["Polished", "Honed", "Brushed"], applications: ["Flooring", "Wall cladding", "Kitchen countertop", "Bathroom / vanity"], attributesVerified: true, description: "An Italian grey marble name associated with layered multicolour veining. Supplier references describe pink, brown and occasional golden tones; the balance changes from slab to slab.", careNotes: "Request a supplier care sheet and confirm the treatment needed for the selected finish and application.", }),

  variety({ slug: "afyon-white", name: "Afyon White", aliases: ["Afyon Beyaz", "Afyon White marble"], origin: { country: "Turkey", region: "Afyonkarahisar", suggestedCountries: ["Turkey"], status: "reference-verified", note: "A Turkish marble supplier identifies Afyonkarahisar as the origin; confirm the source documents for each offered lot.", sourceUrls: [afyonSource], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["White"], patterns: [], finishes: ["Polished", "Honed"], applications: ["Flooring", "Wall cladding"], attributesVerified: true, description: "A white marble trade name associated with Afyonkarahisar. Confirm tone, veining, finish and actual quarry documentation against the slab offered for the project.", careNotes: "Ask for the product care sheet and a sample or slab photograph before final selection.", }),
  variety({ slug: "mugla-white", name: "Muğla White", aliases: ["Mugla White", "Muğla Beyaz"], origin: { country: "Turkey", region: "Muğla", suggestedCountries: ["Turkey"], status: "reference-verified", note: "A Muğla marble producer documents its own Muğla White quarry; Crystal Stones must still verify the origin of any supplied lot.", sourceUrls: [muglaSource], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["White"], patterns: [], finishes: ["Polished", "Honed", "Brushed"], applications: ["Flooring", "Wall cladding"], attributesVerified: true, description: "A Turkish white marble name tied to Muğla quarry production in the cited producer record. Ask which Muğla White variety and block are being offered; the name alone does not define its appearance.", careNotes: "Confirm finish-specific care and the selected block's current technical documentation.", }),
  variety({ slug: "marmara-white", name: "Marmara White", aliases: ["Marmara Marble", "Marmara Island Marble"], origin: { country: "Turkey", region: "Marmara Island, Balıkesir", suggestedCountries: ["Turkey"], status: "reference-verified", note: "A regional investment guide documents Marmara White among the stones quarried in Balıkesir.", sourceUrls: [marmaraSource], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["White", "Grey"], patterns: ["Crystalline", "Banded"], finishes: [], applications: [], attributesVerified: true, description: "Marmara White is associated with Marmara Island and the wider Balıkesir stone district. The regional guide describes white to grey-blue, coarse crystalline material; request current slab photographs for the exact block.", careNotes: "Confirm finish and care guidance for the supplied variety; names within the Marmara marble family can refer to different patterns.", }),
  variety({ slug: "burdur-beige", name: "Burdur Beige", aliases: ["Burdur Beige marble"], origin: { country: "Turkey", region: "Burdur", suggestedCountries: ["Turkey"], status: "reference-verified", note: "Turkish producer and trade references identify Burdur as a source region; confirm quarry documents for the offered lot.", sourceUrls: ["https://www.stonecontact.com/products-102218/burdur-beige-marble-blocks"], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["Beige"], patterns: [], finishes: [], applications: [], attributesVerified: true, description: "A beige marble name associated with Burdur in Turkish supplier records. Request the precise quarry, grade and slab photographs because commercial names can span several nearby source areas.", careNotes: "Ask for batch-specific care advice and technical documents before confirming a finish or use.", }),
  variety({ slug: "bilecik-beige", name: "Bilecik Beige", aliases: ["Bilecik Rosalia"], origin: { country: "Turkey", region: "Bilecik", suggestedCountries: ["Turkey"], status: "reference-verified", note: "A Turkish quarry operator documents a Bilecik Beige quarry; verify the specific variety and lot documentation.", sourceUrls: ["https://www.deltamarble.tr/"], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["Beige"], patterns: [], finishes: [], applications: [], attributesVerified: true, description: "Bilecik Beige is a Turkish commercial marble name linked to a Bilecik quarry by the cited producer. Confirm whether the offered material is Classic, Perlato or another named variety before specification.", careNotes: "Confirm the exact variety, finish and supplier care instructions for the requested lot.", }),
  variety({ slug: "ottoman-beige", name: "Ottoman Beige", aliases: ["Ottoman"], origin: { country: null, suggestedCountries: ["Turkey"], status: "pending", note: "A catalogue search result identifies an Ottoman quarry but does not prove the country and lithology of every item sold under this trade name.", sourceUrls: [], verifiedAt: null }, stoneFamily: "other", familyVerified: false, colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "Retained from the requested Turkish starter list as a trade-name search term. Origin, stone family and visual attributes remain pending until supplier documents are checked.", careNotes: "Request the exact quarry and material identification before relying on marble-specific care guidance.", }),
  variety({ slug: "diana-royal", name: "Diana Royal", aliases: ["Diana Royal marble"], origin: { country: null, suggestedCountries: ["Turkey"], status: "pending", note: "The trade name alone did not establish a specific quarry or country in the reviewed references.", sourceUrls: [], verifiedAt: null }, stoneFamily: "other", familyVerified: false, colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "Included as a discovery term from the requested starter list. Ask for the supplier's quarry declaration, stone-family classification and current slab photographs before evaluating it.", careNotes: "Do not apply marble-specific maintenance assumptions until the actual stone family is verified.", }),
  variety({ slug: "tundra-grey", name: "Tundra Grey", aliases: ["Savana Grey", "Tundra Gray", "Castle Grey"], origin: { country: "Turkey", region: "Burdur / Isparta trade references", suggestedCountries: ["Turkey"], status: "reference-verified", note: "The Turkish natural-stone association records a Burdur source; Brachot lists Savana Grey as an alternative name. Verify the actual quarry for each lot.", sourceUrls: ["https://www.tummer.org.tr/tr/urunDetay.aspx?urun_id=5912", tundraSource], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["Grey"], patterns: ["Cloudy", "Veined"], finishes: ["Honed", "Brushed"], applications: ["Flooring", "Wall cladding", "Kitchen countertop", "Bathroom / vanity"], attributesVerified: true, description: "A Turkish grey marble name. The trade sources describe a soft grey field with lighter and darker movement; Savana Grey appears as an alternative name in one supplier catalogue.", careNotes: "Ask for actual lot images and finish guidance; similarly named grey stones can come from different quarries.", }),
  variety({ slug: "invisible-grey", name: "Invisible Grey", aliases: ["Invisible Grey marble"], origin: { country: null, suggestedCountries: ["Turkey"], status: "pending", note: "The trade name did not establish a specific origin or lithology in the reviewed references.", sourceUrls: [], verifiedAt: null }, stoneFamily: "other", familyVerified: false, colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "A requested catalogue search name held for supplier validation. Confirm whether it refers to marble or another stone family and ask for quarry and slab records.", careNotes: "Wait for the supplier's product identification before applying stone-specific care instructions.", }),
  variety({ slug: "milas-lilac", name: "Milas Lilac", aliases: ["Milas Lilac marble"], origin: { country: "Turkey", region: "Muğla", suggestedCountries: ["Turkey"], status: "reference-verified", note: "A Muğla producer documents Milas Lilac extraction from its Kestanecik quarry area; confirm documents for the supplied lot.", sourceUrls: [milasSource], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["White", "Lilac"], patterns: ["Veined"], finishes: [], applications: [], attributesVerified: true, description: "Milas Lilac is a named marble variety from a Muğla producer's documented quarry range. Ask for slab photographs to assess the actual lilac movement and the continuity available for the project.", careNotes: "Request the care sheet and finish options for the exact block before specifying it in a wet or high-use location.", }),
  variety({ slug: "emperador-dark", name: "Emperador Dark", aliases: ["Dark Emperador", "Emperador Marrón"], origin: { country: null, suggestedCountries: ["Spain", "Turkey"], status: "pending", note: "Supplier references market Emperador under different origins. The specific quarry, country and lithology must be confirmed for each lot.", sourceUrls: ["https://alcanasureste.es/", "https://fmc-gr.com/en/products/marbles/turkish"], verifiedAt: null }, stoneFamily: "other", familyVerified: false, colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "Emperador Dark is a trade name used across more than one source market. It stays in the origin-review group until the offered block's quarry, country and stone family are documented.", careNotes: "Ask for the lot's identification, technical sheet and care guidance; do not infer origin from the name.", }),
  variety({ slug: "emperador-light", name: "Emperador Light", aliases: ["Light Emperador"], origin: { country: null, suggestedCountries: ["Spain", "Turkey"], status: "pending", note: "Supplier references market Emperador under different origins. The specific quarry, country and lithology must be confirmed for each lot.", sourceUrls: ["https://alcanasureste.es/", "https://fmc-gr.com/en/products/marbles/turkish"], verifiedAt: null }, stoneFamily: "other", familyVerified: false, colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "Emperador Light is a trade name used in multiple origin markets. Compare only after the supplier confirms the quarry, country, material family and actual slab appearance.", careNotes: "Request the supplier's technical and care documents for the specific material supplied.", }),

  variety({ slug: "crema-marfil", name: "Crema Marfil", aliases: ["Crema Marfil marble"], origin: { country: "Spain", region: "Monte Coto, Alicante", suggestedCountries: ["Spain"], status: "reference-verified", note: "The regional stone association identifies Monte Coto in Alicante as a source of Crema Marfil; confirm the quarry and lot documentation for any offer.", sourceUrls: [cremaSource, "https://marmolseller.es/en/crema-marfil-quarry/"], verifiedAt: researchDate }, stoneFamily: "limestone", familyVerified: true, familyNote: "Commercially sold as marble; the actual geological classification is limestone.", colours: ["Beige", "Ivory"], patterns: [], finishes: [], applications: [], attributesVerified: true, description: "A cream-to-ivory Spanish dimension stone associated with the Monte Coto quarry district in Alicante. It is commercially sold as marble but classified here as limestone; confirm the offered quarry and batch.", careNotes: "Because this is limestone, request product-specific guidance on acids, sealing, finish and exposure.", }),
  variety({ slug: "nero-marquina", name: "Nero Marquina", aliases: ["Negro Marquina"], origin: { country: null, suggestedCountries: ["Spain"], status: "pending", note: "The reviewed origin references did not establish the quarry of a specific offered Nero Marquina lot.", sourceUrls: [], verifiedAt: null }, stoneFamily: "other", familyVerified: false, familyNote: "Confirm whether the offered material is marble or limestone from its supplier documentation.", colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "A Spanish market trade name included for catalogue search. Verify its quarry, country and whether the supplied material is marble or limestone before using technical descriptions.", careNotes: "Request the actual material classification and care sheet for the offered block.", }),
  variety({ slug: "rosso-alicante", name: "Rosso Alicante", aliases: ["Rojo Alicante"], origin: { country: "Spain", region: "Alicante", suggestedCountries: ["Spain"], status: "reference-verified", note: "Spanish producer product lists associate Rojo Alicante with the Alicante marble trade; verify the specific quarry/lot documents.", sourceUrls: [spainSource, "https://alcanasureste.es/"], verifiedAt: researchDate }, stoneFamily: "other", familyVerified: false, familyNote: "Supplier pages call it marble; geological family and quarry should be confirmed per product lot.", colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "Rosso Alicante, also sold as Rojo Alicante, is retained as an Alicante-region trade name. Confirm the actual source, geological family and slab character from current supplier records.", careNotes: "Ask for product-specific care guidance after the stone family and finish are established.", }),

  variety({ slug: "thassos-white", name: "Thassos White", aliases: ["Thassos marble", "Thassos Island marble"], origin: { country: "Greece", region: "Thassos Island", suggestedCountries: ["Greece"], status: "reference-verified", note: "IUGS Geoheritage and a Thassos quarry operator document Greek Thassos marble and its quarry region.", sourceUrls: [thassosSource, "https://www.papagiannoulis.gr/quarry/thassos-quarry/"], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["White", "Grey"], patterns: ["Crystalline"], finishes: [], applications: ["Flooring", "Wall cladding", "Furniture / bespoke work"], attributesVerified: true, description: "Thassos marble is sourced from the Greek island of Thassos. The IUGS description notes white to white-grey crystalline material; ask for current slab images to judge the particular block.", careNotes: "Request the lot's technical sheet and finish guidance, especially for exterior or wet applications.", }),
  variety({ slug: "volakas", name: "Volakas", aliases: ["Volakas marble", "Volakas Cloudy"], origin: { country: "Greece", region: "Volakas, Drama", suggestedCountries: ["Greece"], status: "reference-verified", note: "Greek quarry operators document Volakas marble production in Northern Greece.", sourceUrls: [volakasSource, "https://quarries.marblesachanas.gr/"], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: ["White", "Grey"], patterns: ["Cloudy", "Veined", "Breccia"], finishes: [], applications: ["Flooring", "Wall cladding", "Bathroom / vanity"], attributesVerified: true, description: "Volakas is a Greek marble family with multiple named pattern variants. Producer references describe white backgrounds with grey clouding or breccia-like movement; confirm the exact named variant and lot.", careNotes: "Ask for slab sequence photos and product-specific care instructions before planning a book-match or wet-area detail.", }),

  variety({ slug: "estremoz", name: "Estremoz Marble", aliases: ["Estremoz marbles", "Mármore de Estremoz"], origin: { country: "Portugal", region: "Estremoz–Borba–Vila Viçosa, Évora", suggestedCountries: ["Portugal"], status: "reference-verified", note: "IUGS Geoheritage documents Estremoz marble and its Portuguese marble triangle.", sourceUrls: [estremozSource], verifiedAt: researchDate }, stoneFamily: "marble", familyVerified: true, colours: [], patterns: [], finishes: [], applications: [], attributesVerified: false, description: "Estremoz refers to a Portuguese marble district and material family, not one uniform appearance. Confirm the specific local variety, quarry, colour and finish against supplier documents.", careNotes: "Request the technical sheet for the exact Estremoz variety and finish being offered.", }),
];

export const marbleOrigins: { slug: MarbleOriginSlug; name: string; country?: MarbleOrigin; intro: string }[] = [
  { slug: "italy", name: "Italian Marble", country: "Italy", intro: "Explore named Italian marble traditions while confirming the quarry and origin documents for every requested lot." },
  { slug: "turkey", name: "Turkish Marble", country: "Turkey", intro: "Browse Turkish marble names by project direction; supplier and quarry documents establish the origin of each actual lot." },
  { slug: "spain", name: "Spanish Marble", country: "Spain", intro: "Discover Spanish-origin candidates and commercially traded limestone; verify the specific quarry and stone family before specification." },
  { slug: "greece", name: "Greek Marble", country: "Greece", intro: "Browse Greek marble varieties with origin references, then confirm the named quarry and current slab selection for your project." },
  { slug: "portugal", name: "Portuguese Marble", country: "Portugal", intro: "Begin with the documented Estremoz marble district. Add individual Portuguese varieties after their source and family are verified." },
  { slug: "other", name: "Other Imported Origins", intro: "Trade names with more than one possible source stay here until the quarry, country and stone family are confirmed." },
];

export function productsForOrigin(slug: MarbleOriginSlug) {
  if (slug === "other") return importedMarbleVarieties.filter((item) => item.origin.country === null && item.origin.suggestedCountries.length > 1);
  const group = marbleOrigins.find((item) => item.slug === slug);
  if (!group?.country) return [];
  return importedMarbleVarieties.filter((item) => item.origin.country === group.country || (item.origin.country === null && item.origin.suggestedCountries.includes(group.country!)));
}

export function getMarbleVariety(slug: string) {
  return importedMarbleVarieties.find((item) => item.slug === slug);
}
