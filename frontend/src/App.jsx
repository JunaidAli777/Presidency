import './App.css'
import { Routes, Route } from 'react-router-dom';
import Header from'./components/Header.jsx'
import HomePage from './components/HomePage.jsx';
import FacultyMembers from './components/FacultyMembers.jsx';
import Students from './components/Students.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import StudentDetails from './components/StudentDetails.jsx';
import LoginPage from './components/LogIn.jsx';
import Footer from './components/Footer.jsx'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/facultymembers' element={<FacultyMembers />} />
        <Route path='/students' element={<Students />} />
        <Route path='/student/:registerNo' element={<StudentDetails />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
