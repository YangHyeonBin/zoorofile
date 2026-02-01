const axios = require('axios');
const config = require('../config.json');

const REPO_URL = 'https://github.com/YangHyeonBin/zoorofile';
const API_URL  = 'https://api.github.com/repos/YangHyeonBin/zoorofile/releases/latest';

/**
 * GitHub releases에서 최신 버전 조회
 * GITHUB_TOKEN 있으면 인증 요청으로 속도 제한 완화
 */
async function getLatestVersion() {
  const headers = {};
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const { data } = await axios.get(API_URL, { headers });
  return data.tag_name; // 예: "v1.0.0"
}

/**
 * 현재 버전과 최신 버전 비교하여 경고 로그 출력
 * 최신이면 아무것도 하지 않음
 * 체크 실패해도 나머지 기능은 정상 동작
 */
async function checkVersion() {
  const currentVersion = config.zoorofile_version;
  if (!currentVersion) {
    console.log('ℹ️  zoorofile_version 미설정 — 버전 체크 건너뜀');
    return;
  }

  try {
    const latestVersion = await getLatestVersion();

    if (currentVersion === latestVersion) {
      console.log(`✅ Zoorofile 최신 버전 사용 중 (${currentVersion})`);
      return;
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[Zoorofile] ⚠️  업데이트가 있습니다!');
    console.log(`   현재 버전: ${currentVersion}`);
    console.log(`   최신 버전: ${latestVersion}`);
    console.log(`   업데이트 내용: ${REPO_URL}/releases/tag/${latestVersion}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
  } catch (e) {
    console.warn('⚠️  Zoorofile 버전 체크 실패:', e.message);
  }
}

module.exports = { checkVersion };