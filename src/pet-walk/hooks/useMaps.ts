import React, {useState} from "react";
import {api} from '../utils/Api.tsx';
import type {KakaoBackendSearchResponse} from "../types/kakaoMapsApi.ts";

export const useMaps = () => {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchResults, setSearchResults] = useState<KakaoBackendSearchResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentMarker, setCurrentMarker] = useState<kakao.maps.Marker | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [showWebView, setShowWebView] = useState<boolean>(false);
    const [webViewUrl, setWebViewUrl] = useState<string>('');

    const handleSearch = async (keyword?: string) => {
        const searchTerm = keyword || searchKeyword;
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
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const moveToLocation = (lat: number, lng: number, placeData: any) => {
        if (!map) return;

        // 기존 마커 제거
        if (currentMarker) {
            currentMarker.setMap(null);
        }

        // 선택된 장소 정보 업데이트
        setSelectedPlace(placeData);

        // 새로운 위치로 지도 이동
        const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
        map.setCenter(moveLatLng);
        map.setLevel(3); // 줌 레벨 설정

        // 새로운 마커 생성
        const marker = new window.kakao.maps.Marker({
            position: moveLatLng,
            map: map
        });

        // 개선된 인포윈도우 생성
        const infoWindowContent = `
            <div style="padding: 10px; min-width: 250px; font-family: 'Malgun Gothic', sans-serif;">
                <div style="font-weight: bold; font-size: 14px; color: #333; margin-bottom: 5px;">
                    ${placeData.place_name}
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 3px;">
                    📍 ${placeData.address_name}
                </div>
                ${placeData.phone ? `<div style="font-size: 12px; color: #666; margin-bottom: 3px;">📞 ${placeData.phone}</div>` : ''}
                ${placeData.category_name ? `<div style="font-size: 11px; color: #888;">${placeData.category_name.split(' > ').pop()}</div>` : ''}
            </div>
        `;

        const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoWindowContent
        });

        // 마커에 인포윈도우 표시
        infoWindow.open(map, marker);

        // 현재 마커 상태 업데이트
        setCurrentMarker(marker);
    };

    const openWebView = (url: string) => {
        console.log('카카오맵 상세 페이지 열기:', url);
        // iframe 대신 새 탭에서 열기 (CSRF 보호 때문)
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const closeWebView = () => {
        setShowWebView(false);
        setWebViewUrl('');
    };

    return {
        map: {
            instance: map,
            setMap
        },
        searchKeyword,
        setSearchKeyword,
        searchResults,
        selectedPlace,
        error,
        loading,
        handleSearch,
        handleKeyUp,
        moveToLocation,
        setSelectedPlace,
        showWebView,
        webViewUrl,
        openWebView,
        closeWebView
    }
}