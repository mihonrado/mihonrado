import { THEME, cardShell } from '../theme.mjs';

const LEVEL_COLOR = {
  NONE: THEME.panelAlt,
  FIRST_QUARTILE: '#0e4b43',
  SECOND_QUARTILE: '#137a6b',
  THIRD_QUARTILE: '#1fb89f',
  FOURTH_QUARTILE: '#34d399',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function heatmapSvg({ weeks, totalContributions }) {
  const cell = 11;
  const gap = 3;
  const left = 50;
  const top = 56;
  const width = left + weeks.length * (cell + gap) + 40;
  const height = top + 7 * (cell + gap) + 40;

  let cells = '';
  let monthLabels = '';
  let lastMonth = -1;

  weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const m = new Date(firstDay.date).getMonth();
      if (m !== lastMonth) {
        monthLabels += `<text x="${left + wi * (cell + gap)}" y="${top - 10}" fill="${THEME.dim}" font-size="11">${MONTHS[m]}</text>`;
        lastMonth = m;
      }
    }
    week.contributionDays.forEach((day, di) => {
      const x = left + wi * (cell + gap);
      const y = top + di * (cell + gap);
      const color = LEVEL_COLOR[day.contributionLevel] || THEME.panelAlt;
      cells += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2.5" fill="${color}"/>`;
    });
  });

  const content = `
    <text x="${left}" y="30" fill="${THEME.text}" font-size="16" font-weight="700">${totalContributions} contributions in the last year</text>
    ${monthLabels}
    ${cells}
    <g transform="translate(${left},${height - 22})" font-size="11" fill="${THEME.dim}">
      <text x="0" y="0">Less</text>
      ${Object.values(LEVEL_COLOR)
        .map((c, i) => `<rect x="${34 + i * 16}" y="-10" width="11" height="11" rx="2.5" fill="${c}"/>`)
        .join('')}
      <text x="${34 + Object.values(LEVEL_COLOR).length * 16 + 8}" y="0">More</text>
    </g>
  `;
  return cardShell({ width, height, content });
}
