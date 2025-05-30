import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 갱신 관련 변수
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30분

// 마지막 갱신 시간을 로컬 스토리지에서 관리
const getLastRefreshTime = () => {
  const time = localStorage.getItem('lastRefreshTime');
  return time ? parseInt(time) : 0;
};

const setLastRefreshTime = (time: number) => {
  localStorage.setItem('lastRefreshTime', time.toString());
};

// 토큰 갱신 구독자 관리
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// 토큰 갱신 함수
const refreshToken = async () => {
  try {
    const rt = localStorage.getItem("rt");
    if (!rt) {
      throw new Error("No refresh token");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/refresh`,
      { refreshToken: rt }
    );

    if (response.data.status === 200) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem("at", accessToken);
      localStorage.setItem("rt", newRefreshToken);
      setLastRefreshTime(Date.now());
      return accessToken;
    }
    throw new Error("Token refresh failed");
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("at");
    localStorage.removeItem("rt");
    localStorage.removeItem("lastRefreshTime");
    throw error;
  }
};

// 요청 인터셉터
instance.interceptors.request.use(
  async (config) => {
    const at = localStorage.getItem("at");
    if (at) {
      // 마지막 갱신으로부터 30분이 지났는지 확인
      const now = Date.now();
      const lastRefreshTime = getLastRefreshTime();
      
      if (now - lastRefreshTime >= REFRESH_INTERVAL) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await refreshToken();
            config.headers.Authorization = `Bearer ${newToken}`;
          } finally {
            isRefreshing = false;
          }
        } else {
          // 이미 갱신 중이면 새로운 토큰을 기다림
          await new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(null);
            });
          });
        }
      } else {
        config.headers.Authorization = `Bearer ${at}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve) => {
            subscribeTokenRefresh((token) => resolve(token));
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        onRefreshed(newToken);
        return instance(originalRequest);
      } catch (refreshError) {
        onRefreshed("");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
