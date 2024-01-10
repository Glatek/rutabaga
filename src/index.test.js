import { Dexie } from "dexie";
import { expect, test, describe } from "vitest";
import { Rutabaga } from "./index.js";

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
const dataBaseName = 'tomten';

describe("validate", () => {
	test("returns true if we can successfully validate the data to the schema", () => {
		const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

		expect(
			rutabaga.validate({
				firstName: "John",
				lastName: "Doe",
				age: 21,
			}),
		).toBe(true);
	});

	test("returns false if the data is not valid to the schema", () => {
		const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

		expect(
			rutabaga.validate({
				middleName: "John",
				catsAge: 4,
			}),
		).toBe(false);
	});
});

describe('database', () => {
	const db = new Dexie(dataBaseName);

	db.version(1).stores({
		friends: 'id, name, age'
	});

	test("creates instance", async () => {
		const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

		expect(rutabaga.table).not.toBe(undefined);
	});
});

describe('handlePost', () => {
	const db = new Dexie(dataBaseName);

	test("returns 402 if form data is malformed", async () => {
		const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

		const formData = new FormData();

		formData.append('middleName', 'John');
		formData.append('age', '21');

		const request = new Request('http://localhost:1234', {
			method: 'POST',
			body: formData
		});

		const response = await rutabaga.handlePost(request);

		expect(response.status).toBe(402);
	});

	test("returns 201 if form data is accepted and added to the database", async () => {
		const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

		const formData = new FormData();

		formData.append('firstName', 'John');
		formData.append('lastName', 'John');
		formData.append('age', '21');

		const request = new Request('http://localhost:1234', {
			method: 'POST',
			body: formData
		});

		const response = await rutabaga.handlePost(request);

		expect(response.status).toBe(201);
	});
});
