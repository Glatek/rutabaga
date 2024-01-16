import { expect, test, describe } from "vitest";
import { jsonSchemaExample, dataBaseName } from "../test-helpers.js";
import { Rutabaga } from "../index.js";

// Shared rutabaga for all suites.
const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

describe("get", () => {
	test("can get data", async () => {
		const getResponse = await rutabaga.frames.get(
			new Request("http://localhost:1234"),
		);
		const text = await getResponse.text();

		expect(text).toStrictEqual(
			'<form><input type="text" name="firstName required /><input type="text" name="lastName required /><input type="number" name="age required /><input type="date" name="birthday /></form>',
		);
	});
});
