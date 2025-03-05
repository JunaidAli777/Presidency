import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, FormHelperText, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    branch: '',
    designation: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    branch: false,
    designation: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (value.trim()) {
      setErrors(prev => ({ ...prev, [name]: false }));
      }
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      branch: !formData.branch,
      designation: !formData.designation,
      email: !formData.email.trim() || !validateEmail(formData.email),
      password: !formData.password || formData.password.length < 6,
      confirmPassword: formData.password !== formData.confirmPassword,
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    const { confirmPassword, ...dataToSubmit } = formData;
    
    try {
      const response = await axios.post('http://localhost:3000/api/faculties', dataToSubmit, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      localStorage.setItem('facultyData', JSON.stringify(response.data));
      console.log('Signup successful:', response.data);
      setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          branch: '',
          designation: '',
          email: '',
          password: '',
          confirmPassword: '',
        })
        dispatch(login());
      navigate('/students')
      alert('Signup successful!');
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert('Failed to sign up. Please try again.');
    }

  };

  const branches = [
    { value: 'CSE', label: 'Computer Science Engineering' },
    { value: 'ECE', label: 'Electronics & Communication Engineering' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'EEE', label: 'Electrical & Electronics Engineering' }
  ];

  const designations = [
    
    'HOD', 'Dean of Faculty', 'Professor', 'Assistant Professor']

  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom   
        sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
      >
        Sign Up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 2,
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="First Name *"
            variant="outlined"
            name="firstName"
            fullWidth
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            helperText={errors.firstName ? "First name cannot be empty" : ""}
            size="small"
          />
          <TextField
            label="Middle Name"
            variant="outlined"
            name="middleName"
            fullWidth
            value={formData.middleName}
            onChange={handleChange}
            size="small"
          />
          <TextField
            label="Last Name *"
            variant="outlined"
            name="lastName"
            fullWidth
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            helperText={errors.lastName ? "Last name cannot be empty" : ""}
            size="small"
          />
        </Stack>

        <FormControl 
          fullWidth 
          size="small" 
          error={errors.branch}
        >
          <InputLabel id="branch-select-label">Branch *</InputLabel>
          <Select
            labelId="branch-select-label"
            id="branch-select"
            name="branch"
            value={formData.branch}
            label="Branch *"
            onChange={handleChange}
          >
            {branches.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {errors.branch && <FormHelperText>Please select your branch</FormHelperText>}
        </FormControl>
        
        <FormControl 
          fullWidth 
          size="small" 
          error={errors.designation}
        >
          <InputLabel id="designation-select-label">Designation *</InputLabel>
          <Select
            labelId="designation-select-label"
            id="designation-select"
            name="designation"
            value={formData.designation}
            label="Designation *"
            onChange={handleChange}
          >
            {designations.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {errors.designation && <FormHelperText>Please select your designations</FormHelperText>}
        </FormControl>

        <TextField
          label="Email *"
          variant="outlined"
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          helperText={errors.email ? "Please enter a valid email address" : ""}
          size="small"
        />
        
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Password *"
            variant="outlined"
            name="password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            helperText={errors.password ? "Password must be at least 6 characters" : ""}
            size="small"
          />
          <TextField
            label="Confirm Password *"
            variant="outlined"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword ? "Passwords do not match" : ""}
            size="small"
          />
        </Stack>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': { backgroundColor: '#444' },
            mt: 1,
          }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default SignupPage;