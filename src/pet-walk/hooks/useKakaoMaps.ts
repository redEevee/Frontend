import { useState, useEffect } from 'react';
import { loadKakaoMaps, isKakaoMapsLoaded, isKakaoMapsLoading } from '../utils/kakaoMapLoader';

interface UseKakaoMapsOptions {
    appKey?: string;
    libraries?: string[];
    autoload?: boolean;
}

interface UseKakaoMapsReturn {
    isLoaded: boolean;
    isLoading: boolean;
    error: string | null;
    loadMaps: () => Promise<void>;
}

export const useKakaoMaps = (options: UseKakaoMapsOptions = {}): UseKakaoMapsReturn => {
    console.log('useKakaoMaps 훅 시작', options);

    const [isLoaded, setIsLoaded] = useState(() => {
        try {
            const loaded = isKakaoMapsLoaded();
            console.log('초기 로드 상태:', loaded);
            return loaded;
        } catch (err) {
            console.error('초기 로드 상태 확인 오류:', err);
            return false;
        }
    });

    const [isLoading, setIsLoading] = useState(() => {
        try {
            const loading = isKakaoMapsLoading();
            console.log('초기 로딩 상태:', loading);
            return loading;
        } catch (err) {
            console.error('초기 로딩 상태 확인 오류:', err);
            return false;
        }
    });

    const [error, setError] = useState<string | null>(null);

    const loadMaps = async () => {
        if (isLoaded || isLoading) {
            console.log('이미 로드되었거나 로딩 중입니다.');
            return;
        }

        try {
            console.log('Kakao Maps API 로드 시작');
            setIsLoading(true);
            setError(null);

            // 기본값으로 autoload=false 설정
            await loadKakaoMaps({
                autoload: false,
                libraries: ['services', 'clusterer'],
                ...options
            });

            console.log('Kakao Maps API 로드 성공');
            setIsLoaded(true);
        } catch (err) {
            console.error('Kakao Maps API 로드 실패:', err);
            const errorMessage = err instanceof Error ? err.message : 'Kakao Maps API 로드 중 알 수 없는 오류가 발생했습니다.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 자동으로 로드 (더 안전하게)
        try {
            if (!isLoaded && !isLoading) {
                console.log('컴포넌트 마운트 - Kakao Maps 로드 시작');
                loadMaps();
            }
        } catch (err) {
            console.error('컴포넌트 마운트 중 오류:', err);
            setError('컴포넌트 초기화 중 오류가 발생했습니다.');
        }
    }, []);

    // 상태 동기화를 위한 폴링 (개발 환경에서만)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const interval = setInterval(() => {
                const currentLoaded = isKakaoMapsLoaded();
                const currentLoading = isKakaoMapsLoading();

                if (currentLoaded !== isLoaded) {
                    setIsLoaded(currentLoaded);
                }

                if (currentLoading !== isLoading) {
                    setIsLoading(currentLoading);
                }
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isLoaded, isLoading]);

    return {
        isLoaded,
        isLoading,
        error,
        loadMaps
    };
};