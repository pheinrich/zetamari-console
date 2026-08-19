import { readPiecesForProduction } from '@/db/actions/piece'
import ProductionTable from './ProductionTable'

export default async function ProductionPage()
{
  const pieces = await readPiecesForProduction()

  return <ProductionTable pieces={pieces} />
}
