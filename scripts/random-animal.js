const fs = require("fs");
const path = require("path");
const axios = require("axios");

const CONFIG_PATH = path.resolve(__dirname, "../config.json");
const ASSETS_PATH = path.resolve(__dirname, "../assets");

// GitHub raw URL base
const GITHUB_RAW_BASE =
    "https://raw.githubusercontent.com/YangHyeonBin/zoorofile/main/assets";

// 사용 가능한 동물 목록
const AVAILABLE_ANIMALS = ["raccoon", "fox", "cat", "duck", "hamster"];

// 동물 이모지 매핑
const ANIMAL_EMOJI = {
    raccoon: "🦝",
    fox: "🦊",
    cat: "🐱",
    duck: "🦆",
    hamster: "🐹",
};

// 기분별 파일명 suffix
const MOODS = ["sleeping", "relaxed", "active", "storm"];

/**
 * URL에서 이미지 다운로드
 */
async function downloadImage(url, destination) {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(destination, response.data);
}

/**
 * 선택된 동물의 이미지 4장 다운로드
 */
async function downloadAnimalImages(animal) {
    console.log(`📥 ${ANIMAL_EMOJI[animal]} ${animal} 이미지 다운로드 중...`);

    // assets 폴더 생성
    if (!fs.existsSync(ASSETS_PATH)) {
        fs.mkdirSync(ASSETS_PATH, { recursive: true });
    }

    for (const mood of MOODS) {
        const filename = `${animal}_${mood}.png`;
        const url = `${GITHUB_RAW_BASE}/${filename}`;
        const destination = path.join(ASSETS_PATH, filename);

        try {
            await downloadImage(url, destination);
            console.log(`  ✅ ${filename}`);
        } catch (e) {
            console.error(`  ❌ ${filename} 다운로드 실패: ${e.message}`);
            throw new Error(`이미지 다운로드 실패: ${filename}`);
        }
    }

    console.log("");
}

/**
 * 랜덤으로 동물을 선택하여 config.json 업데이트 및 이미지 다운로드
 */
async function randomAnimal() {
    // 현재 config.json 읽기
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    const currentAnimal = config.animal;

    // 랜덤 선택
    const randomIndex = Math.floor(Math.random() * AVAILABLE_ANIMALS.length);
    const selectedAnimal = AVAILABLE_ANIMALS[randomIndex];

    // 결과 출력
    console.log("");
    console.log("🎲 랜덤 동물 선택!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    if (currentAnimal && currentAnimal !== selectedAnimal) {
        console.log(
            `   이전: ${ANIMAL_EMOJI[currentAnimal] || ""} ${currentAnimal}`
        );
    }
    console.log(`   선택: ${ANIMAL_EMOJI[selectedAnimal]} ${selectedAnimal}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    // 이미지 다운로드
    try {
        await downloadAnimalImages(selectedAnimal);
    } catch (e) {
        console.error("");
        console.error("❌ 이미지 다운로드에 실패했습니다.");
        console.error(
            "   네트워크 연결을 확인하거나, 수동으로 이미지를 복사해주세요."
        );
        console.error("");
        process.exit(1);
    }

    // config.json 업데이트
    config.animal = selectedAnimal;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");

    console.log("✅ config.json 업데이트 완료!");
    console.log("");
    console.log("💡 선택되지 않은 동물 이미지를 삭제하려면:");
    console.log("   npm run cleanup-assets");
    console.log("");
}

randomAnimal().catch((err) => {
    console.error("❌ 오류 발생:", err.message);
    process.exit(1);
});
