# 🐾 Zoorofile — Setup Guide


## 📋 시작 전 준비

- GitHub 계정
- Node.js 20 이상 (로컬 테스트용)


## 1️⃣ Profile Repository 생성

GitHub에서 **본인의 username과 동일한 이름의 public repository**를 생성합니다.

> 예: GitHub username이 `YangHyeonBin`이면 → `YangHyeonBin/YangHyeonBin`

이 저장소가 당신의 프로필 페이지에 자동으로 표시됩니다.


## 2️⃣ 파일 복사

Zoorofile의 파일들을 본인의 profile repository에 복사합니다.

### 폴더 구조

두 레포를 **같은 폴더** 안에 클론합니다:

```
any-folder/           ← 여기서 명령어 실행 (예: ~/development)
├── zoorofile/        ← Zoorofile 템플릿
└── profile/          ← 본인의 프로필 레포
```

> 💡 이미 사용하는 작업 폴더(예: `~/development`, `~/projects`)가 있다면 그곳을 사용하세요.

### 명령어

```bash
# 작업 폴더로 이동 (본인의 작업 폴더 경로 사용)
cd ~/development

# Zoorofile 클론
git clone https://github.com/YangHyeonBin/zoorofile.git

# 본인의 profile repo 클론
git clone https://github.com/YOUR_USERNAME/YOUR_USERNAME.git profile

# 파일 복사 (README.md 제외)
cp -r zoorofile/.github     profile/
cp -r zoorofile/scripts     profile/
cp -r zoorofile/assets      profile/
cp    zoorofile/.gitignore   profile/
cp    zoorofile/config.json  profile/
cp    zoorofile/package.user.json    profile/package.json
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
    "spotify": false,
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

### Spotify Secrets (현재 사용 불가)

> ⚠️ **Spotify Developer 앱 등록이 현재 일시 중단**되어 있어 신규 사용자는 Spotify 기능을 사용할 수 없습니다. 추후 재개되면 이 문서를 업데이트할 예정입니다.

| Secret 이름 | 설명 |
|:---|:---|
| `SPOTIFY_CLIENT_ID` | Spotify Developer Dashboard에서 복사 |
| `SPOTIFY_CLIENT_SECRET` | Spotify Developer Dashboard에서 복사 |


## 5️⃣ GitHub Actions 확인

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
GITHUB_TOKEN=your_token ZOOROFILE_USERNAME=your_username node scripts/generate-zoorofile-readme.js
```

생성된 `README.md`와 `assets/{animal}_{mood}.png`를 확인하세요.



## ❓ FAQ

**Q: README가 업데이트되지 않아요**  
A: GitHub Actions 탭에서 워크플로우 실행 로그를 확인해보세요. 권한 문제일 수 있습니다.

**Q: Spotify 기능을 사용할 수 있나요?**
A: 현재 Spotify Developer 앱 등록이 일시 중단되어 신규 사용자는 사용할 수 없습니다. 기존 앱을 가지고 있다면 `config.json`의 `features.spotify`를 `true`로 바꾸고 Secrets를 설정하면 됩니다.

**Q: 선택한 동물을 바꿀 수 있나요?**  
A: `config.json`의 `animal` 값만 바꾸면 됩니다!

**Q: 언어를 영어로 설정할 수 있나요?**  
A: `config.json`의 `language` 값을 `en`으로 바꾸면 됩니다!
