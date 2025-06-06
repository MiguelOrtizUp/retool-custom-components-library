import { useRef, useEffect } from 'react';
import type { Item } from '../types/poi';

const COLOR_PALETTE = ['#EF4444', '#3B82F6', '#FACC15', '#10B981', '#8B5CF6', '#F97316', '#14B8A6'];

export default function useTypeColorMap(
  items: Item[],
  onTypeColorMapUpdate: (colorMap: Record<string, string>) => void
) {
  const colorMapRef = useRef<Record<string, string>>({});
  let colorIndex = 0;

  const getColorForType = (type: string = 'default') => {
    if (!colorMapRef.current[type]) {
      colorMapRef.current[type] = COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];
      colorIndex++;
      onTypeColorMapUpdate({ ...colorMapRef.current });
    }
    return colorMapRef.current[type];
  };

  useEffect(() => {
    const uniqueTypes = [...new Set(items.map(item => item.type || 'default'))];
    uniqueTypes.forEach(type => getColorForType(type));
    onTypeColorMapUpdate({ ...colorMapRef.current });
    // eslint-disable-next-line
  }, [items]);

  return { getColorForType, colorMap: colorMapRef.current };
}