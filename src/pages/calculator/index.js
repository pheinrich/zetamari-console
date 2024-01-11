// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import MirrorView from 'src/views/pages/calculator/MirrorView'
import Preview from 'src/views/pages/calculator/Preview'

const Calculator = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Preview />
      </Grid>
    </Grid>
  )
}

export default Calculator
