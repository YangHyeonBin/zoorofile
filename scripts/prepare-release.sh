#!/bin/bash
# 릴리즈 버전 준비 스크립트
# 사용법: ./scripts/prepare-release.sh v1.0.0

VERSION=$1

# ─── 입력값 검증 ───
if [ -z "$VERSION" ]; then
  echo "❌ 버전을 입력해주세요"
  echo "   사용법: ./scripts/prepare-release.sh v1.0.0"
  exit 1
fi

if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "❌ 올바르지 않은 형식: $VERSION"
  echo "   올바른 형식: v1.0.0, v1.2.3 등"
  exit 1
fi

# ─── 현재 버전 확인 ───
CURRENT_CONFIG=$(grep -o '"zoorofile_version": "[^"]*"' config.json | cut -d'"' -f4)
CURRENT_PACKAGE=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
PACKAGE_VERSION=${VERSION#v}  # v 접두사 제거 (package.json용)

echo "📦 현재 버전"
echo "   config.json  → $CURRENT_CONFIG"
echo "   package.json → $PACKAGE_VERSION"
echo ""
echo "📦 업데이트할 버전"
echo "   config.json  → $VERSION"
echo "   package.json → $PACKAGE_VERSION"
echo ""

# ─── 업데이트 실행 ───
sed -i "s/\"zoorofile_version\": \"[^\"]*\"/\"zoorofile_version\": \"$VERSION\"/" config.json
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$PACKAGE_VERSION\"/" package.json

# ─── 결과 확인 ───
echo "✅ 업데이트 완료!"
echo ""
grep "zoorofile_version" config.json
grep "\"version\"" package.json