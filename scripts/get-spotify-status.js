const axios = require('axios');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

/**
 * Refresh Token으로 새 Access Token 교환
 */
async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', REFRESH_TOKEN);

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
 * 최근에 듣은 음악 조회 (현재 재생 중이지 않을 때 대체용)
 */
async function getRecentlyPlayed(token) {
  try {
    const { data } = await axios.get(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data?.items?.length > 0) {
      const track = data.items[0].track;
      return {
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        albumArt:
          track.album.images.find((i) => i.width === 300)?.url ||
          track.album.images[0]?.url,
        url: track.external_urls.spotify,
      };
    }
  } catch (e) {
    console.warn('⚠️  최근 듣은 음악 조회 실패:', e.message);
  }

  return null;
}

/**
 * 현재 재생 중인 음악 조회
 * 재생 중이지 않으면 최근에 듣은 음악으로 대체
 * Spotify가 설정되지 않은 경우 null 반환
 */
async function getSpotifyStatus() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.log('ℹ️  Spotify 설정되지 않음 — 건너뜀');
    return null;
  }

  let token;
  try {
    token = await getAccessToken();
  } catch (e) {
    console.warn('⚠️  Spotify 토큰 갱신 실패:', e.message);
    return null;
  }

  try {
    const { status, data } = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 204 = 재생 중인 음악 없음
    if (status === 204 || !data?.item) {
      return await getRecentlyPlayed(token);
    }

    const track = data.item;
    return {
      isPlaying: true,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      albumArt:
        track.album.images.find((i) => i.width === 300)?.url ||
        track.album.images[0]?.url,
      url: track.external_urls.spotify,
    };
  } catch (e) {
    console.warn('⚠️  현재 재생 음악 조회 실패:', e.message);
    return await getRecentlyPlayed(token);
  }
}

module.exports = { getSpotifyStatus };
