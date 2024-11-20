import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import NavBar from '../../../navbar';

function ViewProfile () {
    const location = useLocation();
    const applicant = location.state?.applicant;

    return (
        <Card>
            <NavBar />
            <Card.Title>{applicant.username} Profile</Card.Title>
            <Card.Text>Email Address: {applicant.email}</Card.Text>
            <Card.Text>Location: {applicant.location}</Card.Text>
            <Card.Text>Phone Number: {applicant.phoneNumber}</Card.Text>
        </Card>
    )
}

export default ViewProfile;