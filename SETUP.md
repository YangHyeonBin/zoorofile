# 🐾 Zoorofile — Setup Guide


## 📋 시작 전 준비

- GitHub 계정
- Node.js 20 이상 (로컬 테스트용)
- Spotify 계정 (선택사항)


## 1️⃣ Profile Repository 생성

GitHub에서 **본인의 username과 동일한 이름의 public repository**를 생성합니다.

> 예: GitHub username이 `YangHyeonBin`이면 → `YangHyeonBin/YangHyeonBin`

이 저장소가 당신의 프로필 페이지에 자동으로 표시됩니다.


## 2️⃣ 파일 복사

Zoorofile의 파일들을 본인의 profile repository에 복사합니다.

```bash
# Zoorofile 클론
git clone https://github.com/YangHyeonBin/zoorofile.git zoorofile

# 본인의 profile repo 클론
git clone https://github.com/YOUR_USERNAME/YOUR_USERNAME.git profile

# 파일 복사 (README.md 제외)
cp -r zoorofile/.github     profile/
cp -r zoorofile/scripts     profile/
cp -r zoorofile/assets      profile/
cp    zoorofile/config.json  profile/
cp    zoorofile/package.json profile/
cp    zoorofile/SETUP.md     profile/

cd profile
npm install
```


## 3️⃣ config.json 설정

`config.json` 파일을 열고 본인의 정보로 수정합니다.

```json
{
  "animal": "raccoon",
  "github_username": "YOUR_USERNAME",
  "timezone": "Asia/Seoul",
  "language": "ko",
  "features": {
    "github_stats": true,
    "spotify": true,
    "time_greeting": true,
    "commit_mood": true
  },
  "commit_thresholds": {
    "sleeping": 10,
    "relaxed": 30,
    "active": 60
  },
  "spotify_track_id": "YOUR_SPOTIFY_TRACK_ID"
}
```

### 설정 항목 설명

| 키 | 설명 |
|:---|:---|
| `animal` | 사용할 동물 캐릭터 키 (아래 표 참고) |
| `github_username` | 본인의 GitHub username |
| `language` | 언어 (`ko` 또는 `en`) |
| `features` | 각 기능의 활성화 여부 |
| `commit_thresholds` | 기분 전환 기준 (주당 컨트리뷰션 수) |
| `spotify_track_id` | Spotify 트랙 ID (아래 참고) |

### 🐾 사용 가능한 동물

**현재 지원하는 동물: 너구리, 여우**
**고양이, 오리, 햄스터는 이미지 생성 후 추가 예정!**

| 동물 | `animal` 키 | 특징 |
|:---:|:---:|:---|
| 🦝 너구리 | `raccoon` | 호기심 많고 똑똑한 느낌 |
| 🦊 여우 | `fox` | 영리하고 민첩한 느낌 |
| 🐱 고양이 | `cat` | 귀여움. |
| 🦆 오리 | `duck` | [러버덕 디버깅](https://en.wikipedia.org/wiki/Rubber_duck_debugging) 전문가 |
| 🐹 햄스터 | `hamster` | 열심히 달리는 느낌 aka.챗바퀴 |


## 4️⃣ GitHub Secrets 설정

Profile repository의 **Settings → Secrets and variables → Actions**에서 아래 값들을 추가합니다.

### 필수 Secrets

| Secret 이름 | 값 |
|:---|:---|
| `ZOOROFILE_USERNAME` | 본인의 GitHub username |

> ℹ️ `GITHUB_TOKEN`은 GitHub Actions에서 **자동 제공**됩니다. 직접 설정할 필요 없습니다.

### Spotify Secrets (선택사항)

| Secret 이름 | 설명 |
|:---|:---|
| `SPOTIFY_CLIENT_ID` | Spotify Developer Dashboard에서 복사 |
| `SPOTIFY_CLIENT_SECRET` | Spotify Developer Dashboard에서 복사 |


## 5️⃣ Spotify 연동 (선택사항)

### Step 1 — Spotify Developer App 생성

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)로 이동
2. **Create App** 클릭
3. App 이름과 설명을 적절히 입력
4. **Settings → Basic information**에서 `Client ID`와 `Client Secret`를 복사
5. 복사한 값을 GitHub Secrets에 추가합니다 (4️⃣ 참고)

### Step 2 — Track ID 얻기

프로필에 표시할 음악의 Track ID를 복사합니다.

1. **Spotify 앱**에서 원하는 곡을 열어둡니다
2. **••• (더보기) → Share → 링크 복사** 클릭
3. 복사된 URL에서 Track ID를 확인합니다:

```
https://open.spotify.com/track/37i8dQZtR8X5uRGDmB5jOK
                               ^^^^^^^^^^^^^^^^^^^^^^
                               이 부분이 Track ID
```

4. 복사한 Track ID를 `config.json`의 `spotify_track_id`에 붙어넣습니다


## 6️⃣ GitHub Actions 확인

1. Profile repository의 **Actions** 탭으로 이동
2. 첫 실행은 수동으로 트리거할 수 있습니다:
   - **Zoorofile - Update README** 워크플로우 클릭
   - **Run workflow** → **Run workflow** 클릭
3. 실행 완료 후 프로필 페이지를 확인합니다!

> 🔄 이후로는 **매시간 자동으로** 실행되어 README가 업데이트됩니다.

## 🎭 커밋 활동별 동물 표정

| 표정 | 주당 컨트리뷰션 | 설명 |
|:---:|:---:|:---|
| 😴 휴식 | 0 ~ 10 | 정말 쉬는 주 |
| 🙂 여유 | 11 ~ 30 | 평상시보다 한가한 주 |
| 💪 활발 | 31 ~ 60 | 꾸준히 코딩하는 주 |
| 🔥 폭풍 | 61+ | 특별히 바쁜 주! |

> 💡 `config.json`의 `commit_thresholds` 값을 조정하면 본인의 패턴에 맞게 기준을 바꿀 수 있습니다.


## 🧪 로컬 테스트

```bash
npm install

# 환경변수를 직접 설정하여 테스트
GITHUB_TOKEN=your_token ZOOROFILE_USERNAME=your_username node scripts/generate-readme.js
```

생성된 `README.md`와 `assets/{animal}_{mood}.png`를 확인하세요.



## ❓ FAQ

**Q: README가 업데이트되지 않아요**  
A: GitHub Actions 탭에서 워크플로우 실행 로그를 확인해보세요. 권한 문제일 수 있습니다.

**Q: Spotify 음악이 안 보여요**  
A: `config.json`의 `spotify_track_id`가 올바르게 설정되었는지 확인해보세요. Spotify 앱에서 링크 복사 후 Track ID만 붙어넣으면 됩니다.

**Q: Spotify 음악을 바꾸려면?**  
A: `config.json`의 `spotify_track_id` 값만 새 곡의 Track ID로 바꾸면 됩니다!

**Q: 선택한 동물을 바꿀 수 있나요?**  
A: `config.json`의 `animal` 값만 바꾸면 됩니다!

**Q: 언어를 영어로 설정할 수 있나요?**  
A: `config.json`의 `language` 값을 `en`으로 바꾸면 됩니다!
