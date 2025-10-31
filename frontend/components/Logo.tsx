import * as React from 'react';

export const Logo = () => {
  // SVG for the "book it" pin icon.
  // The design consists of a black map pin, a yellow inner circle,
  // black 'b' and 'i' text, a vertical divider, and a smile arc.
  // The viewBox is 32x32.
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      role="img"
      aria-label="Book It Logo"
    >
      {/* 1. Black Map Pin Background (Main Shape) */}
      {/* This path creates the classic teardrop map pin shape. */}
      <path
        d="M16 32 C16 32 4 19 4 11 C4 4.925 9.373 0 16 0 C22.627 0 28 4.925 28 11 C28 19 16 32 16 32Z"
        fill="#000000"
      />

      {/* 2. Yellow Inner Circle (Background for Text) */}
      <circle
        cx="15.5"
        cy="12.5"
        r="9.5"
        fill="#FFDA44" /* Bright Yellow color */
      />

      
      {/* 4. Text 'b' and 'i' (Black, bold) */}
      <text
        x="14" /* Adjusted for visual centering of 'b' */
        y="11.2"
        textAnchor="end"
        dominantBaseline="central"
        fill="#000000"
        fontSize="11"
        fontWeight="900" /* Extra bold */
        fontFamily="system-ui, -apple-system, sans-serif"
      >
         b
      </text>
      <text
        x="17" /* Adjusted for visual centering of 'i' */
        y="11.2"
        textAnchor="start"
        dominantBaseline="central"
        fill="#000000"
        fontSize="11"
        fontWeight="900" /* Extra bold */
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        i
      </text>
      
     
    </svg>
  );
};
