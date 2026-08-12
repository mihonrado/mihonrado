import { THEME, esc, truncate, cardShell } from '../theme.mjs';

export function projectsSvg({ projects }) {
  const width = 1200;
  const cols = 2;
  const gap = 24;
  const cardW = (width - 100 - gap) / cols;
  const cardH = 130;
  const rows = Math.ceil(projects.length / cols) || 1;
  const height = 40 + rows * (cardH + gap);

  const cards = projects
    .map((p, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 50 + col * (cardW + gap);
      const y = 30 + row * (cardH + gap);
      const desc = esc(truncate(p.description || 'No description provided.', 68));
      const lang = p.primaryLanguage;
      return `
      <g transform="translate(${x},${y})">
        <rect width="${cardW}" height="${cardH}" rx="10" fill="${THEME.panelAlt}" stroke="${THEME.border}"/>
        <text x="20" y="30" fill="${THEME.accentB}" font-size="15" font-weight="700">${esc(p.name)}</text>
        <text x="20" y="56" fill="${THEME.dim}" font-size="12">${desc}</text>
        <g transform="translate(20,${cardH - 22})" font-size="12">
          ${
            lang
              ? `<circle cx="4" cy="-4" r="4" fill="${lang.color || THEME.accentA}"/><text x="14" y="0" fill="${THEME.dim}">${esc(lang.name)}</text>`
              : ''
          }
          <text x="${lang ? 120 : 0}" y="0" fill="${THEME.dim}">★ ${p.stargazerCount}</text>
          <text x="${lang ? 190 : 70}" y="0" fill="${THEME.dim}">${p.forkCount} forks</text>
        </g>
      </g>`;
    })
    .join('');

  return cardShell({ width, height, content: cards });
}
