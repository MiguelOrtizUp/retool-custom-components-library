import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export function useKmlLayer(
  url: string,
  onFeatureClick?: (event: google.maps.KmlMouseEvent) => void
) {
  const map = useMap();
  const kmlLayerRef = useRef<google.maps.KmlLayer | null>(null);

  useEffect(() => {
    if (!map || !url) return;

    const kmlLayer = new google.maps.KmlLayer({
      url,
      map,
      preserveViewport: true,
    });

    if (onFeatureClick) {
      kmlLayer.addListener('click', onFeatureClick);
    }

    kmlLayerRef.current = kmlLayer;

    return () => {
      if (kmlLayerRef.current) {
        kmlLayerRef.current.setMap(null);
        kmlLayerRef.current = null;
      }
    };
    // Only depend on map and url!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, url]);

  return kmlLayerRef.current;
}