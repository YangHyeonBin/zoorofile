const config = require('../config.json');

/**
 * KST (한국 표준시) 현재 시간 반환
 */
function getKSTTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 60 * 60 * 1000);
}

/**
 * KST 기준 시간대별 인사말 반환
 */
function getTimeGreeting() {
  const kst = getKSTTime();
  const hour = kst.getHours();

  const greetings = {
    ko: [
      { start: 0,  end: 4,  message: '🌜 야행성 모드...',      emoji: '🌜' },
      { start: 4,  end: 6,  message: '🌅 새벽의 코더...',     emoji: '🌅' },
      { start: 6,  end: 12, message: '☀️ 좋은 아침!',         emoji: '☀️' },
      { start: 12, end: 18, message: '🌤️ 좋은 오후!',         emoji: '🌤️' },
      { start: 18, end: 22, message: '🌙 좋은 저녁!',         emoji: '🌙' },
      { start: 22, end: 24, message: '🌜 야행성 모드...',      emoji: '🌜' },
    ],
    en: [
      { start: 0,  end: 4,  message: '🌜 Night owl mode...', emoji: '🌜' },
      { start: 4,  end: 6,  message: '🌅 Early bird coder...', emoji: '🌅' },
      { start: 6,  end: 12, message: '☀️ Good morning!',     emoji: '☀️' },
      { start: 12, end: 18, message: '🌤️ Good afternoon!',   emoji: '🌤️' },
      { start: 18, end: 22, message: '🌙 Good evening!',     emoji: '🌙' },
      { start: 22, end: 24, message: '🌜 Night owl mode...', emoji: '🌜' },
    ],
  };

  const lang = config.language || 'ko';
  const set = greetings[lang] || greetings.ko;

  return set.find((g) => hour >= g.start && hour < g.end) || set[0];
}

/**
 * 주간 컨트리뷰션 수에 따라 기분(mood) 판정
 */
function getMood(weeklyContributions) {
  const t = config.commit_thresholds || { sleeping: 10, relaxed: 30, active: 60 };

  if (weeklyContributions <= t.sleeping) return 'sleeping';
  if (weeklyContributions <= t.relaxed) return 'relaxed';
  if (weeklyContributions <= t.active) return 'active';
  return 'storm';
}

/**
 * 기분에 맞는 표시 라벨 반환
 */
function getMoodLabel(mood) {
  const labels = {
    ko: {
      sleeping: '😴 휴식 중...',
      relaxed: '🙂 여유롭게 코딩 중',
      active:  '💪 열심히 개발 중!',
      storm:   '🔥 폭풍 모드!',
    },
    en: {
      sleeping: '😴 Taking a break...',
      relaxed:  '🙂 Coding leisurely',
      active:   '💪 Actively developing!',
      storm:    '🔥 Storm mode!',
    },
  };

  const lang = config.language || 'ko';
  return (labels[lang] || labels.ko)[mood];
}

/**
 * 퍼센트로 유니코드 진행 바 생성 (기본 20자리)
 */
function generateProgressBar(percentage, total = 20) {
  const filled = Math.round((percentage / 100) * total);
  const empty = total - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

module.exports = {
  getKSTTime,
  getTimeGreeting,
  getMood,
  getMoodLabel,
  generateProgressBar,
  config,
};
