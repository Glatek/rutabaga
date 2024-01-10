
/** @typedef PersonSchema
 *  @prop {string} firstName
 *  @prop {string} lastName
 *  @prop {number} age
 */

/** @type {import('ajv').JSONSchemaType<PersonSchema>} */
export const jsonSchemaExample = {
  title: "Person",
  type: "object",
  required: ['age', 'firstName', 'lastName'],
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
