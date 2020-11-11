import React from 'react'

import Grid from '@material-ui/core/Grid'

const CenteredGrid = ({ children }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      {children}
    </Grid>
  )
}

export default CenteredGrid
