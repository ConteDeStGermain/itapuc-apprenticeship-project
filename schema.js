const dateSchema = { bsonType: "date" };
const objectIdSchema = { bsonType: "objectId" };
const stringSchema = { type: "string" };

module.exports.userSchema = {
  type: "object",
  required: ["createdAt", "email"],
  properties: {
    createdAt: dateSchema,
    displayName: stringSchema,
    email: stringSchema
  }
};

module.exports.roomSchema = {
  type: "object",
  required: ["createdAt", "participants"],
  properties: {
    createdAt: dateSchema,
    lastMessage: objectIdSchema,
    participants: {
      type: "array",
      uniqueItems: true,
      items: objectIdSchema
    }
  }
};

module.exports.messageSchema = {
  type: "object",
  required: ["createdAt", "authorId", "roomId", "text"],
  properties: {
    createdAt: dateSchema,
    authorId: objectIdSchema,
    roomId: objectIdSchema,
    text: stringSchema
  }
};
