import React from 'react'

import {
  createMuiTheme,
  ThemeProvider as Provider
} from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

const ThemeProvider = ({ children }) => (
  <Provider theme={theme}>
    <CssBaseline />
    {children}
  </Provider>
)

export { theme, ThemeProvider }
