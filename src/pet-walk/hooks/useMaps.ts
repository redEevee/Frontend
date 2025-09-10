import React, {useState} from "react";
import {api} from '../utils/Api.tsx';
import type {KakaoBackendSearchResponse} from "../types/kakaoMapsApi.ts";

export const useMaps = () => {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchResults, setSearchResults] = useState<KakaoBackendSearchResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSearch = async (keyword?: string) => {
        const searchTerm = keyword || searchKeyword;
        console.log(456);
        if (!searchTerm.trim()) {
            setError('검색어를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.searchPlaces(searchTerm, "KEYWORD");

            setSearchResults(response);
            console.log('검색 결과:', response);

        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : '검색 중 오류가 발생했습니다.';

            setError(errorMessage);
            setSearchResults(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
        console.log("123");
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    return {
        map: {
            instance: map,
            setMap
        },
        searchKeyword,
        setSearchKeyword,
        searchResults,
        error,
        loading,
        handleSearch,
        handleKeyUp
    }
}