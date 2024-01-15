import { Dexie } from "dexie";
import { expect, test, describe } from "vitest";
import { Rutabaga } from "./index.js";
import { jsonSchemaExample, dataBaseName } from "./test-helpers.js";

describe('database', () => {
	const db = new Dexie(dataBaseName);

	test("creates instance", async () => {
		const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

		expect(rutabaga.table).not.toBe(undefined);
	});
});