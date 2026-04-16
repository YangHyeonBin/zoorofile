const fs = require("fs");
const path = require("path");
const { getMood, getMoodLabel, config } = require("./utils");
const {
    getWeeklyContributions,
    getWeeklyContributionsByRepo,
    getRecentCommits,
} = require("./get-commit-activity");
const { checkVersion } = require("./check-version");

// const USERNAME = process.env.ZOOROFILE_USERNAME || config.github_username;
const ANIMAL = config.animal || "raccoon";

// ─── 주간 기여 섹션 생성 ─────────────────────────────────────────────

function generateWeeklyContributionsSection(
    contributionsByRepo,
    recentCommits
) {
    if (!contributionsByRepo) return "";

    const lang = config.language || "ko";
    const { publicRepos, summary } = contributionsByRepo;

    const title =
        lang === "ko" ? "📅 이번 주 기여" : "📅 This Week's Contributions";
    const summaryTitle = lang === "ko" ? "요약" : "Summary";
    const publicLabel = lang === "ko" ? "Public 레포" : "Public repos";
    const privateLabel = lang === "ko" ? "Private 레포" : "Private repos";
    const repoLabel = lang === "ko" ? "개" : "";

    let section = `### ${title}\n\n`;

    // 요약 테이블
    const commitLabel = lang === "ko" ? "커밋" : "Commits";
    const prLabel = "PR";
    const issueLabel = lang === "ko" ? "이슈" : "Issues";

    section += `**${summaryTitle}**\n\n`;
    section += `| | ${
        lang === "ko" ? "레포 수" : "Repos"
    } | ${commitLabel} | ${prLabel} | ${issueLabel} |\n`;
    section += `|:---|:---:|:---:|:---:|:---:|\n`;
    section += `| 🔓 ${publicLabel} | ${summary.publicRepoCount}${repoLabel} | ${summary.public.commits} | ${summary.public.prs} | ${summary.public.issues} |\n`;
    section += `| 🔒 ${privateLabel} | ${summary.privateRepoCount}${repoLabel} | ${summary.private.commits} | ${summary.private.prs} | ${summary.private.issues} |\n\n`;

    // Public 레포 상세
    if (publicRepos.length > 0) {
        const detailTitle =
            lang === "ko" ? "🔓 Public 기여 상세" : "🔓 Public Contributions";
        section += `**${detailTitle}**\n\n`;

        for (const repo of publicRepos.slice(0, 5)) {
            // 상위 5개만
            const parts = [];
            if (repo.commits > 0) parts.push(`${repo.commits} commits`);
            if (repo.prs > 0) parts.push(`${repo.prs} PRs`);
            if (repo.issues > 0) parts.push(`${repo.issues} issues`);

            section += `- [${repo.name}](${repo.url}) — ${parts.join(", ")}\n`;
        }
        section += "\n";
    }

    // 최근 커밋 메시지
    if (recentCommits && recentCommits.length > 0) {
        const commitsTitle =
            lang === "ko" ? "💬 최근 커밋" : "💬 Recent Commits";
        section += `**${commitsTitle}**\n\n`;

        for (const commit of recentCommits.slice(0, 5)) {
            // 상위 5개만
            const shortRepo = commit.repo.split("/")[1] || commit.repo;
            const shortMessage =
                commit.message.length > 50
                    ? commit.message.substring(0, 47) + "..."
                    : commit.message;
            section += `- \`${shortRepo}\` [${shortMessage}](${commit.url})\n`;
        }
        section += "\n";
    }

    return section;
}

// ─── 메인 실행 ────────────────────────────────────────────────────────

async function main() {
    console.log("🐾 Zoorofile - README 생성 시작...\n");

    // 0. 버전 확인
    await checkVersion();

    // 1. 데이터 수집
    console.log("📡 데이터 가져오기...");

    let weeklyContributions = 0;
    let weeklyContributionsByRepo = null;
    let recentCommits = null;

    try {
        weeklyContributions = await getWeeklyContributions();
        console.log(`  ✅ 주간 컨트리뷰션: ${weeklyContributions}`);
    } catch (e) {
        console.warn("  ⚠️  컨트리뷰션 조회 실패:", e.message);
    }

    try {
        weeklyContributionsByRepo = await getWeeklyContributionsByRepo();
        const { summary } = weeklyContributionsByRepo;
        console.log(
            `  ✅ 레포별 기여: Public ${summary.publicRepoCount}개(${summary.public.total}), Private ${summary.privateRepoCount}개(${summary.private.total})`
        );
    } catch (e) {
        console.warn("  ⚠️  레포별 기여 조회 실패:", e.message);
    }

    try {
        recentCommits = await getRecentCommits(5);
        console.log(`  ✅ 최근 커밋: ${recentCommits.length}개`);
    } catch (e) {
        console.warn("  ⚠️  최근 커밋 조회 실패:", e.message);
    }

    // 2. 기분 결정
    const mood = getMood(weeklyContributions);
    const moodLabel = getMoodLabel(mood);

    console.log(`\n🎭 기분: ${mood} → ${moodLabel}`);
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

    // 4. 기여 요약 메시지 생성
    const lang = config.language || "ko";
    let contributionMessage = "";
    if (weeklyContributionsByRepo) {
        const { summary } = weeklyContributionsByRepo;
        const totalRepos = summary.publicRepoCount + summary.privateRepoCount;
        const totalContributions = summary.public.total + summary.private.total;

        if (totalContributions > 0) {
            contributionMessage =
                lang === "ko"
                    ? `이번 주 ${totalRepos}개의 레포지토리에 ${totalContributions}개의 기여를 하고 있어요!`
                    : `${totalContributions} contributions to ${totalRepos} repositories this week!`;
        } else {
            contributionMessage =
                lang === "ko"
                    ? "이번 주는 아직 기여가 없어요"
                    : "No contributions yet this week";
        }
    }

    // 5. README 구성
    let readme = `<!-- ZOOROFILE_START -->
<!-- Auto-generated by Zoorofile 🐾 | Do not edit manually -->
<!-- Last updated: ${new Date().toISOString()} -->

---

<div align="center">

<img src="${animalImage}" alt="My Zoorofile Pet" width="150" />

${moodLabel}

${contributionMessage}

</div>

`;

    // 주간 기여 (weekly_contributions feature 또는 기본 활성화)
    if (config.features?.weekly_contributions !== false) {
        if (weeklyContributionsByRepo) {
            readme += generateWeeklyContributionsSection(
                weeklyContributionsByRepo,
                recentCommits
            );
        }
    }

    // 푸터
    readme += `---

<div align="center">

*🐾 Generated by [Zoorofile](https://github.com/YangHyeonBin/zoorofile) — Choose your git pet!*

</div>
<!-- ZOOROFILE_END -->
`;

    // 5. README 파일 저장 (마커 사이만 업데이트)
    const readmePath = path.resolve(__dirname, "../README.md");
    let existingContent = "";

    try {
        existingContent = fs.readFileSync(readmePath, "utf-8");
    } catch {
        // README 가 아직 없는 경우 빈 문자열로 시작
    }

    const START_MARKER = "<!-- ZOOROFILE_START -->";
    const END_MARKER = "<!-- ZOOROFILE_END -->";
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
        finalContent =
            existingContent + (existingContent ? "\n\n" : "") + readme;
    }

    fs.writeFileSync(readmePath, finalContent);
    console.log("✅ README.md 생성 완료!\n");
}

main().catch((err) => {
    console.error("❌ 오류 발생:", err);
    process.exit(1);
});
