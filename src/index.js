import Ajv from "ajv";
import { Dexie } from "dexie";

import { APIRoutes } from "./classes/apiRoutes.js";

/** @type { import('ajv').default } */
// @ts-ignore
const ajv = new Ajv();

export class Rutabaga {
	/** @type {object} */
	#schema = undefined;

	/** @type {import('ajv').ValidateFunction} */
	#validate = undefined;

	/** @type {string} */
	#dataBaseName = undefined;

	/** @type {Dexie} */
	#dataBase = undefined;

	/** @type {APIRoutes} */
	apiRoutes = undefined;

	/**
	 * @param {Object} schema
	 * @param {string} dataBaseName
	 */
	constructor(schema, dataBaseName) {
		this.#schema = schema;
		this.#validate = ajv.compile(schema);
		this.#dataBaseName = dataBaseName;
		this.#dataBase = this.#openDatabase();

		this.api = new APIRoutes(this.#dataBase, this.#validate);

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
			[this.#schemaName]: Object.keys(this.#schema.properties).join(', ')
		});
	}

	get #schemaName() {
		return this.#schema.title.toLocaleLowerCase();
	}

	get table() {
		return this.#dataBase.table(this.#schemaName);
	}

	/**
	 * @param {Object} object
	 * @returns {boolean}
	 */
	validate(object) {
		return this.#validate(object);
	}
}
