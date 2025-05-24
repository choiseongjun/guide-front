import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080',
  timeout: 5000,
});

// 로딩 상태를 관리할 이벤트
const loadingEvent = new Event('loading');
const loadingCompleteEvent = new Event('loadingComplete');

// 토큰 갱신 함수
const refreshAccessToken = async () => {
  try { 
    const refreshToken = localStorage.getItem('rt');
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/kakao/refresh`, null, {
      headers: {
        'Refresh-Token': refreshToken
      }
    });

    const { accessToken } = response.data;
    localStorage.setItem('at', accessToken);
    return accessToken;
  } catch (error) {
    localStorage.removeItem('at');
    localStorage.removeItem('rt');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw error;
  }
};

// 토큰 만료 시간 체크 및 갱신
const checkAndRefreshToken = async () => {
  const token = localStorage.getItem('at');
  if (!token) return;

  try {
    // JWT 토큰 디코딩
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // 밀리초로 변환
    const currentTime = Date.now();
    
    // 만료 5분 전에 갱신
    if (expirationTime - currentTime < 5 * 60 * 1000) {
      await refreshAccessToken();
    }
  } catch (error) {
    console.error('Token validation error:', error);
  }
};

// 주기적으로 토큰 체크 (4분마다)
setInterval(checkAndRefreshToken, 4 * 60 * 1000);

// 요청 인터셉터
instance.interceptors.request.use(
  async (config) => {
    // 로딩 시작 이벤트 발생
    window.dispatchEvent(loadingEvent);
    
    await checkAndRefreshToken(); // 요청 전 토큰 체크
    const token = localStorage.getItem('at');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 로딩 종료 이벤트 발생
    window.dispatchEvent(loadingCompleteEvent);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    // 로딩 종료 이벤트 발생
    window.dispatchEvent(loadingCompleteEvent);
    return response;
  },
  async (error) => {
    // 로딩 종료 이벤트 발생
    window.dispatchEvent(loadingCompleteEvent);
    
    const originalRequest = error.config;

    // 토큰 만료 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance; 