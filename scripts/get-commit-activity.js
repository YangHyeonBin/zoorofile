const axios = require('axios');
const config = require('../config.json');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.ZOOROFILE_USERNAME || config.github_username;

/**
 * GraphQL API를 사용하여 지난 7일간의 contribution 수를 반환
 * Private 레포 포함 (토큰에 repo 권한이 있는 경우)
 */
async function getWeeklyContributions() {
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  const now = new Date();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const { data } = await axios.post(
    'https://api.github.com/graphql',
    {
      query,
      variables: {
        username: USERNAME,
        from: oneWeekAgo.toISOString(),
        to: now.toISOString(),
      },
    },
    {
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  // contributionCalendar.totalContributions는 해당 기간의 모든 contribution 합계
  return data.data.user.contributionsCollection.contributionCalendar.totalContributions;
}

/**
 * 이번 주 레포별 기여 상세 정보를 반환
 * @returns {Promise<{
 *   publicRepos: Array<{ name: string, url: string, commits: number }>,
 *   privateRepos: Array<{ name: string, commits: number }>,
 *   summary: { publicRepoCount: number, publicCommits: number, privateRepoCount: number, privateCommits: number }
 * }>}
 */
async function getWeeklyContributionsByRepo() {
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              nameWithOwner
              url
              isPrivate
            }
            contributions {
              totalCount
            }
          }
          pullRequestContributionsByRepository(maxRepositories: 100) {
            repository {
              nameWithOwner
              url
              isPrivate
            }
            contributions {
              totalCount
            }
          }
          issueContributionsByRepository(maxRepositories: 100) {
            repository {
              nameWithOwner
              url
              isPrivate
            }
            contributions {
              totalCount
            }
          }
        }
      }
    }
  `;

  const now = new Date();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const { data } = await axios.post(
    'https://api.github.com/graphql',
    {
      query,
      variables: {
        username: USERNAME,
        from: oneWeekAgo.toISOString(),
        to: now.toISOString(),
      },
    },
    {
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  const collection = data.data.user.contributionsCollection;

  // 레포별로 모든 기여 합산 (commits + PRs + issues)
  const repoMap = new Map();

  const addContributions = (items, type) => {
    for (const item of items) {
      const name = item.repository.nameWithOwner;
      const existing = repoMap.get(name) || {
        name,
        url: item.repository.url,
        isPrivate: item.repository.isPrivate,
        commits: 0,
        prs: 0,
        issues: 0,
      };

      if (type === 'commits') existing.commits += item.contributions.totalCount;
      if (type === 'prs') existing.prs += item.contributions.totalCount;
      if (type === 'issues') existing.issues += item.contributions.totalCount;

      repoMap.set(name, existing);
    }
  };

  addContributions(collection.commitContributionsByRepository, 'commits');
  addContributions(collection.pullRequestContributionsByRepository, 'prs');
  addContributions(collection.issueContributionsByRepository, 'issues');

  // public/private 분리
  const publicRepos = [];
  const privateRepos = [];

  for (const repo of repoMap.values()) {
    const total = repo.commits + repo.prs + repo.issues;
    if (repo.isPrivate) {
      privateRepos.push({
        name: repo.name,
        commits: repo.commits,
        prs: repo.prs,
        issues: repo.issues,
        total,
      });
    } else {
      publicRepos.push({
        name: repo.name,
        url: repo.url,
        commits: repo.commits,
        prs: repo.prs,
        issues: repo.issues,
        total,
      });
    }
  }

  // 기여 수 기준 정렬
  publicRepos.sort((a, b) => b.total - a.total);
  privateRepos.sort((a, b) => b.total - a.total);

  const summary = {
    publicRepoCount: publicRepos.length,
    privateRepoCount: privateRepos.length,
    public: {
      commits: publicRepos.reduce((sum, r) => sum + r.commits, 0),
      prs: publicRepos.reduce((sum, r) => sum + r.prs, 0),
      issues: publicRepos.reduce((sum, r) => sum + r.issues, 0),
      total: publicRepos.reduce((sum, r) => sum + r.total, 0),
    },
    private: {
      commits: privateRepos.reduce((sum, r) => sum + r.commits, 0),
      prs: privateRepos.reduce((sum, r) => sum + r.prs, 0),
      issues: privateRepos.reduce((sum, r) => sum + r.issues, 0),
      total: privateRepos.reduce((sum, r) => sum + r.total, 0),
    },
  };

  return { publicRepos, privateRepos, summary };
}

/**
 * Public 레포의 최근 커밋 메시지를 가져옴 (Search API 사용)
 * @param {number} limit - 가져올 커밋 수 (기본 10)
 * @returns {Promise<Array<{ repo: string, message: string, url: string, date: string }>>}
 */
async function getRecentCommits(limit = 10) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const dateStr = oneWeekAgo.toISOString().split('T')[0];

  const { data } = await axios.get(
    'https://api.github.com/search/commits',
    {
      params: {
        q: `author:${USERNAME} committer-date:>=${dateStr} is:public`,
        sort: 'committer-date',
        order: 'desc',
        per_page: limit,
      },
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.cloak-preview+json',
      },
    }
  );

  return data.items.map((item) => ({
    repo: item.repository.full_name,
    message: item.commit.message.split('\n')[0], // 첫 줄만
    url: item.html_url,
    date: item.commit.committer.date,
  }));
}

module.exports = { getWeeklyContributions, getWeeklyContributionsByRepo, getRecentCommits };
