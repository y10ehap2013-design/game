/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface Official2026BallProps {
  className?: string;
  size?: number;
}

/**
 * High-fidelity vector recreation of the Official FIFA 2026 World Cup Match Ball:
 * "TRIUNFO 14" with official FIFA 2026 Trophy emblem, Adidas stripes,
 * and Mexico/USA/Canada tri-color geometric panels.
 */
export const Official2026Ball: React.FC<Official2026BallProps> = ({
  className = '',
  size = 140,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl pointer-events-none"
        style={{ transform: 'scale(1.08)' }}
      />

      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="relative drop-shadow-[0_15px_35px_rgba(0,0,0,0.65)]"
      >
        <defs>
          {/* Spherical 3D shading gradient */}
          <radialGradient id="triunfoSphere" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f8fafc" />
            <stop offset="85%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#475569" />
          </radialGradient>

          {/* Deep royal blue panel gradient */}
          <linearGradient id="triunfoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="45%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0c2340" />
          </linearGradient>

          {/* Mexico Crimson Red panel gradient */}
          <linearGradient id="triunfoRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="55%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          {/* Canada/Mexico Emerald Green panel gradient */}
          <linearGradient id="triunfoGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* USA Sky Blue Star panel */}
          <linearGradient id="triunfoCyanStar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>

          {/* Gold trophy gradient */}
          <linearGradient id="goldTrophy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Clip path for the ball sphere */}
          <clipPath id="ballSphereClip">
            <circle cx="100" cy="100" r="94" />
          </clipPath>
        </defs>

        {/* 1. Base Ball Sphere */}
        <circle cx="100" cy="100" r="94" fill="url(#triunfoSphere)" stroke="#0f172a" strokeWidth="2.5" />

        {/* 2. Panels and Patterns clipped to sphere */}
        <g clipPath="url(#ballSphereClip)">
          {/* Authentic ball leather texture grid */}
          <pattern id="ballTexture" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.6" fill="#64748b" opacity="0.35" />
          </pattern>
          <rect width="200" height="200" fill="url(#ballTexture)" />

          {/* LEFT RED PANEL (Adidas Three Stripes & Tribal Art) */}
          <path
            d="M 6,55 C 24,32 58,26 68,52 C 78,78 64,124 42,144 C 20,132 4,96 6,55 Z"
            fill="url(#triunfoRed)"
            stroke="#0f172a"
            strokeWidth="2"
          />
          {/* Subtle tribal geometric linework inside red */}
          <path d="M 14,75 Q 35,60 55,75" stroke="#ffffff" strokeWidth="1" opacity="0.4" fill="none" />
          <path d="M 20,95 Q 40,80 60,95" stroke="#ffffff" strokeWidth="1" opacity="0.4" fill="none" />
          {/* Official 3 Bold White Adidas Diagonal Stripes */}
          <path d="M 22,126 L 36,72" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 33,131 L 47,77" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 44,136 L 58,82" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />

          {/* RIGHT SKY BLUE STAR PANEL (USA motif) */}
          <path
            d="M 124,22 C 160,32 186,64 190,102 C 172,122 144,102 134,74 C 124,48 114,32 124,22 Z"
            fill="url(#triunfoCyanStar)"
            stroke="#0f172a"
            strokeWidth="2"
          />
          {/* Major Star */}
          <polygon
            points="156,44 163,59 179,60 167,71 171,87 156,78 141,87 145,71 133,60 149,59"
            fill="#0284c7"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {/* Minor Star */}
          <polygon
            points="174,90 178,98 187,99 180,105 182,114 174,109 166,114 168,105 161,99 170,98"
            fill="#0369a1"
            stroke="#ffffff"
            strokeWidth="1"
          />

          {/* BOTTOM GREEN "TRIUNFO 14" PANEL */}
          <path
            d="M 58,144 C 80,132 120,132 142,144 C 146,176 112,196 100,196 C 84,196 54,176 58,144 Z"
            fill="url(#triunfoGreen)"
            stroke="#0f172a"
            strokeWidth="2"
          />
          {/* Subtle tribal linework inside green */}
          <path d="M 68,154 Q 100,140 132,154" stroke="#ffffff" strokeWidth="1" opacity="0.3" fill="none" />
          {/* "TRIUNFO" Bold Text */}
          <text
            x="100"
            y="164"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10.5"
            fontWeight="900"
            letterSpacing="1.2"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            TRIUNFO
          </text>
          {/* "14" Bold Text */}
          <text
            x="100"
            y="178"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="11.5"
            fontWeight="900"
            letterSpacing="1.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            14
          </text>

          {/* TOP ACCENT ARCH (Green & Red trim) */}
          <path
            d="M 66,24 C 88,14 116,14 136,24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Flowing Seam Ribbons (Navy & Crimson Red) */}
          <path
            d="M 148,28 C 128,54 128,104 144,136"
            fill="none"
            stroke="#b91c1c"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 64,48 C 76,72 72,116 52,140"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* =========================================================================
              CENTER OFFICIAL "26 FIFA" BADGE CAPSULE WITH TROPHY
          ========================================================================== */}
          <g transform="translate(100, 94)">
            {/* Pill Capsule Shield */}
            <rect
              x="-33"
              y="-44"
              width="66"
              height="88"
              rx="25"
              fill="url(#triunfoBlue)"
              stroke="#0284c7"
              strokeWidth="2.5"
            />
            {/* Inner trim border */}
            <rect
              x="-30"
              y="-41"
              width="60"
              height="82"
              rx="22"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.5"
            />

            {/* Stylized Interlocking "2" and "6" White Graphics */}
            <path
              d="M -16,-22 C -16,-31 -3,-31 5,-27 C 13,-23 15,-15 9,-8 C 4,-2 -5,4 -13,14 L 16,14 L 16,18 L -18,18 L -18,12 C -10,3 -2,-3 3,-9 C 7,-14 6,-18 2,-20 C -2,-22 -10,-20 -11,-16 Z"
              fill="#ffffff"
              opacity="0.95"
            />
            <path
              d="M 13,-24 C 7,-24 0,-18 -3,-10 C -5,0 -4,14 4,14 C 12,14 16,6 16,-4 C 16,-16 14,-24 13,-24 Z M 5,-2 C 10,-2 10,6 5,6 C 0,6 0,-2 5,-2 Z"
              fill="#ffffff"
              opacity="0.95"
            />

            {/* FIFA World Cup Trophy Solid Gold Emblem */}
            <g transform="translate(0, -6) scale(0.68)">
              {/* Top Earth Globe */}
              <circle cx="0" cy="-20" r="7.5" fill="url(#goldTrophy)" stroke="#ffffff" strokeWidth="0.8" />
              {/* Twin Athletes Holding Globe */}
              <path
                d="M -10,-15 C -8,-20 -4,-20 0,-20 C 4,-20 8,-20 10,-15 C 8,-6 3,-3 3,4 L -3,4 C -3,-3 -8,-6 -10,-15 Z"
                fill="url(#goldTrophy)"
                stroke="#ffffff"
                strokeWidth="0.8"
              />
              {/* Green malachite rings in base */}
              <rect x="-7" y="4" width="14" height="4" rx="1" fill="#047857" stroke="#ffffff" strokeWidth="0.5" />
              <rect x="-9" y="8" width="18" height="4" rx="1" fill="url(#goldTrophy)" stroke="#ffffff" strokeWidth="0.6" />
            </g>

            {/* "FIFA" text bottom */}
            <text
              x="0"
              y="33"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontWeight="900"
              letterSpacing="2.5"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              FIFA
            </text>
          </g>
        </g>

        {/* 3. Spherical 3D Lighting Sheen & Glare */}
        <ellipse cx="66" cy="54" rx="32" ry="18" fill="#ffffff" opacity="0.32" transform="rotate(-30 66 54)" />
        <ellipse cx="60" cy="48" rx="14" ry="7" fill="#ffffff" opacity="0.55" transform="rotate(-30 60 48)" />

        {/* Perimeter edge highlight */}
        <circle cx="100" cy="100" r="93" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  );
};

interface Official2026LogoProps {
  className?: string;
  ballSize?: number;
  layout?: 'vertical' | 'horizontal';
  theme?: 'dark' | 'light';
  showSubtitles?: boolean;
}

/**
 * Complete Official FIFA World Cup 2026 Logo lockup matching the user's uploaded image:
 * Official Triunfo 14 Match Ball with:
 * "دعنا نلعب كرة القدم" (Let's play football in Arabic)
 * "LET'S PLAY FOOTBALL" (in English)
 */
export const Official2026Logo: React.FC<Official2026LogoProps> = ({
  className = '',
  ballSize = 130,
  layout = 'vertical',
  theme = 'dark',
  showSubtitles = true,
}) => {
  const isLight = theme === 'light';

  return (
    <div
      className={`inline-flex items-center justify-center transition-all select-none ${
        layout === 'vertical' ? 'flex-col text-center' : 'flex-row items-center gap-4 text-left'
      } ${className}`}
    >
      {/* 1. Official 2026 Match Ball */}
      <Official2026Ball size={ballSize} />

      {/* 2. Arabic & English Typography Matching the User's Image */}
      {showSubtitles && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center mt-3' : 'items-start'}`}>
          {/* Arabic: دعنا نلعب كرة القدم */}
          <div
            dir="rtl"
            className={`font-black tracking-normal leading-tight ${
              isLight ? 'text-[#0b1e36]' : 'text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]'
            }`}
            style={{
              fontSize: Math.max(16, Math.round(ballSize * 0.17)),
              fontFamily: "'Cairo', 'Segoe UI', Tahoma, 'Arial', sans-serif",
            }}
          >
            دعنا نلعب كرة القدم
          </div>

          {/* English: LET'S PLAY FOOTBALL */}
          <div
            className={`font-black uppercase tracking-[0.25em] mt-0.5 ${
              isLight ? 'text-[#1e293b]' : 'text-cyan-300 drop-shadow'
            }`}
            style={{
              fontSize: Math.max(9, Math.round(ballSize * 0.085)),
              fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
            }}
          >
            LET'S PLAY FOOTBALL
          </div>
        </div>
      )}
    </div>
  );
};
