export interface KakaoMapsOptions {
    center: kakao.mpas.LatLng;
    level: number;
}

declare global {
    namespace kakao {
        namespace maps {
            class Map {
                constructor(element: HTMLElement, options: KakaoMapsOptions);

                setCenter(latlng: LatLng): void;

                setLevel(level: number): void;
            }

            class LatLng {
                constructor(lat: number, lng: number);

                lat(): number;

                lng(): number;
            }
        }
    }
}

export {};