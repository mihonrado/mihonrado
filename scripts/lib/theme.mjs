export const THEME = {
  bg: '#070a10',
  panel: '#0c1119',
  panelAlt: '#0f1521',
  border: '#1d2733',
  text: '#d6dee7',
  dim: '#69707c',
  dim2: '#3a424e',
  accentA: '#2dd4bf', // teal
  accentB: '#22d3ee', // cyan
  accentC: '#34d399', // green
  warn: '#f2c14e',
  mono: "'SFMono-Regular','Consolas','Liberation Mono','Menlo',monospace",
};

export function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function truncate(s = '', n = 60) {
  s = String(s);
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}

// Shared <defs>: gradients + subtle grid pattern, reused across every card.
export function sharedDefs() {
  return `
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${THEME.bg}"/>
      <stop offset="100%" stop-color="${THEME.panel}"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${THEME.accentA}"/>
      <stop offset="100%" stop-color="${THEME.accentB}"/>
    </linearGradient>
    <linearGradient id="accentGradV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${THEME.accentC}"/>
      <stop offset="100%" stop-color="${THEME.accentB}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="${THEME.accentA}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${THEME.accentA}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="${THEME.border}" stroke-width="0.5" opacity="0.35"/>
    </pattern>
    <clipPath id="avatarClip">
      <circle cx="70" cy="70" r="54"/>
    </clipPath>
  </defs>`;
}

export function cardShell({ width, height, content }) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" font-family="${THEME.mono}">
  ${sharedDefs()}
  <rect x="0" y="0" width="${width}" height="${height}" rx="14" fill="url(#bgGrad)"/>
  <rect x="0" y="0" width="${width}" height="${height}" rx="14" fill="url(#grid)"/>
  <rect x="0" y="0" width="${width}" height="${height}" rx="14" fill="url(#glow)"/>
  <rect x="0.75" y="0.75" width="${width - 1.5}" height="${height - 1.5}" rx="13.5" fill="none" stroke="${THEME.border}"/>
  ${content}
</svg>`;
}
