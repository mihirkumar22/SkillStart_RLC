import React from 'react';
import { Card } from 'react-bootstrap';
import NavBar from '../../navbar';
import { useLocation } from 'react-router-dom';
import  { format } from 'date-fns'

function Applicants () {
    const location = useLocation();
    const posting = location.state?.posting;

    const handleDate = (datePublished) => {
        if (datePublished) {
            const date = new Date(datePublished);
            return format(date, "EEE, MMM dd, yyyy")
        }
        return "Date not available"
    }
    
    return (
        <Card>
            <Card.Body>
                <Card.Header>
                    <NavBar role="employer" />
                </Card.Header>
                <Card.Title>Applicants for: {posting.title}</Card.Title>
                <Card.Text>Location: {posting.location}</Card.Text>
                <Card.Text>Address: {posting.address}</Card.Text>
                <Card.Text>Status: {posting.location}</Card.Text>
                <Card.Text>Date Published: {handleDate(posting.datePublished)}</Card.Text>
                <Card.Text>
                    Applicants: <br />
                    {posting.applicants}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Applicants;