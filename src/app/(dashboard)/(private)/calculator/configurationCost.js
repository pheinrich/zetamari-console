// Drives the Visualizer's Area/Weight/Production/Pricing numbers off the
// SAME cost-factor math the real product-costing system uses (libs/
// costFactors.js's computeDefaultQuantities(), db/actions/productCost.js's
// cost-split formulas) - reused here without a database round-trip and
// without ever creating a real Product, so editing shape/size in the
// calculator shows real numbers instantly. See the 2026-08-01/2026-08-02
// Visualizer discussions for the full rationale (the old calculatorStats.js
// this replaces used hardcoded constants totally disconnected from
// Settings/CostFactor).
//
// CONFIGURATIONS (Wooden Base/Mirror Glass/Tesserae/Substrate/Kit/Finished
// Mirror) is a named subset (or union of subsets) of CostFactor keys
// representing a hypothetical bundle that could become a real product -
// as of the 2026-08-02 revision this is used purely to drive the Pricing
// tab's "Include" column preset dropdown (StatsSummary.jsx), not to
// compute parallel per-configuration totals the way the first pass did.
// This is a Visualizer-only display concept - it's NOT Product.type
// (which has no 'substrate'/'finished mirror' value) and NOT libs/
// costFactors.js's TYPE_TO_FACTOR (which maps a *real* BOM line's material
// type to the area factor it supersedes).
import { computeDefaultQuantities, convertToRateUnit } from '@/libs/costFactors'

const LABOR_RATE_KEYS = { owner: 'laborOwner', assistant: 'laborAssistant' }

function isRateHolderKey( key )
{
  return Object.values( LABOR_RATE_KEYS ).includes( key )
}

// Each configuration's CostFactor keys, additive for the composed ones -
// per the 2026-08-01 discussion: laborSanding lives under Wooden Base
// (not Tesserae); laborGlass is under Mirror Glass, for hand-cut glass
// shapes; laborDesign isn't attributed to any configuration yet.
//
// Per the 2026-08-03 revision, Tesserae's preset is materials-only (no
// labor at all) - TESSERAE_MATERIAL_FACTORS/TESSERAE_LABOR_FACTORS are
// split so Kit can pick up the materials without the labor (Kit's own
// preset deliberately excludes Gluing/Grouting labor - the person still
// wants those two toggled off by default even for a Kit), while Finished
// Mirror - the complete real, assembled product - still includes them:
// it's built directly off the raw factor lists below rather than off
// KIT_FACTORS, so a future change to Kit's own preset doesn't silently
// also change what "Finished Mirror" defaults to.
//
// laborPicking (per the 2026-08-05 discussion) is deliberately only added
// to KIT_FACTORS itself, not any of the raw building-block lists above it
// (nor FINISHED_MIRROR_FACTORS) - Kit is the only preset meant to default
// it "on."
//
// Per the 2026-08-19 revision, Grout is its own building block
// (GROUT_MATERIAL_FACTORS), kept out of TESSERAE_MATERIAL_FACTORS/
// KIT_FACTORS entirely - Finished Mirror is the only preset that should
// default the Grout material row "on" (grouting only makes sense once the
// whole piece is assembled), so it's added directly into
// FINISHED_MIRROR_FACTORS rather than flowing through Tesserae/Kit the
// way it used to.
const WOODEN_BASE_FACTORS = ['woodenBase', 'sheetBreakageWood', 'machineWear', 'utilities', 'laborCnc', 'laborSanding']
const MIRROR_GLASS_FACTORS = ['mirrorGlass', 'sheetBreakageGlass', 'laborGlass']
const TESSERAE_MATERIAL_FACTORS = ['tesserae']
const GROUT_MATERIAL_FACTORS = ['grout']
const TESSERAE_LABOR_FACTORS = ['laborGluing', 'laborGrouting']
const SUBSTRATE_FACTORS = [...WOODEN_BASE_FACTORS, ...MIRROR_GLASS_FACTORS]
const KIT_FACTORS = [...SUBSTRATE_FACTORS, ...TESSERAE_MATERIAL_FACTORS, 'laborPicking']
const FINISHED_MIRROR_FACTORS = [...SUBSTRATE_FACTORS, ...TESSERAE_MATERIAL_FACTORS, ...GROUT_MATERIAL_FACTORS, ...TESSERAE_LABOR_FACTORS, 'laborFinishing', 'bom']

// Ordered for display in the Pricing tab's "Include" preset dropdown - the
// raw materials first, then the progressively composed bundles.
export const CONFIGURATIONS = [
  { key: 'woodenBase', label: 'Wooden Base', factorKeys: WOODEN_BASE_FACTORS },
  { key: 'mirrorGlass', label: 'Mirror Glass', factorKeys: MIRROR_GLASS_FACTORS },
  { key: 'tesserae', label: 'Tesserae', factorKeys: TESSERAE_MATERIAL_FACTORS },
  { key: 'substrate', label: 'Substrate', factorKeys: SUBSTRATE_FACTORS },
  { key: 'kit', label: 'Kit', factorKeys: KIT_FACTORS },
  { key: 'finishedMirror', label: 'Finished Mirror', factorKeys: FINISHED_MIRROR_FACTORS },
]

// Shared tab/column metadata - exported here (rather than owned solely by
// StatsSummary.jsx) since the 2026-08-03 revision moved the "Show Tabs"/
// "Pricing Columns" visibility checkboxes into MirrorCalculator's own
// kebab menu, which needs the same key/label lists to render them.
export const TABS = [
  { key: 'area', label: 'Area' },
  { key: 'weight', label: 'Weight' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'production', label: 'Production' },
  { key: 'pricing', label: 'Pricing' },
]

export const PRICING_COLUMNS = [
  { key: 'cogs', label: 'COGS' },
  { key: 'wholesale', label: 'Wholesale' },
  { key: 'retail', label: 'Retail' },
]

// Builds the synthetic, DB-free "product" computeDefaultQuantities()/
// buildGeometry() (libs/costFactors.js) expect - just enough shape data to
// derive geometry from, no real Product/BillOfMaterial row involved.
// `outsideContour`/`insideContour`/`rabbetContour` are plain Contour rows
// (each with its `shape` association already loaded, same as `contours`
// is fetched everywhere else in the calculator) - already the exact shape
// buildGeometry() expects for `woodenBaseInfo.outside/inside/rabbet`.
//
// `quantityOverrides` is a bare {sheetBreakageWood, sheetBreakageGlass}
// map of PIECE COUNTS (not the dollar quantity every other row's override
// replaces directly - see computeVisualizerStats below) - callers pre-
// extract just the Quantity-column overrides for these two rows into this
// shape (see pieceOverridesFrom) before calling here, so editing them
// flows through the exact same manual-override inputs a real product uses
// (WoodenBaseInfo.piecesPerSheet/glassPiecesPerSheet) and
// computeDefaultQuantities() recomputes the dollar breakage figure from
// the overridden piece count, the same way it would for a real product.
export function buildSyntheticProduct( substrateInfo, outsideContour, insideContour, rabbetContour, quantityOverrides = {} )
{
  return {
    id: null,
    woodenBaseInfo: {
      width: Number( substrateInfo?.width ) || 0,
      height: Number( substrateInfo?.height ) || 0,
      border: Number( substrateInfo?.border ) || 0,
      outside: outsideContour,
      inside: insideContour,
      rabbet: rabbetContour,

      // Not a real product - no learned real-world nesting count exists
      // to enter, so this always falls back to computeDefaultQuantities()'s
      // live grid-packing estimate (see WoodenBaseInfo.js's doc comment)
      // unless the person has clicked to override it.
      piecesPerSheet: quantityOverrides.sheetBreakageWood ?? null,
      glassPiecesPerSheet: quantityOverrides.sheetBreakageGlass ?? null,
    },

    // Never any real BOM lines for a hypothetical shape - computeSupersededFactors()
    // (unused here, since there's nothing to supersede) would always come
    // back empty, and the 'bom' factor's own computed quantity is always 0.
    bomLines: [],
  }
}

// Same lookup as db/actions/productCost.js's resolveLaborRates(),
// duplicated here rather than imported since that module is 'use server'
// (importing it would pull a server action into this isomorphic module).
function resolveLaborRates( factors )
{
  return {
    ownerRate: factors.find( f => f.key === LABOR_RATE_KEYS.owner )?.rate ?? 0,
    assistantRate: factors.find( f => f.key === LABOR_RATE_KEYS.assistant )?.rate ?? 0,
  }
}

// The two rows whose Quantity column shows a piece count rather than the
// factor's own $ quantity (see computeVisualizerStats below) - a Quantity-
// column override therefore has to flow in through buildSyntheticProduct's
// piecesPerSheet fields (computeDefaultQuantities recomputes the dollar
// figure from there), not by replacing `computed[key]` directly. A COGS/
// Wholesale/Retail-column override on either of these rows (per the
// 2026-08-19 revision) bypasses piecesPerSheet entirely instead - see
// pieceOverridesFrom/computeVisualizerStats below.
const SHEET_BREAKAGE_KEYS = new Set( ['sheetBreakageWood', 'sheetBreakageGlass'] )

// The Weight tab's four rows (see MATERIAL_ROWS/WeightTable in
// StatsSummary.jsx) - the only CostFactor keys with a per-sq-in weight of
// their own.
const WEIGHT_MATERIAL_KEYS = ['woodenBase', 'mirrorGlass', 'tesserae', 'grout']

// Picks the Quantity-column (piece-count) overrides out of a Pricing tab's
// override map, in the bare {sheetBreakageWood, sheetBreakageGlass} shape
// buildSyntheticProduct expects - a COGS/Wholesale/Retail-column override
// on either Sheet Breakage row never belongs here (see SHEET_BREAKAGE_KEYS
// above), since it bypasses piecesPerSheet entirely.
function pieceOverridesFrom( pricingOverrides )
{
  const result = {}

  for( const key of SHEET_BREAKAGE_KEYS )
  {
    const override = pricingOverrides[key]

    if( override && 'quantity' === override.source && Number.isFinite( override.value ) )
      result[key] = override.value
  }

  return result
}

// Per-factor $ breakdown, mirroring db/actions/productCost.js's
// readProductCosts() row math - but for a synthetic product with no
// ProductCostOverride rows at all, so every factor's effective quantity is
// just its computed default, or the person's own click-to-edit override
// (see computeVisualizerStats below) - a hypothetical shape has no real
// BOM line to supersede a Material factor, and no product id to hang a
// *persisted* override off of, but the Visualizer still supports the same
// what-if quantity overriding a real product's ProductCostOverride would,
// purely client-side/ephemeral. `ownerCost`/`assistantCost` are always 0
// for Material/Machine rows - only Labor stage rows split between the two -
// exposed on every row (rather than only computed internally) so the
// Pricing tab's Assistant Labor/Owner Labor tooltips can sum them straight
// off the same rows the table itself renders, filtered by whichever the
// person has checked "Include" for.
function computeFactorRow( factor, computed, ownerRate, assistantRate, markupFactor, retailMultiplier )
{
  const rawQuantity = computed[factor.key] ?? 0
  const quantity = Number.isFinite( rawQuantity ) ? rawQuantity : 0
  const rateQuantity = convertToRateUnit( quantity, factor )

  if( 'labor' === factor.category && !isRateHolderKey( factor.key ) )
  {
    const ownerSharePercent = factor.defaultOwnerSharePercent ?? 100
    const ownerCost = rateQuantity * (ownerSharePercent / 100) * ownerRate
    const assistantCost = rateQuantity * (1 - ownerSharePercent / 100) * assistantRate

    // Same COGS/Wholesale split as productCost.js: Assistant labor is part
    // of COGS and gets marked up; Owner labor isn't part of COGS at all,
    // added on top unmarked (it's what turns COGS into Wholesale).
    const cogsCost = assistantCost
    const wholesaleCost = assistantCost * markupFactor + ownerCost

    return {
      key: factor.key, category: factor.category, unit: factor.unit,
      quantity, cogsCost, wholesaleCost, retailCost: wholesaleCost * retailMultiplier,
      ownerCost, assistantCost,
    }
  }

  const cogsCost = rateQuantity * (factor.rate ?? 0)
  const wholesaleCost = cogsCost * markupFactor

  return {
    key: factor.key, category: factor.category, unit: factor.unit,
    quantity, cogsCost, wholesaleCost, retailCost: wholesaleCost * retailMultiplier,
    ownerCost: 0, assistantCost: 0,
  }
}

// Per-$1-of-quantity cost rates for a factor (per the 2026-08-19 revision,
// which made the Pricing tab's COGS/Wholesale/Retail columns editable the
// same way Quantity already was) - every one of computeFactorRow's cogsCost/
// wholesaleCost/retailCost formulas is a straight linear function of
// quantity for fixed rates/markup/retail-multiplier/owner-share (no
// additive constant anywhere in them, Labor's owner/assistant split
// included), so probing computeFactorRow with quantity=1 and reading the
// resulting $ figures back off it IS that per-unit rate, without
// re-deriving its Material/Machine-vs-Labor branching here a second time.
function computeUnitRates( factor, ownerRate, assistantRate, markupFactor, retailMultiplier )
{
  const probe = computeFactorRow( factor, {[factor.key]: 1}, ownerRate, assistantRate, markupFactor, retailMultiplier )

  return { cogs: probe.cogsCost, wholesale: probe.wholesaleCost, retail: probe.retailCost }
}

// Inverts a person's direct edit to a Pricing row's COGS/Wholesale/Retail
// cell (see EditableQuantityCell in StatsSummary.jsx) into the equivalent
// Quantity, via `row.unitRates` (see computeUnitRates above) - the same
// override machinery a Quantity-cell edit already uses (computeVisualizerStats
// below), just entered through a different column. Returns null when the
// column has no rate to invert against (a zero-rate factor), in which case
// the edit is silently ignored rather than dividing by zero.
export function impliedQuantityFromColumn( row, columnKey, targetValue )
{
  const rate = row?.unitRates?.[columnKey]

  if( !rate )
    return null

  return targetValue / rate
}

// Everything the tabbed Visualizer UI needs in one call (StatsSummary.jsx
// memoizes this rather than recomputing per-tab):
//   - computed: the raw computeDefaultQuantities() output, WITH any
//     pricingOverrides already applied - Production's Machine Time/Cut
//     Distance come straight off computed.runTimeMin/computed.cutDistanceIn.
//   - rowsByKey: every non-rate-holder CostFactor's $ breakdown (see
//     computeFactorRow above), keyed by factor key - the Pricing tab's row
//     data source. Each row also carries `computedQuantity`/`computedCost`
//     (the ORIGINAL, un-overridden values - what an overridden cell's
//     tooltip shows), `unitRates` (see computeUnitRates/
//     impliedQuantityFromColumn above), and `overrideSource` (which
//     column, if any, a pricingOverrides entry is currently active for).
//   - weight/weightRowsByKey: Wooden Base/Mirror Glass/Tesserae/Grout's
//     individual weight contributions, in lb, and the row data
//     (quantity/computedQuantity/overrideSource/unit) the Weight tab's own
//     Quantity column edits against - the Weight tab's Total row (see
//     StatsSummary.jsx's WeightTable) sums whichever of these are
//     currently checked "Include", so no fixed Substrate/Kit/Finished
//     Mirror bundle math is kept here (see the 2026-08-19 revision).
//   - markupFactor/retailMultiplier: exposed so the Pricing tab's per-
//     column Assistant/Owner tooltip can work out each $ column's own
//     labor split (COGS/Wholesale/Retail treat Owner labor differently -
//     see StatsSummary.jsx) without duplicating the Settings lookup.
//
// `pricingOverrides`/`weightOverrides` (split into two independent maps
// per the 2026-08-19 revision - previously one shared `quantityOverrides`
// map fed both tabs, so a Pricing what-if edit silently changed the
// estimated Weight too) are each a plain {factorKey: {value, source}} map
// of the person's own click-to-edit edits on that tab - purely client-
// side/ephemeral (nothing persisted server-side, unlike a real product's
// ProductCostOverride, though see MirrorCalculator.jsx for how these now
// travel with the Visualizer's own lightbox/URL/session state instead).
// `source` records which column the person actually edited ('quantity',
// or - Pricing only - 'cogs'/'wholesale'/'retail'), so the UI can show the
// override styling/tooltip on that one cell specifically (see
// EditableQuantityCell) rather than always defaulting to the Quantity
// column, and so a Sheet Breakage row's dollar-column edit knows to bypass
// piecesPerSheet (see pieceOverridesFrom above). Whichever column was
// edited, `row.value` is always the equivalent Quantity - a COGS/
// Wholesale/Retail edit is inverted to it via computeUnitRates/
// impliedQuantityFromColumn (in StatsSummary.jsx) before ever reaching
// here, so from this point on it's handled exactly like a direct Quantity
// edit would be.
export function computeVisualizerStats( substrateInfo, outsideContour, insideContour, rabbetContour, settings, factors, pricingOverrides = {}, weightOverrides = {} )
{
  // Computed with NO overrides at all - the "original" values every
  // overridden row's tooltip compares against, regardless of which tab
  // (or which column within Pricing) is currently overridden.
  const baseComputed = computeDefaultQuantities(
    buildSyntheticProduct( substrateInfo, outsideContour, insideContour, rabbetContour ),
    settings
  )

  // Computed WITH the Sheet Breakage rows' Quantity-column (piece-count)
  // overrides, if any, baked into the synthetic product - only
  // sheetBreakageWood/sheetBreakageGlass/piecesPerSheetWood/
  // piecesPerSheetGlass can actually differ from baseComputed here (see
  // buildSyntheticProduct's doc comment). A COGS/Wholesale/Retail edit on
  // either row skips this entirely - see pieceOverridesFrom/the loop below.
  const piecesComputed = computeDefaultQuantities(
    buildSyntheticProduct( substrateInfo, outsideContour, insideContour, rabbetContour, pieceOverridesFrom( pricingOverrides ) ),
    settings
  )

  const computed = {
    ...baseComputed,
    sheetBreakageWood: piecesComputed.sheetBreakageWood,
    sheetBreakageGlass: piecesComputed.sheetBreakageGlass,
    piecesPerSheetWood: piecesComputed.piecesPerSheetWood,
    piecesPerSheetGlass: piecesComputed.piecesPerSheetGlass,
  }

  // Every other override - and a Sheet Breakage row's own dollar-column
  // override (source is 'cogs'/'wholesale'/'retail', not 'quantity') -
  // replaces `computed[key]` directly, same "effective quantity" idea as
  // db/actions/productCost.js's ProductCostOverride.quantityOverride, just
  // held in memory instead of the database.
  for( const [key, override] of Object.entries( pricingOverrides ) )
  {
    if( SHEET_BREAKAGE_KEYS.has( key ) && 'quantity' === override?.source )
      continue
    if( null != override?.value && Number.isFinite( override.value ) )
      computed[key] = override.value
  }

  const markupPercent = settings?.markupPercent ?? 25
  const markupFactor = 1 + markupPercent / 100
  const retailMultiplier = settings?.retailMultiplier ?? 1
  const { ownerRate, assistantRate } = resolveLaborRates( factors )

  const rowsByKey = {}

  for( const factor of factors )
  {
    if( isRateHolderKey( factor.key ) )
      continue

    const row = computeFactorRow( factor, computed, ownerRate, assistantRate, markupFactor, retailMultiplier )
    const baseRow = computeFactorRow( factor, baseComputed, ownerRate, assistantRate, markupFactor, retailMultiplier )

    row.unitRates = computeUnitRates( factor, ownerRate, assistantRate, markupFactor, retailMultiplier )
    row.computedCost = { cogs: baseRow.cogsCost, wholesale: baseRow.wholesaleCost, retail: baseRow.retailCost }
    row.overrideSource = pricingOverrides[factor.key]?.source ?? null

    // For the two Sheet Breakage rows, the Quantity column shows a PIECE
    // COUNT (what's actually displayed and, when `overrideSource` is
    // 'quantity', edited), not the dollar quantity `row.quantity` carries -
    // see computeFactorRow/SHEET_BREAKAGE_KEYS above.
    if( SHEET_BREAKAGE_KEYS.has( factor.key ) )
    {
      const pieceKey = 'sheetBreakageWood' === factor.key ? 'piecesPerSheetWood' : 'piecesPerSheetGlass'

      row.pieceCount = computed[pieceKey] ?? 0
      row.computedPieceCount = baseComputed[pieceKey] ?? 0
    }
    else
    {
      row.computedQuantity = baseComputed[factor.key] ?? 0
    }

    rowsByKey[factor.key] = row
  }

  // Weight tab's own, entirely independent override pass (per the
  // 2026-08-19 revision) - a Quantity edit here never touches
  // `pricingOverrides`/`computed` above, and vice versa, so adjusting one
  // tab's what-if numbers never silently changes the other's. Simpler
  // than the Pricing pass above: none of WEIGHT_MATERIAL_KEYS is a Sheet
  // Breakage row, so there's no piecesPerSheet indirection to thread
  // through at all - every override here replaces `weightComputed[key]`
  // directly.
  const weightComputed = {...baseComputed}

  for( const [key, override] of Object.entries( weightOverrides ) )
    if( null != override?.value && Number.isFinite( override.value ) )
      weightComputed[key] = override.value

  const weightRowsByKey = {}

  for( const key of WEIGHT_MATERIAL_KEYS )
  {
    const factor = factors.find( f => f.key === key )

    weightRowsByKey[key] = {
      key,
      unit: factor?.unit,
      quantity: weightComputed[key] ?? 0,
      computedQuantity: baseComputed[key] ?? 0,
      overrideSource: weightOverrides[key]?.source ?? null,
    }
  }

  const weight = {
    woodenBase: weightRowsByKey.woodenBase.quantity * (settings?.woodenBaseWeightPerSqIn ?? 0),
    mirrorGlass: weightRowsByKey.mirrorGlass.quantity * (settings?.mirrorGlassWeightPerSqIn ?? 0),
    tesserae: weightRowsByKey.tesserae.quantity * (settings?.tesseraeWeightPerSqIn ?? 0),
    grout: weightRowsByKey.grout.quantity * (settings?.groutWeightPerSqIn ?? 0),
  }

  return { computed, rowsByKey, weight, weightRowsByKey, markupFactor, retailMultiplier }
}

// Area tab's four rows. Mosaic Surface/Visible Mirror are purely geometry
// (from `mirror`, the same object MirrorView/MirrorToolbar already render
// off) - the mirror's own outside-minus-inside/inside dims, no CostFactor/
// Settings involved. "Minimum Rect: Mirror Glass" is also raw geometry
// (libs/mirror.js's getMinBoundRect(), via mirror.glass.obb). "Minimum
// Rect: Wooden Base", per the 2026-08-03 revision, instead comes from
// `computed.woodenBase` (computeDefaultQuantities()'s own woodenBase
// quantity, in libs/costFactors.js) rather than the raw mirror.outside.obb
// area - that's the same kerf-padded footprint (grown by 2x the profiling
// bit's width per side, per Settings.profilingKerfIn) the real Wooden
// Base CostFactor prices, so this row matches what the cost breakdown
// actually charges for rather than a smaller, unpadded rectangle.
export function computeAreaStats( mirror, computed )
{
  return {
    mosaicSurface: (mirror?.outside?.dims?.area ?? 0) - (mirror?.inside?.dims?.area ?? 0),
    visibleMirror: mirror?.inside?.dims?.area ?? 0,
    woodenBaseObb: computed?.woodenBase ?? 0,
    mirrorGlassObb: mirror?.glass?.obb?.area ?? 0,
  }
}

export function formatAreaFt2( value )
{
  return `${((value ?? 0) / 144).toFixed( 2 )} ft²`
}

export function formatAreaIn2( value )
{
  return `${(value ?? 0).toFixed( 2 )} in²`
}

export function formatWeightLb( value )
{
  return `${(value ?? 0).toFixed( 2 )} lb`
}

export function formatWeightOz( value )
{
  return `${(16 * (value ?? 0)).toFixed( 2 )} oz`
}

export function formatCost( value )
{
  return `$${(value ?? 0).toFixed( 2 )}`
}

export function formatMachineTime( minutes )
{
  return `${(minutes ?? 0).toFixed( 2 )} min`
}

export function formatCutDistance( inches )
{
  return `${(inches ?? 0).toFixed( 2 )} in`
}

// Placeholder for figures with no formula yet (Shipping Weight on the
// Weight tab, every Packaging tab column) - ignores its argument entirely,
// but still takes one so it can be used as a drop-in column `format`
// function alongside the real formatters above.
export function formatTBD()
{
  return 'TBD'
}

// Pricing tab's Quantity column - formatted per the factor's own unit
// (see CostFactor.js: 'sqin' for area-based Material factors, 'min' for
// Machine/Labor time, '$' for Sheet Breakage's dollar pass-through). NOT
// used for the two Sheet Breakage rows themselves - see
// formatPiecesPerSheet below.
export function formatQuantity( value, unit )
{
  const v = value ?? 0

  if( '$' === unit )
    return `$${v.toFixed( 2 )}`
  if( 'sqin' === unit )
    return `${v.toFixed( 2 )} sq in`
  if( 'min' === unit )
    return `${v.toFixed( 2 )} min`

  return `${v.toFixed( 2 )}${unit ? ` ${unit}` : ''}`
}

// Sheet Breakage (Wood)/Sheet Breakage (Glass)'s Quantity column shows
// the piece count behind their dollar figure (auto-grid estimate or
// manual override, whichever is in effect - see computeVisualizerStats),
// not the dollar amount every other row's Quantity column shows.
export function formatPiecesPerSheet( value )
{
  return value > 0 ? `${value} / sheet` : '—'
}
