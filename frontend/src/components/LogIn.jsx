import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [errorMessage, setErrorMessage] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: !formData.email.trim() || !validateEmail(formData.email),
      password: !formData.password.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Login successful:', response.data);

      // Dispatch login action to update Redux state
      dispatch(login());

      // Store the facultyToken in sessionStorage
      sessionStorage.setItem('facultyToken', response.data.token);

      setFormData({ email: '', password: '' })
      navigate('/students')
      alert('Login successful!');
      
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
        Log In
      </Typography>

      {errorMessage && <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>{errorMessage}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, maxWidth: 400, width: '100%' }}
      >
        <TextField
          label="Email *"
          variant="outlined"
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          helperText={errors.email ? 'Please enter a valid email address' : ''}
          size="small"
        />

        <TextField
          label="Password *"
          variant="outlined"
          name="password"
          type="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helperText={errors.password ? 'Password cannot be empty' : ''}
          size="small"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#444' }, mt: 1 }}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;