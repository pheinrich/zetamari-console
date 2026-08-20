// MirrorGlassInfo.shape's parametric ENUM (see the model) - matches the
// same key-bearing ShapeType.key values Contour.shape can carry (see the
// 20260715000000-shape-types.js migration). A custom (svgData-only)
// outside contour has no matching ENUM value, so it falls back to
// 'other' here - the ENUM is legacy/descriptive only at this point (see
// MirrorGlassInfo.js's comment on `contourId`), so 'other' losing that
// detail isn't a real loss; `contourId` still carries the real shape.
//
// Shared by CreateMirrorGlassDialog.jsx (the "no suitable existing Mirror
// Glass" picker fallback) and CreateNewProductDialog.jsx (which, per the
// 2026-08-19 revision, resolves this same shape itself when the working
// panel's only checked Material is Mirror Glass - see its `directCategory`
// handling) so the two don't drift out of sync.
export const MIRROR_GLASS_SHAPE_KEYS = new Set( ['chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica piscis'] )

export const MIRROR_GLASS_SHAPE_VALUES = [...MIRROR_GLASS_SHAPE_KEYS, 'other']

export function resolveMirrorGlassShape( outsideContour )
{
  const shapeKey = outsideContour?.shape?.key

  return MIRROR_GLASS_SHAPE_KEYS.has( shapeKey ) ? shapeKey : 'other'
}
