import React, { useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';

import '../CSS/createAcc.css';

const CreateAccount = () => {
    return (
        <Segment inverted id="createAccSegment">
            <Form inverted>
                <Form.Group widths='equal'>
                    <Form.Input  fluid label='Username' placeholder='Rune400' />
                    <Form.Input  fluid label='Email' placeholder='joe@company.com' />
                </Form.Group>
                <Form.Input  fluid label='Password' placeholder='Password' type="password"/>
                <Button type='submit'>Create Account</Button>
                <Button type='submit'>Back</Button>
            </Form>
      </Segment>
    )
}

export default CreateAccount;