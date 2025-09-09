import axios from 'axios';
import type {KakaoBackendSearchResponse} from "../types/kakaoMapsApi.ts";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082',
    timeout: 10000,
});

export const api = {
    searchPlaces: async (
        query: string,
        searchType: 'KEYWORD' | 'CATEGORY' = 'KEYWORD',
        options?: {
            categoryGroupCode?: string;
            x?: number;
            y?: number;
            radius?: number;
            rect?: string;
            page?: number;
            size?: number;
            sort?: string;
        }
    ): Promise<KakaoBackendSearchResponse> => {
        try {
            const searchParams = new URLSearchParams();
            searchParams.append('query', query);
            searchParams.append('searchType', searchType);

            if (options) {
                Object.entries(options).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        searchParams.append(key, value.toString());
                    }
                });
            }

            const url = `/kakao-maps/search?${searchParams.toString()}`;
            console.log('요청 URL:', url); // 디버깅용

            const response = await apiClient.get<KakaoBackendSearchResponse>(url);
            return response.data;
        } catch (error) {
            console.error('주소 검색 실패:', error);
            throw error;
        }
    },
};