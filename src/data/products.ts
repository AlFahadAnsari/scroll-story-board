import indigo from "@/assets/products/indigo-haze.webp";
import marshmallow from "@/assets/products/marshmallow-smoke.webp";
import aqua from "@/assets/products/aqua-bergamot.webp";
import vanilla from "@/assets/products/black-vanilla.webp";
import ten from "@/assets/products/number-10.webp";

export type Format = "body-spray" | "body-wash" | "3-in-1";

export interface Product {
  id: string;
  name: string;
  slug: string;
  format: Format;
  formatLabel: string;
  line: string;
  image: string;
  /** Accent colour drives hover worlds and highlights. */
  accent: string;
  /** ONLY wording printed on the pack. */
  packClaims: string[];
  /** Approved fragrance notes. Empty = awaiting approved copy. */
  fragranceNotes: string[];
  size: string | null;
  description: string | null;
  url: string;
}

export const FORMATS: { id: Format; label: string }[] = [
  { id: "body-spray", label: "Body Spray" },
  { id: "body-wash", label: "Body Wash" },
  { id: "3-in-1", label: "3-in-1" },
];

export const products: Product[] = [
  {
    id: "indigo-haze",
    name: "Indigo Haze",
    slug: "indigo-haze",
    format: "body-spray",
    formatLabel: "Premium Deodorant Body Spray",
    line: "Fine Fragrance Collection",
    image: indigo,
    accent: "#e0782f",
    packClaims: ["72H Fresh", "0% Aluminium Salts", "Infused with Essential Oils"],
    fragranceNotes: [],
    size: null,
    description: null,
    url: "https://www.axe.com/in/en/products.html",
  },
  {
    id: "marshmallow-smoke",
    name: "Marshmallow Smoke",
    slug: "marshmallow-smoke",
    format: "body-spray",
    formatLabel: "Premium Deodorant Body Spray",
    line: "Fine Fragrance Collection",
    image: marshmallow,
    accent: "#e8dcc4",
    packClaims: ["72H Fresh", "0% Aluminium Salts", "Infused with Essential Oils"],
    fragranceNotes: [],
    size: null,
    description: null,
    url: "https://www.axe.com/in/en/products.html",
  },
  {
    id: "aqua-bergamot",
    name: "Aqua Bergamot",
    slug: "aqua-bergamot",
    format: "body-wash",
    formatLabel: "Fine Fragrance Body Wash",
    line: "Fine Fragrance Collection",
    image: aqua,
    accent: "#7fd3d6",
    packClaims: ["Smell Finer Than The Finest Fragrances", "Essential Oils", "12H Refreshing Scent"],
    fragranceNotes: [],
    size: null,
    description: null,
    url: "https://www.axe.com/in/en/products.html",
  },
  {
    id: "black-vanilla",
    name: "Black Vanilla",
    slug: "black-vanilla",
    format: "body-wash",
    formatLabel: "Fine Fragrance Body Wash",
    line: "Fine Fragrance Collection",
    image: vanilla,
    accent: "#e2a93b",
    packClaims: ["Smell Finer Than The Finest Fragrances", "Essential Oils", "12H Refreshing Scent"],
    fragranceNotes: [],
    size: null,
    description: null,
    url: "https://www.axe.com/in/en/products.html",
  },
  {
    id: "number-10",
    name: "Number 10",
    slug: "number-10",
    format: "3-in-1",
    formatLabel: "3-in-1 Body, Face & Hair Wash",
    line: "3 in 1",
    image: ten,
    accent: "#e04fb0",
    packClaims: ["All Day Fresh", "Feel Clean"],
    fragranceNotes: [],
    size: null,
    description: null,
    url: "https://www.axe.com/in/en/products.html",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id)!;
