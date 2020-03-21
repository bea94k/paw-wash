import React from 'react'
import './App.css'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import WashList from './components/WashList'

const theme = createMuiTheme({
    spacing: [0, 4, 8, 16, 32, 64],
})

function App() {
    return (
        <ThemeProvider theme={theme}>
            <WashList />
        </ThemeProvider>
    )
}

export default App
