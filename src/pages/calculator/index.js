import Grid from '@mui/material/Grid'
import Preview from 'src/views/pages/calculator/Preview'

function Calculator()
{
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Preview id={2} />
      </Grid>
    </Grid>
  )
}

export default Calculator
