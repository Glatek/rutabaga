import Ajv from "ajv";
import addFormats from "ajv-formats";
import { convertFormDataToObject } from "../helpers/convertFormDataToObject.js";
import { schemaUrlIdToId } from "../helpers/schemaUrlIdToId.js";

/** @type { import('ajv').default } */
// @ts-ignore
const ajv = new Ajv();

// @ts-ignore
addFormats(ajv);

const httpStatusCodes = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 402,
};

export class APIRoutes {
	/** @type {import('dexie').Dexie} */
	#dataBase;

	/** @type {import('ajv').ValidateFunction} */
	#validate;

	/** @type {import('ajv').ValidateFunction} */
	#validatePatch;

	/** @type {import('ajv/lib/types/json-schema.js').SomeJSONSchema} */
	#schema;

	/**
	 *
	 * @param {import('dexie').Dexie} dataBase
	 * @param {import('ajv/lib/types/json-schema.js').SomeJSONSchema} schema
	 */
	constructor(dataBase, schema) {
		this.#dataBase = dataBase;
		this.#validate = ajv.compile(schema);
		this.#validatePatch = ajv.compile({
			...schema,
			$id: `${schema.$id}--patch--${crypto.randomUUID()}`,
			required: [],
		});
		this.#schema = schema;
	}

	/**
	 * @param {Request} request
	 * @returns {Promise<Response | undefined>}
	 */
	async get(request) {
		try {
			await this.#dataBase.open();

			const tableName = schemaUrlIdToId(this.#schema.$id ?? "");

			const objects = await this.#dataBase.table(tableName).toArray();

			return new Response(JSON.stringify(objects), {
				status: httpStatusCodes.OK,
			});
		} catch (e) {
			console.error("GET error, e");
		}
	}

	/**
	 * @param {Request} request
	 * @returns {Promise<Response | undefined>}
	 */
	async post(request) {
		try {
			const formData = await request.formData();
			const newObject = convertFormDataToObject(formData);

			if (!this.#validate(newObject)) {
				return new Response(null, {
					status: httpStatusCodes.BAD_REQUEST,
					statusText: `The provided form data did not validate against the schema. Reason: ${JSON.stringify(
						this.#validate.errors,
					)}`,
				});
			}

			await this.#dataBase.open();

			const tableName = schemaUrlIdToId(this.#schema.$id ?? "");

			if (!("id" in newObject)) {
				newObject.id = crypto.randomUUID();
			}

			await this.#dataBase.table(tableName).add(newObject);

			return new Response(JSON.stringify(newObject), {
				status: httpStatusCodes.CREATED,
			});
		} catch (e) {
			console.error("POST error", e);
		}
	}

	/**
	 * @param {Request} request
	 * @returns {Promise<Response | undefined>}
	 */
	async put(request) {
		try {
			const formData = await request.formData();
			const newObject = convertFormDataToObject(formData);

			if (!this.#validate(newObject)) {
				return new Response(null, {
					status: httpStatusCodes.BAD_REQUEST,
					statusText: `The provided form data did not validate against the schema. Reason: ${JSON.stringify(
						this.#validate.errors,
					)}`,
				});
			}

			await this.#dataBase.open();

			const tableName = schemaUrlIdToId(this.#schema.$id ?? "");

			if (!("id" in newObject)) {
				newObject.id = crypto.randomUUID();
			}

			await this.#dataBase.table(tableName).put(newObject);

			return new Response(JSON.stringify(newObject), {
				status: httpStatusCodes.CREATED,
			});
		} catch (e) {
			console.error("PUT error", e);
		}
	}

	/**
	 * @param {Request} request
	 * @returns {Promise<Response | undefined>}
	 */
	async patch(request) {
		try {
			const formData = await request.formData();
			const newObject = convertFormDataToObject(formData);

			if (!this.#validatePatch(newObject)) {
				return new Response(null, {
					status: httpStatusCodes.BAD_REQUEST,
					statusText: `The provided form data did not validate against the schema. Reason: ${JSON.stringify(
						this.#validate.errors,
					)}`,
				});
			}

			await this.#dataBase.open();

			const tableName = schemaUrlIdToId(this.#schema.$id ?? "");

			await this.#dataBase.table(tableName).update(newObject.id, newObject);

			const result = await this.#dataBase.table(tableName).get(newObject.id);

			return new Response(JSON.stringify(result), {
				status: httpStatusCodes.OK,
			});
		} catch (e) {
			console.error("PATCH error", e);
		}
	}
}
