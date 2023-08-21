import appSchema, { relationSchema } from "./app";
// import enumSchema from "./enums";

const schema = {
  ...appSchema,
  ...relationSchema,
};

export default schema;

// App Schema Exports

export const conversations = appSchema.conversations;
export const exchanges = appSchema.exchanges;

// Enum Schema Exports
