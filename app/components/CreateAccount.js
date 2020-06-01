import React, { useState, useRef } from 'react';
import { Button, Form, Segment, Loader } from 'semantic-ui-react';

import '../CSS/createAcc.css';

const CreateAccount = ({ onAuthenticated }) => {
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const email = useRef('');
    const displayName = useRef('');
    const password = useRef('');
    
    async function handleClick () {
        if(isCreatingAccount){
            return;
        }

        setIsCreatingAccount(true);
        try {
            const response = await fetch("http://localhost:8082/users", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({ email: email.current, password: password.current, displayName: displayName.current}),
            });

            if (response.ok) {
                alert('response ok')
                onAuthenticated(await response.json());
            } else {
                // display an alert  that login failed
                alert(await response.text())
            }
        } catch (error) {
            // display an alert
            alert("logging catch error")
        } finally {
            setIsCreatingAccount(false);
        }
    }

    return (
        <Segment inverted id="createAccSegment">
            <Form inverted>
                <Form.Group widths='equal'>
                    <Form.Input onChange={(e) => displayName.current = e.target.value} fluid label='Username' placeholder='Rune400' />
                    <Form.Input onChange={(e) => email.current = e.target.value} fluid label='Email' placeholder='joe@company.com' />
                </Form.Group>
                <Form.Input onChange={(e) => password.current = e.target.value}  fluid label='Password' placeholder='Password' type="password"/>
                <Button onClick={handleClick} type='submit'>Create Account</Button>
            </Form>
      </Segment>
    )
}

export default CreateAccount;