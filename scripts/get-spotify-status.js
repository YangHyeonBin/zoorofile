const axios = require('axios');
const config = require('../config.json');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

/**
 * Client Credentials로 Access Token 조회
 * 사용자 권한 불필요 — CLIENT_ID + CLIENT_SECRET만으로 됨
 */
async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const { data } = await axios.post(
    'https://accounts.spotify.com/api/token',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    }
  );

  return data.access_token;
}

/**
 * config.json의 spotify_track_id 값으로 곡 검색
 * 곡 제목, 아티스트, 앨범 아트, Spotify 링크 반환
 * Spotify가 설정되지 않은 경우 null 반환
 */
async function getSpotifyStatus() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.log('ℹ️  Spotify 설정되지 않음 — 건너뜀');
    return null;
  }

  const trackId = config.spotify_track_id;
  if (!trackId) {
    console.log('ℹ️  config.json에 spotify_track_id가 없음 — 건너뜀');
    return null;
  }

  let token;
  try {
    token = await getAccessToken();
  } catch (e) {
    console.warn('⚠️  Spotify 토큰 조회 실패:', e.message);
    return null;
  }

  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/tracks/${config.spotify_track_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!data) {
      console.warn('⚠️  Track ID로 곡을 찾을 수 없음');
      return null;
    }

    return {
      title: data.name,
      artist: data.artists.map((a) => a.name).join(', '),
      albumArt:
        data.album.images.find((i) => i.width === 300)?.url ||
        data.album.images[0]?.url,
      url: data.external_urls.spotify,
    };
  } catch (e) {
    console.warn('⚠️  Spotify 곡 조회 실패:', e.message);
    return null;
  }
}

module.exports = { getSpotifyStatus };