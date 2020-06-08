import React, { useEffect, useState, useRef } from "react";
import { Grid, Input, Button } from "semantic-ui-react";
import Message from "./Message";
import io from "socket.io-client";

import "../CSS/room.css";

const RoomArea = ({
  apiHost,
  session,
  roomId,
  chattingUserId,
  headers,
  onNewRoom,
}) => {
  const message = useRef("");
  const [messages, setMessages] = useState([]);

  // TODO: Connect to socket.io
  const loadMessages = async () => {
    if (!roomId) {
      return;
    }

    try {
      const messagesResponse = await fetch(
        `${apiHost}/rooms/${roomId}/messages`,
        { headers }
      );

      if (messagesResponse.ok) {
        setMessages(await messagesResponse.json().then(({ data }) => data));
      } else {
        console.error("Failed to load messages", await messagesResponse.text());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const socket = io.connect(`${apiHost}?token=${session.token}`);
    socket.on("new-message", (data) => {
      console.log(data);
    });
    loadMessages();
    return () => {
      socket.close();
    };
  }, [session]);

  const handleSend = async () => {
    const localMsg = message.current;
    let localRoomId = roomId;

    if (localMsg === "") {
      return;
    } else if (!localRoomId) {
      const postRoomResponse = await fetch(`${apiHost}/rooms`, {
        method: "POST",
        headers,
        body: JSON.stringify({ participants: [chattingUserId] }),
      });
      if (postRoomResponse.ok) {
        const { data: room } = await postRoomResponse.json();
        localRoomId = room.id;
        onNewRoom(room);
      } else {
        console.error(
          "Failed to create room with new user",
          await postRoomResponse.text()
        );
        return;
      }
    }

    const postMsgResponse = await fetch(
      `${apiHost}/rooms/${localRoomId}/messages`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ text: localMsg }),
      }
    );

    if (postMsgResponse.ok) {
      const { data: msg } = await postMsgResponse.json();
      setMessages([...messages, msg]);
      message.current = "";
    } else {
      console.error(
        "Failed to send message to user",
        await postMsgResponse.text()
      );
    }
  };

  return (
    <React.Fragment>
      <div id="roomBox">
        <div id="messages">
          {messages.map((msg) => {
            return (
              <Message
                text={msg.text}
                isSent={session.user.id === msg.authorId}
              />
            );
          })}
        </div>
      </div>
      <div id="inputArea">
        <Input
          onChange={(e) => (message.current = e.target.value)}
          className="inputMsg"
          placehodler="Say hi..."
        />
        <Button onClick={handleSend} color="blue">
          Send
        </Button>
      </div>
    </React.Fragment>
  );
};

export default RoomArea;
