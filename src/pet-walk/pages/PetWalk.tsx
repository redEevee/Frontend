import {useEffect} from "react";
import {useMaps} from "../hooks/useMaps.ts";

function PetWalk() {
    const {
        map,
        handleKeyUp
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
    return (
        <div className="pt-16 min-h-screen bg-violet-500">
            <section
                className="min-h-screen relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white w-full">
                <div className="flex h-screen">
                    <div className="w-1/4 bg-white text-black p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4">장소 검색</h2>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="검색할 장소를 입력하세요"
                                    onKeyUp={handleKeyUp}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                    🔍
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold mb-3">검색 결과</h3>
                            <div className="space-y-2">
                                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <h4 className="font-medium">장소 예시 1</h4>
                                    <p className="text-sm text-gray-600">주소 정보</p>
                                </div>
                                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <h4 className="font-medium">장소 예시 2</h4>
                                    <p className="text-sm text-gray-600">주소 정보</p>
                                </div>
                                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <h4 className="font-medium">장소 예시 3</h4>
                                    <p className="text-sm text-gray-600">주소 정보</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div
                            id="map"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PetWalk;