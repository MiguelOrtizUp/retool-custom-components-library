import React from 'react';
import { Circle } from './circle'; // Adjust path as needed

type ProximityCircleProps = {
  center: google.maps.LatLng | null;
  radius: number;
};

const ProximityCircle: React.FC<ProximityCircleProps> = ({ center, radius }) => {
  if (!center) return null;

  return (
    <Circle
      center={center}
      radius={radius}
      strokeColor="#0c4cb3"
      strokeOpacity={1}
      strokeWeight={3}
      fillColor="#3b82f6"
      fillOpacity={0.3}
      clickable={false}
      draggable={false}
    />
  );
};

export default ProximityCircle;
