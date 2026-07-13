// Resolves a full substrateInfo (outside/inside/rabbet contour ids plus
// width/height/border) from a possibly-edited width/height/border
// `overrides` plus whichever product is currently selected. `overrides`
// lets a width/height/border edit already present in the caller's state
// take precedence over the product's own stored values; pass {} to force
// the product's original values (e.g. when switching to a different
// product, or resolving a lightbox entry's own captured dimensions).
//
// With no product (blank shape), falls back to a default contour (circle,
// or the first basic shape, or just the first contour available) and a
// 6x6/1 default size.
//
// Shared by MirrorCalculator (the working panel) and LightboxThumbnail
// (each gallery entry resolves its own geometry independently).
export function resolveSubstrateInfo( overrides, product, contours )
{
  if( product?.substrateInfo )
  {
    return {
      outsideId: product.substrateInfo.outsideId,
      insideId: product.substrateInfo.insideId ?? undefined,
      rabbetId: product.substrateInfo.rabbetId ?? undefined,
      width: overrides.width ?? product.substrateInfo.width,
      height: overrides.height ?? product.substrateInfo.height,
      border: overrides.border ?? product.substrateInfo.border,
    }
  }

  const defaultContour = contours.find( c => 'circle' === c.shapeType ) || contours.find( c => !c.svgData ) || contours[0]

  return {
    outsideId: defaultContour?.id,
    insideId: undefined,
    rabbetId: undefined,
    width: overrides.width ?? 6,
    height: overrides.height ?? 6,
    border: overrides.border ?? 1,
  }
}
