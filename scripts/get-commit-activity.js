const axios = require('axios');
const config = require('../config.json');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.ZOOROFILE_USERNAME || config.github_username;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

/**
 * 사용자의 전체 저장소 목록 조회 (페이지네이션 처리)
 */
async function getAllRepos() {
  let repos = [];
  let page = 1;

  while (true) {
    const { data } = await axios.get(
      `https://api.github.com/users/${USERNAME}/repos`,
      { headers, params: { per_page: 100, page, type: 'all' } }
    );
    if (!data.length) break;
    repos = repos.concat(data);
    if (data.length < 100) break;
    page++;
  }

  return repos;
}

/**
 * 지난 7일간의 커밋 수를 합산하여 반환
 * 최근에 업데이트되지 않은 저장소는 건너뛰어 API 호출 횟수를 최소화
 */
async function getWeeklyContributions() {
  const repos = await getAllRepos();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let totalCommits = 0;

  for (const repo of repos) {
    // 최근 1주간 업데이트되지 않은 저장소는 건너뜀
    if (new Date(repo.updated_at) < oneWeekAgo) continue;

    try {
      let page = 1;
      while (true) {
        const { data } = await axios.get(
          `https://api.github.com/repos/${USERNAME}/${repo.name}/commits`,
          {
            headers,
            params: {
              author: USERNAME,
              since: oneWeekAgo.toISOString(),
              per_page: 100,
              page,
            },
          }
        );

        if (!data.length) break;
        totalCommits += data.length;
        if (data.length < 100) break;
        page++;
      }
    } catch {
      // 접근 불가능한 저장소는 건너뜀
    }
  }

  return totalCommits;
}

module.exports = { getWeeklyContributions };
