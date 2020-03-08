# Schema

## User

A user can access and use the system by sending messages to another user.


| Attribute   | Type     | Optional? | Other Notes                    |
|-------------|----------|-----------|--------------------------------|
| \_id        | ObjectId | N         | Primary key, Unique, Immutable |
| createdAt   | Date     | N         | Immutable                      |
| displayName | String   | Y         |                                |
| email       | String   | N         | Unique, Email Address          |

## Room

A room is a place where messages between two users are exchanged. This is also
known as a "conversation".

| Attribute    | Type       | Optional? | Other Notes                     |
|--------------|------------|-----------|---------------------------------|
| \_id         | ObjectId   | N         | Primary key, Unique, Immutable  |
| createdAt    | Date       | N         | Immutable                       |
| lastMessage  | ObjectId   | Y         | References Message.\_id         |
| participants | ObjectId[] | N         | References User.\_id, Immutable |

## Message

A message is an atomic unit of communication - it is sent from one user to
another inside a room.

| Attribute | Type     | Optional? | Other Notes                     |
|-----------|----------|-----------|---------------------------------|
| \_id      | ObjectId | N         | Primary key, Unique, Immutable  |
| createdAt | Date     | N         | Immutable                       |
| authorId  | ObjectId | N         | References User.\_id            |
| text      | String   | N         | References User.\_id, Immutable |
