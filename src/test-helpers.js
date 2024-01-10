export const jsonSchemaExample = {
  title: "Person",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      description: "The person's first name.",
    },
    lastName: {
      type: "string",
      description: "The person's last name.",
    },
    age: {
      description: "Age in years which must be equal to or greater than zero.",
      type: "integer",
      minimum: 0,
    },
  },
  additionalProperties: false,
};
export const dataBaseName = 'tomten';
