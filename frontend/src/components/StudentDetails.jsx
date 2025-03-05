import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Button } from '@mui/material';

const StudentDetails = () => {
  const [student, setStudent] = useState({});
  const [error, setError] = useState({ status: null, message: '' });
  const { registerNo } = useParams();

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/student/${registerNo}`);
        if (!response.data || Object.keys(response.data).length === 0) {
          setError({ status: 404, message: 'Student not found' });
        } else {
          setStudent(response.data);
          setError({ status: null, message: '' });
        }
      } catch (error) {
        const status = error.response?.status || 'unknown';
        
        if (status === 404) {
          setError({ status: 404, message: 'Student not found' });
        } else if (status === 500) {
          setError({ status: 500, message: 'Internal Server Error' });
        } else {
          setError({ status: 'other', message: 'An error occurred' });
        }
      }
  } 

  useEffect(() => {
    fetchStudent();
  }, []);
  
  return (
    <div className='min-h-[70vh] flex justify-center items-center'>
        {error.status === 404 ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">404 - Student Not Found</h1>
          <p className="text-lg text-gray-600">The student with Register No. {registerNo} does not exist.</p>
          <Link to="/">
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>Go Home</Button>
          </Link>
        </div>
      ) : error.status === 500 ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">500 - Internal Server Error</h1>
          <p className="text-lg text-gray-600">Something went wrong. Please try again later.</p>
          <Link to="/">
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>Go Home</Button>
          </Link>
        </div>
      ) : error.status ? (
        <div className="flex flex-col justify-center items-center">
          <Card sx={{ paddingX: '5rem', textAlign: 'center' }}>
            <CardContent>
              <Alert severity="error">{error.message}</Alert>
            </CardContent>
            <CardActions>
              <Button size="small">
                <Link to="/">Home</Link>
              </Button>
            </CardActions>
          </Card>
        </div>
      ) : (
        <Card sx={{ paddingX: '5rem'}}>
          <CardContent>
            <Typography variant="h4" component="div">
              {student.firstName} {student.middleName} {student.lastName}
            </Typography>
            <Typography sx={{mb: 1.5}} variant="body1">
                {student.branch} - {student.year} Year
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{student.registerNo}</Typography>


            <Typography sx={{mb: 1}} variant="body1">
                Mathematics - {student.mathematics}
            </Typography>

            <Typography sx={{mb: 1}} variant="body1">
                Physics - {student.physics}
            </Typography>

            <Typography sx={{mb: 1}} variant="body1">
                Chemistry - {student.chemistry}
            </Typography>

            <Typography sx={{mb: 1}} variant="body1">
                Computer Science - {student.computerScience}
            </Typography>

            <Typography sx={{mb: 1}} variant="body1">
                Technical English - {student.technicalEnglish}
            </Typography>

            <Typography sx={{mb: 1}} variant="body1">
                Engineering Graphics - {student.engineeringGraphics}
            </Typography>

          </CardContent>
          <CardActions>
            <Button size="small">
              <Link to='/'>Home</Link>
            </Button>
          </CardActions>
        </Card>
      )}
    </div>
  )
}

export default StudentDetails
