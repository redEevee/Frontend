import {useEffect, useState} from "react";
import {FaSearch, FaMapMarkerAlt} from "react-icons/fa";
import {useMaps} from "../hooks/useMaps.ts";

function PetWalk() {
    const {
        map,
        searchKeyword,
        setSearchKeyword,
        searchResults,
        selectedPlace,
        error,
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
        moveToCurrentLocation,
        handleRadiusChange
    } = useMaps();

    const [selectedCategory, setSelectedCategory] = useState("동물병원");
    const [searchMode, setSearchMode] = useState<'current' | 'mapCenter'>('current');
    const [initialSearchDone, setInitialSearchDone] = useState(false);

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
    }, [currentLocation, initialSearchDone]);

    const categories = [
        {id: "동물병원", label: "동물병원", emoji: "🏥"},
        {id: "펫샵", label: "펫샵", emoji: "🛍️"},
        {id: "애견미용", label: "애견미용", emoji: "✂️"},
        {id: "애견공원", label: "애견공원", emoji: "🌳"},
        {id: "애견카페", label: "애견카페", emoji: "☕"},
        {id: "애견호텔", label: "애견호텔", emoji: "🏨"},
    ];

    // 카테고리 검색
    const handleCategorySearch = async (category: string) => {
        setSelectedCategory(category);

        if (searchMode === 'current') {
            if (currentLocation) {
                await searchNearbyPlaces(category);
            } else {
                // 위치가 없으면 위치 확인 먼저
                getCurrentLocation();
            }
        } else {
            // 지도 중심 기준 검색
            await searchNearbyPlacesByMapCenter(category);
        }
    };

    // 검색 버튼 클릭
    const handleSearchClick = () => {
        if (searchKeyword.trim()) {
            // 키워드 검색
            handleKeyUp({key: 'Enter'} as React.KeyboardEvent);
        } else if (selectedCategory) {
            // 카테고리 재검색
            handleCategorySearch(selectedCategory);
        }
    };

    // 반경 변경 시 자동 재검색
    const handleRadiusChangeWithSearch = (radius: number) => {
        handleRadiusChange(radius);
        if (selectedCategory) {
            setTimeout(() => {
                if (searchMode === 'current' && currentLocation) {
                    searchNearbyPlaces(selectedCategory);
                } else if (searchMode === 'mapCenter') {
                    searchNearbyPlacesByMapCenter(selectedCategory);
                }
            }, 300);
        }
    };

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

    // 지도 확대/축소
    const zoomIn = () => {
        if (map.instance) {
            const currentLevel = map.instance.getLevel();
            if (currentLevel > 1) {
                map.instance.setLevel(currentLevel - 1);
            }
        }
    };

    const zoomOut = () => {
        if (map.instance) {
            const currentLevel = map.instance.getLevel();
            if (currentLevel < 14) {
                map.instance.setLevel(currentLevel + 1);
            }
        }
    };

    return (
        <div className="pt-16 h-screen bg-violet-500">
            <div className="h-full flex">
                {/* 왼쪽 사이드바 */}
                <div className="w-96 bg-white shadow-xl flex flex-col max-h-screen overflow-hidden">
                    {/* 헤더 - 고정 */}
                    <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-violet-500 to-purple-600">
                        <h1 className="text-lg font-bold text-white mb-3">🐾 펫 플레이스 찾기</h1>

                        {/* 검색창 */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="장소명, 주소 검색..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyUp={handleKeyUp}
                                className="w-full bg-white rounded-full px-4 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-sm border"
                            />

                            {searchKeyword.trim() && (
                                <button
                                    onClick={() => setSearchKeyword('')}
                                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </button>
                            )}

                            <button
                                onClick={handleSearchClick}
                                disabled={loading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-violet-500 hover:text-violet-600 disabled:text-gray-300"
                            >
                                {loading ? (
                                    <div
                                        className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <FaSearch className="w-4 h-4"/>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 검색 설정 */}
                    <div className="p-6 border-b border-gray-200">
                        {/* 검색 모드 */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">검색 기준</h3>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setSearchMode('current')}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                        searchMode === 'current'
                                            ? 'bg-white text-violet-700 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    📍 내 위치 기준
                                </button>
                                <button
                                    onClick={() => setSearchMode('mapCenter')}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                        searchMode === 'mapCenter'
                                            ? 'bg-white text-violet-700 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    🗺️ 지도 중심
                                </button>
                            </div>
                        </div>

                        {/* 위치 버튼들 */}
                        <div className="flex gap-2 mb-6">
                            {!currentLocation && searchMode === 'current' && (
                                <button
                                    onClick={getCurrentLocation}
                                    disabled={locationLoading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-violet-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {locationLoading ? (
                                        <div
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <FaMapMarkerAlt className="w-4 h-4"/>
                                    )}
                                    {locationLoading ? '위치 확인 중...' : '내 위치 찾기'}
                                </button>
                            )}

                            {searchMode === 'mapCenter' && currentLocation && (
                                <button
                                    onClick={moveToCurrentLocation}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-600"
                                >
                                    <FaMapMarkerAlt className="w-4 h-4"/>
                                    내 위치로 이동
                                </button>
                            )}
                        </div>

                        {/* 검색 반경 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-700">검색 반경</h3>
                                <span className="text-sm font-medium text-violet-600">
                                    {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="500"
                                max="5000"
                                step="500"
                                value={searchRadius}
                                onChange={(e) => handleRadiusChangeWithSearch(Number(e.target.value))}
                                className="w-full accent-violet-500"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>500m</span>
                                <span>5km</span>
                            </div>
                        </div>
                    </div>

                    {/* 카테고리 */}
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">카테고리</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategorySearch(category.id)}
                                    disabled={(searchMode === 'current' && !currentLocation) || loading}
                                    className={`p-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2 ${
                                        selectedCategory === category.id
                                            ? "bg-violet-100 text-violet-700 border-2 border-violet-300"
                                            : "bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="text-xl">{category.emoji}</span>
                                    <span className="text-xs">{category.label}</span>
                                    {loading && selectedCategory === category.id && (
                                        <div
                                            className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 검색 결과 */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-700">검색 결과</h3>
                                {searchResults && searchResults.documents && (
                                    <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                                        {searchResults.documents.length}개
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {/* 로딩 상태 */}
                            {loading && (
                                <div className="p-6 text-center">
                                    <div
                                        className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent mx-auto mb-3"></div>
                                    <p className="text-sm text-gray-500">검색 중...</p>
                                </div>
                            )}

                            {/* 에러 상태 */}
                            {error && (
                                <div className="p-6">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* 검색 결과 목록 */}
                            {searchResults && searchResults.documents && searchResults.documents.length > 0 ? (
                                <div className="p-4 space-y-3">
                                    {searchResults.documents.map((place: any, index: number) => {
                                        const distance = currentLocation && searchMode === 'current'
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
                                                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 cursor-pointer transition-colors border hover:border-violet-200"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-900 flex-1">{place.place_name}</h4>
                                                    {distance !== null && (
                                                        <span
                                                            className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                                            {formatDistance(distance)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 mb-1">{place.address_name}</p>
                                                {place.phone && (
                                                    <p className="text-xs text-gray-500">{place.phone}</p>
                                                )}
                                                {place.category_name && (
                                                    <p className="text-xs text-violet-600 mt-2">
                                                        {place.category_name.split(' > ').pop()}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : !loading && !error && (
                                <div className="p-6 text-center text-gray-500">
                                    {searchMode === 'current' && !currentLocation ? (
                                        <div>
                                            <div className="text-4xl mb-4">📍</div>
                                            <h4 className="font-semibold mb-2">위치 정보가 필요해요</h4>
                                            <p className="text-xs mb-4">현재 위치 기준으로 검색하려면<br/>위치 권한을 허용해주세요</p>
                                            <button
                                                onClick={getCurrentLocation}
                                                className="bg-violet-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-600"
                                            >
                                                위치 권한 허용하기
                                            </button>
                                        </div>
                                    ) : searchKeyword.trim() ? (
                                        <div>
                                            <div className="text-4xl mb-4">🔍</div>
                                            <h4 className="font-semibold mb-2">검색 결과가 없어요</h4>
                                            <p className="text-xs">'{searchKeyword}' 검색 결과를 찾을 수 없습니다.<br/>다른 키워드로
                                                시도해보세요.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="text-4xl mb-4">🐾</div>
                                            <h4 className="font-semibold mb-2">검색 결과가 없어요</h4>
                                            <p className="text-xs mb-4">{searchMode === 'current' ? '근처' : '이 지역'}에
                                                '{selectedCategory}'가 없습니다.<br/>검색 반경을 늘려보세요.</p>
                                            {searchRadius < 5000 && (
                                                <button
                                                    onClick={() => handleRadiusChangeWithSearch(Math.min(searchRadius + 1000, 5000))}
                                                    className="bg-violet-100 text-violet-700 px-3 py-2 rounded-lg text-sm hover:bg-violet-200"
                                                >
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
                <div className="flex-1 relative">
                    <div id="map" className="w-full h-full"></div>

                    {/* 지도 컨트롤 */}
                    <div
                        className="absolute top-4 right-4 flex flex-col bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                        <button
                            onClick={zoomIn}
                            className="p-3 hover:bg-gray-50 border-b border-gray-200 transition-colors"
                            aria-label="확대"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                        </button>
                        <button
                            onClick={zoomOut}
                            className="p-3 hover:bg-gray-50 transition-colors"
                            aria-label="축소"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6"/>
                            </svg>
                        </button>
                    </div>

                    {/* 선택된 장소 정보 */}
                    {selectedPlace && (
                        <div
                            className="absolute top-4 left-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-gray-900 text-lg flex-1 pr-3">{selectedPlace.place_name}</h3>
                                <button
                                    onClick={() => setSelectedPlace(null)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </button>
                            </div>

                            {selectedPlace.category_name && (
                                <div className="mb-3">
                                    <span
                                        className="inline-block px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                                        {selectedPlace.category_name.split(' > ').pop()}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-2 text-sm">
                                <p className="text-gray-600 flex items-start gap-2">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    {selectedPlace.address_name}
                                </p>
                                {selectedPlace.phone && (
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor"
                                             viewBox="0 0 20 20">
                                            <path
                                                d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                        </svg>
                                        {selectedPlace.phone}
                                    </p>
                                )}

                                {selectedPlace.place_url && (
                                    <button
                                        onClick={() => openWebView(selectedPlace.place_url)}
                                        className="w-full mt-4 bg-violet-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors"
                                    >
                                        카카오맵에서 자세히 보기
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* WebView 모달 */}
            {showWebView && webViewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">카카오맵</h3>
                            <button
                                onClick={closeWebView}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1">
                            <iframe
                                src={webViewUrl}
                                className="w-full h-full border-0 rounded-b-xl"
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

export default PetWalk;