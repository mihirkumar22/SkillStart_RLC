import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';

import Register from './register';
import Login from './login';
import Home from './home';
import Profile from './profile';

function App() {
    return (
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<Register />} />
                </Routes>
            </Router>
    )
}

export default App;