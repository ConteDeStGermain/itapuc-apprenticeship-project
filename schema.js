const dateSchema = { bsonType: "Date", type: "string" };
const objectIdSchema = {
  bsonType: "ObjectId",
  type: "string",
  pattern: "[a-fA-F0-9]{24}"
};

module.exports.userSchema = {
    type: "object",
  
    required: ["createdAt", "email"],
    properties: {
      createdAt: dateSchema,
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
      lastMessage: objectIdSchema,
      participants: {
        type: 'array',
        uniqueItems: true,
        items: objectIdSchema
      },
    },
  };

  module.exports.messageSchema = {
    type: "object",
  
    required: ['createdAt', 'authorId', 'text'],
    properties: {
      createdAt: dateSchema,
      authorId: objectIdSchema,
      text: {
        type: 'string',
      },
    },
  };