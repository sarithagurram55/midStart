import React from 'react';
import { Routes, Route} from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


import Logo from './assets/logo.png';
import Home from './components/Home';
import Page from "./components/Page";

function App() {
  return(
    <div>
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{backgroundColor:'white',outline:'none'}}>
        <Toolbar variant="dense">
          <img src={Logo} height={50} />
          <Typography variant="h4" color="black" component="div" style={{marginLeft:'10px'}}>
            MidStart
          </Typography>
        </Toolbar>
      </AppBar>
      </Box>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/page' element={<Page />} />
      </Routes>
    </div>
  )
}
export default App