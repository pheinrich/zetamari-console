// Not a 'use server' file - COSTING_INCLUDE is a plain array (a
// Sequelize `include` shape), not an async function, and a 'use server'
// file can only export async functions (see Next's "invalid-use-server-
// value" error). Originally lived in db/actions/productCost.js, which
// broke the moment anything else imported it - every export from a
// 'use server' file is treated as a server action, and Next rejects the
// module outright if any export isn't an async function.
//
// Side-effect-only imports (same trick product.js's own `import '@/db/
// models/SupplierProduct'` uses) - COSTING_INCLUDE below references the
// woodenBaseInfo/bomLines/material/suppliers associations these model
// files declare as a side effect of being imported, not anything
// exported from them directly. Without these, whether COSTING_INCLUDE
// actually works depends on some *other* file (normally product.js)
// having already been loaded earlier in the same process - true by
// accident on product-catalog pages, but not for a caller like
// scheduling.js's ensureProjectionsFresh(), reached from /orders pages
// that have no other reason to load product.js first. Found the hard
// way: "Association with alias 'woodenBaseInfo' does not exist on
// Product" the first time COSTING_INCLUDE was used from outside the
// product pages.
import '@/db/models/WoodenBaseInfo'
import '@/db/models/BillOfMaterial'
import '@/db/models/SupplierProduct'

// What computeDefaultQuantities()/computeSupersededFactors() need to
// derive geometry- and BOM-based defaults - the woodenBaseInfo branch of
// readProduct's eager include (product.js) for geometry, plus bomLines
// with each material's type (to know which area-based factor, if any, it
// supersedes) and supplier prices (to cost the "bom" factor), plus each
// material's own `weight` (for computeProductWeight()'s BOM-weight sum
// below - readProduct's own eager include doesn't need this, only
// costing does). Shared by productCost.js's loadProductForCosting (one
// product) and readProductsCogsCosts (every product at once, for the
// list page's Cost column), and by scheduling.js's ensureProjectionsFresh(),
// which needs the same geometry to compute Piece phase durations via
// pieceScheduling.js's getPieceDurationHours().
export const COSTING_INCLUDE = [
  {
    association: 'woodenBaseInfo',
    include: [
      {association: 'outside', include: [{association: 'shape'}]},
      {association: 'inside', include: [{association: 'shape'}]},
      {association: 'rabbet', include: [{association: 'shape'}]},
    ],
  },
  {
    association: 'bomLines',
    include: [{
      association: 'material',
      include: [{association: 'suppliers', through: {attributes: ['cost']}}],
    }],
  },
]
