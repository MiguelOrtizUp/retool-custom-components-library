import type { Item } from '../types/poi';

export function computeNearbyPois(
  center: google.maps.LatLng,
  items: Item[],
  radius: number
): Item[] {
  return items.filter(item => {
    const point = new google.maps.LatLng(item.location.lat, item.location.lng);
    const distance = google.maps.geometry.spherical.computeDistanceBetween(center, point);
    return distance <= radius;
  });
}