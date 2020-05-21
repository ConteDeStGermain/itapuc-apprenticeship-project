import React, { useState } from 'react';
import { Grid, Button, List, Header, Divider } from 'semantic-ui-react'

import '../CSS/main.css';

const Main = () => {
    const [selectedTab, selectTab] = useState('Rooms');

    return (
        <Grid style={{ height: '100vh' }}>
            <Grid.Column width='4' style={{ height: '100%', borderRight: '5px solid grey' }}>
                <Grid.Row>
                    <Button 
                        style={{ width: '49%' }} 
                        onClick={ () => selectTab('Rooms') }
                        active={selectedTab == 'Rooms'}
                    >
                        Rooms
                    </Button>
                    <Button 
                        style={{ width: '49%' }} 
                        onClick={ () => selectTab('Users') }
                        active={selectedTab == 'Users'}
                    >
                        Users
                    </Button>
                </Grid.Row>
                <Grid.Row style={{ height: '100%' }}>
                <List celled>
                    <List.Item>
                        <List.Content>
                            <List.Header>UserName</List.Header>Date Created
                        </List.Content>
                     </List.Item>

                     <List.Item>
                        <List.Content>
                            <List.Header>UserName</List.Header>Date Created
                        </List.Content>
                     </List.Item>

                     <List.Item>
                        <List.Content>
                            <List.Header>UserName</List.Header>Date Created
                        </List.Content>
                     </List.Item>

                    </List>
                </Grid.Row>
            </Grid.Column>
            <Grid.Column width='12' style={{ height: '100%'}}>
                <Grid.Row>
                    <Header size='huge'  style={{ display: 'inline' }}>UserName</Header>
                    <Button floated='right' color='red'>Log out</Button>
                </Grid.Row>
                <Grid.Row style={{ height: '95%' }}>Messages</Grid.Row>
                <Grid.Row>Input</Grid.Row>
            </Grid.Column>
        </Grid>

    )
}

export default Main;