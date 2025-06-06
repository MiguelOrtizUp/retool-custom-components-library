import { useCallback, useState, useRef, useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import MarkerRenderer from './MarkerRenderer';
import ProximityCircle from './ProximityCircle';
import useTypeColorMap from './useTypeColorMap';
import { computeNearbyPois } from './utils';
import type { Item } from '../types/poi';


const ItemMarkers = ({
  items,
  onSelect,
  onProximityChange,
  radius,
  onActivatePoi,
  onTypeColorMapUpdate,
  selectedMarkerId,
}: {
  items: Item[];
  onSelect: (item: Item) => void;
  onProximityChange: (nearby: Item[]) => void;
  radius: number;
  onActivatePoi: (item: Item) => void;
  onTypeColorMapUpdate: (colorMap: Record<string, string>) => void;
  selectedMarkerId?: string;
}) => {
  const map = useMap();
  const [circleCenter, setCircleCenter] = useState<google.maps.LatLng | null>(null);

  const { getColorForType, colorMap } = useTypeColorMap(items, onTypeColorMapUpdate);

  // --- Clustering state ---
  const markersRef = useRef<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Set marker ref for clustering
  const setMarkerRef = useCallback((marker: google.maps.marker.AdvancedMarkerElement | null, key: string) => {
    if (marker) {
      markersRef.current[key] = marker;
    } else {
      delete markersRef.current[key];
    }
  }, []);

  // The handleClick function
  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, item: Item) => {
      if (!map || !ev.latLng) return;
      const center = ev.latLng;
      map.panTo(center);
      setCircleCenter(center);
      onSelect?.({ ...item });
      onActivatePoi?.(item);

      // Use the full items array here
      const nearby = computeNearbyPois(center, items, radius);
      onProximityChange?.(nearby);
    },
    [map, onSelect, items, onProximityChange, radius, onActivatePoi]
  );

  // Only trigger handleClick for selectedMarkerId on initial mount
  const didRunInitialSelect = useRef(false);
  useEffect(() => {
    if (
      !didRunInitialSelect.current &&
      selectedMarkerId &&
      map
    ) {
      const item = items.find(i => i.key === selectedMarkerId);
      if (item) {
        const latLng = new google.maps.LatLng(item.location.lat, item.location.lng);
        const fakeEvent = { latLng } as google.maps.MapMouseEvent;
        handleClick(fakeEvent, item);
        didRunInitialSelect.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarkerId, map, items]);

  return (
    <>
      <ProximityCircle center={circleCenter} radius={radius} />
      <MarkerRenderer
        items={items}
        onClick={handleClick}
        getColorForType={getColorForType}
        setMarkerRef={setMarkerRef}
      />
    </>
  );
};

export default ItemMarkers;