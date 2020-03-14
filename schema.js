const dateSchema = { bsonType: "date" };
const objectIdSchema = {
  bsonType: "objectId",
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
        type: "string"
      },
    },
  };

  module.exports.roomSchema = {
    type: "object",
  
    required: ['createdAt', 'participants'],
    properties: {
      createdAt: {
        bsonType: "date",
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