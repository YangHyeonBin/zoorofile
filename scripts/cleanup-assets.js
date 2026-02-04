const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.resolve(__dirname, "../config.json");
const ASSETS_PATH = path.resolve(__dirname, "../assets");

// 기분별 파일명 suffix
const MOODS = ["sleeping", "relaxed", "active", "storm"];

/**
 * 선택된 동물 외 이미지 파일 삭제
 */
function cleanupAssets() {
    // config.json 읽기
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    const selectedAnimal = config.animal;

    if (!selectedAnimal) {
        console.error("❌ config.json에 animal이 설정되지 않았습니다.");
        process.exit(1);
    }

    console.log("");
    console.log("🗑️  사용하지 않는 동물 이미지 정리 중...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   유지할 동물: ${selectedAnimal}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    // assets 폴더의 모든 파일 확인
    if (!fs.existsSync(ASSETS_PATH)) {
        console.log("ℹ️  assets 폴더가 없습니다.");
        return;
    }

    const files = fs.readdirSync(ASSETS_PATH);
    let deletedCount = 0;

    for (const file of files) {
        // PNG 파일만 대상
        if (!file.endsWith(".png")) continue;

        // 선택된 동물 파일은 건너뜀
        const isSelectedAnimal = MOODS.some(
            (mood) => file === `${selectedAnimal}_${mood}.png`
        );

        if (isSelectedAnimal) {
            console.log(`✅ 유지: ${file}`);
            continue;
        }

        // 다른 동물 파일 삭제
        const filePath = path.join(ASSETS_PATH, file);
        try {
            fs.unlinkSync(filePath);
            console.log(`🗑️  삭제: ${file}`);
            deletedCount++;
        } catch (e) {
            console.warn(`⚠️  삭제 실패: ${file} (${e.message})`);
        }
    }

    console.log("");
    console.log(`✅ 정리 완료! (삭제된 파일: ${deletedCount}개)`);
    console.log("");
}

cleanupAssets();
