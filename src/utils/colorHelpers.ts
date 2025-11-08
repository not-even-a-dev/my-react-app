/**
 * Calculate the relative luminance of a color
 * @param hex - Hex color string (e.g., "#A8D8EA")
 * @returns Luminance value between 0 (dark) and 1 (light)
 */
export function getLuminance(hex: string): number {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  // Apply gamma correction
  const [rs, gs, bs] = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Get an appropriate text color (dark or light) based on background color brightness
 * @param backgroundColor - Hex color string (e.g., "#A8D8EA")
 * @returns Hex color string for text ("#1f2937" for dark text, "#ffffff" for light text)
 */
export function getContrastTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor);
  // Use dark text for light backgrounds (luminance > 0.5), light text for dark backgrounds
  return luminance > 0.5 ? '#1f2937' : '#ffffff';
}

