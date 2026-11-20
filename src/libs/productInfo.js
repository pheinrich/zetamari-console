import { z } from 'zod'

// Plain (non-'use client') module so both server and client components can
// import these - a server component importing a constant from a client
// module gets a client reference, not the value.

export const optionalPositiveNumber = z.preprocess(
  (val) => (val === '' || val == null ? undefined : val),
  z.coerce.number().optional()
)

// Unlike optionalPositiveNumber, this is for ids referencing another
// row (woodenBaseInfo.insideId/rabbetId, from the "None" option in their
// Selects) - without the '' -> undefined preprocessing, z.coerce.number()
// turns '' into 0 rather than leaving it absent, which then fails the
// WoodenBaseInfo.insideId/rabbetId foreign key constraint (there's no
// Contour with id 0) instead of just leaving the column null.
export const optionalPositiveInt = z.preprocess(
  (val) => (val === '' || val == null ? undefined : val),
  z.coerce.number().int().optional()
)

// Product type -> the key its type-specific Info row is loaded/submitted
// under. Types not listed here ('grout', 'kit', 'other', and assembled
// products) have no Info table.
export const INFO_KEY = {
  bead: 'beadInfo',
  'birdhouse base': 'birdhouseBaseInfo',
  'picture frame': 'pictureFrameInfo',
  millefiori: 'millefioriInfo',
  'mirror glass': 'mirrorGlassInfo',
  tile: 'tileInfo',
  'wooden base': 'woodenBaseInfo',
}

export const TYPES_WITH_INFO = Object.keys( INFO_KEY )

export const infoSchemas = {
  beadInfo: z.object({
    category: z.enum( ['glass', 'plastic', 'ceramic', 'shell', 'metal', 'rhinestone', 'cabochon', 'other'] ).optional(),
    finish: z.enum( ['fire-polished', 'silvered', 'opaque', 'opaque luster', 'transparent', 'aurora borealis', 'plain'] ).optional(),
    shape: z.enum( ['round', 'faceted round', 'bicone', 'drop', 'rondelle', 'rivoli', 'chaton', 'other'] ).optional(),
    color: z.string().min( 1, 'Required' ),
    length: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber
  }),

  pictureFrameInfo: z.object({
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
    channel: optionalPositiveNumber,
    border: optionalPositiveNumber,
    photoWidth: optionalPositiveNumber,
    photoHeight: optionalPositiveNumber,
  }),

  millefioriInfo: z.object({
    shape: z.enum( ['round', 'square'] ).optional(),
    color: z.string().min( 1, 'Required' ),
    length: optionalPositiveNumber,
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
  }),

  mirrorGlassInfo: z.object({
    shape: z.enum( ['chapel arch', 'circle', 'gothic arch', 'oval', 'rectangle', 'square', 'vesica piscis', 'other'] ).optional(),
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
    bevel: optionalPositiveNumber,
    // See MirrorGlassInfo.js - additive alongside `shape`, not yet a
    // replacement for it, so both are optional here.
    contourId: optionalPositiveInt,
  }),

  woodenBaseInfo: z.object({
    // Required - blank must fail as such, not coerce to 0 and then trip
    // the foreign key.
    outsideId: z.preprocess(
      (val) => (val === '' || val == null ? undefined : Number( val )),
      z.number( {required_error: 'Required'} ).int()
    ),
    insideId: optionalPositiveInt,
    rabbetId: optionalPositiveInt,
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
    border: optionalPositiveNumber,

    // How many copies of this exact shape fit on one standard sheet of
    // plywood - blank (the common case) means "not yet known", so the
    // Sheet Breakage (Wood) cost factor falls back to a live grid-packing
    // estimate (see libs/costFactors.js); a real count, learned from
    // actually nesting/cutting the shape, always wins over the estimate
    // when entered here. optionalPositiveInt (not optionalPositiveNumber)
    // for the same reason as insideId/rabbetId above - a blank field
    // should leave the column null, not coerce to 0.
    piecesPerSheet: optionalPositiveInt,

    // Same idea, for this shape's glass cutout against the shop's mirror
    // glass sheet stock instead of plywood - feeds Sheet Breakage (Glass)
    // (see the 20260804000000-glass-sheet-breakage.js migration). Lives
    // here (not on a separate Mirror Glass product) since the glass
    // geometry that formula costs is this wooden base's own cutout.
    glassPiecesPerSheet: optionalPositiveInt,
  }),

  tileInfo: z.object({
    color: z.string().min( 1, 'Required' ),
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    thickness: optionalPositiveNumber,
  }),

  birdhouseBaseInfo: z.object({
    width: optionalPositiveNumber,
    height: optionalPositiveNumber,
    depth: optionalPositiveNumber,
  }),
}
