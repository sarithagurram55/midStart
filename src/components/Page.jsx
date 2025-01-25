import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Paper, Typography } from '@mui/material';

export default function Page() {
  const location = useLocation();
  const navigate = useNavigate();

  const { add, userLocation } = location.state || {};

  // Extract hospital coordinates safely
  const hospitalCoordinates = add?.geometry?.coordinates || []; // Optional chaining
  const hospitalLat = hospitalCoordinates[1]; // Hospital Latitude
  const hospitalLon = hospitalCoordinates[0]; // Hospital Longitude

  const [userAddress, setUserAddress] = useState('Fetching...');
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user's formatted address using reverse geocoding
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await axios.get(
          `http://api.geoapify.com/v1/geocode/reverse?lat=${userLocation?.lat}&lon=${userLocation?.lon}&type=state&lang=en&limit=1&format=json&apiKey=6855bfa3579542bc8dc41201233f7e96`
        );
        const formattedAddress =
          response.data?.features?.[0]?.properties?.formatted || 'Warangal';
        setUserAddress(formattedAddress);
      } catch (error) {
        console.error('Error fetching user address:', error);
        setUserAddress('Failed to fetch address');
      }
    };

    if (userLocation?.lat && userLocation?.lon) {
      fetchUserAddress();
    }
  }, [userLocation]);

  // Fetch route using Geoapify Routing API
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setRouteLoading(true);
        const response = await axios.get(
          `https://api.geoapify.com/v1/routing?waypoints=${userLocation?.lat},${userLocation?.lon}|${hospitalLat},${hospitalLon}&mode=drive&apiKey=6855bfa3579542bc8dc41201233f7e96`
        );
        setRouteData(response.data);
        setError(null); // Clear errors if successful
      } catch (err) {
        console.error('Error fetching route:', err);
        setError('Failed to fetch route');
      } finally {
        setRouteLoading(false);
      }
    };

    if (userLocation?.lat && userLocation?.lon && hospitalLat && hospitalLon) {
      fetchRoute();
    }
  }, [userLocation, hospitalLat, hospitalLon]);

  return (
    <Container>
      <Box display="flex" flexDirection='row' flexWrap="wrap" gap={2} justifyContent="flex-start">
        <Paper elevation={3} style={{ margin: '20px', padding: '40px 15px', width: '45%' }}>
          {/* Hospital Details */}
          <Typography variant="h5" gutterBottom className='two'>
            {add?.properties?.name || 'Unnamed Hospital'}
          </Typography>

          {/* User Details */}
          <Typography gutterBottom className='three'>User Latitude: {userLocation?.lat || 'Unknown'}</Typography>
          <Typography gutterBottom>User Longitude: {userLocation?.lon || 'Unknown'}</Typography>
          <Typography gutterBottom className='two'>User Address: {userAddress}</Typography>

          {/* Hospital Details */}
          <Typography gutterBottom className='three'>Hospital Latitude: {hospitalLat || 'Unknown'}</Typography>
          <Typography gutterBottom>Hospital Longitude: {hospitalLon || 'Unknown'}</Typography>
          <Typography gutterBottom className='two'>
            Hospital Address: {add?.properties?.formatted || 'Address not available'}
          </Typography>
          <Typography gutterBottom className='three'>
            Hospital Website: {add?.properties?.datasource?.url || 'Website not available'}
          </Typography>
          <Typography gutterBottom>State: {add?.properties?.state || 'Unknown'}</Typography>
          <Typography gutterBottom>City: {add?.properties?.city || 'Unknown'}</Typography>
        </Paper>

        {/* Route Information */}
        <Paper elevation={3} style={{ margin: '20px', padding: '10px 15px', width: '45%' }}>
          <Typography variant="h6" gutterBottom>
            Route Information
          </Typography>
          {routeLoading ? (
            <Typography>Loading route...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : routeData ? (
            <>
              <Typography>
                Distance: {routeData?.features?.[0]?.properties?.distance || 'Unknown'} meters
              </Typography>
              <Typography>
                Duration: {routeData?.features?.[0]?.properties?.time || 'Unknown'} seconds
              </Typography>
              <Typography>Directions:</Typography>
              <ul>
                {routeData?.features?.[0]?.properties?.legs?.[0]?.steps.map((step, index) => (
                  <li key={index}>{step.instruction.text}</li>
                ))}
              </ul>
            </>
          ) : (
            <Typography>No route data available</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
