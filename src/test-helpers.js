/** @typedef PersonSchema
 *  @prop {string} firstName
 *  @prop {string} lastName
 *  @prop {number} age
 */

/** @type {import('ajv').JSONSchemaType<PersonSchema>} */
export const jsonSchemaExample = {
	$id: "https://glatek.se/person.schema.json",
	title: "Person",
	type: "object",
	required: ["age", "firstName", "lastName"],
	properties: {
		id: {
			type: "string",
			description: "The person's unique id.",
			$comment: "primary, readOnly",
		},
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
		birthday: {
			description: "Date of birth.",
			type: "string",
			format: "date-time",
		},
	},
	additionalProperties: false,
};

export const dataBaseName = "tomten";
