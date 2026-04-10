import React from 'react';
import { useThemeStore } from '../../store/themeStore';

/**
 * PW IOI Logo + "Career Excellence Platform" brand lockup.
 * Automatically inverts for dark mode.
 */
export default function Logo({
  size = 'md',       // xs | sm | md | lg | xl
  showName = true,   // show "Career Excellence Platform" beside logo
  forceLight = false, // force white colors regardless of theme
  className = '',
  style = {},
  onClick,
}) {
  const { theme } = useThemeStore();
  const isDark = forceLight || theme === 'dark';

  const heights = { xs: 18, sm: 22, md: 28, lg: 36, xl: 48 };
  const h = heights[size] || 28;

  const nameSizes = { xs: 9, sm: 10, md: 11, lg: 13, xl: 16 };
  const nameSize = nameSizes[size] || 11;

  return (
    <div
      className={`flex items-center gap-0 ${className}`}
      style={{ gap: 0, cursor: onClick ? 'pointer' : 'default', ...style }}
      onClick={onClick}
    >
      {/* Logo image */}
      <img
        src="/logo-light.png"
        alt="PW Institute of Innovation"
        height={h}
        style={{
          display: 'block',
          objectFit: 'contain',
          height: h,
          width: 'auto',
          filter: isDark ? 'invert(1) brightness(1.05)' : 'none',
          transition: 'filter 0.3s ease',
          flexShrink: 0,
        }}
      />

      {showName && (
        <>
          {/* Vertical divider */}
          <div style={{
            width: 1,
            height: h * 0.65,
            background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)',
            margin: '0 10px',
            borderRadius: 1,
            flexShrink: 0,
          }} />

          {/* Platform name */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{
              fontSize: nameSize,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(15,14,23,0.85)',
              lineHeight: 1.1,
              fontFamily: 'var(--font-ui)',
              transition: 'color 0.3s ease',
            }}>
              Career Excellence
            </span>
            <span style={{
              fontSize: nameSize - 1,
              fontWeight: 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,14,23,0.40)',
              lineHeight: 1.2,
              fontFamily: 'var(--font-ui)',
              transition: 'color 0.3s ease',
            }}>
              Platform
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// Compact circle mark for tight spaces (mobile topbar etc.)
export function LogoMark({ size = 32, forceLight = false, className = '', style = {} }) {
  const { theme } = useThemeStore();
  const isDark = forceLight || theme === 'dark';
  const color = isDark ? '#FFFFFF' : '#0F0E17';
  return (
    <svg
      width={size} height={size} viewBox="0 0 64 64"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={style} aria-label="PW"
    >
      <circle cx="32" cy="32" r="29" stroke={color} strokeWidth="2.5" />
      <text x="32" y="40" textAnchor="middle"
        fontFamily="'DM Serif Display', Georgia, serif"
        fontSize="21" fontWeight="700" fill={color}>
        PW
      </text>
    </svg>
  );
}
