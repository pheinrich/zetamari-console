import Grid from '@mui/material/Grid'
import Preview from 'src/views/pages/calculator/Preview'

function Calculator( {id} )
{
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Preview id={id} />
      </Grid>
    </Grid>
  )
}

export async function getStaticPaths()
{
  const paths = Array.from( {length: 55}, (_, i) => i + 1).map( x => ({
    params: { id: `${x}` }
  }))

  return {
    paths,
    fallback: false
  }
}

export function getStaticProps( { params } )
{
  return {
    props: {
      id: params?.id
    }
  }
}

export default Calculator
