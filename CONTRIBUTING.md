# 🐾 Zoorofile — Contributing Guide

새로운 동물 캐릭터를 추가하여 기여하고 싶으시다면 아래 가이드를 따라보세요!

---

## 📋 기여 체크리스트

- [ ] `assets/` 폴더에 이미지 4장 추가
- [ ] `SETUP.md`의 동물 리스트 및 지원 현황 업데이트
- [ ] Pull Request 생성

---

## 🖼️ 이미지 생성

### Step 1 — 참고 이미지 준비

기존 동물 이미지 4장을 저장해두세요. AI에게 프롬프트할 때 참고 이미지로 첨부해야 스타일이 동일하게 유지됩니다.

```
assets/
├── raccoon_sleeping.png
├── raccoon_relaxed.png
├── raccoon_active.png
└── raccoon_storm.png
```

> 💡 기존 동물이 여러 종류 있다면, 전부 참고 이미지로 첨부하는 게 스타일 일관성에 더 좋습니다.

---

### Step 2 — AI로 이미지 생성 (ChatGPT 등)

참고 이미지를 첨부하고 아래 프롬프트를 사용합니다.

> 💡 동물을 **하나씩** 요청하는 게 퀄리티가 안정적입니다.

---

#### 프롬프트 템플릿

```
위 참고 이미지와 동일한 스타일로, 아래 동물을 기분별로 4장 생성해주세요.

=== 스타일 유지 조건 ===
- needle felting 질감과 색상 톤을 정확히 유지
- 둥글고 통통한 몸체
- 동물의 크기, 포즈 구성도 참고 이미지와 동일하게
- 배경은 흰색
- 약 150x150px 크기에서 한눈에 기분이 구별되어야 함

=== 기분별 효과 (참고 이미지와 동일하게 유지) ===
- sleeping → 누운 포즈, 눈 닫힘, 파란색 ZZZ
- relaxed → 눈 닫힘, 파란색 음표 ♪♫
- active  → 밝은 눈, 팔 들어올림, 노란색 별 ✨
- storm   → 강렬한 눈, 주황색 번개 ⚡ + 불꽃 효과

=== 생성할 동물 ===
[동물명]
- [특징 1]
- [특징 2]
- [특징 3]
```

---

#### 새 동물 제안 예시

특징은 색상, 신체 부위, 눈에 띄는 특징 위주로 정리하면 좋습니다.

```
🐻 곰
- 갈색 몸체
- 둥근 귀
- 작은 코와 흰색 배
```

---

### Step 3 — 파일명 규칙

생성된 이미지를 아래 규칙에 맞게 저장합니다. `{animal}` 부분은 **영어 소문자**로 작성하세요.

```
assets/
├── {animal}_sleeping.png
├── {animal}_relaxed.png
├── {animal}_active.png
└── {animal}_storm.png
```

예시: 곰을 추가하면

```
assets/
├── bear_sleeping.png
├── bear_relaxed.png
├── bear_active.png
└── bear_storm.png
```

---

## 📄 SETUP.md 수정

두 곳을 수정합니다.

**① 지원 현황 문장 업데이트**

```markdown
**현재 지원하는 동물: 너구리, 여우, 곰**
```

**② 동물 리스트 테이블에 추가**

```markdown
| 🐻 곰 | `bear` | [간단한 특징 설명] |
```

> ℹ️ 테이블의 `animal` 키 값과 파일명의 `{animal}` 부분이 동일해야 합니다.

---

## 🔄 Pull Request

1. 레포를 **fork**합니다
2. 새 브랜치를 생성합니다 (예: `add-bear`)
3. 이미지와 SETUP.md 수정사항을 커밋합니다
4. Pull Request를 생성합니다

PR 제목 예시: `feat: 곰 캐릭터 추가`

---

## ✅ PR 올리기 전 확인

- [ ] 이미지 4장 모두 추가됨 (`{animal}_sleeping/relaxed/active/storm.png`)
- [ ] 파일명이 영어 소문자로 올바르게 작성됨
- [ ] 이미지 스타일이 기존 동물과 동일한지 눈으로 확인
- [ ] SETUP.md 동물 리스트 및 지원 현황 수정됨
- [ ] SETUP.md의 `animal` 키와 파일명이 일치하는지 확인