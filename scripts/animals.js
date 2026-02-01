/**
 * 🐾 Zoorofile Animal Characters
 *
 * 사용 가능한 동물: raccoon, fox, cat, duck, hamster
 * 각 동물은 (mood) => SVG string 형태의 함수
 * mood 값: 'sleeping' | 'relaxed' | 'active' | 'storm'
 */

// ─── 공유 표정 헬퍼 ──────────────────────────────────────────────────

/** 잠자는 눈 (닫힌 눈) */
function sleepingEyes(lx, ly, rx, ry) {
  return `
    <path d="M ${lx - 6} ${ly} Q ${lx} ${ly + 5} ${lx + 6} ${ly}" stroke="#374151" fill="none" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M ${rx - 6} ${ry} Q ${rx} ${ry + 5} ${rx + 6} ${ry}" stroke="#374151" fill="none" stroke-width="2.5" stroke-linecap="round"/>`;
}

/** 여유로운 눈 (반눈질 눈웃음) */
function relaxedEyes(lx, ly, rx, ry) {
  return `
    <circle cx="${lx}" cy="${ly}" r="7" fill="white"/>
    <circle cx="${rx}" cy="${ry}" r="7" fill="white"/>
    <path d="M ${lx - 4} ${ly} Q ${lx} ${ly + 4} ${lx + 4} ${ly}" fill="#374151"/>
    <path d="M ${rx - 4} ${ry} Q ${rx} ${ry + 4} ${rx + 4} ${ry}" fill="#374151"/>`;
}

/** 활발한 눈 (밝고 둥글은 눈) */
function activeEyes(lx, ly, rx, ry) {
  return `
    <circle cx="${lx}" cy="${ly}" r="7.5" fill="white"/>
    <circle cx="${rx}" cy="${ry}" r="7.5" fill="white"/>
    <circle cx="${lx + 0.5}" cy="${ly - 0.5}" r="4.5" fill="#1F2937"/>
    <circle cx="${rx + 0.5}" cy="${ry - 0.5}" r="4.5" fill="#1F2937"/>
    <circle cx="${lx + 2}" cy="${ly - 2.5}" r="1.8" fill="white"/>
    <circle cx="${rx + 2}" cy="${ry - 2.5}" r="1.8" fill="white"/>`;
}

/** 폭풍 눈 (빨간 눈 + 결정적 미리) */
function stormEyes(lx, ly, rx, ry) {
  return `
    <circle cx="${lx}" cy="${ly}" r="7.5" fill="white"/>
    <circle cx="${rx}" cy="${ry}" r="7.5" fill="white"/>
    <circle cx="${lx + 0.5}" cy="${ly + 0.5}" r="4.5" fill="#DC2626"/>
    <circle cx="${rx + 0.5}" cy="${ry + 0.5}" r="4.5" fill="#DC2626"/>
    <circle cx="${lx + 2}" cy="${ly - 1}" r="1.8" fill="white"/>
    <circle cx="${rx + 2}" cy="${ry - 1}" r="1.8" fill="white"/>
    <path d="M ${lx - 7} ${ly - 8} L ${lx + 5} ${ly - 5}" stroke="#374151" fill="none" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M ${rx + 7} ${ry - 8} L ${rx - 5} ${ry - 5}" stroke="#374151" fill="none" stroke-width="2.5" stroke-linecap="round"/>`;
}

/** mood에 따라 눈 반환 */
function getEyes(mood, lx, ly, rx, ry) {
  const map = { sleeping: sleepingEyes, relaxed: relaxedEyes, active: activeEyes, storm: stormEyes };
  return map[mood](lx, ly, rx, ry);
}

/** mood에 따라 입 반환 */
function getMouth(mood, x, y) {
  switch (mood) {
    case 'sleeping':
      return `<path d="M ${x - 2} ${y} Q ${x} ${y + 2} ${x + 2} ${y}" stroke="#374151" fill="none" stroke-width="1.5" stroke-linecap="round"/>`;
    case 'relaxed':
      return `<path d="M ${x - 3} ${y} Q ${x} ${y + 3} ${x + 3} ${y}" stroke="#374151" fill="none" stroke-width="1.8" stroke-linecap="round"/>`;
    case 'active':
      return `<path d="M ${x - 4} ${y} Q ${x} ${y + 4} ${x + 4} ${y}" stroke="#374151" fill="none" stroke-width="2" stroke-linecap="round"/>`;
    case 'storm':
      return `<path d="M ${x - 4} ${y} L ${x} ${y + 3} L ${x + 4} ${y}" stroke="#374151" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
}

/** 잠자는 ZZZ 효과 */
function zzz(x, y) {
  return `
    <text x="${x}" y="${y}" font-size="11" fill="#93C5FD" font-family="Arial, sans-serif" font-weight="bold">z</text>
    <text x="${x + 7}" y="${y - 9}" font-size="14" fill="#93C5FD" font-family="Arial, sans-serif" font-weight="bold">z</text>
    <text x="${x + 16}" y="${y - 21}" font-size="18" fill="#93C5FD" font-family="Arial, sans-serif" font-weight="bold">Z</text>`;
}

/** 폭풍 모드 반짝 효과 */
function stormSparkles() {
  return `
    <circle cx="28" cy="38" r="3" fill="#FCD34D" opacity="0.9"/>
    <circle cx="172" cy="34" r="2.5" fill="#FCD34D" opacity="0.8"/>
    <circle cx="22" cy="55" r="2" fill="#FCA5A5" opacity="0.7"/>
    <circle cx="178" cy="56" r="2" fill="#FCA5A5" opacity="0.7"/>
    <circle cx="42" cy="22" r="1.8" fill="#A78BFA" opacity="0.6"/>
    <circle cx="160" cy="20" r="1.8" fill="#A78BFA" opacity="0.6"/>`;
}

// ─── 동물 캐릭터 ─────────────────────────────────────────────────────

const animals = {

  // 🦝 너구리 — 회색 몸, 눈주위 마스크, 줄무늬 꼬리
  raccoon: (mood) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    ${mood === 'storm' ? stormSparkles() : ''}
    <!-- 꼬리 (줄무늬) -->
    <ellipse cx="152" cy="162" rx="14" ry="32" fill="#9CA3AF" transform="rotate(20 152 162)"/>
    <ellipse cx="152" cy="150" rx="9" ry="4" fill="#6B7280" transform="rotate(20 152 162)"/>
    <ellipse cx="152" cy="163" rx="9" ry="4" fill="#6B7280" transform="rotate(20 152 162)"/>
    <ellipse cx="152" cy="176" rx="9" ry="4" fill="#6B7280" transform="rotate(20 152 162)"/>
    <!-- 몸 -->
    <ellipse cx="100" cy="155" rx="48" ry="40" fill="#9CA3AF"/>
    <!-- 배 -->
    <ellipse cx="100" cy="160" rx="30" ry="25" fill="#C4C9CE"/>
    <!-- 팔 -->
    <ellipse cx="62" cy="155" rx="11" ry="20" fill="#B0B7BC" transform="rotate(-10 62 155)"/>
    <ellipse cx="138" cy="155" rx="11" ry="20" fill="#B0B7BC" transform="rotate(10 138 155)"/>
    <!-- 귀 (머리 뒤로) -->
    <ellipse cx="68" cy="54" rx="15" ry="20" fill="#9CA3AF"/>
    <ellipse cx="132" cy="54" rx="15" ry="20" fill="#9CA3AF"/>
    <ellipse cx="68" cy="56" rx="8" ry="13" fill="#FCA5A5"/>
    <ellipse cx="132" cy="56" rx="8" ry="13" fill="#FCA5A5"/>
    <!-- 머리 -->
    <circle cx="100" cy="90" r="42" fill="#B0B7BC"/>
    <!-- 눈주위 마스크 -->
    <ellipse cx="80" cy="92" rx="17" ry="14" fill="#4B5563"/>
    <ellipse cx="120" cy="92" rx="17" ry="14" fill="#4B5563"/>
    <ellipse cx="100" cy="93" rx="5" ry="9" fill="#4B5563"/>
    <!-- 눈 -->
    ${getEyes(mood, 80, 90, 120, 90)}
    <!-- 코 -->
    <ellipse cx="100" cy="102" rx="4.5" ry="3" fill="#374151"/>
    <!-- 입 -->
    ${getMouth(mood, 100, 107)}
    <!-- ZZZ -->
    ${mood === 'sleeping' ? zzz(108, 66) : ''}
  </svg>`,

  // 🦊 여우 — 주황색 몸, 뾰족한 귀, 흰색 주둘레, 불꽃 꼬리
  fox: (mood) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    ${mood === 'storm' ? stormSparkles() : ''}
    <!-- 꼬리 -->
    <ellipse cx="155" cy="155" rx="18" ry="35" fill="#EA580C" transform="rotate(15 155 155)"/>
    <ellipse cx="155" cy="143" rx="12" ry="8" fill="white" transform="rotate(15 155 155)"/>
    <!-- 몸 -->
    <ellipse cx="100" cy="155" rx="46" ry="38" fill="#F97316"/>
    <!-- 배 -->
    <ellipse cx="100" cy="160" rx="28" ry="22" fill="#FED7AA"/>
    <!-- 팔 -->
    <ellipse cx="64" cy="155" rx="10" ry="19" fill="#FB923C" transform="rotate(-10 64 155)"/>
    <ellipse cx="136" cy="155" rx="10" ry="19" fill="#FB923C" transform="rotate(10 136 155)"/>
    <!-- 귀 (뾰족, 머리 뒤로) -->
    <polygon points="68,56 58,22 84,52" fill="#FB923C"/>
    <polygon points="132,56 142,22 116,52" fill="#FB923C"/>
    <polygon points="70,54 64,30 81,52" fill="#FCA5A5"/>
    <polygon points="130,54 136,30 119,52" fill="#FCA5A5"/>
    <!-- 머리 -->
    <circle cx="100" cy="88" r="40" fill="#FB923C"/>
    <!-- 주둘레 (흰색) -->
    <ellipse cx="100" cy="100" rx="18" ry="14" fill="#FED7AA"/>
    <!-- 눈 -->
    ${getEyes(mood, 80, 85, 120, 85)}
    <!-- 코 -->
    <ellipse cx="100" cy="98" rx="4" ry="3" fill="#374151"/>
    <!-- 입 -->
    ${getMouth(mood, 100, 104)}
    <!-- ZZZ -->
    ${mood === 'sleeping' ? zzz(108, 63) : ''}
  </svg>`,

  // 🐱 고양이 — 주황색 몸, 뾰족한 귀, 수염, 곡선 꼬리
  cat: (mood) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    ${mood === 'storm' ? stormSparkles() : ''}
    <!-- 꼬리 (곡선) -->
    <path d="M 148 155 Q 178 138 170 108 Q 164 88 174 78" stroke="#F59E0B" fill="none" stroke-width="12" stroke-linecap="round"/>
    <path d="M 148 155 Q 178 138 170 108 Q 164 88 174 78" stroke="#FCD34D" fill="none" stroke-width="5" stroke-linecap="round"/>
    <!-- 몸 -->
    <ellipse cx="100" cy="155" rx="46" ry="38" fill="#F59E0B"/>
    <!-- 배 -->
    <ellipse cx="100" cy="160" rx="28" ry="22" fill="#FDE68A"/>
    <!-- 팔 -->
    <ellipse cx="64" cy="155" rx="10" ry="19" fill="#FBBF24" transform="rotate(-10 64 155)"/>
    <ellipse cx="136" cy="155" rx="10" ry="19" fill="#FBBF24" transform="rotate(10 136 155)"/>
    <!-- 귀 (뾰족, 머리 뒤로) -->
    <polygon points="66,58 60,26 84,54" fill="#FBBF24"/>
    <polygon points="134,58 140,26 116,54" fill="#FBBF24"/>
    <polygon points="68,56 64,34 81,54" fill="#FCA5A5"/>
    <polygon points="132,56 136,34 119,54" fill="#FCA5A5"/>
    <!-- 머리 -->
    <circle cx="100" cy="88" r="40" fill="#FBBF24"/>
    <!-- 눈 -->
    ${getEyes(mood, 80, 85, 120, 85)}
    <!-- 코 (핑크) -->
    <ellipse cx="100" cy="98" rx="3.5" ry="2.5" fill="#EC4899"/>
    <!-- 입 -->
    ${getMouth(mood, 100, 103)}
    <!-- 수염 -->
    <line x1="48" y1="96" x2="74" y2="98" stroke="#374151" stroke-width="1.2" opacity="0.5"/>
    <line x1="48" y1="103" x2="74" y2="102" stroke="#374151" stroke-width="1.2" opacity="0.5"/>
    <line x1="152" y1="96" x2="126" y2="98" stroke="#374151" stroke-width="1.2" opacity="0.5"/>
    <line x1="152" y1="103" x2="126" y2="102" stroke="#374151" stroke-width="1.2" opacity="0.5"/>
    <!-- ZZZ -->
    ${mood === 'sleeping' ? zzz(108, 63) : ''}
  </svg>`,

  // 🦆 오리 — 둥근 노란색 몸, 주황색 부리, 작은 날개
  duck: (mood) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    ${mood === 'storm' ? stormSparkles() : ''}
    <!-- 몸 (둥글고 통통한) -->
    <ellipse cx="100" cy="158" rx="52" ry="36" fill="#FDE047"/>
    <!-- 배 -->
    <ellipse cx="100" cy="165" rx="36" ry="20" fill="#FEF08A"/>
    <!-- 날개 -->
    <ellipse cx="68" cy="148" rx="18" ry="11" fill="#EAB308" transform="rotate(-18 68 148)"/>
    <ellipse cx="132" cy="148" rx="18" ry="11" fill="#EAB308" transform="rotate(18 132 148)"/>
    <!-- 날개 결 -->
    <ellipse cx="66" cy="150" rx="10" ry="5.5" fill="#CA8A04" transform="rotate(-18 66 150)"/>
    <ellipse cx="134" cy="150" rx="10" ry="5.5" fill="#CA8A04" transform="rotate(18 134 150)"/>
    <!-- 머리 -->
    <circle cx="100" cy="90" r="36" fill="#FDE047"/>
    <!-- 귀 (불필요하지만 귀엽게 작은 볼록 추가) -->
    <!-- 부리 -->
    <ellipse cx="130" cy="94" rx="16" ry="7" fill="#F97316" transform="rotate(5 130 94)"/>
    <line x1="116" y1="94" x2="145" y2="93" stroke="#EA580C" stroke-width="1.5"/>
    <!-- 눈 (부리가 오른쪽이므로 눈을 약간 왼쪽으로) -->
    ${getEyes(mood, 78, 87, 108, 87)}
    <!-- ZZZ -->
    ${mood === 'sleeping' ? zzz(116, 64) : ''}
  </svg>`,

  // 🐹 햄스터 — 둥글고 통통한 몸, 큰 볼주머니, 핑크 볼
  hamster: (mood) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    ${mood === 'storm' ? stormSparkles() : ''}
    <!-- 작은 꼬리 -->
    <circle cx="148" cy="158" r="6" fill="#E8C9A0"/>
    <!-- 몸 (둥글고 통통한) -->
    <ellipse cx="100" cy="152" rx="48" ry="42" fill="#D4A574"/>
    <!-- 배 -->
    <ellipse cx="100" cy="158" rx="30" ry="28" fill="#F5DEB3"/>
    <!-- 팔 (작은) -->
    <ellipse cx="66" cy="150" rx="9" ry="16" fill="#DEB887" transform="rotate(-8 66 150)"/>
    <ellipse cx="134" cy="150" rx="9" ry="16" fill="#DEB887" transform="rotate(8 134 150)"/>
    <!-- 귀 (둥근, 머리 뒤로) -->
    <circle cx="72" cy="55" r="14" fill="#D4A574"/>
    <circle cx="128" cy="55" r="14" fill="#D4A574"/>
    <circle cx="72" cy="55" r="8" fill="#FCA5A5"/>
    <circle cx="128" cy="55" r="8" fill="#FCA5A5"/>
    <!-- 머리 -->
    <circle cx="100" cy="88" r="40" fill="#DEB887"/>
    <!-- 볼주머니 (통통하게 돌출) -->
    <circle cx="70" cy="100" r="19" fill="#F5DEB3"/>
    <circle cx="130" cy="100" r="19" fill="#F5DEB3"/>
    <!-- 볼 핑크 -->
    <circle cx="70" cy="104" r="9" fill="#FCA5A5" opacity="0.55"/>
    <circle cx="130" cy="104" r="9" fill="#FCA5A5" opacity="0.55"/>
    <!-- 눈 -->
    ${getEyes(mood, 82, 85, 118, 85)}
    <!-- 코 (핑크) -->
    <ellipse cx="100" cy="96" rx="3" ry="2.5" fill="#EC4899"/>
    <!-- 입 -->
    ${getMouth(mood, 100, 101)}
    <!-- ZZZ -->
    ${mood === 'sleeping' ? zzz(108, 62) : ''}
  </svg>`,
};

module.exports = animals;
