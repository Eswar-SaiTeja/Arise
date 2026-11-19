import React from 'react';

interface GooeyMenuAnimationProps {
  id?: string;
  blurRadius?: number;
  contrast?: number;
}

/**
 * GooeyMenuAnimation
 * Defines the SVG filter pipeline that produces organic liquid morphing physics.
 * Uses feGaussianBlur to create fluid halos and feColorMatrix to sharply contrast
 * alpha channels into liquid bridges (viscous necks and merging droplets).
 */
export const GooeyMenuAnimation: React.FC<GooeyMenuAnimationProps> = ({
  id = 'gooey-morph-filter',
  blurRadius = 12,
  contrast = 22,
}) => {
  // Alpha contrast transformation matrix:
  // Scales alpha by `contrast` and shifts cutoff by `- (contrast / 2)`
  const alphaScale = contrast;
  const alphaOffset = -Math.floor(contrast / 2.2);

  return (
    <svg 
      className="fixed w-0 h-0 pointer-events-none select-none overflow-hidden" 
      aria-hidden="true"
      style={{ position: 'absolute', top: -9999, left: -9999 }}
    >
      <defs>
        {/* Primary Liquid Gooey Filter */}
        <filter id={id} x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurRadius} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values={`
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 ${alphaScale} ${alphaOffset}
            `}
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>

        {/* Subtle Liquid Glow Filter for central orb pulse */}
        <filter id="liquid-plasma-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};
