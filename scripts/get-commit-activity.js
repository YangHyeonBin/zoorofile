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

module.exports = { getWeeklyContributions };
