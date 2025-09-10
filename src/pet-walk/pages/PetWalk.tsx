import {useEffect} from "react";
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
        handleKeyUp,
        moveToLocation,
        setSelectedPlace,
        showWebView,
        webViewUrl,
        openWebView,
        closeWebView
    } = useMaps();

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
    
    // 디버깅용 로그
    console.log('PetWalk 렌더링 - showWebView:', showWebView, 'webViewUrl:', webViewUrl);
    
    return (
        <div className="pt-16 min-h-screen bg-violet-500">
            <section
                className="min-h-screen relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white w-full">
                <div className="flex h-screen">
                    {/* 검색 사이드바 */}
                    <div className="w-96 bg-white shadow-xl border-r border-gray-200 flex flex-col">
                        {/* 헤더 */}
                        <div className="p-6 border-b border-gray-100">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">장소 검색</h1>
                            <p className="text-sm text-gray-500">원하는 장소를 검색해보세요</p>
                        </div>

                        {/* 검색 입력 */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    placeholder="카페, 병원, 공원 등을 검색해보세요"
                                    onKeyUp={handleKeyUp}
                                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                {searchKeyword && (
                                    <button
                                        onClick={() => setSearchKeyword('')}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    >
                                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 검색 결과 */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            {/* 로딩 상태 */}
                            {loading && (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <div
                                            className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-50 rounded-full">
                                            <div
                                                className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                                        </div>
                                        <p className="text-gray-600 font-medium">검색 중...</p>
                                        <p className="text-sm text-gray-400 mt-1">잠시만 기다려주세요</p>
                                    </div>
                                </div>
                            )}

                            {/* 에러 상태 */}
                            {error && (
                                <div className="p-6">
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                        <div
                                            className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        </div>
                                        <p className="text-red-700 font-medium">{error}</p>
                                        <p className="text-red-500 text-sm mt-1">다시 시도해보세요</p>
                                    </div>
                                </div>
                            )}

                            {/* 검색 결과 */}
                            {searchResults && !loading && !error && (
                                <div className="flex-1 overflow-y-auto">
                                    {searchResults.documents && searchResults.documents.length > 0 ? (
                                        <>
                                            <div className="p-6 pb-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    검색결과 <span
                                                    className="text-blue-600">{searchResults.documents.length}</span>개
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    전체 {searchResults.meta.total_count.toLocaleString()}개 중
                                                </p>
                                            </div>
                                            <div className="px-6 space-y-3">
                                                {searchResults.documents.map((place: any, index: number) => (
                                                    <div
                                                        key={place.id || index}
                                                        onClick={() => moveToLocation(
                                                            parseFloat(place.y),
                                                            parseFloat(place.x),
                                                            place
                                                        )}
                                                        className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{place.place_name}</h4>
                                                                {place.category_name && (
                                                                    <span
                                                                        className="inline-block mt-2 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                                    {place.category_name.split(' > ').pop()}
                                                                </span>
                                                                )}
                                                            </div>
                                                            <svg
                                                                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors mt-1"
                                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      strokeWidth={2}
                                                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      strokeWidth={2}
                                                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                            </svg>
                                                        </div>

                                                        <div className="mt-3 space-y-1">
                                                            <p className="text-sm text-gray-600 flex items-center">
                                                                <svg className="w-4 h-4 mr-1.5 text-gray-400"
                                                                     fill="none" stroke="currentColor"
                                                                     viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          strokeWidth={2}
                                                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          strokeWidth={2}
                                                                          d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"/>
                                                                </svg>
                                                                {place.address_name}
                                                            </p>
                                                            {place.road_address_name && (
                                                                <p className="text-sm text-gray-500 ml-5.5">{place.road_address_name}</p>
                                                            )}
                                                            {place.phone && (
                                                                <p className="text-sm text-gray-500 flex items-center mt-2">
                                                                    <svg className="w-4 h-4 mr-1.5 text-gray-400"
                                                                         fill="none" stroke="currentColor"
                                                                         viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round"
                                                                              strokeLinejoin="round" strokeWidth={2}
                                                                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                                                    </svg>
                                                                    {place.phone}
                                                                </p>
                                                            )}
                                                            
                                                            {/* 상세보기 버튼 */}
                                                            {place.place_url && (
                                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // 카드 클릭 이벤트 방지
                                                                            openWebView(place.place_url);
                                                                        }}
                                                                        className="w-full px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                        <span>카카오맵에서 보기</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="text-center">
                                                <div
                                                    className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none"
                                                         stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
                                                <p className="text-sm text-gray-400 mt-1">다른 키워드로 검색해보세요</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 초기 상태 */}
                            {!searchResults && !loading && !error && (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center px-8">
                                        <div
                                            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">장소를 검색해보세요</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            카페, 병원, 공원 등<br/>
                                            원하는 장소를 입력하고 Enter를 눌러보세요
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 지도 영역 */}
                    <div className="flex-1 relative">
                        <div
                            id="map"
                            className="w-full h-full"
                        />
                        
                        {/* 선택된 장소 정보 오버레이 */}
                        {selectedPlace && (
                            <div className="absolute top-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 max-w-md">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPlace.place_name}</h3>
                                        {selectedPlace.category_name && (
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                                {selectedPlace.category_name.split(' > ').pop()}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setSelectedPlace(null)}
                                        className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium">{selectedPlace.address_name}</p>
                                            {selectedPlace.road_address_name && (
                                                <p className="text-sm text-gray-500 mt-1">{selectedPlace.road_address_name}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {selectedPlace.phone && (
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span>{selectedPlace.phone}</span>
                                        </div>
                                    )}
                                    
                                    {selectedPlace.place_url && (
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            <button 
                                                onClick={() => openWebView(selectedPlace.place_url)}
                                                className="text-blue-600 hover:text-blue-800 font-medium underline"
                                            >
                                                카카오맵에서 보기
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PetWalk;