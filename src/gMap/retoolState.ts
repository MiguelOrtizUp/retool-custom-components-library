import { Retool } from '@tryretool/custom-component-support';
import { useState } from 'react';
import type { Item } from './components/types/poi';

export function useRetoolState() {
const [dataSource, setDataSource] = Retool.useStateArray({
    name: "dataSource",
    initialValue: [
  {
    key: 'operaHouse',
    location: { lat: -33.8567844, lng: 151.213108 },
    type: 'landmark',
    data: { description: 'Iconic performing arts venue' },
  },
  {
    key: 'tarongaZoo',
    location: { lat: -33.8472767, lng: 151.2188164 },
    type: 'zoo',
    data: [{ description: 'Popular Sydney zoo with harbor views' }],
  },
  {
    key: 'manlyBeach',
    location: { lat: -33.8209738, lng: 151.2563253 },
    type: 'beach',
    data: [{ description: 'Famous surfing beach with scenic views' }],
  },
  {
    key: 'hyderPark',
    location: { lat: -33.8690081, lng: 151.2052393 },
    type: 'park',
    data: [{ description: 'Large urban park in central Sydney' }],
  },
  {
    key: 'theRocks',
    location: { lat: -33.8587568, lng: 151.2058246 },
    type: 'historic',
    data: [{ description: 'Historic district with cobblestone streets' }],
  },
  {
    key: 'circularQuay',
    location: { lat: -33.858761, lng: 151.2055688 },
    type: 'transport',
    data: [{ description: 'Major ferry terminal and public hub' }],
  },
  {
    key: 'harbourBridge',
    location: { lat: -33.852228, lng: 151.2038374 },
    type: 'landmark',
    data: [{ description: 'Famous steel arch bridge' }],
  },
  {
    key: 'kingsCross',
    location: { lat: -33.8737375, lng: 151.222569 },
    type: 'nightlife',
    data: [{ description: 'Known for clubs and bars' }],
  },
  {
    key: 'botanicGardens',
    location: { lat: -33.864167, lng: 151.216387 },
    type: 'garden',
    data: [{ description: 'Beautiful public gardens' }],
  },
  {
    key: 'museumOfSydney',
    location: { lat: -33.8636005, lng: 151.2092542 },
    type: 'museum',
    data: [{ description: 'Museum focused on Sydney’s history' }],
  },
  {
    key: 'maritimeMuseum',
    location: { lat: -33.869395, lng: 151.198648 },
    type: 'museum',
    data: [{ description: 'Museum featuring maritime artifacts' }],
  },
  {
    key: 'kingStreetWharf',
    location: { lat: -33.8665445, lng: 151.1989808 },
    type: 'dining',
    data: [{ description: 'Waterfront area with restaurants' }],
  },
  {
    key: 'aquarium',
    location: { lat: -33.869627, lng: 151.202146 },
    type: 'attraction',
    data: [{ description: 'Popular sea life aquarium' }],
  },
  {
    key: 'darlingHarbour',
    location: { lat: -33.87488, lng: 151.1987113 },
    type: 'district',
    data: [{ description: 'Tourist area with shops and entertainment' }],
  },
  {
    key: 'barangaroo',
    location: { lat: -33.8605523, lng: 151.1972205 },
    type: 'district',
    data: [{ description: 'Urban renewal precinct on the harbor' }],
  },
],
    inspector: "text", // makes it editable in the Retool UI
    description: "Array of Itemss to display on the map",
    label: "Data Source"
  });
  const [selectedItem, setSelectedItem] = Retool.useStateObject({
  name: "selectedItem",
  initialValue: {},
  inspector: "hidden",
  description: "Currently selected Item",
  label: "Selected Item",
});
const [selectedMarkerId, setSelectedMarkerId] = Retool.useStateString({
  name: "selectedMarkerId",
  initialValue: "",
  inspector: "text",
  description: "Persisted selected marker key",
  label: "Selected Marker ID",
});
const [proximityItems, setProximityItems] = Retool.useStateArray({
  name: "proximityItems",
  initialValue: [],
  inspector: "hidden",
  description: "Items within proximity circle",
  label: "Proximity Items"
});
const [radius, setRadius] = Retool.useStateNumber({
  name: "radius",
  initialValue: 800,
  inspector: "text",
  description: "Proximity radius in meters",
  label: "Radius",
});
const [defaultCenter, setDefaultCenter] = Retool.useStateObject({
  name: 'defaultCenter',
  label: 'Default Center',
  initialValue: { lat: -33.865143, lng: 151.209900 },
});
const [showKmlLayer] = Retool.useStateBoolean({
  name: "showKmlLayer",
  initialValue: true,
  inspector: "text",
  description: "Show KML Layer",
  label: "Show KML Layer",
});
const [kmlSelectedItem, setKmlSelectedItem] = Retool.useStateObject({
  name: "kmlSelectedItem",
  initialValue: {},
  inspector: "hidden",
  description: "Selected KML feature",
  label: "KML Selected Item",
});
const [activeItem, setActiveItem] = useState<Item | null>(null);
const onMarkerSelected = Retool.useEventCallback({ name: 'Select Marker' });

  return {
    dataSource, setDataSource,
    selectedItem, setSelectedItem,
    selectedMarkerId, setSelectedMarkerId,
    proximityItems, setProximityItems,
    radius, setRadius,
    defaultCenter, setDefaultCenter,
    showKmlLayer,
    kmlSelectedItem, setKmlSelectedItem,
    activeItem, setActiveItem,
    onMarkerSelected,

  };
}
