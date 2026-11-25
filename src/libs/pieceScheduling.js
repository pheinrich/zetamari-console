// Manufacturing-scheduling helpers - see CONTEXT.md's Manufacturing
// scheduling section. The Capacity-driven backlog simulation that used
// to live here (simulateBacklog/expandCapacityEvents/assignGroutingDay/
// consumeOrdinaryCapacity, plus the Capacity-formula parsing helpers
// only the retired Capacity calendar used) was removed with capacity
// planning itself - see docs/adr/0008. What's left is the
// Production-Phase-sequencing logic the /production table still needs,
// which has nothing to do with Capacity.
import { computeDefaultQuantities, convertToRateUnit } from './costFactors'

// CONTEXT.md's Production Phase: which phases a Piece passes through,
// and in what order, depends on its Product's type. A 'kit' product
// (customer assembles it themselves) never enters Grouting at all;
// every other ("finished") product does. Glass comes after either
// branch and before Finishing in both - Assembly is kit-specific prep,
// Gluing+Grouting is the finished-product path, Glass is hand-cutting
// needed by either when glass doesn't arrive pre-cut.
export const PHASE_SEQUENCES = {
  kit: ['Design', 'CNC', 'Sanding', 'Assembly', 'Glass', 'Finishing'],
  finished: ['Design', 'CNC', 'Sanding', 'Gluing', 'Grouting', 'Glass', 'Finishing'],
}

// Matches Piece.phase's ENUM values to the CostFactor.key each phase's
// duration is computed from.
export const PHASE_TO_COST_FACTOR_KEY = {
  Design: 'laborDesign',
  CNC: 'laborCnc',
  Sanding: 'laborSanding',
  Assembly: 'laborAssembly',
  Gluing: 'laborGluing',
  Grouting: 'laborGrouting',
  Glass: 'laborGlass',
  Finishing: 'laborFinishing',
}

// Design/CNC/Sanding/Glass are Owner-only capacity - a hard rule, not
// just a description of who happens to have Capacity entered (see
// CONTEXT.md's Production Phase entry). Kept even though the Capacity
// engine that consumed it is gone, since it's still a true statement
// about the domain a future rebuild will need again.
export const OWNER_ONLY_PHASES = new Set( ['Design', 'CNC', 'Sanding', 'Glass'] )

export function getPhaseSequence( product )
{
  return 'kit' === product?.type ? PHASE_SEQUENCES.kit : PHASE_SEQUENCES.finished
}

// A Piece's estimated duration for its current phase, in hours - reuses
// computeDefaultQuantities() (the same function productCost.js's
// costing uses) plus any active ProductCostOverride, so scheduling and
// costing can never quietly disagree about how long a phase takes.
// Returns 0 when the phase is disabled (effectiveEnabled false) or has
// no estimated time - callers use that to auto-skip Glass on the common
// case where nothing needs hand-cutting.
export function getPieceDurationHours( phase, product, settingsJson, costFactorsByKey, overrideByFactorId )
{
  const factor = costFactorsByKey[PHASE_TO_COST_FACTOR_KEY[phase]]

  if( !factor )
    return 0

  const computed = computeDefaultQuantities( product, settingsJson )
  const override = overrideByFactorId?.[factor.id]

  const rawComputedQuantity = computed[factor.key] ?? 0
  const computedQuantity = Number.isFinite( rawComputedQuantity ) ? rawComputedQuantity : 0
  const effectiveQuantity = null != override?.quantityOverride ? override.quantityOverride : computedQuantity
  const effectiveEnabled = null != override?.enabledOverride ? override.enabledOverride : true

  if( !effectiveEnabled )
    return 0

  return convertToRateUnit( effectiveQuantity, factor )
}
