import React from 'react';
import type { Item } from '../types/poi';
import {
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';

type MarkerRendererProps = {
  items: Item[];
  onClick: (ev: google.maps.MapMouseEvent, item: Item) => void;
  getColorForType: (type?: string) => string;
  setMarkerRef: (marker: google.maps.marker.AdvancedMarkerElement | null, key: string) => void;
};


const MarkerRenderer: React.FC<MarkerRendererProps> = ({
  items,
  onClick,
  getColorForType,
  setMarkerRef,
}) => {
  return (
    <>
      {items.map((item) => (
        <AdvancedMarker
          key={item.key}
          position={item.location}
          clickable={true}
          onClick={(ev: google.maps.MapMouseEvent) => onClick(ev, item)}
          ref={(marker: google.maps.marker.AdvancedMarkerElement | null) => setMarkerRef(marker, item.key)}
        >
          <Pin
            background={getColorForType(item.type)}
            glyphColor="#000"
            borderColor="#000"
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default MarkerRenderer;