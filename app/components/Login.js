import React, { useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';

import '../CSS/login.css';
 
const Login = (props) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleClick () {
        setIsLoggingIn(true);
        try {
            const response = await fetch("http://localhost:8082/login", {
                method: "POST",
                headers: {
                    "Contend-Type" : "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                console.log('response ok')
                props.onAuthenticated(await response.json());
            } else if (response.status === 401) {
                // display an alert taht email/password were incorrect
                console.log("Email/password incorrect")
            } else {
                // display an alert  that login failed
                console.log('login failed')
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
                <Form.Input onChange={(e) => setEmail(e.target.value)}  fluid label='Email' placeholder='joe@company.com' />
                <Form.Input onChange={(e) => setPassword(e.target.value)} fluid label='Password' placeholder='Password' type="password"/>
                <Button onClick={() => handleClick()} type='submit'>Log in</Button>
                <Button type='submit'>Create Account</Button>
            </Form>
      </Segment>
    );
};

export default Login;