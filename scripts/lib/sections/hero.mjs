import { THEME, esc, truncate, cardShell } from '../theme.mjs';

export function heroSvg({ user, avatarDataUri, joinedYear, totalStars }) {
  const width = 1200;
  const height = 300;
  const name = esc(user.name || user.login);
  const bio = esc(truncate(user.bio || '', 78));
  const login = esc(user.login);

  const content = `
    <g transform="translate(60,60)">
      <circle cx="70" cy="70" r="58" fill="none" stroke="url(#accentGrad)" stroke-width="2"/>
      <image href="${avatarDataUri}" x="16" y="16" width="108" height="108" clip-path="url(#avatarClip)"/>
    </g>
    <g transform="translate(200,86)">
      <text x="0" y="0" fill="${THEME.dim}" font-size="13" letter-spacing="2">@${login}</text>
      <text x="0" y="34" fill="${THEME.text}" font-size="30" font-weight="700">${name}</text>
      <text x="0" y="64" fill="${THEME.dim}" font-size="15">${bio}</text>
    </g>
    <g transform="translate(200,178)" font-size="13">
      <text x="0" y="0" fill="${THEME.accentA}">●</text>
      <text x="16" y="0" fill="${THEME.dim}">${user.public_repos} repos</text>
      <text x="150" y="0" fill="${THEME.accentB}">●</text>
      <text x="166" y="0" fill="${THEME.dim}">${user.followers} followers</text>
      <text x="320" y="0" fill="${THEME.accentC}">●</text>
      <text x="336" y="0" fill="${THEME.dim}">${totalStars} stars</text>
      <text x="470" y="0" fill="${THEME.warn}">●</text>
      <text x="486" y="0" fill="${THEME.dim}">on GitHub since ${joinedYear}</text>
    </g>
    <line x1="60" y1="200" x2="${width - 60}" y2="200" stroke="${THEME.border}"/>
    <text x="60" y="240" fill="${THEME.dim2}" font-size="12">$ curl -s api.github.com/users/${login}</text>
    <text x="60" y="264" fill="${THEME.dim}" font-size="12">200 OK · profile rendered locally, no third-party watermark</text>
  `;
  return cardShell({ width, height, content });
}

export function highlightsSvg({ repoCount, featuredProject, totalStars, activeDays }) {
  const width = 1200;
  const height = 120;
  const chips = [
    { label: `${repoCount} public repositories`, color: THEME.accentA },
    { label: `Featured: ${truncate(featuredProject, 34)}`, color: THEME.accentB },
    { label: `${totalStars} stars · ${activeDays} active days`, color: THEME.accentC },
  ];
  let x = 50;
  const gap = 26;
  const chipEls = chips
    .map((c) => {
      const w = 26 + c.label.length * 8.4;
      const el = `
      <g transform="translate(${x},34)">
        <rect width="${w}" height="52" rx="10" fill="${THEME.panelAlt}" stroke="${THEME.border}"/>
        <circle cx="22" cy="26" r="4" fill="${c.color}"/>
        <text x="38" y="31" fill="${THEME.text}" font-size="14">${esc(c.label)}</text>
      </g>`;
      x += w + gap;
      return el;
    })
    .join('');
  return cardShell({ width, height, content: chipEls });
}
