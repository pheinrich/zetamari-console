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
const WOODEN_BASE_FACTORS = ['woodenBase', 'sheetBreakageWood', 'machineWear', 'utilities', 'laborCnc', 'laborSanding']
const MIRROR_GLASS_FACTORS = ['mirrorGlass', 'sheetBreakageGlass', 'laborGlass']
const TESSERAE_MATERIAL_FACTORS = ['tesserae', 'grout']
const TESSERAE_LABOR_FACTORS = ['laborGluing', 'laborGrouting']
const SUBSTRATE_FACTORS = [...WOODEN_BASE_FACTORS, ...MIRROR_GLASS_FACTORS]
const KIT_FACTORS = [...SUBSTRATE_FACTORS, ...TESSERAE_MATERIAL_FACTORS, 'laborPicking']
const FINISHED_MIRROR_FACTORS = [...SUBSTRATE_FACTORS, ...TESSERAE_MATERIAL_FACTORS, ...TESSERAE_LABOR_FACTORS, 'laborFinishing', 'bom']

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
// `quantityOverrides` (added for the 2026-08-04 editable-Quantity
// revision) only ever contributes its `sheetBreakageWood`/
// `sheetBreakageGlass` entries here - those two rows display a PIECE
// COUNT, not the dollar quantity every other row's override replaces
// directly (see computeVisualizerStats below), so editing them has to
// flow through the exact same manual-override inputs a real product uses
// (WoodenBaseInfo.piecesPerSheet/glassPiecesPerSheet) so
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
      // unless the person has double-clicked to override it.
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
// factor's own $ quantity (see computeVisualizerStats below) - their
// override therefore has to flow in through buildSyntheticProduct's
// piecesPerSheet fields (computeDefaultQuantities recomputes the dollar
// figure from there), not by replacing `computed[key]` directly.
const SHEET_BREAKAGE_KEYS = new Set( ['sheetBreakageWood', 'sheetBreakageGlass'] )

// Per-factor $ breakdown, mirroring db/actions/productCost.js's
// readProductCosts() row math - but for a synthetic product with no
// ProductCostOverride rows at all, so every factor's effective quantity is
// just its computed default, or the person's own double-click override
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

// Everything the tabbed Visualizer UI needs in one call (StatsSummary.jsx
// memoizes this rather than recomputing per-tab):
//   - computed: the raw computeDefaultQuantities() output, WITH any
//     quantityOverrides already applied - Production's Machine Time/Cut
//     Distance come straight off computed.runTimeMin/computed.cutDistanceIn.
//   - rowsByKey: every non-rate-holder CostFactor's $ breakdown (see
//     computeFactorRow above), keyed by factor key - the Pricing tab's row
//     data source. Each row also carries `computedQuantity` (the ORIGINAL,
//     un-overridden value - what the tooltip on an overridden cell shows)
//     and `overridden` (whether a quantityOverrides entry is currently
//     active for it).
//   - weight: Wooden Base/Mirror Glass/Tesserae/Grout's individual weight
//     contributions plus the Substrate/Kit/Finished Mirror running sums
//     (Substrate = Wooden Base + Mirror Glass; Kit = Substrate + Tesserae;
//     Finished Mirror = Kit + Grout - see the 2026-08-02 Weight tab
//     revision), all in lb.
//   - markupFactor/retailMultiplier: exposed so the Pricing tab's per-
//     column Assistant/Owner tooltip can work out each $ column's own
//     labor split (COGS/Wholesale/Retail treat Owner labor differently -
//     see StatsSummary.jsx) without duplicating the Settings lookup.
//
// `quantityOverrides` (added for the 2026-08-04 editable-Quantity
// revision) is a plain {factorKey: value} map of the person's own double-
// click edits on the Pricing tab - purely client-side/ephemeral (nothing
// persisted, unlike a real product's ProductCostOverride). For most keys
// this directly replaces computeDefaultQuantities()'s own value; for the
// two Sheet Breakage rows specifically (see SHEET_BREAKAGE_KEYS) it's
// instead threaded through buildSyntheticProduct's piecesPerSheet fields,
// so the dollar figure gets recomputed from the overridden piece count
// exactly like a real product's manual entry would.
export function computeVisualizerStats( substrateInfo, outsideContour, insideContour, rabbetContour, settings, factors, quantityOverrides = {} )
{
  // Computed with NO overrides at all - the "original" values every
  // overridden row's tooltip compares against, regardless of what's
  // currently overridden.
  const baseComputed = computeDefaultQuantities(
    buildSyntheticProduct( substrateInfo, outsideContour, insideContour, rabbetContour ),
    settings
  )

  // Computed WITH the piece-count overrides (if any) baked into the
  // synthetic product - only sheetBreakageWood/sheetBreakageGlass/
  // piecesPerSheetWood/piecesPerSheetGlass can actually differ from
  // baseComputed here (see buildSyntheticProduct's doc comment).
  const piecesComputed = computeDefaultQuantities(
    buildSyntheticProduct( substrateInfo, outsideContour, insideContour, rabbetContour, quantityOverrides ),
    settings
  )

  const computed = {
    ...baseComputed,
    sheetBreakageWood: piecesComputed.sheetBreakageWood,
    sheetBreakageGlass: piecesComputed.sheetBreakageGlass,
    piecesPerSheetWood: piecesComputed.piecesPerSheetWood,
    piecesPerSheetGlass: piecesComputed.piecesPerSheetGlass,
  }

  // Every other overridden key replaces `computed[key]` directly - same
  // "effective quantity" idea as db/actions/productCost.js's
  // ProductCostOverride.quantityOverride, just held in memory instead of
  // the database.
  for( const [key, value] of Object.entries( quantityOverrides ) )
  {
    if( SHEET_BREAKAGE_KEYS.has( key ) )
      continue
    if( null != value && Number.isFinite( value ) )
      computed[key] = value
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

    // For the two Sheet Breakage rows, "overridden"/"computedQuantity"
    // describe the PIECE COUNT (what's actually displayed and edited),
    // not the dollar quantity `row.quantity` carries - see
    // computeFactorRow/SHEET_BREAKAGE_KEYS above.
    if( SHEET_BREAKAGE_KEYS.has( factor.key ) )
    {
      const pieceKey = 'sheetBreakageWood' === factor.key ? 'piecesPerSheetWood' : 'piecesPerSheetGlass'

      row.pieceCount = computed[pieceKey] ?? 0
      row.computedPieceCount = baseComputed[pieceKey] ?? 0
      row.overridden = null != quantityOverrides[factor.key]
    }
    else
    {
      row.computedQuantity = baseComputed[factor.key] ?? 0
      row.overridden = null != quantityOverrides[factor.key]
    }

    rowsByKey[factor.key] = row
  }

  const woodenBaseWeight = (rowsByKey.woodenBase?.quantity ?? 0) * (settings?.woodenBaseWeightPerSqIn ?? 0)
  const mirrorGlassWeight = (rowsByKey.mirrorGlass?.quantity ?? 0) * (settings?.mirrorGlassWeightPerSqIn ?? 0)
  const tesseraeWeight = (rowsByKey.tesserae?.quantity ?? 0) * (settings?.tesseraeWeightPerSqIn ?? 0)
  const groutWeight = (rowsByKey.grout?.quantity ?? 0) * (settings?.groutWeightPerSqIn ?? 0)
  const substrateWeight = woodenBaseWeight + mirrorGlassWeight
  const kitWeight = substrateWeight + tesseraeWeight
  const finishedMirrorWeight = kitWeight + groutWeight

  const weight = {
    woodenBase: woodenBaseWeight,
    mirrorGlass: mirrorGlassWeight,
    tesserae: tesseraeWeight,
    grout: groutWeight,
    substrate: substrateWeight,
    kit: kitWeight,
    finishedMirror: finishedMirrorWeight,
  }

  return { computed, rowsByKey, weight, markupFactor, retailMultiplier }
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
  return `${(minutes ?? 0).toFixed( 1 )} min`
}

export function formatCutDistance( inches )
{
  return `${(inches ?? 0).toFixed( 1 )} in`
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
    return `${v.toFixed( 1 )} min`

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
