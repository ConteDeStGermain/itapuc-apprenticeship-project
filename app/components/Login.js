import React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';

import '../CSS/login.css';

const Login = () => {
    return (
        <Segment inverted id="loginSegment">
            <Form inverted>

                <Form.Input fluid label='Email' placeholder='joe@company.com' />
                <Form.Input fluid label='Password' placeholder='Password' type="password"/>

            <Button type='submit'>Submit</Button>
            </Form>
      </Segment>
    );
};

export default Login;