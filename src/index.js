import Ajv from "ajv";
import { Dexie } from "dexie";
import { convertFormDataToObject } from "./helpers/convertFormDataToObject.js";

// @ts-ignore
const ajv = new Ajv();

export class Rutabaga {
	/** @type {object} */
	#schema = undefined;

	/** @type {ReturnType<typeof ajv.compile>} */
	#validate = undefined;

	/** @type {string} */
	#dataBaseName = undefined;

	/** @type {Dexie} */
	#dataBase = undefined;

	/**
	 * @param {Object} schema
	 * @param {string} dataBaseName
	 */
	constructor(schema, dataBaseName) {
		this.#schema = schema;
		this.#validate = ajv.compile(schema);
		this.#dataBaseName = dataBaseName;
		this.#dataBase = this.#openDatabase();

		this.#ensureDatabaseTables();
	}

	/**
	 * @returns {Dexie}
	 */
	#openDatabase() {
		if (!this.#dataBaseName) {
			throw new Error("No data base name provided in the construvtor");
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
	 */
	validate(object) {
		return this.#validate(object);
	}

	/**
	 * @param {Request} request
	 * @returns {Response}
	 */
	async handlePost(request) {
		const formData = await request.formData();
		const obj = convertFormDataToObject(formData);

	}
}