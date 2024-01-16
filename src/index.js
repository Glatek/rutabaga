import { Dexie } from "dexie";

import { APIRoutes } from "./classes/apiRoutes.js";
import { FrameRoutes } from "./classes/frameRoutes.js";

export class Rutabaga {
	/** @type {import('ajv/lib/types/json-schema.js').SomeJSONSchema} */
	#schema;
	/** @type {string} */
	#dataBaseName;

	/** @type {Dexie} */
	#dataBase;

	/** @type {APIRoutes} */
	apiRoutes;

	/**
	 * @param {import('ajv/lib/types/json-schema.js').SomeJSONSchema} schema
	 * @param {string} dataBaseName
	 */
	constructor(schema, dataBaseName) {
		this.#schema = schema;
		this.#dataBaseName = dataBaseName;
		this.#dataBase = this.#openDatabase();

		this.api = new APIRoutes(this.#dataBase, this.#schema);
		this.frames = new FrameRoutes(this.#dataBase, this.#schema);

		this.#ensureDatabaseTables();
	}

	/**
	 * @returns {Dexie}
	 */
	#openDatabase() {
		if (!this.#dataBaseName) {
			throw new Error("No data base name provided in the constructor");
		}

		return new Dexie(this.#dataBaseName);
	}

	#ensureDatabaseTables() {
		this.#dataBase.version(1).stores({
			[this.#schemaName]: Object.entries(this.#schema.properties)
				.map(([k, v]) => {
					if ("$comment" in v && v.$comment.includes("primary")) {
						return `&${k}`;
					}

					return k;
				})
				.join(", "),
		});
	}

	get #schemaName() {
		return this.#schema.title.toLocaleLowerCase();
	}

	get table() {
		return this.#dataBase.table(this.#schemaName);
	}
}
