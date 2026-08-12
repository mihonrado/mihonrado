import fs from 'node:fs';
import path from 'node:path';
import {
  getUser,
  getAllRepos,
  getLanguages,
  getContributionCalendar,
  getPinnedItems,
  fetchAsDataUri,
} from './lib/github.mjs';
import { heroSvg, highlightsSvg } from './lib/sections/hero.mjs';
import { heatmapSvg } from './lib/sections/heatmap.mjs';
import { statsSvg, stackSvg } from './lib/sections/stats.mjs';
import { projectsSvg } from './lib/sections/projects.mjs';
import { systemScanSvg } from './lib/sections/systemScan.mjs';

const username = process.env.GITHUB_USERNAME || process.argv[2];
const token = process.env.GITHUB_TOKEN;
const outDir = process.env.OUT_DIR || 'assets';

if (!username) {
  console.error('Usage: GITHUB_USERNAME=<user> GITHUB_TOKEN=<token> node scripts/generate-assets.mjs');
  process.exit(1);
}

function write(file, svg) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, file), svg, 'utf8');
  console.log(`wrote ${path.join(outDir, file)}`);
}

async function main() {
  console.log(`Fetching data for ${username}...`);

  const user = await getUser(username, token);
  const repos = await getAllRepos(username, token);

  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0);
  const joinedYear = new Date(user.created_at).getFullYear();

  // Aggregate languages by bytes across all repos.
  const langTotals = {};
  for (const r of repos) {
    const langs = await getLanguages(username, r.name, token);
    for (const [name, bytes] of Object.entries(langs)) {
      langTotals[name] = (langTotals[name] || 0) + bytes;
    }
  }
  const languages = Object.entries(langTotals)
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes);
  const topLanguage = languages[0]?.name || 'N/A';

  const featuredProject =
    [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0]?.name || 'N/A';

  const avatarDataUri = await fetchAsDataUri(user.avatar_url);

  let weeks = [];
  let totalContributions = 0;
  let totalCommitContributions = 0;
  let activeDays = 0;
  if (token) {
    try {
      const cc = await getContributionCalendar(username, token);
      weeks = cc.contributionCalendar.weeks;
      totalContributions = cc.contributionCalendar.totalContributions;
      totalCommitContributions = cc.totalCommitContributions;
      activeDays = weeks
        .flatMap((w) => w.contributionDays)
        .filter((d) => d.contributionCount > 0).length;
    } catch (e) {
      console.warn('Contribution calendar unavailable (needs a token with public read access):', e.message);
    }
  } else {
    console.warn('No GITHUB_TOKEN set — skipping heatmap/pinned projects (both need GraphQL auth).');
  }

  let pinned = [];
  if (token) {
    try {
      pinned = await getPinnedItems(username, token);
    } catch (e) {
      console.warn('Pinned items unavailable:', e.message);
    }
  }
  if (!pinned || pinned.length === 0) {
    // Fallback: top starred repos if nothing is pinned or token is missing.
    pinned = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
      .map((r) => ({
        name: r.name,
        description: r.description,
        stargazerCount: r.stargazers_count,
        forkCount: r.forks_count,
        primaryLanguage: r.language ? { name: r.language, color: null } : null,
      }));
  }

  write('hero.svg', heroSvg({ user, avatarDataUri, joinedYear, totalStars }));
  write(
    'highlights.svg',
    highlightsSvg({ repoCount: user.public_repos, featuredProject, totalStars, activeDays })
  );
  if (weeks.length) {
    write('heatmap.svg', heatmapSvg({ weeks, totalContributions }));
  }
  write('stats.svg', statsSvg({ totalStars, repoCount: user.public_repos, totalForks, totalCommitContributions }));
  write('stack.svg', stackSvg({ languages }));
  write('projects.svg', projectsSvg({ projects: pinned }));
  write(
    'system-scan.svg',
    systemScanSvg({ login: user.login, repoCount: user.public_repos, totalStars, topLanguage, joinedYear, activeDays })
  );

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
