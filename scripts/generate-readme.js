const fs = require('fs');
const path = require('path');
const { getTimeGreeting, getMood, getMoodLabel, generateProgressBar, config } = require('./utils');
const { getLanguageStats, getUserStats } = require('./get-github-stats');
const { getWeeklyContributions } = require('./get-commit-activity');
const { getSpotifyStatus } = require('./get-spotify-status');

const USERNAME = process.env.ZOOROFILE_USERNAME || config.github_username;
const ANIMAL = config.animal || 'raccoon';

// ─── Spotify 섹션 생성 ───────────────────────────────────────────────

function generateSpotifySection(spotify) {
  if (!spotify) return '';

  const lang = config.language || 'ko';
  const statusText = lang === 'ko'
    ? spotify.isPlaying ? '🎵 현재 듣고 있는 음악' : '🎵 최근에 듣은 음악'
    : spotify.isPlaying ? '🎵 Currently Playing'  : '🎵 Recently Played';

  const playIcon = spotify.isPlaying ? '▶️' : '⏸️';

  return `### ${statusText}

<img src="${spotify.albumArt}" alt="${spotify.title}" width="64" align="left" />

${playIcon} **[${spotify.title}](${spotify.url})**  
🎤 ${spotify.artist}

<br clear="all"/>

`;
}

// ─── 언어 통계 섹션 생성 ─────────────────────────────────────────────

function generateLanguageSection(langs) {
  if (!langs || !langs.length) return '';

  const lang = config.language || 'ko';
  const title  = lang === 'ko' ? '📊 언어 사용 비율'  : '📊 Language Usage';
  const headers = lang === 'ko'
    ? ['언어', '비율', '사용량']
    : ['Language', 'Usage', 'Bar'];

  let section = `### ${title}\n\n`;
  section += `| ${headers[0]} | ${headers[1]} | ${headers[2]} |\n`;
  section += `|:---:|:---:|:---|\n`;

  for (const l of langs) {
    const bar = generateProgressBar(l.percentage);
    section += `| ${l.language} | ${l.percentage}% | \`${bar}\` |\n`;
  }

  return section + '\n';
}

// ─── 통계 섹션 생성 ──────────────────────────────────────────────────

function generateStatsSection(stats) {
  if (!stats) return '';

  const lang = config.language || 'ko';
  const labels = lang === 'ko'
    ? { title: '📈 통계', repos: '저장소', stars: '스타', followers: '팔로워', following: '팔로잉' }
    : { title: '📈 Stats', repos: 'Repos', stars: 'Stars', followers: 'Followers', following: 'Following' };

  return `### ${labels.title}

| ${labels.repos} | ${labels.stars} | ${labels.followers} | ${labels.following} |
|:---:|:---:|:---:|:---:|
| ${stats.repos} | ${stats.stars} | ${stats.followers} | ${stats.following} |

`;
}

// ─── 메인 실행 ────────────────────────────────────────────────────────

async function main() {
  console.log('🐾 Zoorofile - README 생성 시작...\n');

  // 1. 데이터 수집
  console.log('📡 데이터 가져오기...');

  let weeklyContributions = 0;
  let languageStats = [];
  let userStats = null;
  let spotify = null;

  try {
    weeklyContributions = await getWeeklyContributions();
    console.log(`  ✅ 주간 컨트리뷰션: ${weeklyContributions}`);
  } catch (e) {
    console.warn('  ⚠️  컨트리뷰션 조회 실패:', e.message);
  }

  try {
    languageStats = await getLanguageStats();
    console.log(`  ✅ 언어 통계: ${languageStats.map((l) => l.language).join(', ')}`);
  } catch (e) {
    console.warn('  ⚠️  언어 통계 조회 실패:', e.message);
  }

  try {
    userStats = await getUserStats();
    console.log('  ✅ 사용자 통계 조회 완료');
  } catch (e) {
    console.warn('  ⚠️  사용자 통계 조회 실패:', e.message);
  }

  if (config.features?.spotify) {
    try {
      spotify = await getSpotifyStatus();
      console.log(`  ✅ Spotify: ${spotify?.title || '재생 중 아님'}`);
    } catch (e) {
      console.warn('  ⚠️  Spotify 조회 실패:', e.message);
    }
  }

  // 2. 기분 및 인사말 결정
  const mood = getMood(weeklyContributions);
  const moodLabel = getMoodLabel(mood);
  const greeting = getTimeGreeting();

  console.log(`\n🎭 기분: ${mood} → ${moodLabel}`);
  console.log(`🕐 인사말: ${greeting.message}`);
  console.log(`🐾 동물: ${ANIMAL}\n`);

  // 3. 동물 이미지 경로 설정
  const animalImage = `assets/${ANIMAL}_${mood}.png`;
  const animalImagePath = path.resolve(__dirname, `../${animalImage}`);

  if (!fs.existsSync(animalImagePath)) {
    console.error(`❌ 동물 이미지를 찾을 수 없습니다: "${animalImage}"`);
    console.error(`   assets/ 폴더에 파일이 있는지 확인해주세요.`);
    process.exit(1);
  }
  console.log(`✅ 동물 이미지: ${animalImage}`);

  // 4. README 구성
  let readme = `<!-- ZOOROFILE_START -->
<!-- Auto-generated by Zoorofile 🐾 | Do not edit manually -->
<!-- Last updated: ${new Date().toISOString()} -->

<div align="center">

## ${greeting.message}

<img src="${animalImage}" alt="My Zoorofile Pet" width="150" />

### 💻 ${USERNAME}
${moodLabel}

</div>

---

`;

  // GitHub 통계
  if (config.features?.github_stats) {
    if (userStats) readme += generateStatsSection(userStats);
    if (languageStats.length) readme += generateLanguageSection(languageStats);
  }

  // Spotify
  if (config.features?.spotify) {
    readme += generateSpotifySection(spotify);
  }

  // 푸터
  readme += `---

<div align="center">

*🐾 Generated by [Zoorofile](https://github.com/zoorofile) — Choose your coding spirit animal!*

</div>
<!-- ZOOROFILE_END -->
`;

  // 5. README 파일 저장 (마커 사이만 업데이트)
  const readmePath = path.resolve(__dirname, '../README.md');
  let existingContent = '';

  try {
    existingContent = fs.readFileSync(readmePath, 'utf-8')
  } catch {
    // README 가 아직 없는 경우 빈 문자열로 시작
  }

  const START_MARKER = '<!-- ZOOROFILE_START -->';
  const END_MARKER = '<!-- ZOOROFILE_END -->';
  const startIdx = existingContent.indexOf(START_MARKER);
  const endIdx = existingContent.indexOf(END_MARKER);

  let finalContent;

  if (startIdx !== -1 && endIdx !== -1) {
    // 마커가 이미 존재 → 마커 사이만 교체
    const before = existingContent.slice(0, startIdx);
    const after = existingContent.slice(endIdx + END_MARKER.length);
    finalContent = before + readme + after;
  } else {
    // 마커가 없음 (초기 실행) → 기존 내용 뒤에 추가
    finalContent = existingContent + (existingContent ? '\n\n' : '') + readme;
  }

  fs.writeFileSync(readmePath, finalContent);
  console.log('✅ README.md 생성 완료!\n');
}

main().catch((err) => {
  console.error('❌ 오류 발생:', err);
  process.exit(1);
});
