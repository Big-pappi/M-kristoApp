import type { ImageSourcePropType } from "react-native"

/**
 * Catalog of backgrounds available in the verse image studio.
 *
 * `photo` entries render an image behind the verse; `gradient` entries render
 * a pure colour wash (cheap, always available, works offline). Adding a new
 * background is a one-line change here — drop the file in
 * assets/backgrounds/ and append an entry.
 */
export type VerseBackground =
  | {
      id: string
      kind: "photo"
      label: string
      source: ImageSourcePropType
      /** Extra dark scrim strength so light photos keep text readable. */
      scrim: number
      premium?: boolean
    }
  | {
      id: string
      kind: "gradient"
      label: string
      stops: readonly [string, string, ...string[]]
      scrim: number
      premium?: boolean
    }

export const VERSE_BACKGROUNDS: VerseBackground[] = [
  {
    id: "ocean-birds",
    kind: "photo",
    label: "Ocean",
    source: require("../../assets/backgrounds/ocean-birds.jpg"),
    scrim: 0.42,
  },
  {
    id: "earth-coast",
    kind: "photo",
    label: "Creation",
    source: require("../../assets/backgrounds/earth-coast.jpg"),
    scrim: 0.3,
  },
  {
    id: "mountain-sunrise",
    kind: "photo",
    label: "Sunrise",
    source: require("../../assets/backgrounds/mountain-sunrise.png"),
    scrim: 0.4,
  },
  {
    id: "night-sky",
    kind: "photo",
    label: "Starlight",
    source: require("../../assets/backgrounds/night-sky.png"),
    scrim: 0.28,
  },
  {
    id: "candlelight",
    kind: "photo",
    label: "Candles",
    source: require("../../assets/backgrounds/candlelight.png"),
    scrim: 0.3,
  },
  {
    id: "stained-glass",
    kind: "photo",
    label: "Glass",
    source: require("../../assets/backgrounds/stained-glass.png"),
    scrim: 0.36,
    premium: true,
  },
  {
    id: "hilltop-cross",
    kind: "photo",
    label: "Calvary",
    source: require("../../assets/backgrounds/hilltop-cross.png"),
    scrim: 0.44,
    premium: true,
  },
  {
    id: "desert-dusk",
    kind: "photo",
    label: "Wilderness",
    source: require("../../assets/backgrounds/desert-dusk.png"),
    scrim: 0.38,
    premium: true,
  },
  {
    id: "indigo",
    kind: "gradient",
    label: "Indigo",
    stops: ["#3B3175", "#2B2560", "#141032"],
    scrim: 0,
  },
  {
    id: "gild",
    kind: "gradient",
    label: "Gilded",
    stops: ["#E3BD6C", "#C99A3E", "#8A6522"],
    scrim: 0.12,
  },
  {
    id: "midnight",
    kind: "gradient",
    label: "Midnight",
    stops: ["#1D2A4A", "#111A31", "#070B16"],
    scrim: 0,
  },
  {
    id: "olive",
    kind: "gradient",
    label: "Olive",
    stops: ["#4A5B3C", "#33422A", "#1B2415"],
    scrim: 0,
  },
]

/** Font pairings offered in the studio, mapped to RN font families. */
export type VerseFont = {
  id: string
  label: string
  family: "serif" | "sans-serif" | "monospace"
  weight: "400" | "600" | "700"
  italic?: boolean
  letterSpacing?: number
}

export const VERSE_FONTS: VerseFont[] = [
  { id: "serif", label: "Scripture", family: "serif", weight: "400" },
  { id: "serif-italic", label: "Psalm", family: "serif", weight: "400", italic: true },
  { id: "sans-bold", label: "Bold", family: "sans-serif", weight: "700", letterSpacing: -0.4 },
  { id: "mono", label: "Modern", family: "monospace", weight: "400", letterSpacing: 0.4 },
]
