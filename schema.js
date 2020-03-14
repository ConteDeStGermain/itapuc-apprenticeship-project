module.exports.userSchema = {
    type: "object",
  
    required: ["createdAt", "email"],
    properties: {
      createdAt: {
        bsonType: "Date",
        type: "string",
      },
      displayName: {
        type: "string",
      },
      email: {
        type: "string",
        pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/
      },
    },
  };

  module.exports.roomSchema = {
    type: "object",
  
    required: ['createdAt', 'participants'],
    properties: {
      createdAt: {
        bsonType: "Date",
        type: "string",
      },
      lastMessage: {
        bsonType: 'ObjectId',
        type: "string",
      },
      participants: {
        type: 'array',
        uniqueItems: true,
        items: {
            bsonType: 'ObjectId',
            type: 'string'
        }
      },
    },
  };

  module.exports.messageSchema = {
    type: "object",
  
    required: ['createdAt', 'authorId', 'text'],
    properties: {
      createdAt: {
        bsonType: "Date",
        type: "string",
      },
      authorId: {
        bsonType: 'ObjectId',
        type: "string",
      },
      text: {
        type: 'string',
      },
    },
  };