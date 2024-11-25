/**
 * Helper function to calculate relative luminance of a color
 * @param {string} color - Hex color (e.g., '#FFFFFF')
 * @returns {number} Relative luminance
 */
const getLuminance = (color: string) => {
  const rgb =
    color
      .replace('#', '')
      .match(/.{2}/g)
      ?.map(c => parseInt(c, 16) / 255) ?? [];
  const [r, g, b] = rgb.map(channel =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - Hex color 1
 * @param {string} color2 - Hex color 2
 * @returns {number} Contrast ratio
 */
export default function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}
