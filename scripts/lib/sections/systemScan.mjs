import { THEME, esc, cardShell } from '../theme.mjs';

export function systemScanSvg({ login, repoCount, totalStars, topLanguage, joinedYear, activeDays }) {
  const width = 1200;
  const height = 260;
  const lines = [
    { t: `$ ./scan.sh --user ${login}`, c: THEME.dim },
    { t: `> initializing profile scan...`, c: THEME.dim2 },
    { t: `> repositories found ......... ${repoCount}`, c: THEME.text },
    { t: `> stars collected ............ ${totalStars}`, c: THEME.text },
    { t: `> primary language ........... ${topLanguage}`, c: THEME.text },
    { t: `> active days (1y) ........... ${activeDays}`, c: THEME.text },
    { t: `> member since ................ ${joinedYear}`, c: THEME.text },
    { t: `> scan complete. all systems nominal.`, c: THEME.accentC },
  ];

  const textEls = lines
    .map((l, i) => `<text x="50" y="${60 + i * 24}" fill="${l.c}" font-size="14">${esc(l.t)}</text>`)
    .join('');

  const cursorY = 60 + lines.length * 24 - 16;

  const content = `
    <g transform="translate(0,0)">
      <circle cx="70" cy="30" r="6" fill="#ff5f57"/>
      <circle cx="92" cy="30" r="6" fill="#febc2e"/>
      <circle cx="114" cy="30" r="6" fill="#28c840"/>
    </g>
    <line x1="0" y1="46" x2="${width}" y2="46" stroke="${THEME.border}"/>
    ${textEls}
    <rect x="52" y="${cursorY}" width="9" height="16" fill="${THEME.accentA}">
      <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/>
    </rect>
  `;
  return cardShell({ width, height, content });
}
