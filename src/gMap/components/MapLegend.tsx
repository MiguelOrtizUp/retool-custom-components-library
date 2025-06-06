import React from 'react';

import type { Item } from './types/poi';

type MapLegendProps = { 
  typeColorMap: Record<string, string>;
  items: Item[];
  style?: React.CSSProperties;
};

const MapLegend: React.FC<MapLegendProps> = ({ 
  typeColorMap, 
  items,
  style = {}
}) => {
  // Calculate unique types and the number of occurrences for each type
  const typeStats = items.reduce((acc, poi) => {
    const type = poi.type || 'default';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const legendItems = Object.entries(typeStats).map(([type, count]) => ({
    type,
    count,
    color: typeColorMap[type] || '#666666'
  }));

  if (legendItems.length === 0) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
        minWidth: '150px',
        zIndex: 1000,
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        ...style
      }}
    >
      <div 
        style={{ 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: '#333',
          borderBottom: '1px solid #eee',
          paddingBottom: '6px'
        }}
      >
        Legend
      </div>
      {legendItems.map(({ type, count, color }) => (
        <div 
          key={type} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '6px',
            gap: '8px'
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: color,
              borderRadius: '50%',
              border: '2px solid #000',
              flexShrink: 0
            }}
          />
          <span 
            style={{ 
              textTransform: 'capitalize', 
              color: '#333',
              flex: 1
            }}
          >
            {type}
          </span>
          <span 
            style={{ 
              color: '#666', 
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            ({count})
          </span>
        </div>
      ))}
    </div>
  );
};

export default MapLegend;