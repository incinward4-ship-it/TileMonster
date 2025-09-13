
export function buildTransformString(transformVal: any): string {
  if (!transformVal) return 'none';
  const parts = [];
  if (transformVal.translateX) parts.push(`translateX(${transformVal.translateX}px)`);
  if (transformVal.translateY) parts.push(`translateY(${transformVal.translateY}px)`);
  if (transformVal.rotate) parts.push(`rotate(${transformVal.rotate}deg)`);
  if (transformVal.scaleX !== undefined && transformVal.scaleX !== 1) parts.push(`scaleX(${transformVal.scaleX})`);
  if (transformVal.scaleY !== undefined && transformVal.scaleY !== 1) parts.push(`scaleY(${transformVal.scaleY})`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}
