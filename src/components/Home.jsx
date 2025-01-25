import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import '../App.css';
//import { Grid } from '@mui/material';
import { Box, Paper, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [address,setAddress] = useState([]);
  const [userLocation, setUserLocation] = useState([]) //useState({ lat: 17.9820644, lon: 79.5970954 }); // Mock user location
  const navigate = useNavigate()

  useEffect(()=>{
    const getData = async () => {
      try{
          const data =await axios.get(`https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:79.5970954,17.9820644,5000&bias=proximity:79.5970954,17.9820644&limit=20&apiKey=6855bfa3579542bc8dc41201233f7e96`) ;
                console.log(data.data.features)
                setAddress(data.data.features)
            }catch(err){
                console.log(err);
            }
        }
        getData();
    },[userLocation])

    const handleClick = (add) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newUserLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setUserLocation(newUserLocation); // Update userLocation state
          navigate('/page', { state: { add, userLocation: newUserLocation } });
        },
        (error) => {
          console.log('Geolocation error: ', error);
          alert('Unable to retrieve your location. Please enable location services.');
        }
      );
    };
  


  return (
        <Container >
          {/* Use Box as the flex container to arrange the items side by side */}
          <Box
            display="flex" 
            flexWrap="wrap" // Allow wrapping to next row
            gap={2} // Add gap between items
            justifyContent="flex-start" // Align to left
          >
            {address.map((add, index) => {
            return(
                // <Paper key={index} elevation={3} sx={{ padding: '20px', width: { xs: '100%', sm: '48%', md: '30%' } }}>
                <Paper key={index} style={{width:"45%",margin:'15px' , padding:'8px'}}  onClick={()=> handleClick(add) }>
                    <Typography variant="h5" style={{borderBottom:'2px solid gray', padding:'10px 0'}}>{add.properties.name}</Typography>
                    <Typography style={{font:'10px',padding:'10px 0'}}>{add.properties.formatted}</Typography>
                    <Typography style={{font:'10px'}}>{add.properties.address_line2}</Typography>
                    <Typography style={{font:'10px'}}>{add.properties.datasource.url}</Typography>                   
                </Paper>
            )})}
          </Box>
        </Container>
      );
    }