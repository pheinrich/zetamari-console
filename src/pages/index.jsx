import CatalogSearch from '../common/components/catalogsearch'
import Layout from '../common/components/layout'

export default function HomePage()
{
  return (
    <section>
      <h2>Substrates</h2>
      <CatalogSearch />
    </section>
  )
}

HomePage.getLayout = function getLayout( page )
{
  return (
    <Layout>
      {page}
    </Layout>
  )
}