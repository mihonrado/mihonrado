import { THEME, esc, cardShell } from '../theme.mjs';

export function statsSvg({ totalStars, repoCount, totalForks, totalCommitContributions }) {
  const width = 1200;
  const height = 150;
  const stats = [
    { label: 'STARS', value: totalStars },
    { label: 'REPOS', value: repoCount },
    { label: 'FORKS', value: totalForks },
    { label: 'COMMITS (1Y)', value: totalCommitContributions },
  ];
  const colWidth = (width - 100) / stats.length;
  const cols = stats
    .map(
      (s, i) => `
    <g transform="translate(${50 + i * colWidth},40)">
      <text x="0" y="0" fill="${THEME.dim}" font-size="12" letter-spacing="2">${s.label}</text>
      <text x="0" y="52" fill="${THEME.text}" font-size="42" font-weight="700">${s.value}</text>
      <rect x="0" y="66" width="${colWidth - 40}" height="3" rx="1.5" fill="url(#accentGrad)"/>
    </g>`
    )
    .join('');
  return cardShell({ width, height, content: cols });
}

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
};

function colorFor(lang, i) {
  return LANG_COLORS[lang] || [THEME.accentA, THEME.accentB, THEME.accentC, THEME.warn][i % 4];
}

export function stackSvg({ languages }) {
  const width = 1200;
  const height = 150;
  const total = languages.reduce((a, l) => a + l.bytes, 0) || 1;
  const barY = 50;
  const barH = 20;
  const barW = width - 100;

  let x = 50;
  let bar = '';
  languages.forEach((l, i) => {
    const w = (l.bytes / total) * barW;
    bar += `<rect x="${x}" y="${barY}" width="${Math.max(w, 1)}" height="${barH}" fill="${colorFor(l.name, i)}"/>`;
    x += w;
  });

  const legend = languages
    .slice(0, 6)
    .map((l, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const lx = 50 + col * 380;
      const ly = 108 + row * 26;
      const pct = ((l.bytes / total) * 100).toFixed(1);
      return `
      <g transform="translate(${lx},${ly})">
        <circle cx="5" cy="-4" r="5" fill="${colorFor(l.name, i)}"/>
        <text x="18" y="0" fill="${THEME.text}" font-size="13">${esc(l.name)}</text>
        <text x="140" y="0" fill="${THEME.dim}" font-size="13">${pct}%</text>
      </g>`;
    })
    .join('');

  const content = `
    <text x="50" y="30" fill="${THEME.text}" font-size="16" font-weight="700">Language stack</text>
    <rect x="50" y="${barY}" width="${barW}" height="${barH}" rx="6" fill="${THEME.panelAlt}"/>
    <clipPath id="barClip"><rect x="50" y="${barY}" width="${barW}" height="${barH}" rx="6"/></clipPath>
    <g clip-path="url(#barClip)">${bar}</g>
    ${legend}
  `;
  return cardShell({ width, height, content });
}
