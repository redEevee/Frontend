import {useState} from "react";
import {api} from '../utils/Api.tsx';
import type {KakaoBackendSearchResponse} from "../types/kakaoMapsApi.ts";

// 카테고리별 검색 설정
const CATEGORY_CONFIG = {
    '동물병원': {
        searchType: 'KEYWORD' as const,
        query: '동물병원',
        categoryCode: null
    },
    '펫샵': {
        searchType: 'KEYWORD' as const,
        query: '펫샵',
        categoryCode: null
    },
    '애견미용': {
        searchType: 'KEYWORD' as const,
        query: '애견미용',
        categoryCode: null
    },
    '애견공원': {
        searchType: 'KEYWORD' as const,
        query: '애견공원 OR 반려동물공원 OR 도그런',
        categoryCode: null
    },
    '애견카페': {
        searchType: 'KEYWORD' as const,
        query: '애견카페 OR 반려동물카페 OR 도그카페',
        categoryCode: null
    },
    '애견호텔': {
        searchType: 'KEYWORD' as const,
        query: '애견호텔 OR 펜션 OR 반려동물숙박',
        categoryCode: null
    },
};

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
    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [searchRadius, setSearchRadius] = useState<number>(1000); // 기본 1km

    // 키워드 검색
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
            console.log('키워드 검색 결과:', response);
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

    // 지도의 특정 위치로 이동하고 마커 표시
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
        map.setLevel(3);

        // 새로운 마커 생성
        const marker = new window.kakao.maps.Marker({
            position: moveLatLng,
            map: map
        });

        // 인포윈도우 생성
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

        infoWindow.open(map, marker);
        setCurrentMarker(marker);
    };

    // 웹뷰 관련 함수들
    const openWebView = (url: string) => {
        console.log('카카오맵 상세 페이지 열기:', url);
        setWebViewUrl(url);
        setShowWebView(true);
    };

    const closeWebView = () => {
        setShowWebView(false);
        setWebViewUrl('');
    };

    // 현재 위치 가져오기
    const getCurrentLocation = () => {
        setLocationLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('위치 서비스가 지원되지 않습니다.');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const location = { lat: latitude, lng: longitude };
                setCurrentLocation(location);

                if (map) {
                    // 기존 마커 제거
                    if (currentMarker) {
                        currentMarker.setMap(null);
                    }

                    // 현재 위치로 지도 이동
                    const moveLatLng = new window.kakao.maps.LatLng(latitude, longitude);
                    map.setCenter(moveLatLng);
                    map.setLevel(4);

                    // 현재 위치 마커 생성
                    const marker = new window.kakao.maps.Marker({
                        position: moveLatLng,
                        map: map
                    });

                    // 현재 위치 인포윈도우
                    const infoWindowContent = `
                        <div style="padding: 10px; min-width: 200px; font-family: 'Malgun Gothic', sans-serif;">
                            <div style="font-weight: bold; font-size: 14px; color: #333; margin-bottom: 5px;">
                                📍 현재 위치
                            </div>
                            <div style="font-size: 12px; color: #666;">
                                위도: ${latitude.toFixed(6)}<br>
                                경도: ${longitude.toFixed(6)}
                            </div>
                        </div>
                    `;

                    const infoWindow = new window.kakao.maps.InfoWindow({
                        content: infoWindowContent
                    });

                    infoWindow.open(map, marker);
                    setCurrentMarker(marker);
                }
                
                setLocationLoading(false);
            },
            (error) => {
                let errorMessage = '위치를 가져올 수 없습니다.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '위치 접근 권한이 거부되었습니다.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = '위치 정보를 사용할 수 없습니다.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = '위치 요청 시간이 초과되었습니다.';
                        break;
                }
                setError(errorMessage);
                setLocationLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    // 카테고리별 최적화된 검색 수행
    const performOptimizedSearch = async (category: string, searchLat: number, searchLng: number) => {
        const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];

        if (!config) {
            // 기본 키워드 검색
            return await api.searchPlaces(category, "KEYWORD", {
                x: searchLng,
                y: searchLat,
                radius: searchRadius,
                size: 15,
                sort: 'distance'
            });
        }

        if (config.searchType === 'CATEGORY') {
            // 카테고리 코드 기반 검색
            return await api.searchPlaces('', "CATEGORY", {
                categoryGroupCode: config.categoryCode,
                x: searchLng,
                y: searchLat,
                radius: searchRadius,
                size: 15,
                sort: 'distance'
            });
        } else {
            // 키워드 기반 검색 (OR 검색어 지원)
            return await api.searchPlaces(config.query, "KEYWORD", {
                x: searchLng,
                y: searchLat,
                radius: searchRadius,
                size: 15,
                sort: 'distance'
            });
        }
    };

    // 현재 위치 기준 정확한 GPS 좌표로 검색
    const searchNearbyPlaces = async (category: string) => {
        if (!currentLocation) {
            setError('현재 위치를 먼저 확인해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await performOptimizedSearch(category, currentLocation.lat, currentLocation.lng);
            setSearchResults(response);
            console.log(`현재 GPS 위치(${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}) 기준 ${category} 검색:`, response);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : '현재 위치 기준 검색 중 오류가 발생했습니다.';
            setError(errorMessage);
            setSearchResults(null);
        } finally {
            setLoading(false);
        }
    };

    // 지도 화면 중심 기준 검색 (사용자가 보고 있는 지역)
    const searchNearbyPlacesByMapCenter = async (category: string) => {
        if (!map) {
            setError('지도를 불러오는 중입니다.');
            return;
        }

        const center = map.getCenter();
        const centerLat = center.getLat();
        const centerLng = center.getLng();

        setLoading(true);
        setError(null);

        try {
            const response = await performOptimizedSearch(category, centerLat, centerLng);
            setSearchResults(response);
            console.log(`지도 중심(${centerLat.toFixed(4)}, ${centerLng.toFixed(4)}) 기준 ${category} 검색:`, response);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : '지도 중심 기준 검색 중 오류가 발생했습니다.';
            setError(errorMessage);
            setSearchResults(null);
        } finally {
            setLoading(false);
        }
    };


    // 실시간 지도 이동 기반 자동 검색
    const handleMapDragEnd = async (selectedCategory: string) => {
        if (!map || !selectedCategory) return;

        const center = map.getCenter();
        const centerLat = center.getLat();
        const centerLng = center.getLng();

        // 디바운싱을 위한 지연
        setTimeout(async () => {
            try {
                const response = await performOptimizedSearch(selectedCategory, centerLat, centerLng);
                setSearchResults(response);
                console.log(`지도 이동 후 자동 검색 (${centerLat.toFixed(4)}, ${centerLng.toFixed(4)}):`, response);
            } catch (error) {
                console.error('자동 검색 실패:', error);
            }
        }, 500);
    };

    // 현재 위치로 지도 이동
    const moveToCurrentLocation = () => {
        if (!map || !currentLocation) {
            getCurrentLocation();
            return;
        }

        // 기존 마커 제거
        if (currentMarker) {
            currentMarker.setMap(null);
        }

        // 현재 위치로 지도 이동
        const moveLatLng = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        map.setCenter(moveLatLng);
        map.setLevel(4);

        // 현재 위치 마커 생성
        const marker = new window.kakao.maps.Marker({
            position: moveLatLng,
            map: map
        });

        // 현재 위치 인포윈도우
        const infoWindowContent = `
            <div style="padding: 10px; min-width: 200px; font-family: 'Malgun Gothic', sans-serif;">
                <div style="font-weight: bold; font-size: 14px; color: #333; margin-bottom: 5px;">
                    📍 현재 위치
                </div>
                <div style="font-size: 12px; color: #666;">
                    위도: ${currentLocation.lat.toFixed(6)}<br>
                    경도: ${currentLocation.lng.toFixed(6)}
                </div>
            </div>
        `;

        const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoWindowContent
        });

        infoWindow.open(map, marker);
        setCurrentMarker(marker);
    };

    // 반경 변경 처리
    const handleRadiusChange = (radius: number) => {
        setSearchRadius(radius);
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
        setError,
        loading,
        locationLoading,
        currentLocation,
        searchRadius,
        handleSearch,
        handleKeyUp,
        moveToLocation,
        setSelectedPlace,
        showWebView,
        webViewUrl,
        openWebView,
        closeWebView,
        getCurrentLocation,
        searchNearbyPlaces,
        searchNearbyPlacesByMapCenter,
        handleMapDragEnd,
        moveToCurrentLocation,
        handleRadiusChange
    }
}