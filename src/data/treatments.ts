import { useMemo } from "react";
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
import { useTranslation } from "@/i18n/LocaleProvider";
import { translations } from "@/i18n/translations";
import type { Locale } from "@/i18n/types";

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

export interface TreatmentVariant {
  id: string;
  label: string;
  price: string;
}

export interface Treatment {
  slug: string;
  name: string;
  scriptName?: string;
  tagline: string;
  description: string[];
  image: string;
  listingsImage?: string;
  detailImage?: string;
  bookingImage?: string;
  cta: string;
  price?: string;
  bookingDurationMinutes: number;
  exploreLook?: ExploreLookItem[];
  bookingVariants?: TreatmentVariant[];
}

const VARIANT_PRICES = {
  "classic-1-1": "100€",
  "wispy-set": "115€",
  "light-volume": "115€",
  "manga-anime": "110€",
  "korean-style": "70€",
  "keratin-style": "60€",
} as const;

function buildTreatment(slug: keyof typeof translations.en.treatmentContent, locale: Locale): Treatment {
  const content = translations[locale].treatmentContent[slug];

  if (slug === "signature-lash-extensions") {
    const ext = content as (typeof translations.en.treatmentContent)["signature-lash-extensions"];
    return {
      slug,
      name: ext.name,
      scriptName: "Classic 1:1",
      tagline: ext.tagline,
      description: [...ext.description],
      image: signatureLashExtensionsDetailImg,
      listingsImage: signatureLashExtensionsListingImg,
      detailImage: signatureLashExtensionsDetailImg,
      bookingImage: signatureLashExtensionsListingImg,
      cta: ext.cta,
      bookingDurationMinutes: 120,
      exploreLook: [
        { image: exploreWispySet, alt: ext.exploreAlts.wispy },
        { image: exploreLightVolume, alt: ext.exploreAlts.lightVolume },
        { image: exploreMangaAnime, alt: ext.exploreAlts.manga },
      ],
      bookingVariants: [
        { id: "classic-1-1", label: ext.variants["classic-1-1"], price: VARIANT_PRICES["classic-1-1"] },
        { id: "wispy-set", label: ext.variants["wispy-set"], price: VARIANT_PRICES["wispy-set"] },
        { id: "light-volume", label: ext.variants["light-volume"], price: VARIANT_PRICES["light-volume"] },
        { id: "manga-anime", label: ext.variants["manga-anime"], price: VARIANT_PRICES["manga-anime"] },
      ],
    };
  }

  if (slug === "signature-brows") {
    const brows = content as (typeof translations.en.treatmentContent)["signature-brows"];
    return {
      slug,
      name: brows.name,
      scriptName: "Brow Lift",
      tagline: brows.tagline,
      price: brows.price,
      description: [...brows.description],
      image: browLiftImg,
      listingsImage: signatureBrowsListingImg,
      bookingImage: bookingBrowLiftImg,
      cta: brows.cta,
      bookingDurationMinutes: 60,
    };
  }

  const lashes = content as (typeof translations.en.treatmentContent)["korean-lash-lift"];
  return {
    slug: "korean-lash-lift",
    name: lashes.name,
    scriptName: "Korean Lash Lift",
    tagline: lashes.tagline,
    description: [...lashes.description],
    image: koreanLashLiftImg,
    listingsImage: signatureLashesListingImg,
    bookingImage: bookingKoreanLashLiftImg,
    cta: lashes.cta,
    exploreLook: [
      { image: exploreKoreanLashLift, alt: lashes.exploreAlts.korean },
      { image: exploreKeratinLashLift, alt: lashes.exploreAlts.keratin },
    ],
    bookingDurationMinutes: 60,
    bookingVariants: [
      { id: "korean-style", label: lashes.variants["korean-style"], price: VARIANT_PRICES["korean-style"] },
      { id: "keratin-style", label: lashes.variants["keratin-style"], price: VARIANT_PRICES["keratin-style"] },
    ],
  };
}

const TREATMENT_SLUGS = ["signature-lash-extensions", "signature-brows", "korean-lash-lift"] as const;

export function getTreatments(locale: Locale = "en"): Treatment[] {
  return TREATMENT_SLUGS.map((slug) => buildTreatment(slug, locale));
}

export function getTreatment(slug: string, locale: Locale = "en"): Treatment | undefined {
  if (!TREATMENT_SLUGS.includes(slug as (typeof TREATMENT_SLUGS)[number])) return undefined;
  return buildTreatment(slug as (typeof TREATMENT_SLUGS)[number], locale);
}

export function getLashExtensionPriceGroups(locale: Locale = "en"): PriceGroup[] {
  const p = translations[locale].prices;
  return [
    {
      name: p.groups.classic11,
      tiers: [
        { label: p.newSet, price: "100€" },
        { label: p.refill2w, price: "60€" },
        { label: p.refill3w, price: "70€" },
      ],
    },
    {
      name: p.groups.manga,
      tiers: [
        { label: p.newSet, price: "110€" },
        { label: p.refill2w, price: "65€" },
        { label: p.refill3w, price: "75€" },
      ],
    },
    {
      name: p.groups.lightVolume,
      tiers: [
        { label: p.newSet, price: "115€" },
        { label: p.refill2w, price: "70€" },
        { label: p.refill3w, price: "80€" },
      ],
    },
    {
      name: p.groups.wispy,
      tiers: [
        { label: p.newSet, price: "115€" },
        { label: p.refill2w, price: "70€" },
        { label: p.refill3w, price: "80€" },
      ],
    },
  ];
}

export function getPriceGroups(locale: Locale = "en"): PriceGroup[] {
  const p = translations[locale].prices;
  return [
    ...getLashExtensionPriceGroups(locale),
    {
      name: p.groups.browLift,
      tiers: [{ label: p.browLift, price: "55€" }],
    },
  ];
}

export function getLashLiftPriceGroups(locale: Locale = "en"): PriceGroup[] {
  const p = translations[locale].prices;
  return [
    {
      name: p.lashLiftTint,
      tiers: [
        { label: p.variants.koreanLiftTint, price: "70€" },
        { label: p.variants.keratinLiftTint, price: "60€" },
      ],
    },
  ];
}

/** @deprecated Use getTreatments(locale) or useTreatments() */
export const treatments = getTreatments("en");
/** @deprecated Use getPriceGroups(locale) */
export const priceGroups = getPriceGroups("en");
/** @deprecated Use getLashLiftPriceGroups(locale) */
export const lashLiftPriceGroups = getLashLiftPriceGroups("en");

export function useTreatments() {
  const { locale } = useTranslation();
  return useMemo(() => getTreatments(locale), [locale]);
}

export function useTreatment(slug: string) {
  const { locale } = useTranslation();
  return useMemo(() => (slug ? getTreatment(slug, locale) : undefined), [slug, locale]);
}

export function usePriceGroups() {
  const { locale } = useTranslation();
  return useMemo(
    () => ({
      priceGroups: getPriceGroups(locale),
      lashExtensionPriceGroups: getLashExtensionPriceGroups(locale),
      lashLiftPriceGroups: getLashLiftPriceGroups(locale),
    }),
    [locale],
  );
}
