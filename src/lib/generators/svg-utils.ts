/**
 * Create SVG text element with proper encoding
 */
export const createSVGText = (
  text: string,
  x: number,
  y: number,
  options: {
    fontSize?: number;
    fontWeight?: string | number;
    fill?: string;
    textAnchor?: 'start' | 'middle' | 'end';
    dominantBaseline?: 'auto' | 'middle' | 'hanging';
    className?: string;
  } = {},
): string => {
  const {
    fontSize = 12,
    fontWeight = 'normal',
    fill = 'currentColor',
    textAnchor = 'start',
    dominantBaseline = 'auto',
    className = '',
  } = options;

  const classAttr = className ? ` class="${className}"` : '';

  return `<text x="${x}" y="${y}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" text-anchor="${textAnchor}" dominant-baseline="${dominantBaseline}"${classAttr}>${escapeXml(
    text,
  )}</text>`;
};

/**
 * Create SVG rectangle element
 */
export const createSVGRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    rx?: number;
    ry?: number;
    className?: string;
    opacity?: number;
  } = {},
): string => {
  const { fill = 'currentColor', stroke, strokeWidth, rx, ry, className = '', opacity } = options;

  let attrs = `x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"`;

  if (stroke) attrs += ` stroke="${stroke}"`;
  if (strokeWidth) attrs += ` stroke-width="${strokeWidth}"`;
  if (rx !== undefined) attrs += ` rx="${rx}"`;
  if (ry !== undefined) attrs += ` ry="${ry}"`;
  if (opacity !== undefined) attrs += ` opacity="${opacity}"`;
  if (className) attrs += ` class="${className}"`;

  return `<rect ${attrs} />`;
};

/**
 * Create complete SVG wrapper
 */
export const createSVG = (
  width: number,
  height: number,
  content: string,
  options: {
    viewBox?: string;
    xmlns?: boolean;
    className?: string;
    style?: string;
    background?: string;
  } = {},
): string => {
  const { viewBox, xmlns = true, className = '', style = '', background } = options;

  const viewBoxAttr = viewBox ? ` viewBox="${viewBox}"` : ` viewBox="0 0 ${width} ${height}"`;
  const xmlnsAttr = xmlns ? ' xmlns="http://www.w3.org/2000/svg"' : '';
  const classAttr = className ? ` class="${className}"` : '';

  // Make SVG responsive by default for web usage
  const responsiveStyle = 'width: 100%; height: auto; max-width: 100%; display: block;';
  const combinedStyle = responsiveStyle + (style ? ` ${style}` : '');
  const styleAttr = combinedStyle ? ` style="${combinedStyle}"` : '';

  // Use responsive width/height attributes for web, fixed for other contexts
  const widthAttr = ''; //' width="100%"';
  const heightAttr = ''; //' height="auto"';

  let backgroundRect = '';
  if (background) {
    backgroundRect = createSVGRect(0, 0, width, height, { fill: background });
  }

  return `<svg${widthAttr}${heightAttr} preserveAspectRatio="xMidYMid meet" ${viewBoxAttr}${xmlnsAttr}${classAttr}${styleAttr}>${backgroundRect}${content}</svg>`;
};

/**
 * Escape XML/HTML special characters
 */
export const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Format numbers for display in SVG
 */
export const formatSVGNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
