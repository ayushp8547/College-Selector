import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, TextField, CircularProgress, Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';

// Styled component for a better input box design
const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#b0bec5',
    },
    '&:hover fieldset': {
      borderColor: '#1e88e5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1e88e5',
    },
  },
  '& label.Mui-focused': {
    color: '#1e88e5',
  },
});

// Styled Paper component for the box container
const StyledBox = styled(Paper)({
  padding: '20px',
  marginTop: '20px',
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
});

const CollegeSelector = () => {
  // State to hold the list of colleges
  const [colleges, setColleges] = useState([]);
  // State to hold the currently selected college
  const [selectedCollege, setSelectedCollege] = useState(null);
  // State to manage loading state during data fetching
  const [loading, setLoading] = useState(false);

  // Effect to fetch the list of colleges from the API when the component mounts
  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const response = await axios.get('http://universities.hipolabs.com/search');
        setColleges(response.data); // Set the fetched data to the colleges state
      } catch (error) {
        console.error('Error fetching colleges:', error); // Log any errors that occur during the fetch
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchColleges(); // Call the fetchColleges function
  }, []);

  // Handler for when a college is selected from the dropdown
  const handleSelection = (event, value) => {
    setSelectedCollege(value); // Set the selected college to the state
  };

  // Function to generate the URL for fetching the college logo
  const getLogoUrl = (domain) => `https://logo.clearbit.com/${domain}`;

  return (
    <Box p={2} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      {/* Autocomplete component for selecting a college */}
      <Autocomplete
        options={colleges} // Set the options to the list of colleges
        getOptionLabel={(option) => option.name} // Specify which property to use as the label
        loading={loading} // Pass the loading state to show a loading indicator
        onChange={handleSelection} // Handle the selection change
        renderInput={(params) => (
          <StyledTextField
            {...params}
            label="Select a College" // Label for the input field
            variant="outlined" // Use the outlined variant for the input field
            helperText="Start typing to search for a college" // Helper text to guide the user
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null} {/* Show a loading spinner if loading */}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            fullWidth // Make the input take the full width of its container
          />
        )}
      />
      {/* Display the selected college's name and logo if a college is selected */}
      {selectedCollege && (
        <StyledBox elevation={3}>
          <Typography variant="h5">{selectedCollege.name}</Typography> {/* Display the college name */}
          <img
            src={getLogoUrl(selectedCollege.domains[0])} // Fetch and display the college logo
            alt={selectedCollege.name} // Alt text for the image
            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')} // Fallback image if the logo cannot be fetched
            style={{ maxWidth: '150px', marginTop: '20px' }} // Styling for the image
          />
        </StyledBox>
      )}
    </Box>
  );
};

export default CollegeSelector;
