import appSchema, { relationSchema } from "./app";
// import enumSchema from "./enums";

const schema = {
  ...appSchema,
  ...relationSchema,
};

export default schema;

// App Schema Exports

// Enum Schema Exports
