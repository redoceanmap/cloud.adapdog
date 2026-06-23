export {};

declare global {
  interface Window {
    naver: typeof naver;
  }

  namespace naver {
    namespace maps {
      class Map {
        constructor(element: HTMLElement, options: MapOptions);
        setCenter(latlng: LatLng): void;
        panTo(latlng: LatLng): void;
        fitBounds(bounds: LatLngBounds, margin?: number): void;
        setOptions(options: Partial<MapOptions>): void;
      }

      class LatLng {
        constructor(lat: number, lng: number);
      }

      class LatLngBounds {
        constructor(sw: LatLng, ne: LatLng);
        extend(latlng: LatLng): LatLngBounds;
      }

      class Marker {
        constructor(options: MarkerOptions);
        setMap(map: Map | null): void;
      }

      class Polyline {
        constructor(options: PolylineOptions);
        setMap(map: Map | null): void;
      }

      interface MapOptions {
        center: LatLng;
        zoom: number;
        zoomControl?: boolean;
      }

      interface MarkerOptions {
        position: LatLng;
        map?: Map;
        icon?: {
          content: string;
          anchor?: Point;
        };
      }

      interface PolylineOptions {
        map?: Map;
        path: LatLng[];
        strokeColor?: string;
        strokeWeight?: number;
        strokeOpacity?: number;
        strokeStyle?: string;
      }

      class Point {
        constructor(x: number, y: number);
      }

      namespace Event {
        function addListener(
          target: Marker,
          eventName: string,
          listener: () => void,
        ): MapEventListener;
        function removeListener(listener: MapEventListener): void;
        function trigger(target: Map, eventName: string): void;
      }

      interface MapEventListener {
        // opaque handle returned by addListener
      }
    }
  }
}
