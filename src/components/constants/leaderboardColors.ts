// Tailwind text color classes per level (increasing intensity)
export const LEVEL_TEXT_CLASSES: Record<number, string> = {
  1: "text-yellow-700",
  2: "text-green-700",
  3: "text-blue-700",
  4: "text-purple-700",
  5: "text-orange-700",
  6: "text-rose-700",
  7: "text-teal-700",
  8: "text-indigo-700",
  9: "text-amber-700",
};

// Optional stronger variants if you want “bold/hero” emphasis on hover or top ranks
export const LEVEL_TEXT_STRONG: Record<number, string> = {
  1: "text-yellow-800",
  2: "text-green-800",
  3: "text-blue-800",
  4: "text-purple-800",
  5: "text-orange-800",
  6: "text-rose-800",
  7: "text-teal-800",
  8: "text-indigo-800",
  9: "text-amber-800",
};
