export const WORLD = { width: 1280, height: 720 };

export const WALKABLE = {
  center: { x: 230, y: 70, width: 790, height: 590 },
  left: { x: 30, y: 330, width: 180, height: 320 },
  right: { x: 1040, y: 70, width: 210, height: 190 }
} as const;

export function clampPoint(
  point: { x: number; y: number },
  area: { x: number; y: number; width: number; height: number }
) {
  return {
    x: Math.max(area.x + 16, Math.min(area.x + area.width - 16, point.x)),
    y: Math.max(area.y + 16, Math.min(area.y + area.height - 16, point.y))
  };
}
