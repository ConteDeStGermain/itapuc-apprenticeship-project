
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