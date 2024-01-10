import { Dexie } from "dexie";
import { expect, test, describe } from "vitest";
import { Rutabaga } from "./index.js";
import { jsonSchemaExample, dataBaseName } from "./test-helpers.js";

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
}); ''