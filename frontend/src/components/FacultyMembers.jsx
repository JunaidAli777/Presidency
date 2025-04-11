import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";


const FacultyMembers = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    branch: false,
    designation: false,
    email: false
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  const branches = [
    { value: 'CSE', label: 'Computer Science Engineering' },
    { value: 'ECE', label: 'Electronics & Communication Engineering' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'EEE', label: 'Electrical & Electronics Engineering' }
  ];

  const designations = ['HOD', 'Dean of Faculty', 'Professor', 'Assistant Professor'];


  const fetchFaculties = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.get("/api/faculties", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });      
      setFaculties(response.data);
    } catch (error) {
      console.error("Error fetching faculty members:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (!role || role !== "admin") {
      setError("unauthorized");
      setLoading(false);
      return;
    }
    fetchFaculties();
  }, []);

  const handleEditClick = (faculty) => {
    setFormErrors({
      firstName: false,
      lastName: false,
      branch: false,
      designation: false,
      email: false
    });
    setEditingFaculty(faculty);
  };

  const handleDeleteClick = (faculty) => {
    setFacultyToDelete(faculty);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(`/api/faculty/${facultyToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDeleteConfirmOpen(false);
      setFacultyToDelete(null);
      fetchFaculties();
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingFaculty({ ...editingFaculty, [name]: value });
    
    if (value.trim()) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      firstName: !editingFaculty.firstName.trim(),
      lastName: !editingFaculty.lastName.trim(),
      branch: !editingFaculty.branch,
      designation: !editingFaculty.designation,
      email: !editingFaculty.email.trim() || !validateEmail(editingFaculty.email)
    };
    
    setFormErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleEditSubmit = async () => {

    if (!validateForm()) {
      return;
    }

    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.put(
        `/api/faculty/${editingFaculty._id}`,
        editingFaculty,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setEditingFaculty(null);
      fetchFaculties();
    } catch (error) {
      console.error("Error updating faculty:", error);
    }
  };

  if (loading) 
    return (
      <div className="min-h-[70vh] flex justify-center items-center text-4xl p-4">Loading...</div>
    );

    
  if (error && error !== 'unauthorized')
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

  else if (error === "unauthorized")
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-2">
      <h4 className="text-red-500 text-5xl font-bold">401 - Unauthorized</h4>
      <p className="text-gray-600">You must be logged in as admin to view this page.</p>
    </div>
    );

  return (
    <div className="min-h-[70vh] p-4">
      <h1 className="text-4xl mb-4 max-sm:flex max-sm:justify-center">Faculty Details</h1>
      {faculties.length === 0 ? (
        <p className="text-xl">No faculty members found</p>
      ) : (
        <ul className="space-y-3">
          {faculties.map((faculty) => (
            <li key={faculty._id} className="border p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center">
              <div className="max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:items-center">
                <h2 className="text-lg sm:text-2xl font-semibold">
                  {faculty.firstName} {faculty.middleName} {faculty.lastName}
                </h2>
                <p className="text-md sm:text-lg">{faculty.branch} - {faculty.designation}</p>
                <p className="text-gray-600 text-xs sm:text-sm">{faculty.email}</p>
              </div>

              <div className="flex justify-start items-center gap-y-4">
                <Button 
                  sx={{color: 'black'}} 
                  size="small" 
                  variant="text" 
                  onClick={() => handleEditClick(faculty)}>
                    <EditIcon />
                  </Button>
                <Button 
                  sx={{color: '#c1121f'}} 
                  size="small" 
                  variant="text"
                  onClick={() => handleDeleteClick(faculty)}
                >
                    <DeleteIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Faculty Dialog */}
      {editingFaculty && (
        <Dialog open={true} onClose={() => setEditingFaculty(null)}>
          <DialogTitle>Edit Faculty</DialogTitle>
          <DialogContent>
            <TextField
             margin="dense"
             label="First Name *"
             name="firstName"
             value={editingFaculty.firstName}
             onChange={handleEditChange}
             fullWidth
             error={formErrors.firstName}
             helperText={formErrors.firstName ? "First name cannot be empty" : ""}
            />
            <TextField
              margin="dense"
              label="Middle Name"
              name="middleName"
              value={editingFaculty.middleName}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Last Name *"
              name="lastName"
              value={editingFaculty.lastName}
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
                value={editingFaculty.branch || ""}
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
              error={formErrors.designation}
            >
              <InputLabel id="designation-select-label">Designation *</InputLabel>
              <Select
                labelId="designation-select-label"
                id="designation-select"
                name="designation"
                value={editingFaculty.designation || ""}
                label="Designation *"
                onChange={handleEditChange}
              >
                {designations.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.designation && <FormHelperText>Please select a designation</FormHelperText>}
            </FormControl>

            <TextField
             margin="dense"
             label="Email *"
             name="email"
             value={editingFaculty.email}
             onChange={handleEditChange}
             fullWidth
             error={formErrors.email}
             helperText={formErrors.email ? "Please enter a valid email address" : ""}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setEditingFaculty(null)}>Cancel</Button>
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
          Are you sure you want to delete "{facultyToDelete?.firstName} {facultyToDelete?.middleName} {facultyToDelete?.lastName}" ?
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
    </div>
  );
};

export default FacultyMembers;