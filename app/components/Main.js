import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Button, List, Header } from 'semantic-ui-react'
import RoomArea from './RoomArea.js';

import '../CSS/main.css';

const Main = ({ session, onLogout }) => {
    const [selectedTab, selectTab] = useState('Rooms');

    const headers = useMemo(() => ({  "Content-Type" : "application/json", "Authorization" : session.token }), [session.token])
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [chattingUserId, setChattingUserId] = useState();
    const currentRoomId = useMemo(() => rooms.filter((r) => r.participants.includes(chattingUserId)).map((r) => r.id)[0] , [rooms, chattingUserId]);

    const loadUsersAndRooms = async () => {
        try {
            const [usersResponse, roomsResponse] = await Promise.all([
                fetch("http://localhost:8082/users", { headers }), 
                fetch("http://localhost:8082/rooms", { headers }), 
            ]);

            if (usersResponse.ok) {
                setUsers(await usersResponse.json().then(({ data }) => data.filter((u) => u.id !== session.user.id)));
            } else {
               console.error("Failed to load users", await usersResponse.text());
            }

            if (roomsResponse.ok) {
                setRooms(await roomsResponse.json().then(({ data }) => data));
            } else {
                console.error("Failed to load rooms", await roomsResponse.text());
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect (() => { loadUsersAndRooms() }, [session]);

    

    return (
        <Grid style={{ height: '100vh' }}>
            <Grid.Column width='4' style={{ height: '100%', borderRight: '5px solid grey' }}>
                <Grid.Row>
                    <Button
                        style={{ width: '49%' }}
                        onClick={() => selectTab('Rooms')}
                        active={selectedTab == 'Rooms'}
                    >
                        Rooms
                    </Button>
                    <Button
                        style={{ width: '49%' }}
                        onClick={() => selectTab('Users')}
                        active={selectedTab == 'Users'}
                    >
                        Users
                    </Button>
                </Grid.Row>
                <Grid.Row style={{ height: '100%' }}>
                    <List celled>
                       {
                           selectedTab === 'Users' 
                           ? users.map((user) => (
                                <List.Item key={user.id} onClick={ () => setChattingUserId(user.id) }>
                                    <List.Content>
                                        <List.Header>{user.displayName}</List.Header>{user.email}
                                    </List.Content>
                                </List.Item>
                           ))
                           : rooms.map((room) => { 
                               const user = users.find((u) => room.participants.includes(u.id));
                               return  (
                                    <List.Item key={room.id} onClick={ () => setChattingUserId(user.id) }>
                                        <List.Content>
                                            <List.Header>{user.displayName}</List.Header>{room.createdAt}
                                        </List.Content>
                                    </List.Item>
                                )
                            })
                       }
                    </List>
                </Grid.Row>
                <Button color='red' 
                    style={{ position: 'absolute', bottom: '10px', width: '95%', left: '2.5%'}}
                    onClick={ onLogout }
                >
                    Log out
                </Button>
            </Grid.Column>
            <Grid.Column width='12' style={{ height: '100%' }}>
                {   
                    chattingUserId &&
                    <RoomArea 
                        session={session} 
                        roomId={currentRoomId} 
                        chattingUserId={chattingUserId} 
                        headers={headers} 
                        onNewRoom={ (room) =>  setRooms([...rooms, room])}
                    />
                }
            </Grid.Column>
        </Grid>

    )
}

export default Main;