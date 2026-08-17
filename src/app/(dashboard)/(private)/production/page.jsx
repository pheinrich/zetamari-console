import { readPiecesForBoard } from '@/db/actions/piece'
import ProductionBoard from './ProductionBoard'

// CONTEXT.md's Production Phase order - every Piece.phase ENUM value,
// regardless of whether a given piece's own sequence (kit vs finished,
// see pieceScheduling.js's PHASE_SEQUENCES) actually passes through all
// of them. Glass will almost always be empty (advancePieces() auto-
// skips it whenever its duration is 0), but still shown for the rare
// piece actually sitting there with real hand-cut time pending.
const PHASE_ORDER = ['Design', 'CNC', 'Sanding', 'Picking', 'Gluing', 'Grouting', 'Glass', 'Finishing']

export default async function ProductionPage()
{
  const pieces = await readPiecesForBoard()

  const columns = PHASE_ORDER.map( phase => ({
    phase,
    pieces: pieces.filter( p => p.phase === phase ),
  }) )

  return <ProductionBoard columns={columns} />
}
