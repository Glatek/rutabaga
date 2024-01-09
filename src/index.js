import Ajv from "ajv";

const ajv = new Ajv();

export class Rutabaga {
	/** @type {object} */
	#schema = undefined;

	/** @type {ReturnType<typeof ajv.compile>} */
	#validate = undefined;

	/**
	 * @param {Object} schema
	 */
	constructor(schema) {
		this.#schema = schema;
		this.#validate = ajv.compile(schema);
	}

	/**
	 * @param {Object} object
	 */
	validate(object) {
		return this.#validate(object);
	}
}
