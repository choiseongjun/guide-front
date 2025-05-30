import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 로딩 상태를 관리할 이벤트
const loadingEvent = new Event("loading");
const loadingCompleteEvent = new Event("loadingComplete");

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // 로딩 상태 시작
    if (typeof window !== "undefined") {
      window.dispatchEvent(loadingEvent);
    }
    // 브라우저 환경에서만 localStorage 접근
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("at");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // 로딩 상태 종료
    if (typeof window !== "undefined") {
      window.dispatchEvent(loadingCompleteEvent);
    }
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    // 로딩 상태 종료
    if (typeof window !== "undefined") {
      window.dispatchEvent(loadingCompleteEvent);
    }
    return response;
  },
  async (error) => {
    // 로딩 상태 종료
    if (typeof window !== "undefined") {
      window.dispatchEvent(loadingCompleteEvent);
    }

    const originalRequest = error.config;

    // 재시도 횟수 설정
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    // 최대 2번까지 재시도
    if (originalRequest._retryCount < 2) {
      originalRequest._retryCount++;

      // 재시도 전 잠시 대기 (지수 백오프 적용)
      const delay = Math.pow(2, originalRequest._retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      return instance(originalRequest);
    }

    // 네트워크 에러 처리
    if (error.message === "Network Error") {
      // 네트워크 에러 이벤트 발생
      if (typeof window !== "undefined") {
        const networkErrorEvent = new CustomEvent("networkError", {
          detail: {
            message: "서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.",
          },
        });
        window.dispatchEvent(networkErrorEvent);
      }
      return Promise.reject(error);
    }

    // 토큰 만료로 인한 401 에러 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 브라우저 환경에서만 localStorage 접근
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("rt");
          if (!refreshToken) {
            throw new Error("No refresh token");
          }

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/refresh`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem("at", accessToken);
          localStorage.setItem("rt", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        }
      } catch (refreshError: any) {
        // 리프레시 토큰도 만료된 경우에만 로그아웃
        if (
          typeof window !== "undefined" &&
          refreshError.response?.status === 401
        ) {
          localStorage.removeItem("at");
          localStorage.removeItem("rt");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // 기타 에러 처리
    if (error.response) {
      // 서버에서 응답이 왔지만 에러인 경우
      const errorMessage =
        error.response.data?.message || "서버 오류가 발생했습니다.";
      if (typeof window !== "undefined") {
        const serverErrorEvent = new CustomEvent("serverError", {
          detail: { message: errorMessage },
        });
        window.dispatchEvent(serverErrorEvent);
      }
    } else {
      // 서버에서 응답이 없는 경우
      if (typeof window !== "undefined") {
        const serverErrorEvent = new CustomEvent("serverError", {
          detail: {
            message: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
          },
        });
        window.dispatchEvent(serverErrorEvent);
      }
    }

    return Promise.reject(error);
  }
);

// 토큰 만료 시간 체크 및 갱신
const checkAndRefreshToken = async () => {
  // 브라우저 환경에서만 실행
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("at");
  const refreshToken = localStorage.getItem("rt");

  if (!token || !refreshToken) return;

  try {
    // 토큰 갱신 요청 시 instance 사용
    const response = await instance.post("/api/v1/auth/refresh", {
      refreshToken,
    });

    if (response.data && response.data.accessToken) {
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem("at", accessToken);
      localStorage.setItem("rt", newRefreshToken);
    }
  } catch (error) {
    // 토큰 갱신 실패 시에도 즉시 로그아웃하지 않음
    console.error("Token refresh failed:", error);
  }
};

// 클라이언트 사이드에서만 토큰 갱신 체크 초기화
if (typeof window !== "undefined") {
  let intervalId: NodeJS.Timeout | null = null;

  // 15분마다 체크 (10분에서 15분으로 변경)
  intervalId = setInterval(checkAndRefreshToken, 15 * 60 * 1000);

  // 페이지 언마운트 시 인터벌 정리
  window.addEventListener("beforeunload", () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
}

export default instance;
