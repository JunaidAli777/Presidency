import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Link } from 'react-router-dom';

const Students = () => {
  const [ students, setStudents ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ isToken, setIsToken ] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
      firstName: "",
      middleName: "",
      lastName: "",
      branch: "",
      year: "",
      registerNo: "",
      mathematics: "",
      physics: "",
      chemistry: "",
      computerScience: "",
      technicalEnglish: "",
      engineeringGraphics: ""
  });

  const [formErrors, setFormErrors] = useState({
      firstName: false,
      lastName: false,
      branch: false,
      year: false,
      registerNo: false,
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const branches = [
      { value: 'CSE', label: 'Computer Science Engineering' },
      { value: 'ECE', label: 'Electronics & Communication Engineering' },
      { value: 'MECH', label: 'Mechanical Engineering' },
      { value: 'CIVIL', label: 'Civil Engineering' },
      { value: 'EEE', label: 'Electrical & Electronics Engineering' }
    ];
  
  const years = [ '1st', '2nd', '3rd', '4th' ];

  const grades = [ 'S', 'A' , 'B', 'C', 'D' ];



  const fetchStudents = async () => {
    try {
      const facultyToken = sessionStorage.getItem("facultyToken");
      const adminToken = sessionStorage.getItem("adminToken");
      const token = facultyToken || adminToken;

      if (token) {
        setIsToken(true);
      } else {
        setIsToken(false);
        setLoading(false);
        return;
      }
      const response = await axios.get("http://localhost:3000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
    } catch (error) {
        console.error("Error fetching students:", error);
        if (error.response && error.response.status === 401) {
          setIsToken(false);
        } else {
          setError(true);
        }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      fetchStudents();
  }, []);

  const handleEditClick = (student) => {
      setFormErrors({
          firstName: false,
          lastName: false,
          branch: false,
          year: false,
          registerNo: false,
        });
        setEditingStudent(student);
    };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent(prev => ({
    ...prev,
    [name]: value
    }));

    if (value.trim()) {
    setFormErrors(prev => ({ ...prev, [name]: false }));
  }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      firstName: !editingStudent.firstName.trim(),
      lastName: !editingStudent.lastName.trim(),
      branch: !editingStudent.branch,
      year: !editingStudent.year,
      registerNo: !editingStudent.registerNo || isNaN(Number(editingStudent.registerNo))
    };
      
    setFormErrors(newErrors);
      
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    try  {
      const facultyToken = sessionStorage.getItem("facultyToken");
      const adminToken = sessionStorage.getItem("adminToken");
      const token = facultyToken || adminToken;

      await axios.put(
        `http://localhost:3000/api/student/${editingStudent.registerNo}`,
        editingStudent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("Error editing student:", error);
      alert('Failed editing student. Please try again.');
    }
  }

  const handleAddStudentChange = (e) => {
      const { name, value } = e.target;
      setNewStudent(prev => ({
      ...prev,
      [name]: value
      }));

      if (value.trim()) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  }


  const handleAddStudentSubmit = async (e) => {
      e.preventDefault();

      const newErrors = {
        firstName: !newStudent.firstName.trim(),
        lastName: !newStudent.lastName.trim(),
        branch: !newStudent.branch,
        year: !newStudent.year,
        registerNo: !newStudent.registerNo || isNaN(Number(newStudent.registerNo))
      };
        
      setFormErrors(newErrors);
        
      if (Object.values(newErrors).some(error => error)) {
        return;
      }

      try {
        const facultyToken = sessionStorage.getItem("facultyToken");
        const adminToken = sessionStorage.getItem("adminToken");
        const token = facultyToken || adminToken;
        
        const response = await axios.post("http://localhost:3000/api/students", newStudent, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchStudents();
        setOpenDialog(false);
        console.log('Student added:', response.data);
        setNewStudent({
          firstName: "",
          middleName: "",
          lastName: "",
          branch: "",
          year: "",
          registerNo: "",
          mathematics: "",
          physics: "",
          chemistry: "",
          computerScience: "",
          technicalEnglish: "",
          engineeringGraphics: ""
        })
        alert('Student added!');
      } catch (error) {
        console.error("Error adding student:", error);
        alert('Failed to add student. Please try again.');
      }
  };

  
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const facultyToken = sessionStorage.getItem("facultyToken");
      const adminToken = sessionStorage.getItem("adminToken");
      const token = facultyToken || adminToken;
      await axios.delete(`http://localhost:3000/api/student/${studentToDelete.registerNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  if (loading) 
  return (
      <div 
          className="min-h-[70vh] flex justify-center items-center text-4xl p-4"
      >
          Loading...
      </div>
  );

  if (error) 
    return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center gap-2">
        <div className="flex justify-center items-center mb-0">
            <h4 className="text-gray-500 text-7xl font-bold">
              500!
            </h4>
            <div 
              className="flex justify-center items-center text-4xl text-red-500 p-4">
              Server Error
            </div>
        </div>
        <div className="text-gray-600 mt-0">
            <p>Oops, something went wrong.</p>
            <p>Try refreshing the page or contact us if the problem persists</p>
            </div>
        </div>
    );

  else if (!isToken) 
    return (
      <div className="min-h-[70vh] flex justify-center items-center gap-2">
        <div className="flex flex-col justify-center items-center mb-0">
            <h4 className="text-gray-500 text-7xl font-bold">
              Error 401!
            </h4>
            <div 
            className="flex justify-center items-center text-4xl text-red-500 p-4">
                You need to be logged in to access this route
            </div>
        </div>
      </div>
    )
  

  return (
    <div className='min-h-[70vh] p-4'>
        <h1 className="text-4xl mb-4 max-sm:flex max-sm:justify-center">Students</h1>
        { students.length === 0 ? (
            <p className="text-xl">No students found</p>
        ) : (
                <ul className="space-y-3">
                    {students.map((student) => (
                        <li key={student._id} className="border p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center">
                        <div className="max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:items-center">
                            <h2 className="text-lg sm:text-2xl font-semibold">
                            {student.firstName} {student.middleName} {student.lastName}
                            </h2>
                            <p className="text-md sm:text-lg">{student.branch}</p>
                            <p className="text-md sm:text-lg">{student.year} Year</p>
                            <p className="text-md sm:text-lg">Register No. {student.registerNo}</p>
                            <Button
                             size="small"
                             variant="contained"
                             sx={{ marginY: '1rem'}}
                             >
                              <Link to={`/student/${student.registerNo}`}>
                                View Details                              
                              </Link>
                            </Button>
                        </div>

                        <div className="flex justify-start items-center gap-y-4">
                            <Button 
                            sx={{color: 'black'}} 
                            size="small" 
                            variant="text" 
                            onClick={() => handleEditClick(student)}>
                                <EditIcon />
                            </Button>
                            <Button 
                            sx={{color: '#c1121f'}} 
                            size="small" 
                            variant="text"
                            onClick={() => handleDeleteClick(student)}
                            >
                                <DeleteIcon />
                            </Button>
                        </div>
                        </li>
                    ))}
            </ul>
        )}

      {/* Edit Student Dialog */}
      {editingStudent && (
        <Dialog open={true} onClose={() => setEditingStudent(null)}>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogContent>
          <TextField 
                margin="dense" 
                label="First Name *" 
                name="firstName" 
                value={editingStudent.firstName} 
                onChange={handleEditChange}
                fullWidth
                error={formErrors.firstName}
                helperText={formErrors.firstName ? "First name cannot be empty" : ""}
              />

              <TextField 
                margin="dense" 
                label="Middle Name" 
                name="middleName" 
                value={editingStudent.middleName} 
                onChange={handleEditChange} 
                fullWidth 
              />

              <TextField 
                margin="dense" 
                label="Last Name *" 
                name="lastName" 
                value={editingStudent.lastName} 
                onChange={handleEditChange} 
                fullWidth
                error={formErrors.lastName}
                helperText={formErrors.lastName ? "Last name cannot be empty" : ""}
              />

              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
                error={formErrors.branch}
                >
                <InputLabel id="branch-select-label">Branch *</InputLabel>
                <Select
                    labelId="branch-select-label"
                    id="branch-select"
                    name="branch"
                    value={editingStudent.branch}
                    label="Branch *"
                    onChange={handleEditChange}
                >
                  {branches.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                      {option.label}
                  </MenuItem>
                  ))}
                </Select>
                {formErrors.branch && <FormHelperText>Please select a branch</FormHelperText>}
              </FormControl>

              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
                error={formErrors.year}
              >
                <InputLabel id="year-select-label">Year *</InputLabel>
                <Select
                    labelId="year-select-label"
                    id="year-select"
                    name="year"
                    value={editingStudent.year}
                    label="Year *"
                    onChange={handleEditChange}
                >
                    {years.map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                    ))}
                </Select>
                {formErrors.year && <FormHelperText>Please select a year</FormHelperText>}
              </FormControl>

              <TextField  
                margin="dense" 
                label="Register No *" 
                name="registerNo" 
                value={editingStudent.registerNo} 
                onChange={handleEditChange} 
                fullWidth
                error={formErrors.registerNo}
                helperText={formErrors.registerNo ? "Please enter a valid register number" : ""}
              />

              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="mathematicsGrade-select-label">Mathematics</InputLabel>
                <Select
                    labelId="mathematicsGrade-select-label"
                    id="mathematicsGrade-select"
                    name="mathematics"
                    value={editingStudent.mathematics}
                    label="Mathematics"
                    onChange={handleEditChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="physicsGrade-select-label">Physics</InputLabel>
                <Select
                    labelId="physicsGrade-select-label"
                    id="physicsGrade-select"
                    name="physics"
                    value={editingStudent.physics}
                    label="Physics"
                    onChange={handleEditChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="chemistryGrade-select-label">Chemistry</InputLabel>
                <Select
                    labelId="chemistryGrade-select-label"
                    id="chemistryGrade-select"
                    name="chemistry"
                    value={editingStudent.chemistry}
                    label="Chemistry"
                    onChange={handleEditChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="computerScienceGrade-select-label">Computer Science</InputLabel>
                <Select
                    labelId="computerScienceGrade-select-label"
                    id="computerScienceGrade-select"
                    name="computerScience"
                    value={editingStudent.computerScience}
                    label="Computer Science"
                    onChange={handleEditChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="technicalEnglishGrade-select-label">Technical English</InputLabel>
                <Select
                    labelId="technicalEnglishGrade-select-label"
                    id="technicalEnglishGrade-select"
                    name="technicalEnglish"
                    value={editingStudent.technicalEnglish}
                    label="Technical English"
                    onChange={handleEditChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="engineeringGraphicsGrade-select-label">Engineering Graphics</InputLabel>
                <Select
                    labelId="engineeringGraphicsGrade-select-label"
                    id="engineeringGraphicsGrade-select"
                    name="engineeringGraphics"
                    value={editingStudent.engineeringGraphics}
                    label="Engineering Graphics"
                    onChange={handleEditChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>

            
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setEditingStudent(null)}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>

        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          Are you sure you want to delete "{studentToDelete?.firstName} {studentToDelete?.middleName} {studentToDelete?.lastName}" ?
          This action cannot be undone.
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            sx={{backgroundColor: '#c1121f'}}
          >
            Delete
          </Button>
        </DialogActions>
        
      </Dialog>


      {/* Add a Student */}
        <Button variant="contained" color="success" sx={{ marginTop: 2 }} onClick={() => setOpenDialog(true)}>
            Add a Student
        </Button>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add a Student</DialogTitle>
            <DialogContent>
              <TextField 
                margin="dense" 
                label="First Name *" 
                name="firstName" 
                value={newStudent.firstName} 
                onChange={handleAddStudentChange}
                fullWidth
                error={formErrors.firstName}
                helperText={formErrors.firstName ? "First name cannot be empty" : ""}
              />

              <TextField 
                margin="dense" 
                label="Middle Name" 
                name="middleName" 
                value={newStudent.middleName} 
                onChange={handleAddStudentChange} 
                fullWidth 
              />

              <TextField 
                margin="dense" 
                label="Last Name *" 
                name="lastName" 
                value={newStudent.lastName} 
                onChange={handleAddStudentChange} 
                fullWidth
                error={formErrors.lastName}
                helperText={formErrors.lastName ? "Last name cannot be empty" : ""}
              />

              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
                error={formErrors.branch}
                >
                <InputLabel id="branch-select-label">Branch *</InputLabel>
                <Select
                    labelId="branch-select-label"
                    id="branch-select"
                    name="branch"
                    value={newStudent.branch}
                    label="Branch *"
                    onChange={handleAddStudentChange}
                >
                  {branches.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                      {option.label}
                  </MenuItem>
                  ))}
                </Select>
                {formErrors.branch && <FormHelperText>Please select a branch</FormHelperText>}
              </FormControl>

              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
                error={formErrors.year}
              >
                <InputLabel id="year-select-label">Year *</InputLabel>
                <Select
                    labelId="year-select-label"
                    id="year-select"
                    name="year"
                    value={newStudent.year}
                    label="Year *"
                    onChange={handleAddStudentChange}
                >
                    {years.map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                    ))}
                </Select>
                {formErrors.year && <FormHelperText>Please select a year</FormHelperText>}
              </FormControl>

              <TextField  
                margin="dense" 
                label="Register No *" 
                name="registerNo" 
                value={newStudent.registerNo} 
                onChange={handleAddStudentChange} 
                fullWidth
                error={formErrors.registerNo}
                helperText={formErrors.registerNo ? "Please enter a valid register number" : ""}
              />

              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="mathematicsGrade-select-label">Mathematics</InputLabel>
                <Select
                    labelId="mathematicsGrade-select-label"
                    id="mathematicsGrade-select"
                    name="mathematics"
                    value={newStudent.mathematics}
                    label="Mathematics"
                    onChange={handleAddStudentChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="physicsGrade-select-label">Physics</InputLabel>
                <Select
                    labelId="physicsGrade-select-label"
                    id="physicsGrade-select"
                    name="physics"
                    value={newStudent.physics}
                    label="Physics"
                    onChange={handleAddStudentChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="chemistryGrade-select-label">Chemistry</InputLabel>
                <Select
                    labelId="chemistryGrade-select-label"
                    id="chemistryGrade-select"
                    name="chemistry"
                    value={newStudent.chemistry}
                    label="Chemistry"
                    onChange={handleAddStudentChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="computerScienceGrade-select-label">Computer Science</InputLabel>
                <Select
                    labelId="computerScienceGrade-select-label"
                    id="computerScienceGrade-select"
                    name="computerScience"
                    value={newStudent.computerScience}
                    label="Computer Science"
                    onChange={handleAddStudentChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="technicalEnglishGrade-select-label">Technical English</InputLabel>
                <Select
                    labelId="technicalEnglishGrade-select-label"
                    id="technicalEnglishGrade-select"
                    name="technicalEnglish"
                    value={newStudent.technicalEnglish}
                    label="Technical English"
                    onChange={handleAddStudentChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl 
                fullWidth 
                margin="dense"
                size="small" 
              >
                <InputLabel id="engineeringGraphicsGrade-select-label">Engineering Graphics</InputLabel>
                <Select
                    labelId="engineeringGraphicsGrade-select-label"
                    id="engineeringGraphicsGrade-select"
                    name="engineeringGraphics"
                    value={newStudent.engineeringGraphics}
                    label="Engineering Graphics"
                    onChange={handleAddStudentChange}
                >
                  <MenuItem>Unselect the grade</MenuItem>
                  {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                      {grade}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button onClick={handleAddStudentSubmit} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
      
    </div>
  )
}

export default Students
