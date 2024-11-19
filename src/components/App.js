import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';

import Register from './register';
import Login from './login';
import Home from './home';
import Profile from './profile';
import EmployerPostings from './employerPostings';
import Applicants from './employerPostings/applicants';
import Postings from './postings';

function App() {
    return (
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/employer-postings" element={<EmployerPostings />} />
                    <Route path="/employer-postings/applicants" element={<Applicants />} />
                    <Route path="/postings" element={<Postings />} />
                    <Route path="/" element={<Register />} />
                </Routes>
            </Router>
    )
}

export default App;