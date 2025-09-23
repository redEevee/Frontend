export interface KakaoMapsOptions {
    center: kakao.maps.LatLng;
    level: number;
}

declare global {
    interface Window {
        kakao: {
            maps: {
                Map: typeof Map;
                LatLng: typeof LatLng;
                Marker: typeof Marker;
                InfoWindow: typeof InfoWindow;
                event: {
                    addListener: (target: any, type: string, handler: (...args: any[]) => void) => void;
                };
            };
        };
    }

    namespace kakao {
        namespace maps {
            class Map {
                constructor(element: HTMLElement, options: KakaoMapsOptions);
                setCenter(latlng: LatLng): void;
                getCenter(): LatLng;
                setLevel(level: number): void;
                getLevel(): number;
                setBounds(bounds: LatLngBounds): void;
                getBounds(): LatLngBounds;
                panTo(latlng: LatLng): void;
                relayout(): void;
            }

            class LatLng {
                constructor(lat: number, lng: number);
                getLat(): number;
                getLng(): number;
                equals(latlng: LatLng): boolean;
                toString(): string;
            }

            class Marker {
                constructor(options: MarkerOptions);
                setMap(map: Map | null): void;
                getMap(): Map | null;
                setPosition(position: LatLng): void;
                getPosition(): LatLng;
                setTitle(title: string): void;
                getTitle(): string;
                setImage(image: MarkerImage): void;
                getImage(): MarkerImage;
                setZIndex(zIndex: number): void;
                getZIndex(): number;
                setVisible(visible: boolean): void;
                getVisible(): boolean;
                setClickable(clickable: boolean): void;
                getClickable(): boolean;
                setRange(range: number): void;
                getRange(): number;
                setOpacity(opacity: number): void;
                getOpacity(): number;
            }

            class InfoWindow {
                constructor(options?: InfoWindowOptions);
                open(map: Map, marker?: Marker): void;
                close(): void;
                getMap(): Map | null;
                setContent(content: string): void;
                getContent(): string;
                setPosition(position: LatLng): void;
                getPosition(): LatLng;
                setZIndex(zIndex: number): void;
                getZIndex(): number;
            }

            class LatLngBounds {
                constructor(sw?: LatLng, ne?: LatLng);
                extend(latlng: LatLng): void;
                getSouthWest(): LatLng;
                getNorthEast(): LatLng;
                isEmpty(): boolean;
                toString(): string;
            }

            class MarkerImage {
                constructor(src: string, size: Size, options?: MarkerImageOptions);
            }

            class Size {
                constructor(width: number, height: number);
            }

            interface MarkerOptions {
                position: LatLng;
                image?: MarkerImage;
                title?: string;
                draggable?: boolean;
                clickable?: boolean;
                zIndex?: number;
                opacity?: number;
                map?: Map;
            }

            interface InfoWindowOptions {
                content?: string;
                disableAutoPan?: boolean;
                map?: Map;
                position?: LatLng;
                removable?: boolean;
                zIndex?: number;
            }

            interface MarkerImageOptions {
                alt?: string;
                coords?: string;
                offset?: Point;
                shape?: string;
                spriteOrigin?: Point;
                spriteSize?: Size;
            }

            class Point {
                constructor(x: number, y: number);
            }
        }
    }
}

export {};