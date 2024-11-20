import React from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import styles from "./register.module.css" 


function RoleToggle({role, setRole}) {
    function handleChange(value) {
        setRole(value);
    }

    return (
        <ToggleButtonGroup name="role-toggle" type="radio" value={role} onChange={handleChange}>
            <ToggleButton id="student" value="student" >Student</ToggleButton>
            <ToggleButton id="employer" value="employer">Employer</ToggleButton>
        </ToggleButtonGroup>
    )
}

export default RoleToggle;