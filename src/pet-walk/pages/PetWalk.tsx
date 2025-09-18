import {useEffect, useState, useCallback, useMemo, useRef} from "react";
import {FaSearch, FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaTimes, FaBars} from "react-icons/fa";
import {useMaps} from "../hooks/useMaps.ts";

function PetWalk() {
    const {
        map,
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
    } = useMaps();

    const [selectedCategory, setSelectedCategory] = useState("동물병원");
    const [searchMode, setSearchMode] = useState<'gps' | 'mapCenter'>('gps');
    const [initialSearchDone, setInitialSearchDone] = useState(false);
    const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true);
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 디바운싱을 위한 ref
    const radiusSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const categories = useMemo(() => [
        {id: "동물병원", label: "동물병원", emoji: "🏥"},
        {id: "펫샵", label: "펫샵", emoji: "🛍️"},
        {id: "애견미용", label: "애견미용", emoji: "✂️"},
        {id: "애견공원", label: "애견공원", emoji: "🌳"},
        {id: "애견카페", label: "애견카페", emoji: "☕"},
        {id: "애견호텔", label: "애견호텔", emoji: "🏨"}
    ], []);

    // 카테고리 검색 (메모이제이션)
    const handleCategorySearch = useCallback(async (category: string) => {
        // 검색 중이면 무시
        if (loading) return;

        setSelectedCategory(category);
        setSelectedPlace(null); // 이전 선택된 장소 정보 초기화

        switch (searchMode) {
            case 'gps':
                if (currentLocation) {
                    await searchNearbyPlaces(category);
                } else {
                    getCurrentLocation();
                }
                break;
            case 'mapCenter':
                await searchNearbyPlacesByMapCenter(category);
                break;
        }
    }, [loading, searchMode, currentLocation, searchNearbyPlaces, searchNearbyPlacesByMapCenter, getCurrentLocation, setError]);

    // 지도 초기화
    useEffect(() => {
        if (window.kakao?.maps && !map.instance) {
            const mapContainer = document.getElementById('map')!;
            const mapInstance = new window.kakao.maps.Map(mapContainer, {
                center: new window.kakao.maps.LatLng(37.5666805, 126.9784147),
                level: 4,
            });
            map.setMap(mapInstance);
        }
    }, [map]);

    // 현재 위치 가져온 후 자동 검색
    useEffect(() => {
        if (currentLocation && !initialSearchDone) {
            handleCategorySearch(selectedCategory);
            setInitialSearchDone(true);
        }
    }, [currentLocation, initialSearchDone, handleCategorySearch, selectedCategory]);

    // cleanup 함수
    useEffect(() => {
        return () => {
            if (radiusSearchTimeoutRef.current) {
                clearTimeout(radiusSearchTimeoutRef.current);
            }
        };
    }, []);

    // 검색 버튼 클릭 (메모이제이션)
    const handleSearchClick = useCallback(() => {
        if (searchKeyword.trim()) {
            // 키워드 검색
            handleKeyUp({key: 'Enter'} as React.KeyboardEvent);
        } else if (selectedCategory) {
            // 카테고리 재검색
            handleCategorySearch(selectedCategory);
        }
    }, [searchKeyword, selectedCategory, handleKeyUp, handleCategorySearch]);

    // 검색 모드 변경 핸들러 (메모이제이션)
    const handleSearchModeChange = useCallback((newMode: 'gps' | 'mapCenter') => {
        if (newMode === searchMode) return; // 같은 모드면 무시

        setSearchMode(newMode);
        setSelectedPlace(null); // 선택된 장소 초기화

        // 새로운 모드에서 검색 가능하면 자동 재검색
        if (selectedCategory) {
            setTimeout(() => {
                switch (newMode) {
                    case 'gps':
                        if (currentLocation) {
                            searchNearbyPlaces(selectedCategory);
                        }
                        // GPS 모드인데 위치가 없으면 사용자가 수동으로 위치 찾기 버튼 클릭해야 함
                        break;
                    case 'mapCenter':
                        searchNearbyPlacesByMapCenter(selectedCategory);
                        break;
                }
            }, 100);
        }
    }, [searchMode, selectedCategory, currentLocation, searchNearbyPlaces, searchNearbyPlacesByMapCenter]);


    // 반경 변경 시 자동 재검색 (디바운싱 강화)
    const handleRadiusChangeWithSearch = useCallback((radius: number) => {
        handleRadiusChange(radius);

        if (radiusSearchTimeoutRef.current) {
            clearTimeout(radiusSearchTimeoutRef.current);
        }

        if (selectedCategory && !loading) {
            radiusSearchTimeoutRef.current = setTimeout(() => {
                handleCategorySearch(selectedCategory);
            }, 600);
        }
    }, [selectedCategory, loading, handleRadiusChange, handleCategorySearch]);

    // 거리 계산 함수
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // 거리 포맷팅
    const formatDistance = (distance: number): string => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)}m`;
        } else {
            return `${distance.toFixed(1)}km`;
        }
    };

    // 지도 확대/축소 (메모이제이션)
    const zoomIn = useCallback(() => {
        if (map.instance) {
            const currentLevel = map.instance.getLevel();
            if (currentLevel > 1) {
                map.instance.setLevel(currentLevel - 1);
            }
        }
    }, [map.instance]);

    const zoomOut = useCallback(() => {
        if (map.instance) {
            const currentLevel = map.instance.getLevel();
            if (currentLevel < 14) {
                map.instance.setLevel(currentLevel + 1);
            }
        }
    }, [map.instance]);

    return (
        <div className="h-screen pt-16 bg-gray-50 relative overflow-hidden">
            {/* 모바일 햄버거 메뉴 */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-20 left-4 z-30 lg:hidden bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
                {isSidebarOpen ? <FaTimes className="w-5 h-5 text-gray-600" /> : <FaBars className="w-5 h-5 text-gray-600" />}
            </button>

            <div className="h-full flex relative">
                {/* 왼쪽 사이드바 */}
                <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    fixed lg:relative z-20 w-80 lg:w-96 bg-white shadow-2xl
                    flex flex-col h-full transition-transform duration-300 ease-in-out`}>
                    {/* 헤더 - 고정 */}
                    <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-xl font-bold text-gray-800">🐾 펫 플레이스</h1>
                                <div className="lg:hidden">
                                    <button
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <FaTimes className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* 검색창 */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="장소명, 주소 검색..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyUp={handleKeyUp}
                                    className="w-full bg-gray-50 rounded-xl px-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white border border-gray-200 transition-all"
                                />

                                {searchKeyword.trim() && (
                                    <button
                                        onClick={() => setSearchKeyword('')}
                                        className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    onClick={handleSearchClick}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-600 disabled:text-gray-300 transition-colors"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <FaSearch className="w-4 h-4"/>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 카테고리 - 항상 보이게 */}
                        <div className="px-4 pb-4">
                            <div className="grid grid-cols-3 gap-3">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategorySearch(category.id)}
                                        disabled={(searchMode === 'gps' && !currentLocation) || loading}
                                        className={`p-3 md:p-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2 md:gap-1 min-h-[72px] md:min-h-[64px] touch-manipulation ${
                                            selectedCategory === category.id
                                                ? "bg-indigo-500 text-white shadow-lg scale-105"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                                        }`}
                                    >
                                        <span className="text-xl md:text-lg">{category.emoji}</span>
                                        <span className="text-xs leading-tight text-center">{category.label}</span>
                                        {loading && selectedCategory === category.id && (
                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 검색 설정 토글 */}
                        <button
                            onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
                            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm font-medium text-gray-700 border-t border-gray-200"
                        >
                            <span>검색 설정</span>
                            {isSettingsPanelOpen ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* 검색 설정 패널 - 접을 수 있는 */}
                    {isSettingsPanelOpen && (
                        <div className="border-b border-gray-200 bg-gray-50">
                            <div className="p-4 space-y-5">
                                {/* 검색 모드 */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">검색 방식</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleSearchModeChange('gps')}
                                            className={`w-full p-3 rounded-xl text-left transition-all ${
                                                searchMode === 'gps'
                                                    ? 'bg-indigo-500 text-white shadow-lg'
                                                    : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    searchMode === 'gps'
                                                        ? 'bg-white/20'
                                                        : 'bg-indigo-100'
                                                }`}>
                                                    📍
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">GPS 위치 기준</div>
                                                    <div className="text-xs opacity-75">현재 GPS 좌표에서 정확한 거리순</div>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => handleSearchModeChange('mapCenter')}
                                            className={`w-full p-3 rounded-xl text-left transition-all ${
                                                searchMode === 'mapCenter'
                                                    ? 'bg-indigo-500 text-white shadow-lg'
                                                    : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    searchMode === 'mapCenter'
                                                        ? 'bg-white/20'
                                                        : 'bg-indigo-100'
                                                }`}>
                                                    🗺️
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">지도 화면 중심</div>
                                                    <div className="text-xs opacity-75">현재 보고 있는 지역 기준</div>
                                                </div>
                                            </div>
                                        </button>

                                    </div>
                                </div>


                                {/* 위치 관련 버튼들 */}
                                <div className="flex gap-2">
                                    {!currentLocation && searchMode === 'gps' && (
                                        <button
                                            onClick={getCurrentLocation}
                                            disabled={locationLoading}
                                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white py-2.5 px-3 rounded-lg text-xs font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {locationLoading ? (
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <FaMapMarkerAlt className="w-3 h-3"/>
                                            )}
                                            {locationLoading ? '위치 확인 중...' : '내 위치 찾기'}
                                        </button>
                                    )}

                                    {currentLocation && searchMode !== 'gps' && (
                                        <button
                                            onClick={moveToCurrentLocation}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white py-2.5 px-3 rounded-lg text-xs font-medium hover:bg-gray-600 transition-colors"
                                        >
                                            <FaMapMarkerAlt className="w-3 h-3"/>
                                            내 위치로 이동
                                        </button>
                                    )}
                                </div>

                                {/* 검색 반경 */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-gray-700">검색 반경</h3>
                                        <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                                            {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min="500"
                                            max="5000"
                                            step="500"
                                            value={searchRadius}
                                            onChange={(e) => handleRadiusChangeWithSearch(Number(e.target.value))}
                                            className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider shadow-inner"
                                            style={{
                                                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((searchRadius - 500) / (5000 - 500)) * 100}%, #e5e7eb ${((searchRadius - 500) / (5000 - 500)) * 100}%, #e5e7eb 100%)`
                                            }}
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                                            <span className="bg-gray-100 px-2 py-1 rounded-full">500m</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded-full">5km</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 검색 결과 */}
                    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                        <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-700">검색 결과</h3>
                                {searchResults && searchResults.documents && (
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                                        {searchResults.documents.length}개
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-gray-50">
                            {/* 로딩 상태 */}
                            {loading && (
                                <div className="p-8 text-center">
                                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-3 border-indigo-200 border-t-indigo-500"></div>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-lg mb-2">검색 중...</h4>
                                        <p className="text-sm text-gray-600">잠시만 기다려주세요</p>
                                    </div>
                                </div>
                            )}

                            {/* 에러 상태 */}
                            {error && (
                                <div className="p-8 text-center">
                                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <div className="text-3xl">⚠️</div>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-lg mb-3">오류가 발생했어요</h4>
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                            <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 검색 결과 목록 */}
                            {searchResults && searchResults.documents && searchResults.documents.length > 0 ? (
                                <div className="p-4 space-y-3">
                                    {searchResults.documents.map((place: any, index: number) => {
                                        const distance = currentLocation && searchMode === 'gps'
                                            ? calculateDistance(
                                                currentLocation.lat,
                                                currentLocation.lng,
                                                parseFloat(place.y),
                                                parseFloat(place.x)
                                            )
                                            : null;

                                        return (
                                            <div
                                                key={place.id || index}
                                                onClick={() => moveToLocation(
                                                    parseFloat(place.y),
                                                    parseFloat(place.x),
                                                    place
                                                )}
                                                className="group bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white rounded-2xl p-5 md:p-4 cursor-pointer transition-all duration-300 border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] animate-fade-in touch-manipulation"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-indigo-800 transition-colors">{place.place_name}</h4>
                                                        {place.category_name && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="inline-block px-2 py-1 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                                                                    {place.category_name.split(' > ').pop()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {distance !== null && (
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="text-xs bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm">
                                                                {formatDistance(distance)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-2">
                                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                                        </svg>
                                                        <p className="text-sm text-gray-600 leading-relaxed">{place.address_name}</p>
                                                    </div>

                                                    {place.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                                            </svg>
                                                            <p className="text-sm text-gray-500">{place.phone}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                    <span className="text-xs text-gray-400 font-medium">지도에서 보기</span>
                                                    <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : !loading && !error && (
                                <div className="p-8 text-center">
                                    {searchMode === 'gps' && !currentLocation ? (
                                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <div className="text-3xl">📍</div>
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-3">위치 정보가 필요해요</h4>
                                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">현재 위치 기준으로 검색하려면<br/>위치 권한을 허용해주세요</p>
                                            <button
                                                onClick={getCurrentLocation}
                                                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 mx-auto"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                위치 권한 허용하기
                                            </button>
                                        </div>
                                    ) : searchKeyword.trim() ? (
                                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <div className="text-3xl">🔍</div>
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-3">검색 결과가 없어요</h4>
                                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    '<span className="font-medium text-indigo-600">{searchKeyword}</span>' 검색 결과를 찾을 수 없습니다.
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">다른 키워드로 시도해보세요</p>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <div className="text-3xl">🐾</div>
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-3">검색 결과가 없어요</h4>
                                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                                    {searchMode === 'gps' ? 'GPS 근처' : '이 지역'}에
                                                    '<span className="font-medium text-indigo-600">{selectedCategory}</span>'가 없습니다.
                                                </p>
                                                <p className="text-xs text-gray-500">검색 반경을 늘려보세요</p>
                                            </div>
                                            {searchRadius < 5000 && (
                                                <button
                                                    onClick={() => handleRadiusChangeWithSearch(Math.min(searchRadius + 1000, 5000))}
                                                    className="bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-200 hover:to-indigo-100 transition-all border border-indigo-200 hover:border-indigo-300 flex items-center justify-center gap-2 mx-auto"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                    반경 1km 늘리기
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 오른쪽 지도 영역 */}
                <div className="flex-1 relative bg-white">
                    <div id="map" className="w-full h-full rounded-l-xl lg:rounded-l-none"></div>

                    {/* 지도 컨트롤 */}
                    <div className="absolute top-4 right-4 flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <button
                            onClick={zoomIn}
                            className="p-5 md:p-4 hover:bg-indigo-50 border-b border-gray-200 transition-all hover:text-indigo-600 group active:scale-95 touch-manipulation"
                            aria-label="확대"
                        >
                            <svg className="w-6 h-6 md:w-5 md:h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                        </button>
                        <button
                            onClick={zoomOut}
                            className="p-5 md:p-4 hover:bg-indigo-50 transition-all hover:text-indigo-600 group active:scale-95 touch-manipulation"
                            aria-label="축소"
                        >
                            <svg className="w-6 h-6 md:w-5 md:h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6"/>
                            </svg>
                        </button>
                    </div>

                    {/* 선택된 장소 정보 */}
                    {selectedPlace && (
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-sm animate-fade-in">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-xl mb-2 leading-tight">{selectedPlace.place_name}</h3>
                                    {selectedPlace.category_name && (
                                        <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-200">
                                            {selectedPlace.category_name.split(' > ').pop()}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedPlace(null)}
                                    className="p-3 md:p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110 active:scale-95 ml-3 touch-manipulation"
                                >
                                    <FaTimes className="w-5 h-5 md:w-4 md:h-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700 mb-1">주소</p>
                                            <p className="text-sm text-gray-600 leading-relaxed">{selectedPlace.address_name}</p>
                                        </div>
                                    </div>

                                    {selectedPlace.phone && (
                                        <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700 mb-1">전화번호</p>
                                                <p className="text-sm text-gray-600">{selectedPlace.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {selectedPlace.place_url && (
                                    <button
                                        onClick={() => openWebView(selectedPlace.place_url)}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        카카오맵에서 자세히 보기
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 사이드바 마스크 (모바일용) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* WebView 모달 */}
            {showWebView && webViewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">카카오맵</h3>
                            <button
                                onClick={closeWebView}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FaTimes className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <iframe
                                src={webViewUrl}
                                className="w-full h-full border-0 rounded-b-2xl"
                                title="카카오맵"
                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// CSS 스타일 추가
const globalStyles = `
.slider {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.slider::-webkit-slider-track {
  height: 12px;
  border-radius: 6px;
  background: transparent;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  height: 24px;
  width: 24px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4), 0 2px 4px rgba(0,0,0,0.1);
  border: 3px solid white;
  transition: all 0.2s ease;
  position: relative;
  top: -6px;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5), 0 4px 8px rgba(0,0,0,0.15);
}

.slider::-webkit-slider-thumb:active {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.6), 0 4px 12px rgba(0,0,0,0.2);
}

.slider::-moz-range-track {
  height: 12px;
  border-radius: 6px;
  background: transparent;
  border: none;
}

.slider::-moz-range-thumb {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  height: 24px;
  width: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4), 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5), 0 4px 8px rgba(0,0,0,0.15);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

// 전역 스타일 주입
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

export default PetWalk;