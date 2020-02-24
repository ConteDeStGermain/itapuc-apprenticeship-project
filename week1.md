### Messenger application schema

## User schema

| Attribute      | Type                     | Optional? | Other Notes                  |
| -------------- | ------------------------ | --------- | ---------------------------- |
| \_id           | ObjectId                 | N         | Primary key, Unique          |
| email          | String                   | N         | Unique, email address       |
| password 			 | String                   | N         | Encrypted, must contain special characters, numbers, and at least a capital letter  |
| contactList    | Object 									| N         | Here will be saved all of the user's contacts|
| role           | "owner" \| "list"				| N 				| 															| 
| fullName 			 | String 									| Y 				| Optional full name of the user. Can be left empty for anonymity |

## ContactList schema

| Attribute      | Type                     | Optional? | Other Notes                  |
| -------------- | ------------------------ | --------- | ---------------------------- |
| \_id           | ObjectId                 | N         | Primary key, Unique          |
| owner          | Object                   | N         | User who owns this contact list |
| contacts 			 | List                   	| N         | List of contacts the user has  |
| contactList    | Object 									| N         | Here will be saved all of the user's contacts|
| role           | "list"	\| "owner"  			| N 				| 															| 

## Contact scheme

| Attribute      | Type                     | Optional? | Other Notes                  |
| -------------- | ------------------------ | --------- | ---------------------------- |
| \_id           | ObjectId                 | N         | Primary key, Unique          |
| list           | Object                   | N         | List where this contact is saved in |
| isConversationStarted | boolean           | N         | Whether the user has started a conversation with this contact  |
| sentMessages   | List 										| N         | A list of messages sent by the user to the contact |
| receivedMessages | List                   | N 	 	 		| A list of messages sent by the contact to the user | 
| role           | "contact" \| "list"      | N         |                              | 

## Message scheme

| Attribute      | Type                     | Optional? | Other Notes                  |
| -------------- | ------------------------ | --------- | ---------------------------- |
| \_id           | ObjectId                 | N         | Primary key, Unique          |
| message        | String                   | y         |     												 |
| dateSent       | String                   | N         | Date and time when the message was sent |
| dateReceived   | String 									| N         | Date and time when the message was received |
| isReceived		 | Boolean                  | N 	 	 		| Whether the messaged was received by its recepient or not | 
| role           | "message" \| "conact"      | N         |                              | 

