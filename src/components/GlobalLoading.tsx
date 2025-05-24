'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  useEffect(() => {
    const handleLoading = () => {
      setLoadingCount((prev) => {
        const newCount = prev + 1;
        setIsLoading(newCount > 0);
        return newCount;
      });
    };

    const handleLoadingComplete = () => {
      setLoadingCount((prev) => {
        const newCount = Math.max(0, prev - 1);
        setIsLoading(newCount > 0);
        return newCount;
      });
    };

    window.addEventListener('loading', handleLoading);
    window.addEventListener('loadingComplete', handleLoadingComplete);

    return () => {
      window.removeEventListener('loading', handleLoading);
      window.removeEventListener('loadingComplete', handleLoadingComplete);
    };
  }, []);

  if (!isLoading) return null;

  return <LoadingSpinner message="로딩 중..." />;
} 