import { expect, test, describe } from "vitest";
import { Rutabaga } from "./index";

const jsonSchemaExample = {
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

describe("validate", () => {
	test("returns true if we can successfully validate the data to the schema", () => {
		const rutabaga = new Rutabaga(jsonSchemaExample);

		expect(
			rutabaga.validate({
				firstName: "John",
				lastName: "Doe",
				age: 21,
			}),
		).toBe(true);
	});

	test("returns false if the data is not valid to the schema", () => {
		const rutabaga = new Rutabaga(jsonSchemaExample);

		expect(
			rutabaga.validate({
				middleName: "John",
				catsAge: 4,
			}),
		).toBe(false);
	});
});
