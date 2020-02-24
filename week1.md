# Week 1 - Onboarding and schema design

## Onboarding

In order to get a better sense of what to focus on, please rate your
familiarity with the following (put an 'x' in the column that best reflects
your understanding - don't worry, I don't expect you to have experience with
these things yet):

|                        | Never heard of it | Heard of it | Played with it | Used it | Understand it internally |
| ---------------------- | ----------------- | ----------- | -------------- | ------- | ------------------------ |
| Node.js                |                   |             | X              |         |                          |
| Express.js             | X                 |             |                |         |                          |
| Mongo DB               |                   | X           |                |         |                          |
| Mongoose               | X                 |             |                |         |                          |
| HTTP                   |                   | X           |                |         |                          |
| REST                   |                   |             |                | X       |                          |
| Database Schemas       |                   | X           |                |         |                          |
| React                  |                   |             |                | X       |                          |
| Redux                  |                   |             | X              |         |                          |
| WebSockets             |                   | X           |                |         |                          |
| Continuous Integration |                   | X           |                |         |                          |
| git                    |                   |             |                | X       |                          |
| GitHub                 |                   |             |                | X       |                          |
| Docker                 | X                 |             |                |         |                          |

## Designing a database schema

A database schema is the answer to the question "How is the data in my
application structured? Some things that a schema specifies are:

- The names of the entities in the system
- The names and types of the attributes of those entities
- Rules definine how the atttributes may be changed (e.g. if a field is
  required, immutable, within a range, a minimum or maximum length, etc...)
- How entities are related to one another.

### A simple way to write a schema

Markdown tables are a really good way to define rough drafts and notes on
schemas. They let you specify your data as a set of interrelated tables, which
automatically encourages you to think about data in terms of flat structures (as
opposed to nested ones with multiple levels of hierarchy), and it translates
very nicely to the tools used to implement them.

An example table might look like this:

#### User Schema

| Attribute   | Type     | Optional? | Other Notes           |
| ----------- | -------- | --------- | --------------------- |
| \_id        | ObjectId | N         | Primary key, Unique   |
| email       | String   | N         | Unique, email address |
| displayName | String   | Y         |                       |

What this is saying is that a User has three attributes: `_id`, email, and,
displayName. `_id` is a DB-generated, unique key that is the primary identifier
of the user. `email` is a required field that is unique to each user.
`displayName` is an optional free-form string field.

### Defining relationships between entities

When you are considering if 2 entities are relatted to each other, the first
thing to understand is if the relationship is:

- 1-to-1: one cannot exist without the other
- 1-to-many: One entity can be related to more than one of the other, but not
  vice-versa
- many-to-many: Both entities can be associated with many instances of the
  other.

As an example:

- User to Profile is a 1-to-1 relationship. All users have one profile, and a
  profile can only be associated with a single user.
- User to message is a 1-to-many relationship. A user may have sent any number
  of messages, but each message can only have one author.
- User to Conversation is a many-to-many relationship: users can be in multiple
  conversations, and each conversation has multiple participating users.

When you want to specify a relationship in your schema, you can do so like this:

- 1-to-1: Include an attribute in one entity's schema that contains the `_id`
  of the other. For example, a Profile would have a `userId` attribute.
- 1-to-many: Same as 1-to-1 - add the `_id` as an attribute to the `many`
  entity. For example, Message has a `userId` attribute.
- many-to-many: There are two options here. If the relationship is a simple list
  of related entities, then add an attribute that has an array of related entity
  IDs, for example, a Conversation would have a `userIds` array that lists all
  the users participating in the conversation. The other option is explained in
  more detail below.

### Relationships with attributes

Sometimes, a rerlationship its self may need to have attributes. For example, if
we want to keep track of a user's role in a conversation, and say if they are
the owner or a regular participant of the conversation, then this is an
attribute of the relationship its self. The way to handle this situation is to
turn the relationship into a new entity with 1-to-1 relationships with both
other entities. In this example, the new entity would be called
`ConversationUser`. It would have a schema that looks like this:

### ConversationUserSchema

| Attribute      | Type                     | Optional? | Other Notes                  |
| -------------- | ------------------------ | --------- | ---------------------------- |
| \_id           | ObjectId                 | N         | Primary key, Unique          |
| userId         | ObjectId                 | N         | References User.\_id         |
| conversationId | ObjectId                 | N         | References Conversation.\_id |
| role           | "owner" \| "participant" | N         |                              |

## Task

Create a database schema here which has all the entities which we need to implement
the chat system. Hint: read the requirements of the system in the README and use
that as a starting point for listing entities.

