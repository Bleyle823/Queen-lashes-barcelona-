import koreanLashLiftImg from "@/assets/korean-lash-lift.png";
import signatureLashesListingImg from "@/assets/signature-lashes-listing.jpg";
import browLiftImg from "@/assets/brow-lift.png";
import signatureBrowsListingImg from "@/assets/signature-brows-listing.jpg";
import signatureLashExtensionsDetailImg from "@/assets/signature-lash-extensions-detail.png";
import signatureLashExtensionsListingImg from "@/assets/signature-lash-extensions-listing.png";
import bookingBrowLiftImg from "@/assets/booking/brow-lift.jpg";
import bookingKoreanLashLiftImg from "@/assets/booking/korean-lash-lift.jpg";
import exploreKoreanLashLift from "@/assets/explore-korean-lash-lift.png";
import exploreKeratinLashLift from "@/assets/explore-keratin-lash-lift.png";
import exploreWispySet from "@/assets/explore-wispy-set.png";
import exploreLightVolume from "@/assets/explore-light-volume.png";
import exploreMangaAnime from "@/assets/explore-manga-anime.png";

export interface PriceTier {
  label: string;
  price: string;
}

export interface PriceGroup {
  name: string;
  tiers: PriceTier[];
}

export interface ExploreLookItem {
  image: string;
  alt: string;
}

/** Bookable sub-style for treatments that share one page slug (e.g. Wispy vs Light Volume). */
export interface TreatmentVariant {
  id: string;
  label: string;
  /** Parsed by checkout as the first `NN€` value (e.g. `"115€"` → 11500 cents). */
  price: string;
}

export interface Treatment {
  slug: string;
  name: string;
  scriptName?: string;
  tagline: string;
  description: string[];
  image: string;
  /** Image on /treatments listing; falls back to `image` when omitted. */
  listingsImage?: string;
  /** Hero image on the treatment detail page; falls back to `image` when omitted. */
  detailImage?: string;
  /** Thumbnail on the booking flow only; falls back to `image` when omitted. */
  bookingImage?: string;
  cta: string;
  price?: string;
  /** Slot length for calendar booking (lash extensions = 120). */
  bookingDurationMinutes: number;
  /** Promo graphics on the detail page (“Explore your look”) */
  exploreLook?: ExploreLookItem[];
  /** If set, the guest must pick one variant before continuing (prices shown at booking). */
  bookingVariants?: TreatmentVariant[];
}

const signatureLashExtensionsExploreLook: ExploreLookItem[] = [
  { image: exploreWispySet, alt: "Wispy Set lash extensions, Queenlashes Barcelona" },
  { image: exploreLightVolume, alt: "Light Volume lash extensions, Queenlashes Barcelona" },
  { image: exploreMangaAnime, alt: "Manga x Anime lash style, Queenlashes Barcelona" },
];

const signatureLashesExploreLook: ExploreLookItem[] = [
  { image: exploreKoreanLashLift, alt: "Korean Lash Lift, Queenlashes Barcelona" },
  { image: exploreKeratinLashLift, alt: "Keratin Lash Lift, Queenlashes Barcelona" },
];

export const treatments: Treatment[] = [
  {
    slug: "signature-lash-extensions",
    name: "Signature Lash Extensions",
    scriptName: "Classic 1:1",
    tagline: "A subtle touch that makes all the difference.",
    description: [
      "There's something special about feeling effortlessly put together without trying too hard.",
      "Lash extensions softly enhance your natural beauty, creating a delicate, fuller look that feels as light as it looks. No mascara, no routine, just quiet confidence from morning to night.",
      "A subtle touch that makes all the difference.",
    ],
    image: signatureLashExtensionsDetailImg,
    listingsImage: signatureLashExtensionsListingImg,
    detailImage: signatureLashExtensionsDetailImg,
    bookingImage: signatureLashExtensionsListingImg,
    cta: "Explore Your Look",
    bookingDurationMinutes: 120,
    exploreLook: signatureLashExtensionsExploreLook,
    bookingVariants: [
      { id: "classic-1-1", label: "Classic 1:1", price: "100€" },
      { id: "wispy-set", label: "Wispy Set", price: "115€" },
      { id: "light-volume", label: "Light Volume (5D)", price: "115€" },
      { id: "manga-anime", label: "Manga x Anime", price: "110€" },
    ],
  },
  {
    slug: "signature-brows",
    name: "Signature Brows",
    scriptName: "Brow Lift",
    tagline: "A subtle transformation, made for you.",
    price: "Brow Lift 55€",
    description: [
      "There's a quiet confidence in beautifully styled brows, soft, lifted, and naturally full.",
      "Our Signature Brow Lift enhances what's already yours, creating a smooth, brushed-up finish that feels light, effortless, and perfectly tailored to you.",
      "No daily styling, no harsh lines just naturally elevated beauty.",
      "A subtle transformation, made for you.",
    ],
    image: browLiftImg,
    listingsImage: signatureBrowsListingImg,
    bookingImage: bookingBrowLiftImg,
    cta: "Explore Your Look",
    bookingDurationMinutes: 60,
  },
  {
    slug: "korean-lash-lift",
    name: "Signature Lashes",
    scriptName: "Korean Lash Lift",
    tagline: "Experience lashes, elevated.",
    description: [
      "If your lashes feel straight, lose their shape quickly, or rely on daily mascara to create definition, the result often feels temporary rather than refined.",
      "Our Signature Lash Lift offers a bespoke approach. Lifting your natural lashes with precision to create a soft, lasting curve that enhances your eyes without excess or effort.",
      "The result is a polished, weightless look that stays with you, from morning to night.",
      "Experience lashes, elevated.",
    ],
    image: koreanLashLiftImg,
    listingsImage: signatureLashesListingImg,
    bookingImage: bookingKoreanLashLiftImg,
    cta: "Explore Your Look",
    exploreLook: signatureLashesExploreLook,
    bookingDurationMinutes: 60,
    bookingVariants: [
      { id: "korean-style", label: "Korean Lash Lift & Tint", price: "70€" },
      { id: "keratin-style", label: "Keratin Lash Lift & Tint", price: "60€" },
    ],
  },
];

export const priceGroups: PriceGroup[] = [
  {
    name: "Classic 1:1",
    tiers: [
      { label: "New set", price: "100€" },
      { label: "Refill after 2 weeks", price: "60€" },
      { label: "Refill after 3 weeks", price: "70€" },
    ],
  },
  {
    name: "Manga Lashes",
    tiers: [
      { label: "New set", price: "110€" },
      { label: "Refill after 2 weeks", price: "65€" },
      { label: "Refill after 3 weeks", price: "75€" },
    ],
  },
  {
    name: "Light Volume 5D",
    tiers: [
      { label: "New set", price: "115€" },
      { label: "Refill after 2 weeks", price: "70€" },
      { label: "Refill after 3 weeks", price: "80€" },
    ],
  },
  {
    name: "Wispy Set",
    tiers: [
      { label: "New set", price: "115€" },
      { label: "Refill after 2 weeks", price: "70€" },
      { label: "Refill after 3 weeks", price: "80€" },
    ],
  },
  {
    name: "Brow Lift",
    tiers: [
      { label: "Brow Lift", price: "55€" },
    ],
  },
];

/** Homepage + Korean lash detail: lift & tint menu */
export const lashLiftPriceGroups: PriceGroup[] = [
  {
    name: "Lash lift & tint",
    tiers: [
      { label: "Korean Lash Lift & Tint", price: "70€" },
      { label: "Keratin Lash Lift & Tint", price: "60€" },
    ],
  },
];

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}
