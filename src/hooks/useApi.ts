import { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (config?: AxiosRequestConfig) => Promise<void>;
}

export function useApi<T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (config?: AxiosRequestConfig) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios({
        url,
        method,
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${localStorage.getItem('at')}`,
        },
      });

      if (response.data.status === 200) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'API 요청 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
} 