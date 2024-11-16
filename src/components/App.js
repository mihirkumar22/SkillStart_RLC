import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Register from './register';
import Login from './login';
import Home from './home'

function App() {
    return (
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />

                    <Route path="/" element={<Register />} />
                </Routes>
            </Router>
    )
}

export default App;