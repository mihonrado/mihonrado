const API = 'https://api.github.com';
const GRAPHQL_URL = 'https://api.github.com/graphql';

function headers(token) {
  const h = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'readme-asset-generator',
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function rest(path, token) {
  const res = await fetch(`${API}${path}`, { headers: headers(token) });
  if (!res.ok) {
    throw new Error(`GitHub REST ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function getUser(username, token) {
  return rest(`/users/${username}`, token);
}

export async function getAllRepos(username, token) {
  let page = 1;
  let all = [];
  while (true) {
    const data = await rest(`/users/${username}/repos?per_page=100&page=${page}&type=owner`, token);
    all = all.concat(data);
    if (data.length < 100) break;
    page += 1;
  }
  return all.filter((r) => !r.fork);
}

export async function getLanguages(owner, repo, token) {
  try {
    return await rest(`/repos/${owner}/${repo}/languages`, token);
  } catch {
    return {};
  }
}

async function graphql(query, variables, token) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`GraphQL failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

// Requires a token (GITHUB_TOKEN in Actions works fine for public data).
export async function getContributionCalendar(username, token) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          totalCommitContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }`;
  const data = await graphql(query, { login: username }, token);
  return data.user.contributionsCollection;
}

export async function getPinnedItems(username, token) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              name
              description
              stargazerCount
              forkCount
              url
              primaryLanguage { name color }
            }
          }
        }
      }
    }`;
  const data = await graphql(query, { login: username }, token);
  return data.user.pinnedItems.nodes;
}

export async function fetchAsDataUri(url) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || 'image/png';
  return `data:${contentType};base64,${buf.toString('base64')}`;
}
