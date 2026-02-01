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
 * fork가 아닌 저장소들의 언어 사용량을 바이트 단위로 합산하여
 * 상위 5개 언어를 퍼센트로 반환
 */
async function getLanguageStats() {
  const repos = await getAllRepos();
  const langMap = {};

  for (const repo of repos) {
    if (repo.fork) continue;

    try {
      const { data } = await axios.get(
        `https://api.github.com/repos/${USERNAME}/${repo.name}/languages`,
        { headers }
      );

      for (const [lang, bytes] of Object.entries(data)) {
        langMap[lang] = (langMap[lang] || 0) + bytes;
      }
    } catch {
      // 접근 불가능한 저장소는 건너뜀
    }
  }

  const total = Object.values(langMap).reduce((sum, val) => sum + val, 0);
  if (total === 0) return [];

  return Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, bytes]) => ({
      language,
      percentage: parseFloat(((bytes / total) * 100).toFixed(1)),
    }));
}

/**
 * 사용자 기본 통계 조회 (저장소 수, 팔로워, 스타 합계)
 */
async function getUserStats() {
  const { data: user } = await axios.get(
    `https://api.github.com/users/${USERNAME}`,
    { headers }
  );

  const repos = await getAllRepos();
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  return {
    repos: user.public_repos,
    followers: user.followers,
    following: user.following,
    stars: totalStars,
  };
}

module.exports = { getLanguageStats, getUserStats };
