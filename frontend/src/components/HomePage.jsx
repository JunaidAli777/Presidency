import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [registerNo, setRegisterNo] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setRegisterNo(value);

    if (value.trim()) {
        setError(false);
      }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!registerNo.trim()) {
      setError(true);
      return;
    }
    setError(false);
    navigate(`/student/${registerNo}`);

  };

  return (
    <Box className="min-h-[70vh] flex flex-col justify-center items-center p-4">
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ fontSize: { xs: '1.5rem', md: '2.25rem' } }}
      >
        Enter your register number to view the marks
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 2,
          maxWidth: 500,
          width: '100%',
        }}
      >
          <TextField
            label="Register No. *"
            variant="outlined"
            fullWidth
            value={registerNo}
            onChange={handleChange}
            size="small"
            error={error} 
            helperText={error ? "Please enter your register number." : ""}
          />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': { backgroundColor: '#444' },
            width: { xs: '100%', md: 'auto' },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
