import React, { useState, useRef } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';

import '../CSS/login.css';
 
const Login = (props) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const email = useRef('');
    const password = useRef('');

    async function handleClick () {
        if(isLoggingIn){
            return;
        }

        setIsLoggingIn(true);
        try {
            const response = await fetch("http://localhost:8082/login", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({ email: email.current, password: password.current }),
            });

            if (response.ok) {
                console.log('response ok')
                props.onAuthenticated(await response.json());
            } else if (response.status === 401) {
                // display an alert taht email/password were incorrect
                alert("Email/password incorrect")
            } else {
                // display an alert  that login failed
                alert('login failed')
            }
        } catch (error) {
            // display an alert
            console.log("logging catch error")
        } finally {
            setIsLoggingIn(false);
        }
    }

    // Show a loading gif if isLoggingIn is true
    return (
        <Segment inverted id="loginSegment">
            <Form inverted>
                <Form.Input onChange={(e) => email.current = e.target.value}  fluid label='Email' placeholder='joe@company.com' />
                <Form.Input onChange={(e) => password.current = e.target.value} fluid label='Password' placeholder='Password' type="password"/>
                <Button onClick={() => handleClick()} type='submit'>Log in</Button>
            </Form>
      </Segment>
    );
};

export default Login;