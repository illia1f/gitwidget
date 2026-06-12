/**
 * Generate CSS animations for contribution cells
 * https://www.w3.org/TR/SVG11/styling.html
 * https://www.w3.org/TR/SVG11/animate.html
 */
export const generateCellAnimations = (enableAnimations: boolean): string => {
  const animationCSS = !enableAnimations
    ? ''
    : ` .contribution-cell {
            opacity: 0;
            transform-origin: center;
            transform: translateY(6px) scale(0.85);
            animation: popIn 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            transition: transform 180ms ease, filter 180ms ease, opacity 180ms ease;
            cursor: pointer;
            will-change: transform, opacity, filter;
        }

        /* High contribution cells get a slightly punchier entrance */
        .contribution-cell.high-contribution {
            animation-name: popInStrong;
        }
        
        @keyframes popIn {
            0% {
                opacity: 0;
                transform: translateY(8px) scale(0.85);
            }
            60% {
                opacity: 1;
                transform: translateY(-2px) scale(1.06);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes popInStrong {
            0% {
                opacity: 0;
                transform: translateY(10px) scale(0.8);
            }
            55% {
                opacity: 1;
                transform: translateY(-3px) scale(1.1);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }`;

  return `
        <style>
          <![CDATA[
            .contribution-cell {
              opacity: 1;
              transform-origin: center;
              animation: none;
              transition: filter 180ms ease, opacity 180ms ease;
              cursor: pointer;
            }
            
            .contribution-cell:hover {
              transform: none;
              filter: brightness(1.15) drop-shadow(0 2px 8px rgba(0,0,0,0.25));
              opacity: 1 !important;
              z-index: 10;
            }
            
            /* Slightly more noticeable for high contribution cells */
            .contribution-cell.high-contribution:hover {
              transform: none;
              filter: brightness(1.2) drop-shadow(0 0 3px currentColor);
            }

            ${animationCSS}

            /* Respect reduced motion preferences */
            @media (prefers-reduced-motion: reduce) {
                .contribution-cell {
                    animation: none !important;
                    transform: none !important;
                    opacity: 1 !important;
                }
            }
          ]]>
        </style>
      `;
};
