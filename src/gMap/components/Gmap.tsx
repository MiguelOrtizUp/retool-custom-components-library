import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRetoolState } from '../retoolState';
import { Retool } from '@tryretool/custom-component-support';
import MapLegend from '../components/MapLegend';
import { useKmlLayer } from './useKmlLayer';
import ItemMarkers from './markers';
import { APIProvider, Map, InfoWindow } from '@vis.gl/react-google-maps';
import type { Item } from './types/poi';
import { API_KEY, MAP_ID } from '../variables';

export const Gmap: React.FC = () => {
  Retool.useComponentSettings({
    defaultHeight: 50,
    defaultWidth: 7,
  });

  const {
    dataSource, setDataSource,
    selectedItem, setSelectedItem,
    selectedMarkerId, setSelectedMarkerId,
    proximityItems, setProximityItems,
    radius, setRadius,
    defaultCenter, setDefaultCenter,
    showKmlLayer,
    kmlSelectedItem, setKmlSelectedItem,
    activeItem, setActiveItem,
    onMarkerSelected
  } = useRetoolState();

  const [typeColorMap, setTypeColorMap] = useState<Record<string, string>>({});

  const handleSelectPoi = (item: Item) => {
  console.log('handleSelectPoi called', item);
  setSelectedItem(item);
  setSelectedMarkerId(item.key);
  onMarkerSelected();
};


  // Memoized KML click handler
  const handleKmlFeatureClick = useCallback((event: google.maps.KmlMouseEvent) => {
  // Only keep serializable featureData properties
  const propertiesArray = Object.entries(event.featureData || {})
    .filter(([_, value]) =>
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    )
    .map(([key, value]) => ({ key, value }));

  const kmlSelected: Record<string, any> = {
    data: propertiesArray,
  };

  // Only add infoWindowHtml if it's a string
  if (typeof (event as any).infoWindowHtml === 'string') {
    kmlSelected.infoWindowHtml = (event as any).infoWindowHtml;
  }

  // Only add latLng if it exists
  if (event.latLng && typeof event.latLng.toJSON === 'function') {
    kmlSelected.latLng = event.latLng.toJSON();
  }

  setKmlSelectedItem(kmlSelected);
}, [setKmlSelectedItem]);

  // KML Layer component
  function KmlLayer({ url, onFeatureClick }: { url: string, onFeatureClick?: (event: google.maps.KmlMouseEvent) => void }) {
    useKmlLayer(url, onFeatureClick);
    return null;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <APIProvider apiKey={API_KEY} libraries={['geometry']}>
        <Map
          defaultZoom={8}
          defaultCenter={defaultCenter as { lat: number; lng: number }}
          mapId={MAP_ID}
          style={{ width: '100%', height: '100%' }}
        >
          {showKmlLayer && (
            <KmlLayer
              url="https://cdn.jsdelivr.net/gh/MiguelOrtizUp/kml-hosting@main/sydneytrains.kml"
              onFeatureClick={handleKmlFeatureClick}
            />
          )}

          <ItemMarkers
            items={dataSource as unknown as Item[]}
            onSelect={handleSelectPoi}
            onProximityChange={setProximityItems}
            radius={radius}
            onActivatePoi={setActiveItem}
            onTypeColorMapUpdate={setTypeColorMap}
            selectedMarkerId={selectedMarkerId}
          />

          {activeItem && (
            <InfoWindow
              position={activeItem.location}
              onCloseClick={() => setActiveItem(null)}
            >
              <div style={{ maxWidth: '200px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong style={{ fontSize: '16px', color: '#333' }}>
                    {activeItem.key}
                  </strong>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: typeColorMap[activeItem.type] || '#666666',
                      borderRadius: '50%',
                      border: '1px solid #000',
                      flexShrink: 0
                    }}
                  />
                  <span style={{
                    fontSize: '14px',
                    color: '#666',
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {activeItem.type || 'default'}
                  </span>
                </div>
                {activeItem.data && activeItem.data.length > 0 && activeItem.data[0].description && (
                  <div style={{
                    fontSize: '13px',
                    color: '#555',
                    lineHeight: '1.4',
                    fontStyle: 'italic'
                  }}>
                    {activeItem.data[0].description}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
        <MapLegend
          typeColorMap={typeColorMap}
          items={dataSource as unknown as Item[]}
        />
      </APIProvider>
    </div>
  );
};