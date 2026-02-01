const axios = require('axios');
const config = require('../config.json');

const REPO_URL = 'https://github.com/YangHyeonBin/zoorofile';
const API_URL  = 'https://api.github.com/repos/YangHyeonBin/zoorofile/releases/latest';

/**
 * GitHub releases에서 최신 버전 조회
 * zoorofile은 public 레포이므로 인증 불필요
 * 사용자 레포의 GITHUB_TOKEN을 외부 레포 API에 전달하지 않음
 */
async function getLatestVersion() {
  const { data } = await axios.get(API_URL);
  return data.tag_name; // 예: "v1.0.0"
}

/**
 * 현재 버전과 최신 버전 비교하여 경고 로그 출력
 * 최신이면 아무것도 하지 않음
 * 체크 실패해도 나머지 기능은 정상 동작
 */
async function checkVersion() {
  const currentVersion = config.zoorofile_version;
  if (!currentVersion || currentVersion === 'v0.0.0') {
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